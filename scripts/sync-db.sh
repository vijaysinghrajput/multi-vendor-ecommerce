#!/bin/bash

# Database Synchronization Script
# Syncs local database to production server

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

# Load local environment
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Local database configuration
LOCAL_DB_HOST="${DB_HOST:-localhost}"
LOCAL_DB_PORT="${DB_PORT:-5432}"
LOCAL_DB_USER="${DB_USERNAME:-postgres}"
LOCAL_DB_PASS="${DB_PASSWORD:-postgres}"
LOCAL_DB_NAME="${DB_NAME:-multi_vendor_ecommerce}"

# Production database configuration
PROD_DB_HOST="${PROD_DB_HOST:-localhost}"
PROD_DB_PORT="${PROD_DB_PORT:-5432}"
PROD_DB_USER="${PROD_DB_USERNAME:-postgres}"
PROD_DB_PASS="${PROD_DB_PASSWORD:-postgres}"
PROD_DB_NAME="${PROD_DB_NAME:-multi_vendor_ecommerce_prod}"

# Server configuration
SERVER_HOST="${DEPLOY_HOST:-31.97.207.193}"
SERVER_USER="${DEPLOY_USER:-developer1}"
SERVER_PASS="${DEPLOY_PASS:-Skyably@411}"
SERVER_PORT="${DEPLOY_PORT:-22}"

# Sync options
BACKUP_BEFORE_SYNC="${DB_BACKUP_BEFORE_SYNC:-true}"
CREATE_BACKUP_LOCAL="${DB_CREATE_LOCAL_BACKUP:-true}"
SYNC_MODE="${DB_SYNC_MODE:-full}"  # full, schema-only, data-only
COMPRESS_BACKUP="${DB_COMPRESS_BACKUP:-true}"

# Paths
BACKUP_DIR="./backups/database"
TEMP_DIR="/tmp/db_sync_$(date +%s)"

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
    
    log "Executing on server: $description" "$BLUE"
    
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no -p "$SERVER_PORT" "$SERVER_USER@$SERVER_HOST" "$command"
    else
        log_error "sshpass not found. Please install it or use SSH keys."
        exit 1
    fi
}

# Function to upload files via SCP
upload_file() {
    local source="$1"
    local destination="$2"
    local description="$3"
    
    log "Uploading: $description" "$BLUE"
    
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -p "$SERVER_PASS" scp -o StrictHostKeyChecking=no -P "$SERVER_PORT" "$source" "$SERVER_USER@$SERVER_HOST:$destination"
    else
        log_error "sshpass not found. Please install it or use SSH keys."
        exit 1
    fi
}

# Function to test database connections
test_connections() {
    log_step "1" "Testing database connections"
    
    # Test local database
    log "Testing local database connection..." "$BLUE"
    if PGPASSWORD="$LOCAL_DB_PASS" psql -h "$LOCAL_DB_HOST" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
        log_success "Local database connection successful"
    else
        log_error "Failed to connect to local database"
        exit 1
    fi
    
    # Test production database (via SSH)
    log "Testing production database connection..." "$BLUE"
    if execute_ssh "PGPASSWORD='$PROD_DB_PASS' psql -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME' -c 'SELECT 1;'" "Testing prod DB"; then
        log_success "Production database connection successful"
    else
        log_error "Failed to connect to production database"
        exit 1
    fi
}

# Function to create backup directories
setup_directories() {
    log_step "2" "Setting up directories"
    
    # Create local backup directory
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$TEMP_DIR"
    
    # Create remote backup directory
    execute_ssh "mkdir -p /var/backups/databases" "Creating remote backup directory"
    
    log_success "Directories created"
}

# Function to backup production database
backup_production() {
    if [ "$BACKUP_BEFORE_SYNC" = "true" ]; then
        log_step "3" "Backing up production database"
        
        local backup_file="/var/backups/databases/${PROD_DB_NAME}_backup_$(date +%Y%m%d_%H%M%S).sql"
        
        if [ "$COMPRESS_BACKUP" = "true" ]; then
            backup_file="${backup_file}.gz"
            execute_ssh "PGPASSWORD='$PROD_DB_PASS' pg_dump -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME' | gzip > '$backup_file'" "Creating compressed backup"
        else
            execute_ssh "PGPASSWORD='$PROD_DB_PASS' pg_dump -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME' > '$backup_file'" "Creating backup"
        fi
        
        log_success "Production database backed up to $backup_file"
    else
        log "Skipping production backup (disabled)"
    fi
}

# Function to create local database dump
create_local_dump() {
    log_step "4" "Creating local database dump"
    
    local dump_file="$TEMP_DIR/local_dump.sql"
    
    case "$SYNC_MODE" in
        "schema-only")
            log "Creating schema-only dump..." "$BLUE"
            PGPASSWORD="$LOCAL_DB_PASS" pg_dump -h "$LOCAL_DB_HOST" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" --schema-only > "$dump_file"
            ;;
        "data-only")
            log "Creating data-only dump..." "$BLUE"
            PGPASSWORD="$LOCAL_DB_PASS" pg_dump -h "$LOCAL_DB_HOST" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" --data-only > "$dump_file"
            ;;
        "full"|*)
            log "Creating full database dump..." "$BLUE"
            PGPASSWORD="$LOCAL_DB_PASS" pg_dump -h "$LOCAL_DB_HOST" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" > "$dump_file"
            ;;
    esac
    
    # Compress if enabled
    if [ "$COMPRESS_BACKUP" = "true" ]; then
        gzip "$dump_file"
        dump_file="${dump_file}.gz"
    fi
    
    # Create local backup copy if enabled
    if [ "$CREATE_BACKUP_LOCAL" = "true" ]; then
        local local_backup="$BACKUP_DIR/local_${LOCAL_DB_NAME}_$(date +%Y%m%d_%H%M%S).sql"
        if [ "$COMPRESS_BACKUP" = "true" ]; then
            local_backup="${local_backup}.gz"
        fi
        cp "$dump_file" "$local_backup"
        log_success "Local backup created: $local_backup"
    fi
    
    log_success "Local database dump created: $dump_file"
    echo "$dump_file"
}

# Function to upload and restore dump
upload_and_restore() {
    local dump_file="$1"
    
    log_step "5" "Uploading and restoring database"
    
    # Upload dump file
    local remote_dump="/tmp/$(basename $dump_file)"
    upload_file "$dump_file" "$remote_dump" "Database dump"
    
    # Prepare restore command based on compression
    local restore_cmd
    if [[ "$dump_file" == *.gz ]]; then
        restore_cmd="gunzip -c '$remote_dump' | PGPASSWORD='$PROD_DB_PASS' psql -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME'"
    else
        restore_cmd="PGPASSWORD='$PROD_DB_PASS' psql -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME' < '$remote_dump'"
    fi
    
    # Handle different sync modes
    case "$SYNC_MODE" in
        "schema-only")
            log "Restoring schema only..." "$BLUE"
            execute_ssh "$restore_cmd" "Restoring schema"
            ;;
        "data-only")
            log "Truncating tables and restoring data..." "$BLUE"
            # Note: This is dangerous - truncates all tables
            log_warning "This will truncate all tables in the production database!"
            read -p "Are you sure you want to continue? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                execute_ssh "$restore_cmd" "Restoring data"
            else
                log "Data restore cancelled by user"
                exit 1
            fi
            ;;
        "full"|*)
            log "Dropping and recreating database..." "$BLUE"
            log_warning "This will completely replace the production database!"
            read -p "Are you sure you want to continue? (yes/no): " confirm
            if [ "$confirm" = "yes" ]; then
                # Drop and recreate database
                execute_ssh "PGPASSWORD='$PROD_DB_PASS' dropdb -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' '$PROD_DB_NAME' --if-exists" "Dropping database"
                execute_ssh "PGPASSWORD='$PROD_DB_PASS' createdb -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' '$PROD_DB_NAME'" "Creating database"
                execute_ssh "$restore_cmd" "Restoring database"
            else
                log "Database restore cancelled by user"
                exit 1
            fi
            ;;
    esac
    
    # Clean up remote dump file
    execute_ssh "rm -f '$remote_dump'" "Cleaning up remote dump"
    
    log_success "Database restore completed"
}

# Function to verify sync
verify_sync() {
    log_step "6" "Verifying database sync"
    
    # Get table counts from both databases
    log "Comparing table counts..." "$BLUE"
    
    local local_tables=$(PGPASSWORD="$LOCAL_DB_PASS" psql -h "$LOCAL_DB_HOST" -p "$LOCAL_DB_PORT" -U "$LOCAL_DB_USER" -d "$LOCAL_DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    
    local prod_tables=$(execute_ssh "PGPASSWORD='$PROD_DB_PASS' psql -h '$PROD_DB_HOST' -p '$PROD_DB_PORT' -U '$PROD_DB_USER' -d '$PROD_DB_NAME' -t -c \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';\"" "Getting prod table count" | tr -d ' ')
    
    log "Local tables: $local_tables" "$CYAN"
    log "Production tables: $prod_tables" "$CYAN"
    
    if [ "$local_tables" = "$prod_tables" ]; then
        log_success "Table counts match"
    else
        log_warning "Table counts don't match - this might be expected depending on sync mode"
    fi
    
    log_success "Verification completed"
}

# Function to cleanup
cleanup() {
    log_step "7" "Cleaning up temporary files"
    
    rm -rf "$TEMP_DIR"
    
    log_success "Cleanup completed"
}

# Function to show sync summary
show_summary() {
    log "\n" "$GREEN"
    log "🎉 Database Sync Summary" "$GREEN"
    log "=======================" "$GREEN"
    log "Source: $LOCAL_DB_USER@$LOCAL_DB_HOST:$LOCAL_DB_PORT/$LOCAL_DB_NAME" "$CYAN"
    log "Target: $PROD_DB_USER@$PROD_DB_HOST:$PROD_DB_PORT/$PROD_DB_NAME" "$CYAN"
    log "Sync Mode: $SYNC_MODE" "$CYAN"
    log "Backup Created: $BACKUP_BEFORE_SYNC" "$CYAN"
    log "Compressed: $COMPRESS_BACKUP" "$CYAN"
    log "\n"
}

# Main sync function
main() {
    log "🔄 Starting Database Synchronization" "$GREEN"
    log "===================================" "$GREEN"
    
    # Check prerequisites
    if ! command -v psql >/dev/null 2>&1; then
        log_error "PostgreSQL client (psql) not found. Please install it."
        exit 1
    fi
    
    if ! command -v sshpass >/dev/null 2>&1; then
        log_error "sshpass not found. Please install it."
        exit 1
    fi
    
    # Run sync steps
    test_connections
    setup_directories
    backup_production
    local dump_file=$(create_local_dump)
    upload_and_restore "$dump_file"
    verify_sync
    cleanup
    
    # Show summary
    show_summary
    
    log_success "Database synchronization completed successfully! 🎉"
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Database Synchronization Script"
        echo ""
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h         Show this help message"
        echo "  --dry-run          Show sync plan without executing"
        echo "  --config           Show current configuration"
        echo "  --schema-only      Sync schema only"
        echo "  --data-only        Sync data only"
        echo "  --full             Full database sync (default)"
        echo ""
        echo "Environment Variables:"
        echo "  Local Database:"
        echo "    DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME"
        echo "  Production Database:"
        echo "    PROD_DB_HOST, PROD_DB_PORT, PROD_DB_USERNAME, PROD_DB_PASSWORD, PROD_DB_NAME"
        echo "  Server:"
        echo "    DEPLOY_HOST, DEPLOY_USER, DEPLOY_PASS, DEPLOY_PORT"
        echo "  Options:"
        echo "    DB_BACKUP_BEFORE_SYNC, DB_CREATE_LOCAL_BACKUP, DB_COMPRESS_BACKUP"
        exit 0
        ;;
    --dry-run)
        log "🔍 Database Sync Plan (Dry Run)" "$YELLOW"
        log "===============================" "$YELLOW"
        log "1. Test local database connection: $LOCAL_DB_USER@$LOCAL_DB_HOST:$LOCAL_DB_PORT/$LOCAL_DB_NAME"
        log "2. Test production database connection: $PROD_DB_USER@$PROD_DB_HOST:$PROD_DB_PORT/$PROD_DB_NAME"
        log "3. Setup backup directories"
        log "4. Backup production database (if enabled): $BACKUP_BEFORE_SYNC"
        log "5. Create local database dump (mode: $SYNC_MODE)"
        log "6. Upload dump to server and restore"
        log "7. Verify synchronization"
        log "8. Cleanup temporary files"
        exit 0
        ;;
    --config)
        log "📋 Current Configuration" "$CYAN"
        log "========================" "$CYAN"
        log "Local Database:"
        log "  Host: $LOCAL_DB_HOST:$LOCAL_DB_PORT"
        log "  User: $LOCAL_DB_USER"
        log "  Database: $LOCAL_DB_NAME"
        log "Production Database:"
        log "  Host: $PROD_DB_HOST:$PROD_DB_PORT"
        log "  User: $PROD_DB_USER"
        log "  Database: $PROD_DB_NAME"
        log "Server:"
        log "  Host: $SERVER_HOST:$SERVER_PORT"
        log "  User: $SERVER_USER"
        log "Options:"
        log "  Sync Mode: $SYNC_MODE"
        log "  Backup Before Sync: $BACKUP_BEFORE_SYNC"
        log "  Create Local Backup: $CREATE_BACKUP_LOCAL"
        log "  Compress Backup: $COMPRESS_BACKUP"
        exit 0
        ;;
    --schema-only)
        SYNC_MODE="schema-only"
        main
        ;;
    --data-only)
        SYNC_MODE="data-only"
        main
        ;;
    --full)
        SYNC_MODE="full"
        main
        ;;
    *)
        main
        ;;
esac