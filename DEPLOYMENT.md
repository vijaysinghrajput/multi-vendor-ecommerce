# 🚀 Automated Deployment Guide

This guide explains how to use the automated deployment system for the Multi-Vendor E-Commerce platform.

## 📋 Prerequisites

### Local Machine Requirements
- Node.js 16+ and npm 8+
- Git configured with repository access
- macOS with Homebrew (for sshpass installation)

### Server Requirements
- Ubuntu 24.04 LTS VPS
- PostgreSQL database configured
- PM2 process manager installed
- Git repository cloned to `/var/www/wise-lifescience/backend`

## 🔧 Server Configuration

**Server Details:**
- Host: `31.97.207.193`
- OS: Ubuntu 24.04 LTS
- Backend Path: `/var/www/wise-lifescience/backend`
- Server Port: `3000` (NestJS default)
- SSH Users:
  - `root` password: `Vijay@411..,,`
  - `developer1` password: `Skyably@411`

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies and setup all workspaces
npm run setup

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Verify Server Access

Test SSH connection manually:
```bash
ssh developer1@31.97.207.193
# Enter password: Skyably@411
```

### 3. Install sshpass (if not already installed)

The deployment script will automatically install sshpass via Homebrew:
```bash
brew install hudochenkov/sshpass/sshpass
```

## 🚀 Deployment Commands

### Quick Deployment
```bash
npm run deploy
```

### Dry Run (Preview Changes)
```bash
npm run deploy:dry-run
```

### Help
```bash
npm run deploy:help
```

### Direct Script Usage
```bash
node deploy.js
node deploy.js --dry-run
node deploy.js --help
```

## 📊 Deployment Process

The automated deployment performs these steps:

### 1. 🔐 SSH Connection Test
- Connects to `developer1@31.97.207.193`
- Verifies server access

### 2. 📁 File Upload
- Uses `rsync` to upload backend files
- Excludes: `node_modules`, `dist`, `.git`, `logs`, `uploads`, `.env`
- Preserves file permissions and timestamps

### 3. 🔄 Git Pull
- Navigates to `/var/www/wise-lifescience/backend`
- Pulls latest changes from `main` branch

### 4. 📦 Dependencies Installation
- Runs `npm install --production`
- Installs only production dependencies

### 5. 🏗️ Application Build
- Executes `npm run build`
- Compiles TypeScript to JavaScript

### 6. 🗄️ Database Migrations
- Runs `npm run migration:run`
- Applies pending database schema changes

### 7. ⚙️ Frontend Environment Update
- Updates `frontend/.env.local`
- Sets `NEXT_PUBLIC_API_URL=http://31.97.207.193:3000/api/v1`
- Sets `NEXT_PUBLIC_WS_URL=ws://31.97.207.193:3000`
- Sets `NEXT_PUBLIC_ENV=production`

### 8. 🔄 PM2 Process Management
- Restarts existing PM2 application or starts new one
- Uses application name from `package.json`
- Saves PM2 configuration
- Sets up startup script

### 9. ✅ Deployment Verification
- Tests server health endpoint
- Verifies API is responding
- Reports deployment status

## 📁 File Structure

```
.
├── deploy.js              # Main deployment script
├── package.json           # Root package.json with scripts
├── DEPLOYMENT.md          # This guide
├── backend/               # NestJS backend
│   ├── package.json
│   ├── .env.example
│   └── src/
└── frontend/              # Next.js frontend
    ├── package.json
    ├── .env.example
    └── .env.local         # Auto-updated by deployment
```

## 🔍 Monitoring & Troubleshooting

### Check PM2 Status
```bash
ssh developer1@31.97.207.193
pm2 status
pm2 logs
pm2 monit
```

### View Application Logs
```bash
pm2 logs backend-app  # or your app name
pm2 logs --lines 100
```

### Restart Application
```bash
pm2 restart backend-app
pm2 reload backend-app  # Zero-downtime restart
```

### Check Server Health
```bash
curl http://31.97.207.193:3000/api/v1/health
```

## 🛡️ Security Considerations

- SSH passwords are used for automation (consider SSH keys for production)
- Server credentials are hardcoded in script (consider environment variables)
- CORS is configured for the frontend domain
- Rate limiting is enabled on the API

## 🔧 Customization

### Modify Server Configuration
Edit the `SERVER_CONFIG` object in `deploy.js`:

```javascript
const SERVER_CONFIG = {
  host: 'your-server-ip',
  username: 'your-username',
  password: 'your-password',
  backendPath: '/path/to/backend',
  port: 3000
};
```

### Add Custom Deployment Steps
Extend the `deploy()` function in `deploy.js` to add custom steps:

```javascript
// Add after Step 8
logStep(9, 'Custom deployment step');
executeSSHCommand(
  'your-custom-command',
  'Description of custom step'
);
```

### Environment-Specific Deployments
Create multiple deployment scripts for different environments:

```bash
cp deploy.js deploy-staging.js
cp deploy.js deploy-production.js
```

## 📞 Support

If you encounter issues:

1. **Check SSH Connection**: Verify manual SSH access
2. **Review Logs**: Check PM2 and application logs
3. **Verify Permissions**: Ensure proper file permissions
4. **Database Issues**: Check PostgreSQL connection and migrations
5. **Port Conflicts**: Verify port 3000 is available

## 🎯 Next Steps

After successful deployment:

1. **Test API Endpoints**: Verify all routes work correctly
2. **Frontend Deployment**: Deploy frontend to your hosting platform
3. **Domain Setup**: Configure domain and SSL certificates
4. **Monitoring**: Set up application monitoring and alerts
5. **Backup**: Configure automated database backups

## 📈 Performance Tips

- Use PM2 cluster mode for better performance:
  ```bash
  pm2 start dist/main.js -i max --name "backend-app"
  ```

- Enable PM2 monitoring:
  ```bash
  pm2 install pm2-server-monit
  ```

- Set up log rotation:
  ```bash
  pm2 install pm2-logrotate
  ```

---

**Happy Deploying! 🚀**