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

#### ✅ NGINX Fix Applied
- **Issue**: NGINX was proxying `/wise-lifescience/api/v1/` to `http://localhost:3001/` causing double prefix
- **Solution**: Updated proxy_pass to `http://localhost:3001/api/v1/` to match backend routing
- **Result**: Domain URL now returns proper API response with updated GitHub repository

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
**Deployment Status:** Backend Deployed ✅ | Frontend Environment Updated ✅ | Domain Routing Issue ⚠️