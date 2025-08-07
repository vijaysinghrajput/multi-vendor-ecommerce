#!/bin/bash

# Remove Unused Files Script
# Cleans unused dependencies, temporary files, and dead code

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
MOBILE_DIR="$PROJECT_ROOT/mobile-app"
DRY_RUN=false
VERBOSE=false

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

log_info() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}ℹ️  $1${NC}"
    fi
}

# Function to safely remove files/directories
safe_remove() {
    local target="$1"
    local description="$2"
    
    if [ -e "$target" ]; then
        if [ "$DRY_RUN" = true ]; then
            log "[DRY RUN] Would remove: $target" "$YELLOW"
        else
            log_info "Removing: $target"
            rm -rf "$target"
            log_success "Removed: $description"
        fi
    else
        log_info "Not found: $target"
    fi
}

# Function to get directory size
get_size() {
    local dir="$1"
    if [ -d "$dir" ]; then
        du -sh "$dir" 2>/dev/null | cut -f1 || echo "0B"
    else
        echo "0B"
    fi
}

# Function to clean node_modules
clean_node_modules() {
    log_step "1" "Cleaning node_modules directories"
    
    local total_size=0
    
    # Find all node_modules directories
    local node_modules_dirs=()
    while IFS= read -r -d '' dir; do
        node_modules_dirs+=("$dir")
    done < <(find "$PROJECT_ROOT" -name "node_modules" -type d -print0 2>/dev/null)
    
    if [ ${#node_modules_dirs[@]} -eq 0 ]; then
        log "No node_modules directories found"
        return
    fi
    
    for dir in "${node_modules_dirs[@]}"; do
        local size=$(get_size "$dir")
        log "Found node_modules: $dir ($size)" "$BLUE"
        safe_remove "$dir" "node_modules ($size)"
    done
    
    log_success "Node modules cleanup completed"
}

# Function to clean build artifacts
clean_build_artifacts() {
    log_step "2" "Cleaning build artifacts"
    
    # Backend build artifacts
    if [ -d "$BACKEND_DIR" ]; then
        safe_remove "$BACKEND_DIR/dist" "Backend dist directory"
        safe_remove "$BACKEND_DIR/build" "Backend build directory"
        safe_remove "$BACKEND_DIR/.tsbuildinfo" "TypeScript build info"
    fi
    
    # Frontend build artifacts
    if [ -d "$FRONTEND_DIR" ]; then
        safe_remove "$FRONTEND_DIR/.next" "Next.js build directory"
        safe_remove "$FRONTEND_DIR/out" "Next.js export directory"
        safe_remove "$FRONTEND_DIR/build" "Frontend build directory"
        safe_remove "$FRONTEND_DIR/.vercel" "Vercel build cache"
    fi
    
    # Mobile app build artifacts
    if [ -d "$MOBILE_DIR" ]; then
        safe_remove "$MOBILE_DIR/android/app/build" "Android build directory"
        safe_remove "$MOBILE_DIR/ios/build" "iOS build directory"
        safe_remove "$MOBILE_DIR/.expo" "Expo build cache"
    fi
    
    log_success "Build artifacts cleanup completed"
}

# Function to clean cache directories
clean_cache() {
    log_step "3" "Cleaning cache directories"
    
    # NPM cache
    safe_remove "$HOME/.npm/_cacache" "NPM cache"
    
    # Yarn cache
    safe_remove "$HOME/.yarn/cache" "Yarn cache"
    
    # Project-specific caches
    safe_remove "$PROJECT_ROOT/.cache" "Project cache"
    safe_remove "$BACKEND_DIR/.cache" "Backend cache"
    safe_remove "$FRONTEND_DIR/.cache" "Frontend cache"
    
    # ESLint cache
    safe_remove "$BACKEND_DIR/.eslintcache" "Backend ESLint cache"
    safe_remove "$FRONTEND_DIR/.eslintcache" "Frontend ESLint cache"
    
    # Jest cache
    safe_remove "$BACKEND_DIR/.jest" "Backend Jest cache"
    safe_remove "$FRONTEND_DIR/.jest" "Frontend Jest cache"
    
    # TypeScript cache
    safe_remove "$BACKEND_DIR/.tscache" "Backend TypeScript cache"
    safe_remove "$FRONTEND_DIR/.tscache" "Frontend TypeScript cache"
    
    log_success "Cache cleanup completed"
}

# Function to clean log files
clean_logs() {
    log_step "4" "Cleaning log files"
    
    # Find and remove log files
    local log_patterns=("*.log" "*.log.*" "logs/*.log" "logs/*.log.*")
    
    for pattern in "${log_patterns[@]}"; do
        while IFS= read -r -d '' file; do
            safe_remove "$file" "Log file: $(basename "$file")"
        done < <(find "$PROJECT_ROOT" -name "$pattern" -type f -print0 2>/dev/null)
    done
    
    # Clean log directories
    safe_remove "$BACKEND_DIR/logs" "Backend logs directory"
    safe_remove "$FRONTEND_DIR/logs" "Frontend logs directory"
    safe_remove "$PROJECT_ROOT/logs" "Project logs directory"
    
    log_success "Log files cleanup completed"
}

# Function to clean temporary files
clean_temp_files() {
    log_step "5" "Cleaning temporary files"
    
    # Temporary file patterns
    local temp_patterns=("*.tmp" "*.temp" "*~" ".DS_Store" "Thumbs.db" "*.swp" "*.swo")
    
    for pattern in "${temp_patterns[@]}"; do
        while IFS= read -r -d '' file; do
            safe_remove "$file" "Temporary file: $(basename "$file")"
        done < <(find "$PROJECT_ROOT" -name "$pattern" -type f -print0 2>/dev/null)
    done
    
    # Clean temp directories
    safe_remove "/tmp/backend_deploy_*" "Deployment temp directories"
    safe_remove "/tmp/db_sync_*" "Database sync temp directories"
    
    log_success "Temporary files cleanup completed"
}

# Function to clean test artifacts
clean_test_artifacts() {
    log_step "6" "Cleaning test artifacts"
    
    # Test coverage
    safe_remove "$BACKEND_DIR/coverage" "Backend test coverage"
    safe_remove "$FRONTEND_DIR/coverage" "Frontend test coverage"
    
    # Test results
    safe_remove "$BACKEND_DIR/test-results" "Backend test results"
    safe_remove "$FRONTEND_DIR/test-results" "Frontend test results"
    
    # NYC output
    safe_remove "$BACKEND_DIR/.nyc_output" "Backend NYC output"
    safe_remove "$FRONTEND_DIR/.nyc_output" "Frontend NYC output"
    
    # Jest snapshots (optional - be careful)
    # safe_remove "$BACKEND_DIR/**/__snapshots__" "Backend Jest snapshots"
    # safe_remove "$FRONTEND_DIR/**/__snapshots__" "Frontend Jest snapshots"
    
    log_success "Test artifacts cleanup completed"
}

# Function to clean development files
clean_dev_files() {
    log_step "7" "Cleaning development files"
    
    # Editor files
    safe_remove "$PROJECT_ROOT/.vscode/settings.json" "VSCode settings (keeping workspace)"
    safe_remove "$PROJECT_ROOT/.idea" "IntelliJ IDEA files"
    
    # OS files
    while IFS= read -r -d '' file; do
        safe_remove "$file" "macOS .DS_Store file"
    done < <(find "$PROJECT_ROOT" -name ".DS_Store" -type f -print0 2>/dev/null)
    
    # Windows files
    while IFS= read -r -d '' file; do
        safe_remove "$file" "Windows Thumbs.db file"
    done < <(find "$PROJECT_ROOT" -name "Thumbs.db" -type f -print0 2>/dev/null)
    
    log_success "Development files cleanup completed"
}

# Function to clean unused dependencies
clean_unused_deps() {
    log_step "8" "Analyzing unused dependencies"
    
    # Check if depcheck is installed
    if ! command -v depcheck >/dev/null 2>&1; then
        log_warning "depcheck not found. Install with: npm install -g depcheck"
        log "Skipping unused dependency analysis"
        return
    fi
    
    # Analyze backend dependencies
    if [ -d "$BACKEND_DIR" ] && [ -f "$BACKEND_DIR/package.json" ]; then
        log "Analyzing backend dependencies..." "$BLUE"
        cd "$BACKEND_DIR"
        if [ "$DRY_RUN" = true ]; then
            log "[DRY RUN] Would analyze backend dependencies" "$YELLOW"
        else
            depcheck --json > /tmp/backend_depcheck.json 2>/dev/null || true
            if [ -f "/tmp/backend_depcheck.json" ]; then
                local unused=$(cat /tmp/backend_depcheck.json | jq -r '.dependencies[]' 2>/dev/null | wc -l)
                log "Found $unused potentially unused backend dependencies" "$CYAN"
                log "Review: /tmp/backend_depcheck.json" "$BLUE"
            fi
        fi
        cd "$PROJECT_ROOT"
    fi
    
    # Analyze frontend dependencies
    if [ -d "$FRONTEND_DIR" ] && [ -f "$FRONTEND_DIR/package.json" ]; then
        log "Analyzing frontend dependencies..." "$BLUE"
        cd "$FRONTEND_DIR"
        if [ "$DRY_RUN" = true ]; then
            log "[DRY RUN] Would analyze frontend dependencies" "$YELLOW"
        else
            depcheck --json > /tmp/frontend_depcheck.json 2>/dev/null || true
            if [ -f "/tmp/frontend_depcheck.json" ]; then
                local unused=$(cat /tmp/frontend_depcheck.json | jq -r '.dependencies[]' 2>/dev/null | wc -l)
                log "Found $unused potentially unused frontend dependencies" "$CYAN"
                log "Review: /tmp/frontend_depcheck.json" "$BLUE"
            fi
        fi
        cd "$PROJECT_ROOT"
    fi
    
    log_success "Dependency analysis completed"
}

# Function to clean Docker artifacts
clean_docker() {
    log_step "9" "Cleaning Docker artifacts"
    
    if ! command -v docker >/dev/null 2>&1; then
        log "Docker not found, skipping Docker cleanup"
        return
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log "[DRY RUN] Would clean Docker artifacts" "$YELLOW"
        return
    fi
    
    # Clean unused Docker images
    log "Cleaning unused Docker images..." "$BLUE"
    docker image prune -f >/dev/null 2>&1 || true
    
    # Clean unused Docker containers
    log "Cleaning unused Docker containers..." "$BLUE"
    docker container prune -f >/dev/null 2>&1 || true
    
    # Clean unused Docker volumes
    log "Cleaning unused Docker volumes..." "$BLUE"
    docker volume prune -f >/dev/null 2>&1 || true
    
    # Clean unused Docker networks
    log "Cleaning unused Docker networks..." "$BLUE"
    docker network prune -f >/dev/null 2>&1 || true
    
    log_success "Docker cleanup completed"
}

# Function to show cleanup summary
show_summary() {
    log "\n" "$GREEN"
    log "🎉 Cleanup Summary" "$GREEN"
    log "=================" "$GREEN"
    
    # Calculate freed space (approximate)
    local total_size="Unknown"
    if command -v du >/dev/null 2>&1; then
        total_size=$(du -sh "$PROJECT_ROOT" 2>/dev/null | cut -f1 || echo "Unknown")
    fi
    
    log "Project directory: $PROJECT_ROOT" "$CYAN"
    log "Current size: $total_size" "$CYAN"
    log "Mode: $([ "$DRY_RUN" = true ] && echo "Dry Run" || echo "Actual Cleanup")" "$CYAN"
    
    log "\nCleaned items:" "$YELLOW"
    log "✓ Node modules directories" "$BLUE"
    log "✓ Build artifacts (dist, .next, build)" "$BLUE"
    log "✓ Cache directories (.cache, .eslintcache)" "$BLUE"
    log "✓ Log files (*.log, logs/)" "$BLUE"
    log "✓ Temporary files (*.tmp, .DS_Store)" "$BLUE"
    log "✓ Test artifacts (coverage, test-results)" "$BLUE"
    log "✓ Development files (.vscode, .idea)" "$BLUE"
    log "✓ Docker artifacts (if Docker available)" "$BLUE"
    
    log "\nNext steps:" "$YELLOW"
    log "1. Run 'npm install' in backend and frontend directories" "$BLUE"
    log "2. Review dependency analysis results in /tmp/*_depcheck.json" "$BLUE"
    log "3. Consider running 'npm audit fix' to update dependencies" "$BLUE"
    log "\n"
}

# Main cleanup function
main() {
    log "🧹 Starting Project Cleanup" "$GREEN"
    log "===========================" "$GREEN"
    
    if [ "$DRY_RUN" = true ]; then
        log "🔍 DRY RUN MODE - No files will be deleted" "$YELLOW"
    fi
    
    # Run cleanup steps
    clean_node_modules
    clean_build_artifacts
    clean_cache
    clean_logs
    clean_temp_files
    clean_test_artifacts
    clean_dev_files
    clean_unused_deps
    clean_docker
    
    # Show summary
    show_summary
    
    if [ "$DRY_RUN" = true ]; then
        log_success "Dry run completed! Run without --dry-run to actually clean files."
    else
        log_success "Project cleanup completed successfully! 🎉"
    fi
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Remove Unused Files Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --help, -h         Show this help message"
            echo "  --dry-run          Show what would be cleaned without executing"
            echo "  --verbose, -v      Show detailed output"
            echo "  --node-modules     Clean only node_modules directories"
            echo "  --build            Clean only build artifacts"
            echo "  --cache            Clean only cache directories"
            echo "  --logs             Clean only log files"
            echo "  --temp             Clean only temporary files"
            echo "  --test             Clean only test artifacts"
            echo "  --dev              Clean only development files"
            echo "  --deps             Analyze only unused dependencies"
            echo "  --docker           Clean only Docker artifacts"
            echo ""
            echo "Examples:"
            echo "  $0                 # Clean everything"
            echo "  $0 --dry-run       # Show what would be cleaned"
            echo "  $0 --node-modules  # Clean only node_modules"
            echo "  $0 --verbose       # Show detailed output"
            exit 0
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --node-modules)
            clean_node_modules
            exit 0
            ;;
        --build)
            clean_build_artifacts
            exit 0
            ;;
        --cache)
            clean_cache
            exit 0
            ;;
        --logs)
            clean_logs
            exit 0
            ;;
        --temp)
            clean_temp_files
            exit 0
            ;;
        --test)
            clean_test_artifacts
            exit 0
            ;;
        --dev)
            clean_dev_files
            exit 0
            ;;
        --deps)
            clean_unused_deps
            exit 0
            ;;
        --docker)
            clean_docker
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function if no specific options were provided
main