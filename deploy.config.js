// Deployment Configuration
// This file contains all the configuration settings for the deployment automation

module.exports = {
  // Server Configuration
  server: {
    host: process.env.DEPLOY_HOST || '31.97.207.193',
    username: process.env.DEPLOY_USER || 'developer1',
    password: process.env.DEPLOY_PASS || 'Skyably@411',
    port: parseInt(process.env.DEPLOY_PORT) || 22, // SSH port
    backendPath: process.env.DEPLOY_BACKEND_PATH || '/var/www/wise-lifescience/backend',
    serverPort: parseInt(process.env.DEPLOY_SERVER_PORT) || 3000 // Application port
  },

  // Application Configuration
  app: {
    name: process.env.DEPLOY_APP_NAME || 'wise-lifescience-api',
    environment: process.env.DEPLOY_ENV || 'production',
    gitBranch: process.env.DEPLOY_GIT_BRANCH || 'main',
    clientName: process.env.CLIENT_NAME || 'wise-lifescience',
    version: process.env.APP_VERSION || '1.0.0'
  },

  // Deployment Options
  deployment: {
    // Files and directories to exclude during upload
    excludePatterns: [
      'node_modules',
      'dist',
      '.git',
      'logs',
      'uploads',
      '.env',
      '*.log',
      '.DS_Store',
      'coverage',
      '.nyc_output',
      'test-results'
    ],
    
    // Timeout settings (in milliseconds)
    timeouts: {
      ssh: 30000,        // 30 seconds
      upload: 600000,    // 10 minutes
      build: 300000,     // 5 minutes
      migration: 120000  // 2 minutes
    },
    
    // Retry settings
    retries: {
      ssh: 3,
      upload: 2,
      build: 1,
      migration: 2
    },
    
    // Whether to run migrations
    runMigrations: process.env.DEPLOY_RUN_MIGRATIONS !== 'false',
    
    // Whether to install dependencies
    installDependencies: process.env.DEPLOY_INSTALL_DEPS !== 'false',
    
    // Whether to build the application
    buildApplication: process.env.DEPLOY_BUILD_APP !== 'false',
    
    // Whether to update frontend environment
    updateFrontendEnv: process.env.DEPLOY_UPDATE_FRONTEND !== 'false',
    
    // Whether to restart PM2
    restartPM2: process.env.DEPLOY_RESTART_PM2 !== 'false'
  },

  // PM2 Configuration
  pm2: {
    // PM2 ecosystem configuration
    ecosystem: {
      name: process.env.DEPLOY_APP_NAME || 'backend-app',
      script: 'dist/main.js',
      instances: process.env.PM2_INSTANCES || 1,
      exec_mode: process.env.PM2_EXEC_MODE || 'fork', // 'fork' or 'cluster'
      env: {
        NODE_ENV: 'production',
        PORT: process.env.DEPLOY_SERVER_PORT || 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    },
    
    // PM2 startup options
    startup: {
      platform: 'ubuntu',
      service_name: 'pm2'
    }
  },

  // Database Configuration
  database: {
    // Migration settings
    migrations: {
      timeout: 120000, // 2 minutes
      retries: 2
    },
    
    // Database sync and upload settings
    sync: {
      enabled: process.env.DB_SYNC_ENABLED !== 'false',
      backupBeforeSync: process.env.DB_BACKUP_BEFORE_SYNC !== 'false',
      sqlFile: process.env.DB_SQL_FILE || 'schema.sql',
      uploadSqlFiles: process.env.DB_UPLOAD_SQL === 'true',
      runSqlFiles: process.env.DB_RUN_SQL === 'true'
    },
    
    // Database backup settings
    backup: {
      enabled: process.env.DB_BACKUP_ENABLED !== 'false',
      path: process.env.DB_BACKUP_PATH || '/var/backups/databases',
      retention: parseInt(process.env.DB_BACKUP_RETENTION) || 7,
      filename: (clientName) => `${clientName}_backup_${new Date().toISOString().split('T')[0]}.sql`
    }
  },

  // Frontend Configuration
  frontend: {
    envFile: '.env.local',
    envExample: '.env.example',
    
    // Environment variables to update
    envVars: {
      NEXT_PUBLIC_API_URL: (config) => `http://${config.server.host}:${config.server.serverPort}/api/v1`,
      NEXT_PUBLIC_WS_URL: (config) => `ws://${config.server.host}:${config.server.serverPort}`,
      NEXT_PUBLIC_ENV: 'production'
    },
    
    // Vercel deployment settings (DISABLED - User will manage manually)
    vercel: {
      enabled: false, // Disabled as requested by user
      projectName: process.env.VERCEL_PROJECT_NAME || 'wise-lifescience',
      teamId: process.env.VERCEL_TEAM_ID,
      token: process.env.VERCEL_TOKEN,
      domain: process.env.VERCEL_DOMAIN || 'wise-lifescience.vercel.app',
      waitForDeployment: false,
      timeout: parseInt(process.env.VERCEL_TIMEOUT) || 300000 // 5 minutes
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.DEPLOY_LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
    colors: {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    }
  },

  // Health Check Configuration
  healthCheck: {
    enabled: true,
    endpoint: '/api/v1/health',
    timeout: 10000, // 10 seconds
    retries: 3,
    delay: 5000 // Wait 5 seconds before first check
  },

  // Backup Configuration (optional)
  backup: {
    enabled: process.env.DEPLOY_BACKUP_ENABLED === 'true',
    beforeDeployment: true,
    backupPath: '/var/backups/wise-lifescience',
    retention: 5 // Keep 5 backups
  },

  // Notification Configuration (optional)
  notifications: {
    enabled: process.env.DEPLOY_NOTIFICATIONS_ENABLED === 'true',
    
    // Slack webhook (optional)
    slack: {
      webhook: process.env.SLACK_WEBHOOK_URL,
      channel: process.env.SLACK_CHANNEL || '#deployments'
    },
    
    // Email notifications (optional)
    email: {
      enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD
      },
      to: process.env.NOTIFICATION_EMAIL,
      from: process.env.NOTIFICATION_FROM_EMAIL
    }
  },

  // Security Configuration
  security: {
    // SSH key path (alternative to password)
    sshKeyPath: process.env.SSH_KEY_PATH,
    
    // Whether to use SSH keys instead of password
    useSSHKeys: process.env.USE_SSH_KEYS === 'true',
    
    // SSH options
    sshOptions: {
      StrictHostKeyChecking: 'no',
      UserKnownHostsFile: '/dev/null',
      ConnectTimeout: 30
    }
  },

  // Development Configuration
  development: {
    // Whether to run in dry-run mode
    dryRun: process.env.DEPLOY_DRY_RUN === 'true',
    
    // Whether to enable verbose logging
    verbose: process.env.DEPLOY_VERBOSE === 'true',
    
    // Whether to skip certain steps for faster development
    skipSteps: {
      upload: process.env.DEPLOY_SKIP_UPLOAD === 'true',
      build: process.env.DEPLOY_SKIP_BUILD === 'true',
      migrations: process.env.DEPLOY_SKIP_MIGRATIONS === 'true',
      dbSync: process.env.DEPLOY_SKIP_DB_SYNC === 'true',
      vercel: process.env.DEPLOY_SKIP_VERCEL === 'true',
      github: process.env.DEPLOY_SKIP_GITHUB === 'true'
    }
  },
  
  // GitHub Integration
  github: {
    enabled: process.env.GITHUB_INTEGRATION_ENABLED !== 'false',
    token: process.env.GITHUB_TOKEN,
    repository: process.env.GITHUB_REPOSITORY || 'multi-vendor-ecommerce',
    owner: process.env.GITHUB_OWNER || 'vijaysinghrajput',
    branch: process.env.GITHUB_BRANCH || 'main',
    autoCommit: process.env.GITHUB_AUTO_COMMIT !== 'false',
    commitMessage: process.env.GITHUB_COMMIT_MESSAGE || 'chore: automated deployment update',
    autoPush: process.env.GITHUB_AUTO_PUSH !== 'false'
  },
  
  // Multi-Client Support
  multiClient: {
    enabled: process.env.MULTI_CLIENT_ENABLED === 'true',
    basePath: process.env.MULTI_CLIENT_BASE_PATH || '/var/www',
    clientFolders: {
      'wise-lifescience': {
        backendPath: '/var/www/wise-lifescience/backend',
        pm2Name: 'wise-lifescience-api',
        port: 3000,
        dbName: 'wise_lifescience'
      }
      // Add more clients as needed
      // 'client-a': {
      //   backendPath: '/var/www/client-a/backend',
      //   pm2Name: 'client-a-api',
      //   port: 3001,
      //   dbName: 'client_a'
      // }
    }
  }
};

// Validation function
function validateConfig(config) {
  const required = [
    'server.host',
    'server.username',
    'server.backendPath'
  ];
  
  const missing = [];
  
  required.forEach(path => {
    const keys = path.split('.');
    let current = config;
    
    for (const key of keys) {
      if (!current || !current[key]) {
        missing.push(path);
        break;
      }
      current = current[key];
    }
  });
  
  if (missing.length > 0) {
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
  }
  
  return true;
}

// Export validation function
module.exports.validateConfig = validateConfig;

// Helper function to get configuration with environment overrides
function getConfig() {
  const config = module.exports;
  
  // Validate configuration
  validateConfig(config);
  
  return config;
}

module.exports.getConfig = getConfig;