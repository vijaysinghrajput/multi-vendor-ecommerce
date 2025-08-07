#!/bin/bash

# Multi-Vendor E-Commerce Server Deployment Script
# Deploys backend to VPS and syncs database

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f ".env.deploy" ]; then
    export $(cat .env.deploy | grep -v '^#' | xargs)
fi

# Default configuration (can be overridden by .env.deploy)
SERVER_HOST="${DEPLOY_HOST:-31.97.207.193}"
SERVER_USER="${DEPLOY_USER:-developer1}"
SERVER_PASS="${DEPLOY_PASS:-Skyably@411}"
SERVER_PORT="${DEPLOY_PORT:-22}"
BACKEND_PATH="${DEPLOY_BACKEND_PATH:-/var/www/multi-vendor-ecommerce/backend}"
APP_PORT="${DEPLOY_SERVER_PORT:-3000}"
APP_NAME="${DEPLOY_APP_NAME:-multi-vendor-api}"
GIT_BRANCH="${DEPLOY_GIT_BRANCH:-main}"
DB_NAME="${DEPLOY_DB_NAME:-multi_vendor_ecommerce}"

# Deployment options
RUN_MIGRATIONS="${DEPLOY_RUN_MIGRATIONS:-true}"
INSTALL_DEPS="${DEPLOY_INSTALL_DEPS:-true}"
BUILD_APP="${DEPLOY_BUILD_APP:-true}"
RESTART_PM2="${DEPLOY_RESTART_PM2:-true}"
SYNC_DB="${DB_SYNC_ENABLED:-true}"
BACKUP_DB="${DB_BACKUP_BEFORE_SYNC:-true}"

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
    
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "$command"
    else
        log_error "sshpass not found. Please install it or use SSH keys."
        log "Install with: brew install hudochenkov/sshpass/sshpass (macOS) or apt-get install sshpass (Ubuntu)"
        exit 1
    fi
}

# Function to upload files via SCP
upload_files() {
    local source="$1"
    local destination="$2"
    local description="$3"
    
    log "Uploading: $description" "$BLUE"
    
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$SERVER_PASS" scp -o StrictHostKeyChecking=no -P "$SERVER_PORT" -r "$source" "$SERVER_USER@$SERVER_HOST:$destination"
    else
        log_error "sshpass not found. Please install it or use SSH keys."
        exit 1
    fi
}

# Function to check if sshpass is installed
check_sshpass() {
    if ! command -v sshpass >/dev/null 2>&1; then
        log_warning "sshpass not found. Installing..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew >/dev/null 2>&1; then
                brew install hudochenkov/sshpass/sshpass
            else
                log_error "Homebrew not found. Please install sshpass manually."
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update && sudo apt-get install -y sshpass
        else
            log_error "Unsupported OS. Please install sshpass manually."
            exit 1
        fi
    fi
}

# Function to test SSH connection
test_ssh_connection() {
    log_step "1" "Testing SSH connection"
    
    if execute_ssh "echo 'SSH connection successful'" "Testing connection"; then
        log_success "SSH connection established"
    else
        log_error "Failed to establish SSH connection"
        exit 1
    fi
}

# Function to prepare server directories
prepare_server() {
    log_step "2" "Preparing server directories"
    
    execute_ssh "mkdir -p $BACKEND_PATH" "Creating backend directory"
    execute_ssh "mkdir -p $BACKEND_PATH/logs" "Creating logs directory"
    execute_ssh "mkdir -p $BACKEND_PATH/uploads" "Creating uploads directory"
    execute_ssh "mkdir -p /var/backups/databases" "Creating backup directory"
    
    log_success "Server directories prepared"
}

# Function to backup database
backup_database() {
    if [ "$BACKUP_DB" = "true" ]; then
        log_step "3" "Backing up database"
        
        local backup_file="/var/backups/databases/${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"
        
        execute_ssh "pg_dump -U postgres -d $DB_NAME > $backup_file" "Creating database backup"
        
        log_success "Database backed up to $backup_file"
    else
        log "Skipping database backup (disabled)"
    fi
}

# Function to sync database
sync_database() {
    if [ "$SYNC_DB" = "true" ]; then
        log_step "4" "Syncing database"
        
        # Upload schema and demo data files
        if [ -f "backend/schema.sql" ]; then
            upload_files "backend/schema.sql" "$BACKEND_PATH/" "Database schema"
            execute_ssh "cd $BACKEND_PATH && psql -U postgres -d $DB_NAME < schema.sql" "Running schema"
        fi
        
        if [ -f "backend/demo-data.sql" ]; then
            upload_files "backend/demo-data.sql" "$BACKEND_PATH/" "Demo data"
            execute_ssh "cd $BACKEND_PATH && psql -U postgres -d $DB_NAME < demo-data.sql" "Loading demo data"
        fi
        
        log_success "Database synchronized"
    else
        log "Skipping database sync (disabled)"
    fi
}

# Function to upload backend files
upload_backend() {
    log_step "5" "Uploading backend files"
    
    # Create temporary directory for clean upload
    local temp_dir="/tmp/backend_deploy_$(date +%s)"
    mkdir -p "$temp_dir"
    
    # Copy backend files excluding unnecessary directories
    rsync -av --exclude='node_modules' --exclude='dist' --exclude='.git' --exclude='logs' --exclude='uploads' --exclude='*.log' backend/ "$temp_dir/"
    
    # Upload to server
    upload_files "$temp_dir/*" "$BACKEND_PATH/" "Backend source code"
    
    # Clean up
    rm -rf "$temp_dir"
    
    log_success "Backend files uploaded"
}

# Function to install dependencies
install_dependencies() {
    if [ "$INSTALL_DEPS" = "true" ]; then
        log_step "6" "Installing dependencies"
        
        execute_ssh "cd $BACKEND_PATH && npm install --production" "Installing npm packages"
        
        log_success "Dependencies installed"
    else
        log "Skipping dependency installation (disabled)"
    fi
}

# Function to build application
build_application() {
    if [ "$BUILD_APP" = "true" ]; then
        log_step "7" "Building application"
        
        execute_ssh "cd $BACKEND_PATH && npm run build" "Building TypeScript"
        
        log_success "Application built"
    else
        log "Skipping application build (disabled)"
    fi
}

# Function to run migrations
run_migrations() {
    if [ "$RUN_MIGRATIONS" = "true" ]; then
        log_step "8" "Running database migrations"
        
        execute_ssh "cd $BACKEND_PATH && npm run migration:run" "Running migrations"
        
        log_success "Migrations completed"
    else
        log "Skipping migrations (disabled)"
    fi
}

# Function to setup PM2 ecosystem
setup_pm2() {
    log_step "9" "Setting up PM2 configuration"
    
    # Create PM2 ecosystem file
    cat > /tmp/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$APP_NAME',
    script: 'dist/main.js',
    cwd: '$BACKEND_PATH',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: $APP_PORT,
      MODE: 'prod'
    },
    error_file: '$BACKEND_PATH/logs/err.log',
    out_file: '$BACKEND_PATH/logs/out.log',
    log_file: '$BACKEND_PATH/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF
    
    upload_files "/tmp/ecosystem.config.js" "$BACKEND_PATH/" "PM2 ecosystem config"
    rm /tmp/ecosystem.config.js
    
    log_success "PM2 configuration created"
}

# Function to restart PM2
restart_pm2() {
    if [ "$RESTART_PM2" = "true" ]; then
        log_step "10" "Restarting PM2 application"
        
        # Stop existing application if running
        execute_ssh "cd $BACKEND_PATH && pm2 stop $APP_NAME || true" "Stopping existing app"
        execute_ssh "cd $BACKEND_PATH && pm2 delete $APP_NAME || true" "Deleting existing app"
        
        # Start application with ecosystem file
        execute_ssh "cd $BACKEND_PATH && pm2 start ecosystem.config.js" "Starting application"
        execute_ssh "pm2 save" "Saving PM2 configuration"
        execute_ssh "pm2 startup" "Setting up PM2 startup"
        
        log_success "PM2 application restarted"
    else
        log "Skipping PM2 restart (disabled)"
    fi
}

# Function to verify deployment
verify_deployment() {
    log_step "11" "Verifying deployment"
    
    # Wait a moment for the application to start
    sleep 5
    
    # Check if PM2 process is running
    if execute_ssh "pm2 list | grep $APP_NAME" "Checking PM2 status"; then
        log_success "PM2 process is running"
    else
        log_warning "PM2 process not found"
    fi
    
    # Test API endpoint
    local health_url="http://localhost:$APP_PORT/api/v1/health"
    if execute_ssh "curl -f $health_url" "Testing API health endpoint"; then
        log_success "API is responding"
    else
        log_warning "API health check failed"
    fi
    
    log_success "Deployment verification completed"
}

# Function to show deployment summary
show_summary() {
    log "\n" "$GREEN"
    log "🎉 Deployment Summary" "$GREEN"
    log "==================" "$GREEN"
    log "Server: $SERVER_HOST" "$CYAN"
    log "Backend Path: $BACKEND_PATH" "$CYAN"
    log "Application: $APP_NAME" "$CYAN"
    log "Port: $APP_PORT" "$CYAN"
    log "API URL: http://$SERVER_HOST:$APP_PORT/api/v1" "$CYAN"
    log "Health Check: http://$SERVER_HOST:$APP_PORT/api/v1/health" "$CYAN"
    log "\nUseful Commands:" "$YELLOW"
    log "- Check logs: ssh $SERVER_USER@$SERVER_HOST 'pm2 logs $APP_NAME'" "$BLUE"
    log "- Restart app: ssh $SERVER_USER@$SERVER_HOST 'pm2 restart $APP_NAME'" "$BLUE"
    log "- Check status: ssh $SERVER_USER@$SERVER_HOST 'pm2 status'" "$BLUE"
    log "\n"
}

# Main deployment function
main() {
    log "🚀 Starting Multi-Vendor E-Commerce Server Deployment" "$GREEN"
    log "======================================================" "$GREEN"
    
    # Check prerequisites
    check_sshpass
    
    # Run deployment steps
    test_ssh_connection
    prepare_server
    backup_database
    sync_database
    upload_backend
    install_dependencies
    build_application
    run_migrations
    setup_pm2
    restart_pm2
    verify_deployment
    
    # Show summary
    show_summary
    
    log_success "Deployment completed successfully! 🎉"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Multi-Vendor E-Commerce Server Deployment Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --dry-run      Show deployment plan without executing"
        echo "  --config       Show current configuration"
        echo ""
        echo "Environment Variables (can be set in .env.deploy):"
        echo "  DEPLOY_HOST              Server hostname/IP"
        echo "  DEPLOY_USER              SSH username"
        echo "  DEPLOY_PASS              SSH password"
        echo "  DEPLOY_BACKEND_PATH      Backend deployment path"
        echo "  DEPLOY_APP_NAME          PM2 application name"
        echo "  DEPLOY_SERVER_PORT       Application port"
        echo "  DB_SYNC_ENABLED          Enable database sync (true/false)"
        echo "  DB_BACKUP_BEFORE_SYNC    Backup before sync (true/false)"
        exit 0
        ;;
    --dry-run)
        log "🔍 Deployment Plan (Dry Run)" "$YELLOW"
        log "============================" "$YELLOW"
        log "1. Test SSH connection to $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
        log "2. Prepare server directories at $BACKEND_PATH"
        log "3. Backup database: $DB_NAME (if enabled)"
        log "4. Sync database schema and data (if enabled)"
        log "5. Upload backend files to $BACKEND_PATH"
        log "6. Install npm dependencies (if enabled)"
        log "7. Build TypeScript application (if enabled)"
        log "8. Run database migrations (if enabled)"
        log "9. Setup PM2 ecosystem configuration"
        log "10. Restart PM2 application: $APP_NAME (if enabled)"
        log "11. Verify deployment and API health"
        exit 0
        ;;
    --config)
        log "📋 Current Configuration" "$CYAN"
        log "========================" "$CYAN"
        log "Server Host: $SERVER_HOST"
        log "Server User: $SERVER_USER"
        log "Server Port: $SERVER_PORT"
        log "Backend Path: $BACKEND_PATH"
        log "App Name: $APP_NAME"
        log "App Port: $APP_PORT"
        log "Git Branch: $GIT_BRANCH"
        log "Database: $DB_NAME"
        log "Run Migrations: $RUN_MIGRATIONS"
        log "Install Dependencies: $INSTALL_DEPS"
        log "Build Application: $BUILD_APP"
        log "Restart PM2: $RESTART_PM2"
        log "Sync Database: $SYNC_DB"
        log "Backup Database: $BACKUP_DB"
        exit 0
        ;;
    *)
        main
        ;;
esac