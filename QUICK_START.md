# 🚀 Quick Start - Deployment Automation

Get your Multi-Vendor E-Commerce platform deployed in minutes!

## ⚡ Instant Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy Now!
```bash
npm run deploy
```

That's it! Your application will be automatically deployed to the server.

## 🎯 What Happens During Deployment

✅ **SSH Connection** - Connects to your VPS server  
✅ **File Upload** - Syncs your backend code  
✅ **Git Pull** - Gets latest changes from repository  
✅ **Dependencies** - Installs npm packages  
✅ **Build** - Compiles TypeScript to JavaScript  
✅ **Migrations** - Updates database schema  
✅ **Frontend Config** - Updates API URLs automatically  
✅ **PM2 Restart** - Restarts your application  
✅ **Health Check** - Verifies deployment success  

## 🔧 Server Details (Pre-configured)

- **Host:** `31.97.207.193`
- **User:** `developer1`
- **Password:** `Skyably@411`
- **Backend Path:** `/var/www/wise-lifescience/backend`
- **API Port:** `3000`

## 📋 Available Commands

```bash
# Deploy to production
npm run deploy

# Preview what will be deployed (dry run)
npm run deploy:dry-run

# Show help and options
npm run deploy:help

# View current configuration
npm run deploy:config

# Setup all dependencies
npm run setup
```

## 🛠️ Alternative Methods

### Using Shell Script
```bash
# Make executable (first time only)
chmod +x deploy.sh

# Deploy
./deploy.sh

# Dry run
./deploy.sh --dry-run
```

### Direct Node.js
```bash
node deploy.js
node deploy.js --dry-run
node deploy.js --help
```

## 🎛️ Customization (Optional)

### Environment Variables
Create `.env.deploy` file to override defaults:

```bash
cp .env.deploy.example .env.deploy
# Edit .env.deploy with your settings
```

### Configuration File
Modify `deploy.config.js` for advanced settings:

```javascript
// Example: Change server details
server: {
  host: 'your-server-ip',
  username: 'your-username',
  password: 'your-password'
}
```

## 🔍 Monitoring

### Check Application Status
```bash
ssh developer1@31.97.207.193
pm2 status
pm2 logs
```

### Test API
```bash
curl http://31.97.207.193:3000/api/v1/health
```

## 🆘 Troubleshooting

### Common Issues

**SSH Connection Failed**
```bash
# Test manual connection
ssh developer1@31.97.207.193
```

**sshpass Not Found**
```bash
# Install on macOS
brew install hudochenkov/sshpass/sshpass
```

**PM2 App Not Starting**
```bash
ssh developer1@31.97.207.193
cd /var/www/wise-lifescience/backend
pm2 logs
npm run start:prod  # Test manual start
```

**Build Errors**
```bash
# Check build locally first
cd backend
npm run build
```

### Get Help

1. **Check Logs:** `npm run deploy` shows detailed output
2. **Dry Run:** `npm run deploy:dry-run` to see what will happen
3. **Configuration:** `npm run deploy:config` to view settings
4. **Manual Steps:** Follow individual steps in `DEPLOYMENT.md`

## 🎉 Success!

After successful deployment:

- **API:** http://31.97.207.193:3000/api/v1
- **Health:** http://31.97.207.193:3000/api/v1/health
- **Frontend:** Your `.env.local` is automatically updated

## 📚 Next Steps

1. **Deploy Frontend:** Use your preferred hosting (Vercel, Netlify, etc.)
2. **Domain Setup:** Configure your domain and SSL
3. **Monitoring:** Set up application monitoring
4. **Backups:** Configure database backups

---

**Need more details?** Check `DEPLOYMENT.md` for comprehensive documentation.

**Happy Deploying! 🚀**