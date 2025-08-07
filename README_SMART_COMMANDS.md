# 🤖 Smart Command System for Multi-Vendor E-commerce Platform

This document explains how to use the intelligent command-based workflow for your multi-vendor e-commerce platform. The system automatically switches between **Local Development Mode** and **Production Deployment Mode** based on natural language commands.

## 🎯 Overview

Your platform now supports smart commands that you can type or speak:
- **"start development"** or **"start local server"** → Activates local development mode
- **"deploy on server"** → Deploys to production (VPS + Vercel)

## 🔧 Tech Stack

- **Backend**: Node.js + NestJS (runs on VPS with PM2)
- **Frontend**: Next.js + React (hosted on Vercel)
- **Database**: PostgreSQL (local + production)
- **Infrastructure**: VPS + GitHub + Vercel + Nginx
- **Automation**: Shell scripts + GitHub Actions

---

## 🟢 Command 1: Start Development

### Trigger Commands:
```bash
npm run start:dev
npm run start:development
npm run start:local
```

### What Happens:
1. ✅ Loads `.env.local` configuration
2. 🗄️ Connects to local PostgreSQL database
3. 🔧 Starts backend server at `http://localhost:3000`
4. 🎨 Starts frontend server at `http://localhost:3001`
5. 🔄 Enables hot reloading for both servers
6. 📱 Shows quick access links

### Expected Output:
```
🎉 Development Environment Ready!
==================================

📱 Frontend: http://localhost:3001
🔌 Backend API: http://localhost:3000/api/v1
🗄️ Database: localhost:5432/multi_vendor_ecommerce_dev
🔄 Hot Reloading: Enabled

📝 What happened:
• Loaded .env.local for local development configuration
• Connected to your local PostgreSQL database
• Started backend server with hot reloading enabled
• Started frontend server with Next.js dev mode
• Both servers are now running and ready for development

🚀 Quick Links:
• Admin Login: http://localhost:3001/login/admin
• User Login: http://localhost:3001/login/user
• Vendor Login: http://localhost:3001/login/vendor
• API Health: http://localhost:3000/health
```

### Explanation:
> "We used the `.env.local` file to connect to your local PostgreSQL and spun up the dev servers using `npm run dev`. You can now develop safely with hot reloading enabled."

---

## 🚀 Command 2: Deploy to Production

### Trigger Commands:
```bash
npm run deploy:server
npm run deploy:production
npm run deploy:prod
```

### What Happens:
1. ✅ Loads `.env.production` configuration
2. 🔐 SSH into your VPS server
3. 📥 Pulls latest code from GitHub (main branch)
4. 🗄️ Syncs local database to production (schema + data)
5. 🔄 Restarts backend API with PM2
6. 📤 Pushes frontend to GitHub → triggers Vercel auto-deploy
7. 🌐 Verifies deployment status

### Expected Output:
```
🚀 Production Deployment Complete!
==================================

✅ Backend API: https://api.yourdomain.com
✅ Frontend: https://yourdomain.com
✅ Database: Synced successfully
✅ PM2: Backend restarted
✅ Vercel: Auto-deployment triggered

📝 What happened:
• Loaded .env.production for production configuration
• SSH connected to your VPS server
• Pulled latest code from GitHub main branch
• Synced your local database to production
• Restarted backend service with PM2
• Pushed frontend changes to trigger Vercel deployment
```

### Explanation:
> "You're now running the production build. Your backend is live via PM2 on the server, and Vercel is handling the frontend build automatically."

---

## 🛠️ Additional Commands

### Database Synchronization
```bash
npm run sync:db
```
Syncs your local database to production server.

### Cleanup Unused Files
```bash
npm run cleanup
```
Removes node_modules, build artifacts, cache files, and analyzes unused dependencies.

### Health Check
```bash
npm run health:check
```
Tests if your production API is responding.

---

## 📂 File Structure

```
📁 multi-vendor-ecommerce/
├── 📄 .env.local              # Local development config
├── 📄 .env.production         # Production config
├── 📄 .env.deploy.example     # Deployment config template
├── 📁 scripts/
│   ├── 📄 start-dev.sh        # Local development script
│   ├── 📄 deploy-server.sh    # Production deployment script
│   ├── 📄 sync-db.sh          # Database sync script
│   └── 📄 remove-unused-files.sh # Cleanup script
├── 📁 .github/workflows/
│   └── 📄 deploy-frontend.yml # Vercel auto-deployment
├── 📁 config/
│   ├── 📄 env.js              # Environment management
│   └── 📄 db.config.js        # Database configuration
├── 📁 backend/                # NestJS backend
├── 📁 frontend/               # Next.js frontend
└── 📄 package.json            # Smart command scripts
```

---

## ⚙️ Environment Configuration

### Local Development (`.env.local`)
```env
NODE_ENV=development
MODE=local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=multi_vendor_ecommerce_dev
BACKEND_PORT=3000
FRONTEND_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Production (`.env.production`)
```env
NODE_ENV=production
MODE=prod
DB_HOST=your-production-db-host.com
DB_NAME=multi_vendor_ecommerce_prod
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🔄 Automatic Mode Switching

The system automatically detects and switches modes based on:

1. **Environment Variables**: `NODE_ENV` and `MODE`
2. **Configuration Files**: `.env.local` vs `.env.production`
3. **Command Context**: Development vs deployment scripts

### Mode Detection Logic (`config/env.js`):
```javascript
const getMode = () => {
  if (process.env.MODE) return process.env.MODE;
  if (process.env.NODE_ENV === 'production') return 'prod';
  if (process.env.NODE_ENV === 'development') return 'local';
  return 'local'; // default
};
```

---

## 🚦 Quick Start Guide

### 1. First Time Setup
```bash
# Install dependencies
npm run setup

# Configure deployment (optional)
npm run setup:deploy
```

### 2. Start Development
```bash
npm run start:dev
```

### 3. Deploy to Production
```bash
npm run deploy:server
```

### 4. Access Your Application
- **Local**: http://localhost:3001
- **Production**: https://yourdomain.com

---

## 🔧 Troubleshooting

### Port Already in Use
The system automatically detects and kills existing processes on required ports.

### Database Connection Issues
1. Check your `.env.local` or `.env.production` file
2. Ensure PostgreSQL is running
3. Verify database credentials

### Deployment Failures
1. Check SSH connection to VPS
2. Verify GitHub repository access
3. Ensure Vercel is properly configured

### View Logs
```bash
# Backend logs (development)
tail -f backend/logs/app.log

# Production logs (PM2)
pm2 logs backend
```

---

## 🎯 Advanced Features

### GitHub Actions Integration
Automatic frontend deployment to Vercel on push to main branch.

### Database Backup & Sync
Automatic backup before production deployment with rollback capability.

### Health Monitoring
Built-in health checks for both development and production environments.

### Multi-Environment Support
Easy switching between local, staging, and production environments.

---

## 📞 Support

If you encounter any issues:

1. Check the terminal output for detailed error messages
2. Review the relevant `.env` file configuration
3. Ensure all required services are running
4. Check the logs for more information

---

## 🎉 Success!

Your multi-vendor e-commerce platform now has intelligent automation that:
- ✅ Simplifies development workflow
- ✅ Automates production deployment
- ✅ Manages environment switching
- ✅ Provides clear feedback and explanations
- ✅ Handles errors gracefully

Just say **"start development"** or **"deploy on server"** and let the automation handle the rest! 🚀