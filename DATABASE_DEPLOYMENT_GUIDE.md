# 🗄️ Database Deployment Guide

**Multi-Vendor E-Commerce Platform - Database Correlation System**

This guide explains how to establish proper database correlation between development and production environments, ensuring seamless database deployment when you deploy to the server.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Database Deployment Commands](#database-deployment-commands)
5. [Development to Production Workflow](#development-to-production-workflow)
6. [Advanced Usage](#advanced-usage)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## 🎯 Overview

The database deployment system provides:

- **Automatic Schema Sync**: Sync database schema from development to production
- **Migration Management**: Run TypeORM migrations automatically
- **Data Synchronization**: Optionally sync data between environments
- **Backup Protection**: Automatic backups before making changes
- **Seed Data Management**: Insert admin users and demo data
- **Verification**: Verify deployment success

## ⚡ Quick Start

### 1. Configure Database Settings

```bash
# Copy the database configuration template
cp .env.database.example .env.database

# Edit the configuration file
nano .env.database
```

### 2. Deploy Database Schema

```bash
# Deploy complete database (schema + migrations)
npm run deploy:db

# Or deploy everything including database
npm run deploy:full
```

### 3. Verify Deployment

```bash
# Check if deployment was successful
curl https://node-api.skyablyitsolution.com/wise-lifescience/api/v1/version
```

## 🔧 Configuration

### Environment Variables

Create `.env.database` from the template and configure:

```bash
# Development Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=mac
DB_PASSWORD=
DB_NAME=multi_vendor_ecommerce

# Production Database
PROD_DB_HOST=localhost
PROD_DB_PORT=5432
PROD_DB_USERNAME=developer1
PROD_DB_PASSWORD=Skyably@411
PROD_DB_NAME=wise_lifescience

# Deployment Options
DB_BACKUP_BEFORE_SYNC=true
DB_SYNC_SCHEMA=true
DB_SYNC_DATA=false
DB_RUN_MIGRATIONS=true
DB_CREATE_TABLES=true
DB_INSERT_SEED_DATA=false
```

### Server Configuration

```bash
# Server Details
DEPLOY_HOST=31.97.207.193
DEPLOY_USER=developer1
DEPLOY_PASS=Skyably@411
DEPLOY_BACKEND_PATH=/var/www/clients/wise-lifescience/backend
```

## 🚀 Database Deployment Commands

### Basic Commands

```bash
# Deploy complete database
npm run deploy:db

# Deploy only database schema
npm run deploy:db:schema

# Deploy only database data
npm run deploy:db:data

# Run only migrations
npm run deploy:db:migrations

# Insert seed data
npm run deploy:db:seed

# Show help
npm run deploy:db:help
```

### Full Deployment

```bash
# Deploy database + application
npm run deploy:full

# Regular application deployment (includes database sync)
npm run deploy
```

### Advanced Commands

```bash
# Schema only deployment
node scripts/deploy-database.js --schema-only

# Data only deployment
DB_SYNC_DATA=true node scripts/deploy-database.js --data-only

# Migrations only
node scripts/deploy-database.js --migrations-only

# Create tables and seed data
node scripts/deploy-database.js --create-tables --seed-data

# Skip backup
node scripts/deploy-database.js --no-backup

# Dry run (preview what will be done)
node scripts/deploy-database.js --dry-run
```

## 🔄 Development to Production Workflow

### 1. Development Phase

```bash
# Work on your local development database
cd backend
npm run start:dev

# Make database changes using TypeORM entities
# Create migrations for schema changes
npm run migration:generate -- -n AddNewFeature
npm run migration:run
```

### 2. Prepare for Deployment

```bash
# Ensure all migrations are created
cd backend
npm run migration:generate -- -n FinalChanges

# Test migrations locally
npm run migration:run
```

### 3. Deploy to Production

```bash
# Option 1: Deploy everything (recommended)
npm run deploy:full

# Option 2: Deploy database first, then application
npm run deploy:db
npm run deploy

# Option 3: Deploy only schema changes
npm run deploy:db:schema
npm run deploy:db:migrations
```

### 4. Verify Deployment

```bash
# Test API endpoints
curl https://node-api.skyablyitsolution.com/wise-lifescience/api/v1/auth/admin-login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

## 🔧 Advanced Usage

### Custom Database Sync

```bash
# Sync specific tables only
DB_SYNC_SCHEMA=true DB_SYNC_DATA=false npm run deploy:db

# Sync data from development to production (use with caution)
DB_SYNC_DATA=true npm run deploy:db:data

# Skip backup (faster, but risky)
DB_BACKUP_BEFORE_SYNC=false npm run deploy:db
```

### Environment-Specific Deployments

```bash
# Deploy to staging
CLIENT_NAME=staging PROD_DB_NAME=staging_db npm run deploy:db

# Deploy to different server
DEPLOY_HOST=staging.example.com npm run deploy:db
```

### Backup and Recovery

```bash
# Create manual backup before deployment
node scripts/deploy-database.js --backup-only

# Deploy with backup
DB_BACKUP_BEFORE_SYNC=true npm run deploy:db

# Restore from backup (manual process)
ssh developer1@31.97.207.193
cd /var/backups/databases
psql wise_lifescience < wise_lifescience_backup_2024-01-15.sql
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Permission Denied Errors

```bash
# Error: permission denied for schema public
# Solution: Grant proper permissions to database user

# Connect as superuser and grant permissions
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE wise_lifescience TO developer1;
GRANT ALL PRIVILEGES ON SCHEMA public TO developer1;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO developer1;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO developer1;
```

#### 2. Connection Refused

```bash
# Error: connection refused
# Solution: Check database configuration

# Verify database is running
ssh developer1@31.97.207.193
sudo systemctl status postgresql

# Check connection
psql -h localhost -U developer1 -d wise_lifescience
```

#### 3. Migration Failures

```bash
# Error: migration failed
# Solution: Check migration files and database state

# Check migration status
cd backend
npm run migration:show

# Revert last migration if needed
npm run migration:revert

# Run specific migration
npm run migration:run
```

#### 4. Schema Conflicts

```bash
# Error: table already exists
# Solution: Use migrations instead of schema.sql

# Deploy migrations only
npm run deploy:db:migrations

# Or force schema recreation (destructive)
DB_DROP_SCHEMA=true npm run deploy:db:schema
```

### Debug Mode

```bash
# Enable verbose logging
DEPLOY_VERBOSE=true npm run deploy:db

# Dry run to see what will happen
npm run deploy:db --dry-run

# Check configuration
node -e "console.log(require('./deploy.config.js'))"
```

### Manual Database Operations

```bash
# Connect to production database
ssh developer1@31.97.207.193
PGPASSWORD='Skyably@411' psql -h localhost -U developer1 -d wise_lifescience

# List tables
\dt

# Check admin user
SELECT * FROM users WHERE role = 'admin';

# Check database size
SELECT pg_size_pretty(pg_database_size('wise_lifescience'));
```

## 📋 Best Practices

### 1. Always Backup Before Deployment

```bash
# Enable automatic backups
DB_BACKUP_BEFORE_SYNC=true

# Set backup retention
DB_BACKUP_RETENTION=7
```

### 2. Use Migrations for Schema Changes

```bash
# Create migrations for all schema changes
cd backend
npm run migration:generate -- -n DescriptiveChangeName

# Test migrations locally first
npm run migration:run
```

### 3. Separate Schema and Data Deployment

```bash
# Deploy schema changes first
npm run deploy:db:schema
npm run deploy:db:migrations

# Deploy data separately if needed
DB_SYNC_DATA=true npm run deploy:db:data
```

### 4. Use Environment Variables

```bash
# Create environment-specific configurations
cp .env.database.example .env.database.production
cp .env.database.example .env.database.staging

# Use different configs for different environments
source .env.database.production && npm run deploy:db
```

### 5. Monitor Deployment

```bash
# Check logs after deployment
ssh developer1@31.97.207.193
pm2 logs wise-lifescience-api

# Verify API health
curl https://node-api.skyablyitsolution.com/wise-lifescience/api/v1/version
```

### 6. Test Before Production

```bash
# Use dry run to preview changes
npm run deploy:db --dry-run

# Test on staging first
CLIENT_NAME=staging npm run deploy:db

# Verify functionality
curl https://staging-api.example.com/api/v1/health
```

## 🔐 Security Considerations

### 1. Database Credentials

- Store credentials in `.env.database` (not in version control)
- Use strong passwords for production
- Consider using SSH keys instead of passwords
- Rotate credentials regularly

### 2. Backup Security

- Encrypt database backups
- Store backups in secure location
- Implement backup retention policies
- Test backup restoration procedures

### 3. Network Security

- Use SSL/TLS for database connections
- Restrict database access to specific IPs
- Use VPN for remote database access
- Monitor database access logs

## 📊 Monitoring and Maintenance

### 1. Regular Backups

```bash
# Schedule daily backups
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### 2. Database Health Checks

```bash
# Monitor database size
SELECT pg_size_pretty(pg_database_size('wise_lifescience'));

# Check connection count
SELECT count(*) FROM pg_stat_activity;

# Monitor slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

### 3. Performance Optimization

```bash
# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'admin@example.com';

# Update table statistics
ANALYZE;

# Vacuum tables
VACUUM ANALYZE;
```

## 🎯 Next Steps

After setting up database deployment:

1. **Configure CI/CD**: Integrate with GitHub Actions or Jenkins
2. **Set up Monitoring**: Use tools like Grafana or DataDog
3. **Implement Alerts**: Set up notifications for deployment failures
4. **Document Procedures**: Create runbooks for common operations
5. **Train Team**: Ensure team members understand the deployment process

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review deployment logs: `pm2 logs wise-lifescience-api`
3. Test database connectivity manually
4. Verify configuration files
5. Check server resources and permissions

---

**🎉 Happy Database Deploying!** Your development and production databases are now properly correlated and will sync automatically when you deploy to the server.