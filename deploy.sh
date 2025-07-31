#!/bin/bash

# Multi-Vendor E-Commerce Deployment Script
# Alternative bash script for deployment automation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Server configuration
SERVER_HOST="31.97.207.193"
SERVER_USER="developer1"
SERVER_PASS="Skyably@411"
BACKEND_PATH="/var/www/wise-lifescience/backend"
SERVER_PORT="3000"
APP_NAME="backend-app"

# Functions
log() {
    echo -e "${2:-$NC}$1${NC}"
}

log_step() {
    echo -e "\n${CYAN}🔄 Step $1: $2${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to execute SSH commands
execute_ssh() {
    local command="$1"
    local description="$2"
    
    log "Executing: $description" "$BLUE"
    
    if ! sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_HOST" "$command"; then
        log_error "Failed to execute: $description"
        exit 1
    fi
}

# Check if sshpass is installed
check_sshpass() {
    if ! command -v sshpass &> /dev/null; then
        log_warning "sshpass is not installed"
        log "Installing sshpass via Homebrew..." "$YELLOW"
        
        if command -v brew &> /dev/null; then
            brew install hudochenkov/sshpass/sshpass
            log_success "sshpass installed successfully"
        else
            log_error "Homebrew not found. Please install sshpass manually:"
            log "brew install hudochenkov/sshpass/sshpass" "$CYAN"
            exit 1
        fi
    fi
}

# Upload files using rsync
upload_files() {
    log_step 2 "Uploading backend files to server"
    
    local local_backend="./backend/"
    
    if [ ! -d "$local_backend" ]; then
        log_error "Backend directory not found: $local_backend"
        exit 1
    fi
    
    log "Uploading files..." "$BLUE"
    
    if ! rsync -avz --delete \
        --exclude='node_modules' \
        --exclude='dist' \
        --exclude='.git' \
        --exclude='logs' \
        --exclude='uploads' \
        --exclude='.env' \
        --exclude='*.log' \
        -e "sshpass -p '$SERVER_PASS' ssh -o StrictHostKeyChecking=no" \
        "$local_backend" \
        "$SERVER_USER@$SERVER_HOST:$BACKEND_PATH/"; then
        log_error "Failed to upload files"
        exit 1
    fi
    
    log_success "Files uploaded successfully"
}

# Update frontend environment
update_frontend_env() {
    log_step 7 "Updating frontend environment configuration"
    
    local frontend_dir="./frontend"
    local env_local="$frontend_dir/.env.local"
    local env_example="$frontend_dir/.env.example"
    
    if [ ! -d "$frontend_dir" ]; then
        log_warning "Frontend directory not found, skipping environment update"
        return
    fi
    
    # Create .env.local from .env.example if it doesn't exist
    if [ ! -f "$env_local" ] && [ -f "$env_example" ]; then
        cp "$env_example" "$env_local"
        log "Created .env.local from .env.example" "$BLUE"
    elif [ ! -f "$env_local" ]; then
        touch "$env_local"
        log "Created new .env.local file" "$BLUE"
    fi
    
    # Update API URLs
    local api_url="http://$SERVER_HOST:$SERVER_PORT/api/v1"
    local ws_url="ws://$SERVER_HOST:$SERVER_PORT"
    
    # Use sed to update or add environment variables
    if grep -q "NEXT_PUBLIC_API_URL=" "$env_local"; then
        sed -i.bak "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=$api_url|" "$env_local"
    else
        echo "NEXT_PUBLIC_API_URL=$api_url" >> "$env_local"
    fi
    
    if grep -q "NEXT_PUBLIC_WS_URL=" "$env_local"; then
        sed -i.bak "s|NEXT_PUBLIC_WS_URL=.*|NEXT_PUBLIC_WS_URL=$ws_url|" "$env_local"
    else
        echo "NEXT_PUBLIC_WS_URL=$ws_url" >> "$env_local"
    fi
    
    if grep -q "NEXT_PUBLIC_ENV=" "$env_local"; then
        sed -i.bak "s|NEXT_PUBLIC_ENV=.*|NEXT_PUBLIC_ENV=production|" "$env_local"
    else
        echo "NEXT_PUBLIC_ENV=production" >> "$env_local"
    fi
    
    # Remove backup files
    rm -f "$env_local.bak"
    
    log_success "Frontend .env.local updated with API URL: $api_url"
    log "WebSocket URL: $ws_url" "$CYAN"
}

# Main deployment function
deploy() {
    log "🚀 Starting deployment automation..." "$GREEN"
    log "Target server: $SERVER_HOST" "$CYAN"
    log "Backend path: $BACKEND_PATH" "$CYAN"
    
    # Check prerequisites
    check_sshpass
    
    # Step 1: Test SSH connection
    log_step 1 "Testing SSH connection"
    execute_ssh "echo 'SSH connection successful'" "Test SSH connection"
    log_success "SSH connection established"
    
    # Step 2: Upload files
    upload_files
    
    # Step 3: Pull latest changes
    log_step 3 "Pulling latest changes from repository"
    execute_ssh "cd $BACKEND_PATH && git pull origin main" "Pull latest changes"
    log_success "Latest changes pulled"
    
    # Step 4: Install dependencies
    log_step 4 "Installing dependencies"
    execute_ssh "cd $BACKEND_PATH && npm install --production" "Install npm dependencies"
    log_success "Dependencies installed"
    
    # Step 5: Build application
    log_step 5 "Building the application"
    execute_ssh "cd $BACKEND_PATH && npm run build" "Build application"
    log_success "Application built successfully"
    
    # Step 6: Run migrations
    log_step 6 "Running database migrations"
    if execute_ssh "cd $BACKEND_PATH && npm run migration:run" "Run database migrations" 2>/dev/null; then
        log_success "Database migrations completed"
    else
        log_warning "Migration failed or no migrations to run"
        log "Continuing with deployment..." "$YELLOW"
    fi
    
    # Step 7: Update frontend environment
    update_frontend_env
    
    # Step 8: Manage PM2 application
    log_step 8 "Managing PM2 application"
    
    # Check if PM2 app exists and restart or start
    if execute_ssh "pm2 list | grep -q '$APP_NAME'" "Check if PM2 app exists" 2>/dev/null; then
        execute_ssh "pm2 restart $APP_NAME" "Restart PM2 application"
        log_success "PM2 application restarted"
    else
        execute_ssh "cd $BACKEND_PATH && pm2 start dist/main.js --name '$APP_NAME' --env production" "Start new PM2 application"
        log_success "PM2 application started"
    fi
    
    # Save PM2 configuration
    if execute_ssh "pm2 save" "Save PM2 configuration" 2>/dev/null; then
        log_success "PM2 configuration saved"
    else
        log_warning "Could not save PM2 configuration"
    fi
    
    # Step 9: Verify deployment
    log_step 9 "Verifying deployment"
    
    local server_url="http://$SERVER_HOST:$SERVER_PORT"
    
    log "Waiting for server to start..." "$BLUE"
    sleep 5
    
    # Test server health
    if execute_ssh "curl -f -s -o /dev/null -w '%{http_code}' $server_url/api/v1/health | grep -q '200'" "Test server health" 2>/dev/null; then
        log_success "Server is responding correctly"
    else
        log_warning "Server health check failed, but deployment completed"
    fi
    
    # Final success message
    echo
    log "🎉 Deployment completed successfully!" "$GREEN"
    log "🌐 Server URL: $server_url" "$GREEN"
    log "📱 API URL: $server_url/api/v1" "$GREEN"
    log "📊 PM2 App: $APP_NAME" "$GREEN"
    log "📁 Frontend .env.local updated with production API URL" "$GREEN"
    
    echo
    log "📋 Next steps:" "$CYAN"
    log "1. Test your API endpoints" "$BLUE"
    log "2. Check PM2 logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs'" "$BLUE"
    log "3. Monitor application: ssh $SERVER_USER@$SERVER_HOST 'pm2 monit'" "$BLUE"
    log "4. Build and deploy frontend if needed" "$BLUE"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "🚀 Multi-Vendor E-Commerce Deployment Script"
        echo
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --dry-run      Show what would be deployed without executing"
        echo
        echo "Server Configuration:"
        echo "  Host: $SERVER_HOST"
        echo "  User: $SERVER_USER"
        echo "  Path: $BACKEND_PATH"
        echo "  Port: $SERVER_PORT"
        exit 0
        ;;
    --dry-run)
        log "🔍 Dry run mode - showing deployment plan:" "$YELLOW"
        log "1. Test SSH connection" "$BLUE"
        log "2. Upload backend files (excluding node_modules, dist, .git)" "$BLUE"
        log "3. Pull latest changes from git" "$BLUE"
        log "4. Install npm dependencies" "$BLUE"
        log "5. Build application" "$BLUE"
        log "6. Run database migrations" "$BLUE"
        log "7. Update frontend .env.local with production API URL" "$BLUE"
        log "8. Restart/start PM2 application" "$BLUE"
        log "9. Verify deployment" "$BLUE"
        exit 0
        ;;
    "")
        deploy
        ;;
    *)
        log_error "Unknown option: $1"
        log "Use --help for usage information" "$YELLOW"
        exit 1
        ;;
esac