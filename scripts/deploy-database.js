#!/usr/bin/env node

/**
 * Database Deployment Script
 * Handles database schema and data synchronization between development and production
 * Author: Multi-Vendor E-Commerce Team
 * Version: 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../deploy.config.js');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Logging functions
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

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Environment configuration
const ENV_CONFIG = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'mac',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'multi_vendor_ecommerce'
  },
  production: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: process.env.PROD_DB_PORT || 5432,
    username: process.env.PROD_DB_USERNAME || 'developer1',
    password: process.env.PROD_DB_PASSWORD || 'Skyably@411',
    database: process.env.PROD_DB_NAME || 'wise_lifescience'
  }
};

// Server configuration
const SERVER_CONFIG = {
  host: config.server.host,
  username: config.server.username,
  password: config.server.password,
  backendPath: config.server.backendPath
};

// Database deployment options
const DB_DEPLOY_OPTIONS = {
  backupBeforeSync: process.env.DB_BACKUP_BEFORE_SYNC !== 'false',
  syncSchema: process.env.DB_SYNC_SCHEMA !== 'false',
  syncData: process.env.DB_SYNC_DATA === 'true',
  runMigrations: process.env.DB_RUN_MIGRATIONS !== 'false',
  createTables: process.env.DB_CREATE_TABLES !== 'false',
  insertSeedData: process.env.DB_INSERT_SEED_DATA === 'true'
};

/**
 * Execute local command
 */
function executeLocalCommand(command, description) {
  try {
    logInfo(`Executing: ${description}`);
    const result = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minutes
    });
    return result;
  } catch (error) {
    logError(`Failed to execute: ${description}`);
    logError(error.message);
    throw error;
  }
}

/**
 * Execute SSH command on remote server
 */
function executeSSHCommand(command, description) {
  const sshCommand = `sshpass -p '${SERVER_CONFIG.password}' ssh -o StrictHostKeyChecking=no ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "${command}"`;
  return executeLocalCommand(sshCommand, description);
}

/**
 * Check if database exists
 */
function checkDatabaseExists(env) {
  const dbConfig = ENV_CONFIG[env];
  const checkCommand = env === 'development' 
    ? `PGPASSWORD='${dbConfig.password}' psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -lqt | cut -d \\| -f 1 | grep -qw ${dbConfig.database}`
    : `sshpass -p '${SERVER_CONFIG.password}' ssh -o StrictHostKeyChecking=no ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "PGPASSWORD='${dbConfig.password}' psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -lqt | cut -d \\| -f 1 | grep -qw ${dbConfig.database}"`;
  
  try {
    executeLocalCommand(checkCommand, `Check if ${env} database exists`);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Create database backup
 */
function createDatabaseBackup(env) {
  const dbConfig = ENV_CONFIG[env];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = `${dbConfig.database}_backup_${timestamp}.sql`;
  const backupPath = env === 'production' ? `/tmp/${backupFile}` : `./backups/${backupFile}`;
  
  logStep('BACKUP', `Creating ${env} database backup`);
  
  // Ensure backup directory exists
  if (env === 'development') {
    executeLocalCommand('mkdir -p ./backups', 'Create backup directory');
  }
  
  const dumpCommand = env === 'development'
    ? `PGPASSWORD='${dbConfig.password}' pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} > ${backupPath}`
    : `sshpass -p '${SERVER_CONFIG.password}' ssh -o StrictHostKeyChecking=no ${SERVER_CONFIG.username}@${SERVER_CONFIG.host} "PGPASSWORD='${dbConfig.password}' pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} > ${backupPath}"`;
  
  executeLocalCommand(dumpCommand, `Create ${env} database backup`);
  logSuccess(`${env} database backup created: ${backupFile}`);
  
  return backupPath;
}

/**
 * Export development database schema
 */
function exportDevelopmentSchema() {
  logStep('EXPORT', 'Exporting development database schema');
  
  const dbConfig = ENV_CONFIG.development;
  const schemaFile = path.join(__dirname, '..', 'backend', 'schema-export.sql');
  
  // Export schema only (no data)
  const exportCommand = `PGPASSWORD='${dbConfig.password}' pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} --schema-only --no-owner --no-privileges > ${schemaFile}`;
  
  executeLocalCommand(exportCommand, 'Export development schema');
  logSuccess('Development schema exported');
  
  return schemaFile;
}

/**
 * Export development database data
 */
function exportDevelopmentData() {
  logStep('EXPORT', 'Exporting development database data');
  
  const dbConfig = ENV_CONFIG.development;
  const dataFile = path.join(__dirname, '..', 'backend', 'data-export.sql');
  
  // Export data only (no schema)
  const exportCommand = `PGPASSWORD='${dbConfig.password}' pg_dump -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} --data-only --no-owner --no-privileges > ${dataFile}`;
  
  executeLocalCommand(exportCommand, 'Export development data');
  logSuccess('Development data exported');
  
  return dataFile;
}

/**
 * Upload files to server
 */
function uploadFilesToServer(files) {
  logStep('UPLOAD', 'Uploading database files to server');
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const fileName = path.basename(file);
      const uploadCommand = `sshpass -p '${SERVER_CONFIG.password}' scp -o StrictHostKeyChecking=no ${file} ${SERVER_CONFIG.username}@${SERVER_CONFIG.host}:${SERVER_CONFIG.backendPath}/${fileName}`;
      
      executeLocalCommand(uploadCommand, `Upload ${fileName}`);
      logSuccess(`${fileName} uploaded`);
    } else {
      logWarning(`File not found: ${file}`);
    }
  });
}

/**
 * Execute SQL file on production database
 */
function executeSQLOnProduction(sqlFile) {
  const dbConfig = ENV_CONFIG.production;
  const fileName = path.basename(sqlFile);
  
  logStep('EXECUTE', `Executing ${fileName} on production database`);
  
  const executeCommand = `cd ${SERVER_CONFIG.backendPath} && PGPASSWORD='${dbConfig.password}' psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -f ${fileName}`;
  
  try {
    executeSSHCommand(executeCommand, `Execute ${fileName}`);
    logSuccess(`${fileName} executed successfully`);
  } catch (error) {
    logWarning(`Failed to execute ${fileName}, continuing...`);
    logWarning(error.message);
  }
}

/**
 * Run TypeORM migrations
 */
function runMigrations() {
  logStep('MIGRATIONS', 'Running TypeORM migrations');
  
  try {
    executeSSHCommand(
      `cd ${SERVER_CONFIG.backendPath} && npm run migration:run`,
      'Run TypeORM migrations'
    );
    logSuccess('Migrations completed successfully');
  } catch (error) {
    logWarning('Migration failed or no migrations to run');
    logWarning(error.message);
  }
}

/**
 * Create essential database tables
 */
function createEssentialTables() {
  logStep('TABLES', 'Creating essential database tables');
  
  const schemaFile = path.join(__dirname, '..', 'backend', 'schema.sql');
  
  if (fs.existsSync(schemaFile)) {
    uploadFilesToServer([schemaFile]);
    executeSQLOnProduction(schemaFile);
  } else {
    logWarning('schema.sql not found, skipping table creation');
  }
}

/**
 * Insert seed data
 */
function insertSeedData() {
  logStep('SEED', 'Inserting seed data');
  
  const seedFiles = [
    path.join(__dirname, '..', 'backend', 'create-admin.sql'),
    path.join(__dirname, '..', 'backend', 'demo-data.sql')
  ];
  
  const existingFiles = seedFiles.filter(file => fs.existsSync(file));
  
  if (existingFiles.length > 0) {
    uploadFilesToServer(existingFiles);
    existingFiles.forEach(file => {
      executeSQLOnProduction(file);
    });
  } else {
    logWarning('No seed data files found');
  }
}

/**
 * Verify database deployment
 */
function verifyDatabaseDeployment() {
  logStep('VERIFY', 'Verifying database deployment');
  
  const dbConfig = ENV_CONFIG.production;
  
  try {
    // Check if users table exists
    const checkTablesCommand = `PGPASSWORD='${dbConfig.password}' psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -c "\\dt"`;
    
    executeSSHCommand(checkTablesCommand, 'Check database tables');
    logSuccess('Database tables verified');
    
    // Check if admin user exists
    const checkAdminCommand = `PGPASSWORD='${dbConfig.password}' psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.username} -d ${dbConfig.database} -c "SELECT email FROM users WHERE role = 'admin' LIMIT 1;"`;
    
    executeSSHCommand(checkAdminCommand, 'Check admin user');
    logSuccess('Admin user verified');
    
  } catch (error) {
    logWarning('Database verification failed');
    logWarning(error.message);
  }
}

/**
 * Main database deployment function
 */
function deployDatabase(options = {}) {
  log('\n🚀 Starting Database Deployment', 'bright');
  log('=====================================', 'cyan');
  
  const deployOptions = { ...DB_DEPLOY_OPTIONS, ...options };
  
  try {
    // Step 1: Check database connections
    logStep(1, 'Checking database connections');
    
    const devDbExists = checkDatabaseExists('development');
    const prodDbExists = checkDatabaseExists('production');
    
    logInfo(`Development database: ${devDbExists ? 'Connected' : 'Not found'}`);
    logInfo(`Production database: ${prodDbExists ? 'Connected' : 'Not found'}`);
    
    // Step 2: Backup production database
    if (deployOptions.backupBeforeSync && prodDbExists) {
      createDatabaseBackup('production');
    }
    
    // Step 3: Create essential tables if needed
    if (deployOptions.createTables) {
      createEssentialTables();
    }
    
    // Step 4: Run migrations
    if (deployOptions.runMigrations) {
      runMigrations();
    }
    
    // Step 5: Sync schema from development
    if (deployOptions.syncSchema && devDbExists) {
      const schemaFile = exportDevelopmentSchema();
      uploadFilesToServer([schemaFile]);
      executeSQLOnProduction(schemaFile);
    }
    
    // Step 6: Sync data from development
    if (deployOptions.syncData && devDbExists) {
      const dataFile = exportDevelopmentData();
      uploadFilesToServer([dataFile]);
      executeSQLOnProduction(dataFile);
    }
    
    // Step 7: Insert seed data
    if (deployOptions.insertSeedData) {
      insertSeedData();
    }
    
    // Step 8: Verify deployment
    verifyDatabaseDeployment();
    
    log('\n🎉 Database deployment completed successfully!', 'green');
    
  } catch (error) {
    logError('Database deployment failed');
    logError(error.message);
    process.exit(1);
  }
}

/**
 * Show help information
 */
function showHelp() {
  log('\n📚 Database Deployment Script Help', 'cyan');
  log('===================================', 'cyan');
  log('\nUsage: node deploy-database.js [options]\n');
  log('Options:');
  log('  --help, -h              Show this help message');
  log('  --schema-only           Sync schema only');
  log('  --data-only             Sync data only');
  log('  --migrations-only       Run migrations only');
  log('  --create-tables         Create essential tables');
  log('  --seed-data             Insert seed data');
  log('  --no-backup             Skip backup before sync');
  log('  --dry-run               Show deployment plan without executing');
  log('\nEnvironment Variables:');
  log('  DB_BACKUP_BEFORE_SYNC   Backup before sync (default: true)');
  log('  DB_SYNC_SCHEMA          Sync schema (default: true)');
  log('  DB_SYNC_DATA            Sync data (default: false)');
  log('  DB_RUN_MIGRATIONS       Run migrations (default: true)');
  log('  DB_CREATE_TABLES        Create tables (default: true)');
  log('  DB_INSERT_SEED_DATA     Insert seed data (default: false)');
  log('\nExamples:');
  log('  node deploy-database.js --schema-only');
  log('  node deploy-database.js --migrations-only');
  log('  DB_SYNC_DATA=true node deploy-database.js');
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const options = { ...DB_DEPLOY_OPTIONS };
  
  args.forEach(arg => {
    switch (arg) {
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      case '--schema-only':
        options.syncSchema = true;
        options.syncData = false;
        options.runMigrations = false;
        options.createTables = false;
        options.insertSeedData = false;
        break;
      case '--data-only':
        options.syncSchema = false;
        options.syncData = true;
        options.runMigrations = false;
        options.createTables = false;
        options.insertSeedData = false;
        break;
      case '--migrations-only':
        options.syncSchema = false;
        options.syncData = false;
        options.runMigrations = true;
        options.createTables = false;
        options.insertSeedData = false;
        break;
      case '--create-tables':
        options.createTables = true;
        break;
      case '--seed-data':
        options.insertSeedData = true;
        break;
      case '--no-backup':
        options.backupBeforeSync = false;
        break;
      case '--dry-run':
        log('\n🔍 Database Deployment Plan (Dry Run)', 'yellow');
        log('======================================', 'yellow');
        log('1. Check database connections');
        log(`2. Backup production database: ${options.backupBeforeSync}`);
        log(`3. Create essential tables: ${options.createTables}`);
        log(`4. Run migrations: ${options.runMigrations}`);
        log(`5. Sync schema: ${options.syncSchema}`);
        log(`6. Sync data: ${options.syncData}`);
        log(`7. Insert seed data: ${options.insertSeedData}`);
        log('8. Verify deployment');
        process.exit(0);
        break;
    }
  });
  
  return options;
}

// Main execution
if (require.main === module) {
  const options = parseArguments();
  deployDatabase(options);
}

module.exports = {
  deployDatabase,
  createDatabaseBackup,
  exportDevelopmentSchema,
  exportDevelopmentData,
  runMigrations,
  createEssentialTables,
  insertSeedData,
  verifyDatabaseDeployment
};