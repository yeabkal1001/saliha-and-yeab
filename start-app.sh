#!/bin/bash

# Yeab-Saliha E-commerce Platform - Development Start Script
# This script starts the application using Docker Compose

set -e

echo "🚀 Starting Yeab-Saliha E-commerce Platform..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker not found. Starting with manual servers..."
    
    # Start backend
    print_status "Starting Rails backend..."
    cd backend
    bundle exec rails server -p 3000 -b 0.0.0.0 &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    print_status "Starting React frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Application started!"
    echo ""
    echo "Frontend: http://localhost:3002"
    echo "Backend:  http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Wait for interrupt
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
else
    # Use Docker Compose
    print_status "Using Docker Compose to start the application..."
    
    # Check if docker-compose.yml exists
    if [ -f "docker-compose.yml" ]; then
        docker-compose up --build
    else
        print_warning "docker-compose.yml not found. Creating one..."
        
        # Create a simple docker-compose.yml for development
        cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yeab_saliha_development
      POSTGRES_USER: yeab_saliha_user
      POSTGRES_PASSWORD: development_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network

  # Rails Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      RAILS_ENV: development
      DATABASE_URL: postgresql://yeab_saliha_user:development_password@postgres:5432/yeab_saliha_development
    depends_on:
      - postgres
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - bundle_cache:/usr/local/bundle
    networks:
      - app-network
    command: bundle exec rails server -p 3000 -b 0.0.0.0

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3002:3002"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
    networks:
      - app-network
    command: npm run dev -- --host 0.0.0.0 --port 3002

volumes:
  postgres_data:
  bundle_cache:

networks:
  app-network:
    driver: bridge
EOF
        
        print_status "Starting with Docker Compose..."
        docker-compose up --build
    fi
fi 