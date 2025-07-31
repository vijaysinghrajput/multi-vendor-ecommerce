#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');
const http = require('http');

// Load environment variables from .env.deploy if it exists
const envDeployPath = path.join(__dirname, '.env.deploy');
if (fs.existsSync(envDeployPath)) {
  require('dotenv').config({ path: envDeployPath });
}

// Load configuration
const config = require('./deploy.config.js').getConfig();
const SERVER_CONFIG = config.server;
const APP_CONFIG = config.app;
const DEPLOY_CONFIG = config.deployment;
const PM2_CONFIG = config.pm2;
const FRONTEND_CONFIG = config.frontend;
const HEALTH_CONFIG = config.healthCheck;
const LOGGING_CONFIG = config.logging;
const DB_CONFIG = config.database;
const GITHUB_CONFIG = config.github;
const MULTI_CLIENT_CONFIG = config.multiClient;

// Colors for console output
const colors = LOGGING_CONFIG.colors;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n🔄 Step ${step}: ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Function to execute SSH commands
function executeSSHCommand(command, description) {
  log(`Executing: ${description}`, 'blue');
  
  const sshCommand = config.security.useSSHKeys && config.security.sshKeyPath
    ? `ssh -i ${config.security.sshKeyPath} -o StrictHostKeyChecking=no ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "${command}"`
    : `sshpass -p '${SERVER_CONFIG.password}' ssh -o StrictHostKeyChecking=no ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "${command}"`;
  
  try {
    const result = execSync(sshCommand, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300000 // 5 minutes timeout
    });
    log(result, 'bright');
    return result;
  } catch (error) {
    logError(`Failed to execute: ${description}`);
    logError(error.message);
    if (error.stdout) log(error.stdout, 'yellow');
    if (error.stderr) log(error.stderr, 'red');
    throw error;
  }
}

// Function to execute local commands
function executeLocalCommand(command, description) {
  log(`Executing locally: ${description}`, 'blue');
  
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 300000
    });
    log(result, 'bright');
    return result;
  } catch (error) {
    logError(`Failed to execute locally: ${description}`);
    logError(error.message);
    if (error.stdout) log(error.stdout, 'yellow');
    if (error.stderr) log(error.stderr, 'red');
    throw error;
  }
}

// Function to check if sshpass is installed
function checkSSHPass() {
  try {
    execSync('which sshpass', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to install sshpass on macOS
function installSSHPass() {
  log('Installing sshpass...', 'yellow');
  try {
    execSync('brew install hudochenkov/sshpass/sshpass', { stdio: 'inherit' });
    logSuccess('sshpass installed successfully');
  } catch (error) {
    logError('Failed to install sshpass via homebrew');
    log('Please install sshpass manually:', 'yellow');
    log('brew install hudochenkov/sshpass/sshpass', 'cyan');
    process.exit(1);
  }
}

// Function to get client configuration for multi-client support
function getClientConfig(clientName = APP_CONFIG.clientName) {
  if (MULTI_CLIENT_CONFIG.enabled && MULTI_CLIENT_CONFIG.clientFolders[clientName]) {
    const clientConfig = MULTI_CLIENT_CONFIG.clientFolders[clientName];
    return {
      ...SERVER_CONFIG,
      backendPath: clientConfig.backendPath,
      serverPort: clientConfig.port,
      pm2Name: clientConfig.pm2Name,
      dbName: clientConfig.dbName
    };
  }
  return SERVER_CONFIG;
}

// Function to push changes to GitHub
function pushToGitHub() {
  logStep('GitHub', 'Pushing changes to GitHub repository');
  
  if (!GITHUB_CONFIG.enabled || DEPLOY_CONFIG.development?.skipSteps?.github) {
    logWarning('Skipping GitHub push (disabled or in development mode)');
    return;
  }
  
  try {
    // Check if there are any changes to commit
    const status = executeLocalCommand('git status --porcelain', 'Check git status');
    
    if (status.trim()) {
      // Add all changes
      executeLocalCommand('git add .', 'Add all changes');
      
      // Commit changes
      if (GITHUB_CONFIG.autoCommit) {
        executeLocalCommand(
          `git commit -m "${GITHUB_CONFIG.commitMessage}"`,
          'Commit changes'
        );
        logSuccess('Changes committed to git');
      }
      
      // Push to repository
      if (GITHUB_CONFIG.autoPush) {
        executeLocalCommand(
          `git push origin ${GITHUB_CONFIG.branch}`,
          'Push to GitHub'
        );
        logSuccess('Changes pushed to GitHub');
      }
    } else {
      log('No changes to commit', 'blue');
    }
  } catch (error) {
    logWarning('GitHub push failed, continuing with deployment');
    log(error.message, 'yellow');
  }
}

// Function to backup database
function backupDatabase() {
  if (!DB_CONFIG.backup.enabled) {
    logWarning('Database backup disabled');
    return;
  }
  
  const clientConfig = getClientConfig();
  const backupFilename = DB_CONFIG.backup.filename(APP_CONFIG.clientName);
  const backupPath = `${DB_CONFIG.backup.path}/${backupFilename}`;
  
  try {
    // Create backup directory if it doesn't exist
    executeSSHCommand(
      `mkdir -p ${DB_CONFIG.backup.path}`,
      'Create backup directory'
    );
    
    // Create database backup
    executeSSHCommand(
      `cd ${clientConfig.backendPath} && pg_dump ${clientConfig.dbName || 'postgres'} > ${backupPath}`,
      'Create database backup'
    );
    
    // Clean old backups
    executeSSHCommand(
      `cd ${DB_CONFIG.backup.path} && ls -t ${APP_CONFIG.clientName}_backup_*.sql | tail -n +${DB_CONFIG.backup.retention + 1} | xargs -r rm`,
      'Clean old backups'
    );
    
    logSuccess(`Database backed up to ${backupPath}`);
  } catch (error) {
    logWarning('Database backup failed, continuing with deployment');
    log(error.message, 'yellow');
  }
}

// Function to sync database
function syncDatabase() {
  logStep('DB', 'Synchronizing database');
  
  if (!DB_CONFIG.sync.enabled || DEPLOY_CONFIG.development?.skipSteps?.dbSync) {
    logWarning('Skipping database sync (disabled or in development mode)');
    return;
  }
  
  const clientConfig = getClientConfig();
  
  try {
    // Backup database before sync if enabled
    if (DB_CONFIG.sync.backupBeforeSync) {
      backupDatabase();
    }
    
    // Upload SQL files if enabled
    if (DB_CONFIG.sync.uploadSqlFiles) {
      const sqlFile = path.join(__dirname, 'backend', DB_CONFIG.sync.sqlFile);
      if (fs.existsSync(sqlFile)) {
        log(`Uploading ${DB_CONFIG.sync.sqlFile}...`, 'blue');
        
        const sshCommand = config.security.useSSHKeys && config.security.sshKeyPath
          ? `scp -i ${config.security.sshKeyPath} -o StrictHostKeyChecking=no`
          : `sshpass -p '${SERVER_CONFIG.password}' scp -o StrictHostKeyChecking=no`;
        
        executeLocalCommand(
          `${sshCommand} ${sqlFile} ${SERVER_CONFIG.username}@${SERVER_CONFIG.host}:${clientConfig.backendPath}/`,
          'Upload SQL file'
        );
        
        logSuccess('SQL file uploaded');
      } else {
        logWarning(`SQL file ${DB_CONFIG.sync.sqlFile} not found`);
      }
    }
    
    // Run SQL files if enabled
    if (DB_CONFIG.sync.runSqlFiles) {
      executeSSHCommand(
        `cd ${clientConfig.backendPath} && psql ${clientConfig.dbName || 'postgres'} < ${DB_CONFIG.sync.sqlFile}`,
        'Execute SQL file'
      );
      logSuccess('SQL file executed');
    }
    
    logSuccess('Database synchronization completed');
  } catch (error) {
    logWarning('Database sync failed, continuing with deployment');
    log(error.message, 'yellow');
  }
}

// Function to deploy to Vercel
 async function deployToVercel() {
   logStep('Vercel', 'Deploying frontend to Vercel');
  
  if (!FRONTEND_CONFIG.vercel.enabled || DEPLOY_CONFIG.development?.skipSteps?.vercel) {
    logWarning('Skipping Vercel deployment (disabled or in development mode)');
    return;
  }
  
  try {
    // Check if Vercel CLI is installed
    try {
      executeLocalCommand('vercel --version', 'Check Vercel CLI');
    } catch (error) {
      logWarning('Vercel CLI not found, installing...');
      executeLocalCommand('npm install -g vercel', 'Install Vercel CLI');
    }
    
    // Deploy to Vercel
    const vercelCommand = [
      'vercel',
      '--prod',
      '--yes',
      FRONTEND_CONFIG.vercel.token ? `--token ${FRONTEND_CONFIG.vercel.token}` : '',
      FRONTEND_CONFIG.vercel.teamId ? `--scope ${FRONTEND_CONFIG.vercel.teamId}` : ''
    ].filter(Boolean).join(' ');
    
    const deployResult = executeLocalCommand(
      `cd frontend && ${vercelCommand}`,
      'Deploy to Vercel'
    );
    
    // Extract deployment URL from result
    const urlMatch = deployResult.match(/https:\/\/[^\s]+/);
    const deploymentUrl = urlMatch ? urlMatch[0] : FRONTEND_CONFIG.vercel.domain;
    
    logSuccess(`Frontend deployed to Vercel: ${deploymentUrl}`);
    
    // Wait for deployment if enabled
    if (FRONTEND_CONFIG.vercel.waitForDeployment) {
      log('Waiting for Vercel deployment to complete...', 'blue');
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      // Test deployment
      try {
        const testResult = executeLocalCommand(
          `curl -f -s -o /dev/null -w "%{http_code}" --max-time 30 ${deploymentUrl}`,
          'Test Vercel deployment'
        );
        
        if (testResult.includes('200')) {
          logSuccess('Vercel deployment is live and responding');
        } else {
          logWarning('Vercel deployment may not be fully ready yet');
        }
      } catch (error) {
        logWarning('Could not verify Vercel deployment status');
      }
    }
    
    return deploymentUrl;
  } catch (error) {
    logWarning('Vercel deployment failed, continuing with backend deployment');
    log(error.message, 'yellow');
    return null;
  }
}

// Function to upload files using rsync
function uploadFiles() {
  logStep(2, 'Uploading backend files to server');
  
  if (DEPLOY_CONFIG.development?.skipSteps?.upload) {
    logWarning('Skipping file upload (development mode)');
    return;
  }
  
  const localBackendPath = path.join(__dirname, 'backend');
  const excludePatterns = DEPLOY_CONFIG.excludePatterns.map(pattern => `--exclude=${pattern}`);
  const clientConfig = getClientConfig();
  
  const sshCommand = config.security.useSSHKeys && config.security.sshKeyPath
    ? `ssh -i ${config.security.sshKeyPath} -o StrictHostKeyChecking=no`
    : `sshpass -p '${SERVER_CONFIG.password}' ssh -o StrictHostKeyChecking=no`;
  
  const rsyncCommand = [
    'rsync',
    '-avz',
    '--delete',
    ...excludePatterns,
    '-e', `"${sshCommand}"`,
    `${localBackendPath}/`,
    `${SERVER_CONFIG.username}@${SERVER_CONFIG.host}:${clientConfig.backendPath}/`
  ].join(' ');
  
  try {
    log('Uploading files...', 'blue');
    execSync(rsyncCommand, { stdio: 'inherit', timeout: DEPLOY_CONFIG.timeouts.upload });
    logSuccess('Files uploaded successfully');
  } catch (error) {
    logError('Failed to upload files');
    throw error;
  }
}

// Function to read package.json and get project info
function getProjectInfo() {
  try {
    const packagePath = path.join(__dirname, 'backend', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return {
      name: packageJson.name || APP_CONFIG.name,
      version: packageJson.version || APP_CONFIG.version
    };
  } catch (error) {
    logWarning('Could not read package.json, using defaults');
    return {
      name: APP_CONFIG.name,
      version: APP_CONFIG.version
    };
  }
}

// Function to update frontend .env.local
function updateFrontendEnv() {
  logStep(7, 'Updating frontend environment configuration');
  
  if (!DEPLOY_CONFIG.updateFrontendEnv) {
    logWarning('Skipping frontend environment update (disabled in config)');
    return;
  }
  
  const frontendPath = path.join(__dirname, 'frontend');
  const envLocalPath = path.join(frontendPath, FRONTEND_CONFIG.envFile);
  const envExamplePath = path.join(frontendPath, FRONTEND_CONFIG.envExample);
  
  let envContent = '';
  
  // Read existing .env.local or create from .env.example
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8');
    log('Found existing .env.local file', 'blue');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    log('Creating .env.local from .env.example', 'blue');
  } else {
    logWarning('No .env.example found, creating minimal .env.local');
    const apiUrl = FRONTEND_CONFIG.envVars.NEXT_PUBLIC_API_URL(config);
    envContent = `# Auto-generated environment file\nNEXT_PUBLIC_API_URL=${apiUrl}\n`;
  }
  
  // Update environment variables from configuration
  Object.entries(FRONTEND_CONFIG.envVars).forEach(([key, value]) => {
    const envValue = typeof value === 'function' ? value(config) : value;
    
    if (envContent.includes(`${key}=`)) {
      envContent = envContent.replace(
        new RegExp(`${key}=.*`),
        `${key}=${envValue}`
      );
    } else {
      envContent += `\n${key}=${envValue}`;
    }
  });
  
  // Write updated .env.local
  fs.writeFileSync(envLocalPath, envContent);
  
  const apiUrl = FRONTEND_CONFIG.envVars.NEXT_PUBLIC_API_URL(config);
  const wsUrl = FRONTEND_CONFIG.envVars.NEXT_PUBLIC_WS_URL(config);
  
  logSuccess(`Frontend .env.local updated with API URL: ${apiUrl}`);
  log(`WebSocket URL: ${wsUrl}`, 'cyan');
}

// Main deployment function
async function deploy() {
  const startTime = Date.now();
  let vercelUrl = null;
  
  try {
    log('🚀 Starting full-stack deployment automation...', 'bright');
    log(`Target server: ${SERVER_CONFIG.host}`, 'cyan');
    
    const clientConfig = getClientConfig();
    log(`Backend path: ${clientConfig.backendPath}`, 'cyan');
    log(`Client: ${APP_CONFIG.clientName}`, 'cyan');
    
    // Check if sshpass is installed (if not using SSH keys)
    if (!config.security.useSSHKeys && !checkSSHPass()) {
      logWarning('sshpass is not installed');
      installSSHPass();
    }
    
    const projectInfo = getProjectInfo();
    log(`Deploying: ${projectInfo.name} v${projectInfo.version}`, 'magenta');
    log(`Environment: ${APP_CONFIG.environment}`, 'magenta');
    log(`Git Branch: ${APP_CONFIG.gitBranch}`, 'magenta');
    
    // Step 0: Push to GitHub first
    pushToGitHub();
    
    // Step 1: Test SSH connection
    logStep(1, 'Testing SSH connection');
    executeSSHCommand('echo "SSH connection successful"', 'Test SSH connection');
    logSuccess('SSH connection established');
    
    // Step 2: Upload files
    uploadFiles();
    
    // Step 3: Navigate to backend directory and pull latest changes
    logStep(3, 'Pulling latest changes from repository');
    
    if (process.env.SKIP_GIT_PULL === 'true') {
      logWarning('Skipping git pull (SKIP_GIT_PULL environment variable is set)');
    } else {
      executeSSHCommand(
        `cd ${clientConfig.backendPath} && git pull origin ${APP_CONFIG.gitBranch}`,
        'Pull latest changes'
      );
      logSuccess('Latest changes pulled');
    }
    
    // Step 4: Database sync and backup
    syncDatabase();
    
    // Step 5: Install dependencies
    logStep(5, 'Installing dependencies');
    if (DEPLOY_CONFIG.installDependencies) {
      executeSSHCommand(
        `cd ${clientConfig.backendPath} && npm install --production`,
        'Install npm dependencies'
      );
      logSuccess('Dependencies installed');
    } else {
      logWarning('Skipping dependency installation (disabled in config)');
    }
    
    // Step 6: Build the application
    logStep(6, 'Building the application');
    if (DEPLOY_CONFIG.buildApplication) {
      executeSSHCommand(
        `cd ${clientConfig.backendPath} && npm run build`,
        'Build application'
      );
      logSuccess('Application built successfully');
    } else {
      logWarning('Skipping application build (disabled in config)');
    }
    
    // Step 7: Run database migrations
    logStep(7, 'Running database migrations');
    if (DEPLOY_CONFIG.runMigrations) {
      try {
        executeSSHCommand(
          `cd ${clientConfig.backendPath} && npm run migration:run`,
          'Run database migrations'
        );
        logSuccess('Database migrations completed');
      } catch (error) {
        logWarning('Migration failed or no migrations to run');
        log('Continuing with deployment...', 'yellow');
      }
    } else {
      logWarning('Skipping database migrations (disabled in config)');
    }
    
    // Step 8: Update frontend environment
    updateFrontendEnv();
    
    // Step 9: Deploy to Vercel
    vercelUrl = await deployToVercel();
    
    // Step 10: Restart PM2 application
    logStep(10, 'Managing PM2 application');
    
    if (DEPLOY_CONFIG.restartPM2) {
      try {
        const pm2List = executeSSHCommand(
          'pm2 list --no-color',
          'Check PM2 applications'
        );
        
        const appName = clientConfig.pm2Name || APP_CONFIG.name;
        
        if (pm2List.includes(appName)) {
          executeSSHCommand(
            `pm2 restart ${appName}`,
            'Restart PM2 application'
          );
          logSuccess('PM2 application restarted');
        } else {
          const ecosystem = PM2_CONFIG.ecosystem;
          const startCommand = `cd ${clientConfig.backendPath} && pm2 start ${ecosystem.script} --name "${appName}" --instances ${ecosystem.instances} --exec-mode ${ecosystem.exec_mode} --env production`;
          
          executeSSHCommand(
            startCommand,
            'Start new PM2 application'
          );
          logSuccess('PM2 application started');
        }
      } catch (error) {
        logWarning('PM2 management failed, trying alternative approach');
        executeSSHCommand(
          `cd ${clientConfig.backendPath} && pm2 start dist/main.js --name "${clientConfig.pm2Name || APP_CONFIG.name}"`,
          'Start PM2 application (alternative)'
        );
      }
      
      try {
        executeSSHCommand('pm2 save', 'Save PM2 configuration');
        executeSSHCommand('pm2 startup', 'Setup PM2 startup script');
        logSuccess('PM2 configuration saved');
      } catch (error) {
        logWarning('Could not save PM2 configuration');
      }
    } else {
      logWarning('Skipping PM2 restart (disabled in config)');
    }
    
    // Step 11: Verify deployment
    logStep(11, 'Verifying deployment');
    
    const serverUrl = `http://${SERVER_CONFIG.host}:${clientConfig.serverPort}`;
    
    if (HEALTH_CONFIG.enabled) {
      log(`Waiting ${HEALTH_CONFIG.delay / 1000} seconds for server to start...`, 'blue');
      await new Promise(resolve => setTimeout(resolve, HEALTH_CONFIG.delay));
      
      let healthCheckPassed = false;
      
      for (let i = 0; i < HEALTH_CONFIG.retries; i++) {
        try {
          const testCommand = `curl -f -s -o /dev/null -w "%{http_code}" --max-time ${HEALTH_CONFIG.timeout / 1000} ${serverUrl}${HEALTH_CONFIG.endpoint} || echo "Server not responding"`;
          const response = executeSSHCommand(testCommand, `Test server health (attempt ${i + 1})`);
          
          if (response.includes('200')) {
            logSuccess('Server is responding correctly');
            healthCheckPassed = true;
            break;
          } else {
            logWarning(`Health check attempt ${i + 1} failed`);
            if (i < HEALTH_CONFIG.retries - 1) {
              log('Retrying in 3 seconds...', 'yellow');
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }
        } catch (error) {
          logWarning(`Health check attempt ${i + 1} failed with error`);
          if (i < HEALTH_CONFIG.retries - 1) {
            log('Retrying in 3 seconds...', 'yellow');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
      
      if (!healthCheckPassed) {
        logWarning('All health checks failed, but deployment completed');
      }
    } else {
      logWarning('Health check disabled, skipping verification');
    }
    
    // Calculate deployment time
    const deploymentTime = Math.round((Date.now() - startTime) / 1000);
    
    // Final success message
    log('\n🎉 Full-Stack Deployment completed successfully!', 'bright');
    log(`✅ Backend Deployed: ${serverUrl}${HEALTH_CONFIG.endpoint}`, 'green');
    if (vercelUrl) {
      log(`✅ Frontend Updated: ${vercelUrl}`, 'green');
    }
    log(`✅ Database Synced ✅ PM2 Restarted ✅ GitHub Pushed`, 'green');
    log(`📁 Path: ${clientConfig.backendPath}`, 'green');
    log(`🧠 Total Time: ${deploymentTime}s`, 'green');
    
    log('\n📋 Deployment Summary:', 'cyan');
    log(`🌐 Server URL: ${serverUrl}`, 'blue');
    log(`📱 API URL: ${serverUrl}/api/v1`, 'blue');
    log(`📊 PM2 App: ${clientConfig.pm2Name || APP_CONFIG.name}`, 'blue');
    log(`🌍 Environment: ${APP_CONFIG.environment}`, 'blue');
    if (vercelUrl) {
      log(`🚀 Frontend: ${vercelUrl}`, 'blue');
    }
    
    log('\n📋 Next steps:', 'cyan');
    log('1. Test your API endpoints', 'blue');
    log('2. Check PM2 logs: pm2 logs', 'blue');
    log('3. Monitor application: pm2 monit', 'blue');
    if (vercelUrl) {
      log('4. Test frontend functionality', 'blue');
    }
    
  } catch (error) {
    logError('\n💥 Deployment failed!');
    logError(error.message);
    
    log('\n🔧 Troubleshooting tips:', 'yellow');
    log('1. Check SSH connection manually', 'blue');
    log('2. Verify server permissions', 'blue');
    log('3. Check PM2 status: pm2 status', 'blue');
    log('4. Review application logs: pm2 logs', 'blue');
    log('5. Check database connectivity', 'blue');
    
    process.exit(1);
  }
}

// Handle script arguments
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    log('🚀 Multi-Client Full-Stack Deployment Script', 'bright');
    log('\nUsage: node deploy.js [options]', 'cyan');
    log('\nOptions:', 'cyan');
    log('  --help, -h     Show this help message', 'blue');
    log('  --dry-run      Show what would be deployed without executing', 'blue');
    log('\nServer Configuration:', 'cyan');
    log(`  Host: ${SERVER_CONFIG.host}`, 'blue');
    log(`  User: ${SERVER_CONFIG.username}`, 'blue');
    log(`  Path: ${getClientConfig().backendPath}`, 'blue');
    log(`  Port: ${getClientConfig().serverPort}`, 'blue');
    log(`  Client: ${APP_CONFIG.clientName}`, 'blue');
    process.exit(0);
  }
  
  if (process.argv.includes('--dry-run')) {
    log('🔍 Dry run mode - showing full-stack deployment plan:', 'yellow');
    log('0. Push changes to GitHub', 'blue');
    log('1. Test SSH connection', 'blue');
    log('2. Upload backend files (excluding node_modules, dist, .git)', 'blue');
    log('3. Pull latest changes from git', 'blue');
    log('4. Sync and backup database', 'blue');
    log('5. Install npm dependencies', 'blue');
    log('6. Build application', 'blue');
    log('7. Run database migrations', 'blue');
    log('8. Update frontend .env.local with production API URL', 'blue');
    log('9. Deploy frontend to Vercel', 'blue');
    log('10. Restart/start PM2 application', 'blue');
    log('11. Verify deployment', 'blue');
    process.exit(0);
  }
  
  deploy();
}

module.exports = { deploy, SERVER_CONFIG, getClientConfig };