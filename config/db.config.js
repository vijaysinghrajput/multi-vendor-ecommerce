/**
 * Database Configuration Manager
 * Handles database connections for different environments
 */

const { getConfig, getDatabaseConfig } = require('./env');

/**
 * Get TypeORM configuration for current environment
 * @returns {Object} TypeORM configuration object
 */
function getTypeOrmConfig() {
  return getDatabaseConfig();
}

/**
 * Get raw database connection configuration
 * @returns {Object} Raw database configuration
 */
function getRawDbConfig() {
  const config = getConfig();
  return config.database;
}

/**
 * Get database connection string
 * @returns {string} Database connection string
 */
function getConnectionString() {
  const config = getRawDbConfig();
  const { host, port, username, password, name } = config;
  
  return `postgresql://${username}:${password}@${host}:${port}/${name}`;
}

/**
 * Get database configuration for different ORMs/clients
 * @param {string} type - Type of configuration ('typeorm', 'sequelize', 'prisma', 'raw')
 * @returns {Object} Database configuration
 */
function getDbConfig(type = 'typeorm') {
  const rawConfig = getRawDbConfig();
  
  switch (type) {
    case 'typeorm':
      return getTypeOrmConfig();
      
    case 'sequelize':
      return {
        dialect: 'postgres',
        host: rawConfig.host,
        port: rawConfig.port,
        username: rawConfig.username,
        password: rawConfig.password,
        database: rawConfig.name,
        logging: rawConfig.logging,
        dialectOptions: rawConfig.ssl ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } : {}
      };
      
    case 'prisma':
      return {
        url: getConnectionString()
      };
      
    case 'pg':
    case 'raw':
    default:
      return {
        host: rawConfig.host,
        port: rawConfig.port,
        user: rawConfig.username,
        password: rawConfig.password,
        database: rawConfig.name,
        ssl: rawConfig.ssl
      };
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection test result
 */
async function testConnection() {
  const { Client } = require('pg');
  const config = getDbConfig('pg');
  
  const client = new Client(config);
  
  try {
    await client.connect();
    await client.query('SELECT 1');
    await client.end();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Create database if it doesn't exist
 * @param {string} dbName - Database name to create
 * @returns {Promise<boolean>} Creation result
 */
async function createDatabase(dbName) {
  const { Client } = require('pg');
  const config = getDbConfig('pg');
  
  // Connect to postgres database to create new database
  const adminConfig = { ...config, database: 'postgres' };
  const client = new Client(adminConfig);
  
  try {
    await client.connect();
    
    // Check if database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );
    
    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created successfully`);
    } else {
      console.log(`ℹ️  Database '${dbName}' already exists`);
    }
    
    await client.end();
    return true;
  } catch (error) {
    console.error(`❌ Failed to create database '${dbName}':`, error.message);
    await client.end();
    return false;
  }
}

/**
 * Run SQL file against database
 * @param {string} sqlFilePath - Path to SQL file
 * @returns {Promise<boolean>} Execution result
 */
async function runSqlFile(sqlFilePath) {
  const fs = require('fs');
  const path = require('path');
  const { Client } = require('pg');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ SQL file not found: ${sqlFilePath}`);
    return false;
  }
  
  const config = getDbConfig('pg');
  const client = new Client(config);
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  try {
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log(`✅ SQL file executed successfully: ${path.basename(sqlFilePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute SQL file:`, error.message);
    await client.end();
    return false;
  }
}

/**
 * Backup database to SQL file
 * @param {string} outputPath - Output file path
 * @returns {Promise<boolean>} Backup result
 */
async function backupDatabase(outputPath) {
  const { execSync } = require('child_process');
  const config = getRawDbConfig();
  const { host, port, username, password, name } = config;
  
  try {
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${name} > "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Database backup created: ${outputPath}`);
    return true;
  } catch (error) {
    console.error('❌ Database backup failed:', error.message);
    return false;
  }
}

/**
 * Restore database from SQL file
 * @param {string} sqlFilePath - SQL file path
 * @returns {Promise<boolean>} Restore result
 */
async function restoreDatabase(sqlFilePath) {
  const { execSync } = require('child_process');
  const config = getRawDbConfig();
  const { host, port, username, password, name } = config;
  
  try {
    const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${name} < "${sqlFilePath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Database restored from: ${sqlFilePath}`);
    return true;
  } catch (error) {
    console.error('❌ Database restore failed:', error.message);
    return false;
  }
}

module.exports = {
  getDbConfig,
  getTypeOrmConfig,
  getRawDbConfig,
  getConnectionString,
  testConnection,
  createDatabase,
  runSqlFile,
  backupDatabase,
  restoreDatabase
};