#!/bin/bash

# Yeab-Saliha E-commerce Platform Deployment Script
# This script automates the production deployment process

set -e  # Exit on any error

echo "🚀 Starting Yeab-Saliha E-commerce Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed"
}

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    # Check for required environment variables
    if [ -z "$SECRET_KEY_BASE" ]; then
        print_warning "SECRET_KEY_BASE is not set. Generating one..."
        export SECRET_KEY_BASE=$(openssl rand -hex 64)
    fi
    
    if [ -z "$JWT_SECRET_KEY" ]; then
        print_warning "JWT_SECRET_KEY is not set. Generating one..."
        export JWT_SECRET_KEY=$(openssl rand -hex 32)
    fi
    
    if [ -z "$POSTGRES_PASSWORD" ]; then
        print_warning "POSTGRES_PASSWORD is not set. Using default password..."
        export POSTGRES_PASSWORD="secure_password_$(openssl rand -hex 8)"
    fi
    
    print_success "Environment variables configured"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm ci
    
    # Build for production
    print_status "Building frontend for production..."
    npm run build:prod
    
    cd ..
    
    print_success "Frontend built successfully"
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    bundle install --without development test
    
    # Precompile assets
    print_status "Precompiling Rails assets..."
    RAILS_ENV=production bundle exec rails assets:precompile
    
    cd ..
    
    print_success "Backend built successfully"
}

# Deploy with Docker Compose
deploy_docker() {
    print_status "Deploying with Docker Compose..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down || true
    
    # Build and start containers
    print_status "Building and starting containers..."
    docker-compose -f docker-compose.prod.yml up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    print_status "Checking service status..."
    docker-compose -f docker-compose.prod.yml ps
    
    print_success "Deployment completed successfully!"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait for database to be ready
    sleep 10
    
    # Run migrations
    docker-compose -f docker-compose.prod.yml exec backend bundle exec rails db:migrate RAILS_ENV=production
    
    print_success "Database migrations completed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for services to be fully ready
    sleep 10
    
    # Check if the application is responding
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Application is healthy and responding"
    else
        print_warning "Health check failed. The application might still be starting up."
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_docker
    check_environment
    
    # Build applications
    build_frontend
    build_backend
    
    # Deploy
    deploy_docker
    
    # Run migrations
    run_migrations
    
    # Health check
    health_check
    
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Your application is now running at:"
    echo "  Frontend: http://localhost"
    echo "  API: http://localhost/api"
    echo ""
    echo "To view logs:"
    echo "  docker-compose -f docker-compose.prod.yml logs -f"
    echo ""
    echo "To stop the application:"
    echo "  docker-compose -f docker-compose.prod.yml down"
}

# Handle script arguments
case "${1:-}" in
    "build")
        check_docker
        check_environment
        build_frontend
        build_backend
        print_success "Build completed"
        ;;
    "deploy")
        main
        ;;
    "logs")
        docker-compose -f docker-compose.prod.yml logs -f
        ;;
    "stop")
        docker-compose -f docker-compose.prod.yml down
        print_success "Application stopped"
        ;;
    "restart")
        docker-compose -f docker-compose.prod.yml restart
        print_success "Application restarted"
        ;;
    "status")
        docker-compose -f docker-compose.prod.yml ps
        ;;
    *)
        echo "Usage: $0 {build|deploy|logs|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  build   - Build frontend and backend"
        echo "  deploy  - Full deployment (default)"
        echo "  logs    - View application logs"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  status  - Show service status"
        exit 1
        ;;
esac 