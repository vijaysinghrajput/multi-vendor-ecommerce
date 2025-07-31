# 🚀 Full-Stack Deployment Automation

**Multi-Vendor E-Commerce Platform - Automated Deployment System**

This repository includes a comprehensive deployment automation system that handles the complete deployment pipeline from your local machine to your VPS server.

## 📁 Deployment Files Overview

| File | Purpose | Description |
|------|---------|-------------|
| `deploy.js` | Main deployment script | Node.js automation script with full features |
| `deploy.sh` | Shell script alternative | Bash script for users who prefer shell |
| `deploy.config.js` | Configuration file | Centralized settings and options |
| `.env.deploy.example` | Environment template | Template for custom environment variables |
| `package.json` | Root package file | Scripts and dependencies for deployment |
| `DEPLOYMENT.md` | Comprehensive guide | Detailed documentation and troubleshooting |
| `QUICK_START.md` | Quick start guide | Get started in minutes |

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Deploy immediately
npm run deploy
```

## 🎯 What Gets Automated

### ✅ Complete Deployment Pipeline

1. **SSH Connection** - Secure connection to your VPS
2. **File Synchronization** - Upload backend code (excludes node_modules, .git, etc.)
3. **Git Integration** - Pull latest changes from your repository
4. **Dependency Management** - Install production npm packages
5. **Application Build** - Compile TypeScript to JavaScript
6. **Database Migrations** - Run pending schema updates
7. **Frontend Configuration** - Auto-update API URLs in `.env.local`
8. **Process Management** - Restart/start PM2 application
9. **Health Verification** - Test deployment success

### 🔧 Server Configuration (Pre-configured)

- **Host:** `31.97.207.193`
- **User:** `developer1` (password: `Skyably@411`)
- **Backend Path:** `/var/www/wise-lifescience/backend`
- **Application Port:** `3000`
- **Process Manager:** PM2
- **Database:** PostgreSQL

## 📋 Available Commands

```bash
# Deployment Commands
npm run deploy              # Full deployment
npm run deploy:dry-run      # Preview deployment plan
npm run deploy:help         # Show help information
npm run deploy:config       # View current configuration

# Development Commands
npm run setup               # Install all dependencies
npm run dev:backend         # Start backend development
npm run dev:frontend        # Start frontend development
npm run build:backend       # Build backend locally
npm run build:frontend      # Build frontend locally

# Alternative Methods
./deploy.sh                 # Shell script deployment
./deploy.sh --dry-run       # Shell script dry run
node deploy.js              # Direct Node.js execution
```

## 🎛️ Configuration Options

### Environment Variables (`.env.deploy`)

Create `.env.deploy` from `.env.deploy.example` to customize:

```bash
# Server Configuration
DEPLOY_HOST=31.97.207.193
DEPLOY_USER=developer1
DEPLOY_PASS=Skyably@411
DEPLOY_BACKEND_PATH=/var/www/wise-lifescience/backend
DEPLOY_SERVER_PORT=3000

# Application Settings
DEPLOY_APP_NAME=backend-app
DEPLOY_ENV=production
DEPLOY_GIT_BRANCH=main

# Feature Toggles
DEPLOY_RUN_MIGRATIONS=true
DEPLOY_INSTALL_DEPS=true
DEPLOY_BUILD_APP=true
DEPLOY_UPDATE_FRONTEND=true
DEPLOY_RESTART_PM2=true
```

### Advanced Configuration (`deploy.config.js`)

- **Server settings** - Host, credentials, paths
- **Deployment options** - Timeouts, retries, feature flags
- **PM2 configuration** - Process management settings
- **Health checks** - Verification and monitoring
- **Security options** - SSH keys, authentication
- **Development mode** - Skip steps, verbose logging

## 🔍 Monitoring & Verification

### Automatic Health Checks
- Tests API endpoint: `/api/v1/health`
- Configurable retries and timeouts
- Detailed success/failure reporting

### Manual Verification
```bash
# Check API health
curl http://31.97.207.193:3000/api/v1/health

# Monitor PM2 processes
ssh developer1@31.97.207.193
pm2 status
pm2 logs
pm2 monit
```

## 🛡️ Security Features

- **SSH Authentication** - Password or key-based
- **Secure File Transfer** - rsync with SSH
- **Environment Isolation** - Production environment variables
- **Process Management** - PM2 with proper user permissions
- **Health Monitoring** - Automatic deployment verification

## 🔧 Customization Examples

### Deploy to Different Server
```bash
# Create custom .env.deploy
DEPLOY_HOST=your-server-ip
DEPLOY_USER=your-username
DEPLOY_PASS=your-password
DEPLOY_BACKEND_PATH=/path/to/your/backend
```

### Skip Certain Steps
```bash
# Skip migrations during deployment
DEPLOY_RUN_MIGRATIONS=false

# Skip build (if building locally)
DEPLOY_BUILD_APP=false
```

### Use SSH Keys Instead of Password
```bash
USE_SSH_KEYS=true
SSH_KEY_PATH=/path/to/your/private/key
```

## 🆘 Troubleshooting

### Common Issues & Solutions

**1. SSH Connection Failed**
```bash
# Test manual connection
ssh developer1@31.97.207.193

# Install sshpass if missing
brew install hudochenkov/sshpass/sshpass
```

**2. Build Errors**
```bash
# Test build locally first
cd backend
npm install
npm run build
```

**3. PM2 Issues**
```bash
# Check PM2 status on server
ssh developer1@31.97.207.193
pm2 status
pm2 logs backend-app
pm2 restart backend-app
```

**4. Database Connection**
```bash
# Check database configuration
ssh developer1@31.97.207.193
cd /var/www/wise-lifescience/backend
cat .env  # Verify database settings
```

### Debug Mode
```bash
# Enable verbose logging
DEPLOY_VERBOSE=true npm run deploy

# View configuration
npm run deploy:config

# Dry run to see what will happen
npm run deploy:dry-run
```

## 📚 Documentation

- **`QUICK_START.md`** - Get started in minutes
- **`DEPLOYMENT.md`** - Comprehensive deployment guide
- **`deploy.config.js`** - Configuration options and examples
- **`.env.deploy.example`** - Environment variable template

## 🎉 Success Indicators

After successful deployment, you'll see:

```
🎉 Deployment completed successfully!
🌐 Server URL: http://31.97.207.193:3000
📱 API URL: http://31.97.207.193:3000/api/v1
📊 PM2 App: backend-app
🌍 Environment: production
📁 Frontend .env.local updated with production API URL
```

## 🚀 Next Steps

1. **Frontend Deployment** - Deploy your Next.js frontend to Vercel/Netlify
2. **Domain Configuration** - Set up your custom domain and SSL
3. **Monitoring Setup** - Configure application monitoring and alerts
4. **Backup Strategy** - Set up automated database backups
5. **CI/CD Integration** - Integrate with GitHub Actions or similar

## 🤝 Contributing

To improve the deployment system:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For deployment issues:

1. Check the troubleshooting section
2. Run `npm run deploy:dry-run` to debug
3. Review logs with `npm run deploy:config`
4. Test individual components manually

---

**Built with ❤️ for seamless deployments**

*This automation system saves hours of manual deployment work and ensures consistent, reliable deployments every time.*