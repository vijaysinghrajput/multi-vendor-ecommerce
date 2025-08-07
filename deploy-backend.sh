#!/bin/bash

# Backend Deployment Script for VPS
# Usage: ./deploy-backend.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_HOST="node-api.skyablyitsolution.com"
SERVER_USER="root"
PROJECT_PATH="/var/www/multi-vendor-ecommerce"
BACKEND_PATH="$PROJECT_PATH/backend"

echo -e "${BLUE}🚀 Starting Backend Deployment...${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    print_warning "SSH key not found. You'll need to enter password."
fi

# 1. Build the backend locally
print_status "Building backend application..."
cd backend
npm install
npm run build
print_status "Backend built successfully"

# 2. Create deployment package
print_status "Creating deployment package..."
cd ..
tar -czf backend-deploy.tar.gz backend/dist backend/package.json backend/package-lock.json backend/.env

# 3. Upload to server
print_status "Uploading to server..."
scp backend-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# 4. Deploy on server
print_status "Deploying on server..."
ssh $SERVER_USER@$SERVER_HOST << 'EOF'
    set -e
    
    # Create project directory if it doesn't exist
    sudo mkdir -p /var/www/multi-vendor-ecommerce
    sudo chown -R $USER:$USER /var/www/multi-vendor-ecommerce
    
    # Extract deployment package
    cd /var/www/multi-vendor-ecommerce
    tar -xzf /tmp/backend-deploy.tar.gz
    
    # Install dependencies
    cd backend
    npm install --production
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
API_PREFIX=wise-lifescience/api/v1
CORS_ORIGIN=https://multi-vendor-ecommerce-frontend-tau.vercel.app,https://wise-lifescience.vercel.app,https://*.vercel.app
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=multi_vendor_ecommerce
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d
ENVEOF
        echo "Environment file created. Please update with your actual values."
    fi
    
    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'PM2EOF'
module.exports = {
  apps: [{
    name: 'multi-vendor-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
PM2EOF
    
    # Create logs directory
    mkdir -p logs
    
    # Start/restart the application
    pm2 delete multi-vendor-backend 2>/dev/null || true
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
    
    # Check if the application is running
    sleep 5
    if pm2 list | grep -q "multi-vendor-backend.*online"; then
        echo "✅ Backend deployed successfully!"
        echo "🌐 API URL: https://node-api.skyablyitsolution.com/wise-lifescience/api/v1"
        echo "📊 PM2 Status:"
        pm2 list
    else
        echo "❌ Backend deployment failed!"
        pm2 logs multi-vendor-backend --lines 10
        exit 1
    fi
EOF

# 5. Clean up
print_status "Cleaning up..."
rm backend-deploy.tar.gz

print_status "Deployment completed!"
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update the .env file on the server with your actual database credentials"
echo "2. Configure your domain DNS to point to the server"
echo "3. Set up SSL certificate for HTTPS"
echo "4. Test the API endpoint: https://node-api.skyablyitsolution.com/wise-lifescience/api/v1/health"
