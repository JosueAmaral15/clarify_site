#!/bin/bash
# ====================================================================
# Clarify Site - Development Startup (Foreground Mode)
# ====================================================================
# This version runs services in the foreground for better control
# Press Ctrl+C to stop all services
# ====================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "========================================"
echo "  CLARIFY SITE - DEVELOPMENT STARTUP"
echo "  (Foreground Mode)"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
    exit 1
fi

echo -e "${BLUE}[INFO] Node.js version:${NC}"
node --version
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    
    # Kill background jobs
    jobs -p | xargs kill 2>/dev/null || true
    
    # Kill by port
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped. Goodbye!${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Check ports
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING] Port 5000 in use, killing...${NC}"
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING] Port 5173 in use, killing...${NC}"
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

# Backend setup
echo -e "${GREEN}[1/3] Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing backend dependencies...${NC}"
    npm install
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[WARNING] backend/.env not found!${NC}"
fi

echo -e "${BLUE}Starting backend on port 5000...${NC}"
npm run dev 2>&1 | sed 's/^/[BACKEND] /' &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Frontend setup
cd ../frontend
echo ""
echo -e "${GREEN}[2/3] Setting up Frontend...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating frontend/.env...${NC}"
    echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
fi

echo -e "${BLUE}Starting frontend on port 5173...${NC}"
npm run dev 2>&1 | sed 's/^/[FRONTEND] /' &
FRONTEND_PID=$!

# Return to root
cd ..

echo ""
echo -e "${GREEN}[3/3] Services Started!${NC}"
echo ""
echo "========================================"
echo "  DEVELOPMENT SERVERS RUNNING"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Admin:    http://localhost:5173/admin/login"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo "========================================"
echo ""

# Open browser
sleep 2
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5173 2>/dev/null || true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:5173 2>/dev/null || sensible-browser http://localhost:5173 2>/dev/null || true
fi

# Wait for any background job to exit
wait
