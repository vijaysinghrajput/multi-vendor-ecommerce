# VPS Deployment Log

## Server Information
- **Domain:** node-api.skyablyitsolution.com
- **IP Address:** 31.97.207.193
- **Port:** 3001 (Direct API Access)
- **User:** developer1
- **Password:** Skyably@411

## Deployment Summary

### Backend Deployment
- **Location:** `/var/www/clients/wise-lifescience/backend`
- **PM2 Process:** `wise-lifescience-api`
- **Status:** ✅ Online and Running
- **Direct API Access:** http://31.97.207.193:3001/api/v1
- **Domain Access Issue:** NGINX double prefix problem with http://node-api.skyablyitsolution.com/wise-lifescience/api/v1

### Key Deployment Steps Performed

1. **Directory Creation**
   ```bash
   sshpass -p 'Skyably@411' ssh developer1@31.97.207.193 'sudo mkdir -p /var/www/wise-lifescience/backend'
   ```

2. **Permission Issues Resolution**
   - Initial deployment failed due to permission denied errors
   - Changed deployment path to existing directory: `/var/www/clients/wise-lifescience/backend`
   - Git repository issue: directory was not a git repository

3. **Manual Deployment Process**
   ```bash
   # Install dependencies
   sshpass -p 'Skyably@411' ssh developer1@31.97.207.193 'cd /var/www/clients/wise-lifescience/backend && npm install'
   
   # Build application
   sshpass -p 'Skyably@411' ssh developer1@31.97.207.193 'cd /var/www/clients/wise-lifescience/backend && npm run build'
   
   # Restart PM2 process
   sshpass -p 'Skyably@411' ssh developer1@31.97.207.193 'pm2 restart wise-lifescience-api'
   ```

4. **API Testing**
   ```bash
   # Health check
   curl -s http://31.97.207.193:3001/api/v1/health | jq
   
   # Version check
   curl -s http://31.97.207.193:3001/api/v1/version | jq
   ```

### Configuration Updates Made

#### Frontend Environment (.env.production)
```env
# Updated API URL
NEXT_PUBLIC_API_URL=http://node-api.skyablyitsolution.com/wise-lifescience/api/v1
NEXT_PUBLIC_WS_URL=wss://node-api.skyablyitsolution.com/wise-lifescience
```

#### Backend Service (app.service.ts)
```typescript
// Updated repository URL
repository: 'https://github.com/vijaysinghrajput/multi-vendor-ecommerce'
```

#### Deployment Scripts Updated
- `deploy.sh`: SERVER_HOST="node-api.skyablyitsolution.com"
- `deploy-backend.sh`: SERVER_HOST="node-api.skyablyitsolution.com"
- `.env.deploy.example`: DEPLOY_HOST=node-api.skyablyitsolution.com
- `deploy.config.js`: host: 'node-api.skyablyitsolution.com'
- `scripts/deploy-server.sh`: SERVER_HOST="node-api.skyablyitsolution.com"
- `scripts/sync-db.sh`: SERVER_HOST="node-api.skyablyitsolution.com"

### Current Status

#### ✅ Working
- Backend API accessible via direct IP: http://31.97.207.193:3001/api/v1
- **Domain API now working**: http://node-api.skyablyitsolution.com/wise-lifescience/api/v1
- PM2 process running successfully
- All endpoints responding correctly
- GitHub repository URL updated
- Local development environment running
- **NGINX routing fixed**: Proper proxy configuration implemented
- **CORS configuration fixed**: Vercel domain now allowed

#### ✅ NGINX Fix Applied
- **Issue**: NGINX was proxying `/wise-lifescience/api/v1/` to `http://localhost:3001/` causing double prefix
- **Solution**: Updated proxy_pass to `http://localhost:3001/api/v1/` to match backend routing
- **Result**: Domain URL now returns proper API response with updated GitHub repository

### ✅ SSL/HTTPS Certificate Setup
- **Issue**: Production frontend on Vercel requires HTTPS but server only had HTTP
- **Solution**: Installed Let's Encrypt SSL certificate using certbot
- **Command**: `certbot --nginx -d node-api.skyablyitsolution.com`
- **Result**: HTTPS now working at `https://node-api.skyablyitsolution.com/wise-lifescience/api/v1/`
- **Frontend Config**: Updated `.env.production` to use HTTPS API URL

### ✅ PWA Manifest.json Fix
- **Issue**: Missing icons causing 404 errors in production
- **Solution**: Created SVG icon and updated manifest.json
- **Files Added**: `/public/icons/icon.svg`, updated manifest.json
- **Result**: PWA manifest now loads correctly without 404 errors

### ✅ CORS Configuration Fix
- **Issue**: Production frontend on Vercel getting CORS policy errors
- **Root Cause**: Backend only allowed `localhost:3001` as CORS origin
- **Solution**: Updated CORS_ORIGIN to include Vercel domain
- **Config**: `CORS_ORIGIN=http://localhost:3001,https://multi-vendor-ecommerce-frontend-tau.vercel.app`
- **Result**: CORS headers now properly configured for production frontend

### ❌ Database Setup Issue
- **Issue**: 500 Internal Server Error on admin login endpoint due to missing database tables
- **Root Cause**: Database tables were not created during initial deployment
- **Current Status**: 
  - ✅ Application modules properly imported in `app.module.ts`
  - ✅ API server running and responding to basic endpoints
  - ❌ Database tables missing ("relation 'users' does not exist")
  - ❌ Database user lacks permission to create tables in public schema
- **Actions Taken**:
  1. Fixed missing module imports in `app.module.ts` (AdminModule, etc.)
  2. Attempted to run database migrations - failed due to permission issues
  3. Attempted to execute schema.sql - failed due to permission issues
  4. Created basic-schema.sql for essential tables - failed due to permission issues
- **Next Steps Required**:
  - Database administrator needs to grant CREATE permissions to `developer1` user on `wise_lifescience` database
  - OR provide a database user with sufficient privileges to create tables
  - Execute schema.sql or run TypeORM migrations to create all required tables
  - Create initial admin user for testing
- **Current API Status**: 
  - ✅ Basic endpoints working (e.g., `/api/v1/version`)
  - ❌ Database-dependent endpoints failing (e.g., `/api/v1/auth/admin-login`)

### API Endpoints Verified
- `GET /api/v1/` - Health check ✅
- `GET /api/v1/health` - Detailed health info ✅
- `GET /api/v1/version` - Version and repository info ✅

### PM2 Process Information
```
┌────┬─────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                    │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ wise-lifescience-api    │ default     │ 1.0.0   │ cluster │ 1903985  │ 0s     │ 16   │ online    │ 0%       │ 41.4mb   │ develop… │ disabled │
└────┴─────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### Next Steps Required
1. Fix NGINX configuration on server to resolve double prefix issue
2. Ensure domain URL routing works correctly
3. Set up proper SSL certificates for HTTPS
4. Configure proper environment variables on server

### Commands for Future Reference

#### SSH Access
```bash
ssh developer1@node-api.skyablyitsolution.com
# or
ssh developer1@31.97.207.193
```

#### PM2 Management
```bash
# Check status
pm2 status

# View logs
pm2 logs wise-lifescience-api

# Restart
pm2 restart wise-lifescience-api

# Stop
pm2 stop wise-lifescience-api
```

#### File Sync
```bash
# Copy files to server
sshpass -p 'Skyably@411' scp -o StrictHostKeyChecking=no [local-file] developer1@node-api.skyablyitsolution.com:[remote-path]

# Sync entire directory
rsync -avz --delete -e "sshpass -p 'Skyably@411' ssh -o StrictHostKeyChecking=no" [local-dir]/ developer1@node-api.skyablyitsolution.com:[remote-dir]/
```

---

**Last Updated:** $(date)
**Deployment Status:** Backend Deployed ✅ | Frontend Environment Updated ✅ | Domain Routing Fixed ✅ | Database Setup Required ❌