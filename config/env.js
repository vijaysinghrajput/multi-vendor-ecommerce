/**
 * Environment Configuration Manager
 * Handles automatic switching between local and production environments
 * Based on NODE_ENV and MODE variables
 */

const path = require('path');
const fs = require('fs');

// Environment mode detection
const NODE_ENV = process.env.NODE_ENV || 'development';
const MODE = process.env.MODE || (NODE_ENV === 'production' ? 'prod' : 'local');

// Base configuration
const baseConfig = {
  // Environment info
  nodeEnv: NODE_ENV,
  mode: MODE,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  isLocal: MODE === 'local',
  isProd: MODE === 'prod',
  
  // Application info
  appName: 'Multi-Vendor E-Commerce',
  version: '1.0.0',
  
  // Common settings
  cors: {
    credentials: true
  },
  
  // File upload settings
  upload: {
    maxFileSize: 5242880, // 5MB
    allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  },
  
  // JWT settings
  jwt: {
    expiresIn: '7d',
    refreshExpiresIn: '30d'
  }
};

// Local development configuration
const localConfig = {
  ...baseConfig,
  
  // Database
  database: {
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: process.env.DB_NAME || 'multi_vendor_ecommerce',
    synchronize: true,
    logging: true,
    ssl: false
  },
  
  // Server
  server: {
    port: 3000,
    host: 'localhost',
    apiPrefix: 'api',
    apiVersion: 'v1'
  },
  
  // Frontend
  frontend: {
    url: 'http://localhost:3001',
    apiUrl: 'http://localhost:3000/api/v1',
    wsUrl: 'ws://localhost:3000'
  },
  
  // CORS
  cors: {
    ...baseConfig.cors,
    origin: ['http://localhost:3001', 'http://localhost:3000']
  },
  
  // File paths
  paths: {
    uploads: './uploads',
    logs: './logs',
    backups: './backups'
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'local_development_secret_key_minimum_32_chars',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'local_refresh_secret_key_minimum_32_chars'
  }
};

// Production configuration
const prodConfig = {
  ...baseConfig,
  
  // Database
  database: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: parseInt(process.env.PROD_DB_PORT) || 5432,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    name: process.env.PROD_DB_NAME || 'multi_vendor_ecommerce_prod',
    synchronize: false,
    logging: false,
    ssl: process.env.PROD_DB_SSL === 'true'
  },
  
  // Server
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.PROD_SERVER_HOST || '0.0.0.0',
    apiPrefix: 'api',
    apiVersion: 'v1'
  },
  
  // Frontend
  frontend: {
    url: process.env.PROD_FRONTEND_URL || 'https://your-domain.vercel.app',
    apiUrl: process.env.PROD_API_URL || 'https://api.your-domain.com/api/v1',
    wsUrl: process.env.PROD_WS_URL || 'wss://api.your-domain.com'
  },
  
  // CORS
  cors: {
    ...baseConfig.cors,
    origin: [
      process.env.PROD_FRONTEND_URL || 'https://your-domain.vercel.app',
      process.env.PROD_ADMIN_URL || 'https://admin.your-domain.com'
    ]
  },
  
  // File paths
  paths: {
    uploads: process.env.PROD_UPLOAD_PATH || '/var/www/uploads',
    logs: process.env.PROD_LOG_PATH || '/var/log/app',
    backups: process.env.PROD_BACKUP_PATH || '/var/backups/app'
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET
  }
};

/**
 * Get configuration based on current mode
 * @returns {Object} Configuration object
 */
function getConfig() {
  const config = MODE === 'prod' ? prodConfig : localConfig;
  
  // Validate required production settings
  if (MODE === 'prod') {
    const required = [
      'PROD_DB_USERNAME',
      'PROD_DB_PASSWORD',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
  }
  
  return config;
}

/**
 * Switch environment mode
 * @param {string} newMode - 'local' or 'prod'
 */
function switchMode(newMode) {
  if (!['local', 'prod'].includes(newMode)) {
    throw new Error('Mode must be either "local" or "prod"');
  }
  
  process.env.MODE = newMode;
  console.log(`Environment switched to: ${newMode}`);
  
  return getConfig();
}

/**
 * Load environment file based on mode
 * @param {string} mode - Environment mode
 */
function loadEnvFile(mode = MODE) {
  const envFiles = {
    local: ['.env.local', '.env.development', '.env'],
    prod: ['.env.production', '.env.prod', '.env']
  };
  
  const files = envFiles[mode] || envFiles.local;
  
  for (const file of files) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
      console.log(`Loaded environment from: ${file}`);
      break;
    }
  }
}

/**
 * Get database configuration for TypeORM
 * @returns {Object} TypeORM configuration
 */
function getDatabaseConfig() {
  const config = getConfig();
  const dbConfig = config.database;
  
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.name,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    ssl: dbConfig.ssl,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    subscribers: ['dist/**/*.subscriber{.ts,.js}'],
    cli: {
      entitiesDir: 'src/modules',
      migrationsDir: 'src/database/migrations',
      subscribersDir: 'src/database/subscribers'
    }
  };
}

/**
 * Get frontend environment variables
 * @returns {Object} Frontend environment variables
 */
function getFrontendEnv() {
  const config = getConfig();
  
  return {
    NEXT_PUBLIC_API_URL: config.frontend.apiUrl,
    NEXT_PUBLIC_APP_URL: config.frontend.url,
    NEXT_PUBLIC_WS_URL: config.frontend.wsUrl,
    NEXT_PUBLIC_ENV: config.mode,
    NODE_ENV: config.nodeEnv,
    NEXTAUTH_URL: config.frontend.url,
    NEXTAUTH_SECRET: config.security.jwtSecret
  };
}

// Load environment file on module initialization
loadEnvFile();

module.exports = {
  getConfig,
  switchMode,
  loadEnvFile,
  getDatabaseConfig,
  getFrontendEnv,
  MODE,
  NODE_ENV
};