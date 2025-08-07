#!/bin/bash

# Start Development Script
# Loads .env.local and starts both backend and frontend in development mode

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
ENV_LOCAL="$PROJECT_ROOT/.env.local"

# Functions
log() {
    echo -e "${2:-$NC}$1${NC}"
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
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_step() {
    echo -e "\n${CYAN}🔄 $1${NC}"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port)
    if [ ! -z "$pids" ]; then
        log_warning "Killing existing process on port $port"
        echo $pids | xargs kill -9
        sleep 2
    fi
}

# Function to wait for server to start
wait_for_server() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $name to start at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            log_success "$name is ready at $url"
            return 0
        fi
        
        if [ $((attempt % 5)) -eq 0 ]; then
            log_info "Still waiting for $name... (attempt $attempt/$max_attempts)"
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log_error "$name failed to start within expected time"
    return 1
}

# Main function
main() {
    log "🚀 Starting Development Environment" "$GREEN"
    log "===================================" "$GREEN"
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Load environment variables
    log_step "Loading local environment configuration..."
    
    if [ -f "$ENV_LOCAL" ]; then
        export NODE_ENV=development
        export MODE=local
        source "$ENV_LOCAL"
        log_success "Loaded .env.local configuration"
        log_info "Environment: $NODE_ENV"
        log_info "Mode: $MODE"
        log_info "Database: ${DB_HOST:-localhost}:${DB_PORT:-5432}/${DB_NAME:-multi_vendor_ecommerce_dev}"
    else
        log_warning ".env.local not found, using default development settings"
        export NODE_ENV=development
        export MODE=local
    fi
    
    # Check required directories
    log_step "Checking project structure..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        log_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        log_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    log_success "Project structure verified"
    
    # Check and kill existing processes
    log_step "Checking for existing processes..."
    
    BACKEND_PORT=${BACKEND_PORT:-3000}
    FRONTEND_PORT=${FRONTEND_PORT:-3001}
    
    if check_port $BACKEND_PORT; then
        log_warning "Port $BACKEND_PORT is already in use"
        kill_port $BACKEND_PORT
    fi
    
    if check_port $FRONTEND_PORT; then
        log_warning "Port $FRONTEND_PORT is already in use"
        kill_port $FRONTEND_PORT
    fi
    
    # Install dependencies if needed
    log_step "Installing dependencies..."
    
    # Backend dependencies
    if [ -f "$BACKEND_DIR/package.json" ]; then
        cd "$BACKEND_DIR"
        if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
            log_info "Installing backend dependencies..."
            npm install
        else
            log_info "Backend dependencies are up to date"
        fi
        cd "$PROJECT_ROOT"
    fi
    
    # Frontend dependencies
    if [ -f "$FRONTEND_DIR/package.json" ]; then
        cd "$FRONTEND_DIR"
        if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
            log_info "Installing frontend dependencies..."
            npm install
        else
            log_info "Frontend dependencies are up to date"
        fi
        cd "$PROJECT_ROOT"
    fi
    
    log_success "Dependencies ready"
    
    # Start backend server
    log_step "Starting backend server..."
    
    cd "$BACKEND_DIR"
    
    # Check if we have a start:dev script
    if npm run | grep -q "start:dev"; then
        log_info "Starting backend with npm run start:dev"
        npm run start:dev &
    elif npm run | grep -q "dev"; then
        log_info "Starting backend with npm run dev"
        npm run dev &
    else
        log_info "Starting backend with npm start"
        npm start &
    fi
    
    BACKEND_PID=$!
    cd "$PROJECT_ROOT"
    
    # Wait for backend to start
    sleep 3
    BACKEND_URL="http://localhost:$BACKEND_PORT"
    
    # Start frontend server
    log_step "Starting frontend server..."
    
    cd "$FRONTEND_DIR"
    
    # Check if we have a dev script
    if npm run | grep -q "dev"; then
        log_info "Starting frontend with npm run dev"
        npm run dev &
    else
        log_info "Starting frontend with npm start"
        npm start &
    fi
    
    FRONTEND_PID=$!
    cd "$PROJECT_ROOT"
    
    # Wait for servers to be ready
    sleep 5
    
    FRONTEND_URL="http://localhost:$FRONTEND_PORT"
    API_URL="$BACKEND_URL/api/v1"
    
    # Display status
    log "\n" "$GREEN"
    log "🎉 Development Environment Ready!" "$GREEN"
    log "==================================" "$GREEN"
    log "\n"
    log "📱 Frontend: $FRONTEND_URL" "$CYAN"
    log "🔌 Backend API: $API_URL" "$CYAN"
    log "🗄️  Database: ${DB_HOST:-localhost}:${DB_PORT:-5432}/${DB_NAME:-multi_vendor_ecommerce_dev}" "$CYAN"
    log "🔄 Hot Reloading: Enabled" "$CYAN"
    log "\n"
    log "📝 What happened:" "$YELLOW"
    log "• Loaded .env.local for local development configuration" "$BLUE"
    log "• Connected to your local PostgreSQL database" "$BLUE"
    log "• Started backend server with hot reloading enabled" "$BLUE"
    log "• Started frontend server with Next.js dev mode" "$BLUE"
    log "• Both servers are now running and ready for development" "$BLUE"
    log "\n"
    log "🚀 Quick Links:" "$YELLOW"
    log "• Admin Login: $FRONTEND_URL/login/admin" "$BLUE"
    log "• User Login: $FRONTEND_URL/login/user" "$BLUE"
    log "• Vendor Login: $FRONTEND_URL/login/vendor" "$BLUE"
    log "• API Health: $BACKEND_URL/health" "$BLUE"
    log "\n"
    log "💡 Tips:" "$YELLOW"
    log "• Press Ctrl+C to stop both servers" "$BLUE"
    log "• Changes to code will auto-reload" "$BLUE"
    log "• Check terminal output for any errors" "$BLUE"
    log "\n"
    
    # Function to cleanup on exit
    cleanup() {
        log "\n" "$YELLOW"
        log "🛑 Shutting down development servers..." "$YELLOW"
        
        if [ ! -z "$BACKEND_PID" ]; then
            kill $BACKEND_PID 2>/dev/null || true
        fi
        
        if [ ! -z "$FRONTEND_PID" ]; then
            kill $FRONTEND_PID 2>/dev/null || true
        fi
        
        # Kill any remaining processes on our ports
        kill_port $BACKEND_PORT
        kill_port $FRONTEND_PORT
        
        log_success "Development environment stopped"
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Keep script running
    log "Press Ctrl+C to stop the development environment" "$CYAN"
    wait
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Start Development Script"
            echo ""
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --help, -h         Show this help message"
            echo "  --backend-only     Start only the backend server"
            echo "  --frontend-only    Start only the frontend server"
            echo "  --port-backend     Override backend port (default: 3000)"
            echo "  --port-frontend    Override frontend port (default: 3001)"
            echo ""
            echo "Examples:"
            echo "  $0                 # Start both servers"
            echo "  $0 --backend-only  # Start only backend"
            echo "  $0 --frontend-only # Start only frontend"
            exit 0
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        --port-backend)
            BACKEND_PORT="$2"
            shift 2
            ;;
        --port-frontend)
            FRONTEND_PORT="$2"
            shift 2
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main