#!/bin/bash
# ====================================================================
# Clarify Site - Development Startup Script (Linux/Mac)
# ====================================================================
# Author: Josué Amaral
# Date: January 06, 2026
# Description: Starts both backend and frontend in development mode
# ====================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "  CLARIFY SITE - DEVELOPMENT STARTUP"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo -e "${BLUE}[INFO] Node.js version:${NC}"
node --version
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}[WARNING] Port $1 is already in use${NC}"
        echo "Killing process on port $1..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
    fi
}

# Check and free ports
check_port 5000
check_port 5173

# Navigate to backend
echo -e "${GREEN}[1/4] Starting Backend Server...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}[INFO] Installing backend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[WARNING] backend/.env file not found!${NC}"
    echo "Please create backend/.env with required variables."
    echo "See backend/.env.example for reference."
    read -p "Press Enter to continue..."
fi

echo -e "${BLUE}[INFO] Starting backend on port 5000...${NC}"
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend PID: $BACKEND_PID${NC}"

# Wait for backend to start
sleep 3

# Navigate to frontend
cd ../frontend
echo ""
echo -e "${GREEN}[2/4] Starting Frontend Server...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}[INFO] Installing frontend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[WARNING] frontend/.env file not found!${NC}"
    echo "Creating default .env file..."
    echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
fi

echo -e "${BLUE}[INFO] Starting frontend on port 5173...${NC}"
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend PID: $FRONTEND_PID${NC}"

# Return to root
cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Save PIDs for cleanup
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo -e "${GREEN}[3/4] Services Started Successfully!${NC}"
echo ""
echo "========================================"
echo "  DEVELOPMENT SERVERS RUNNING"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "API Docs: http://localhost:5000/api"
echo "Admin:    http://localhost:5173/admin/login"
echo ""
echo "Logs:"
echo "  Backend:  logs/backend.log"
echo "  Frontend: logs/frontend.log"
echo ""

# Open browser (different commands for different OS)
echo -e "${GREEN}[4/4] Opening browser...${NC}"
sleep 2

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5173
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5173 2>/dev/null || sensible-browser http://localhost:5173 2>/dev/null || true
fi

echo ""
echo "========================================"
echo "  TO STOP: Press Ctrl+C"
echo "  TO VIEW LOGS: tail -f logs/*.log"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            echo -e "${GREEN}Backend stopped${NC}"
        fi
        rm -f logs/backend.pid
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            echo -e "${GREEN}Frontend stopped${NC}"
        fi
        rm -f logs/frontend.pid
    fi
    
    # Kill any remaining processes on ports
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    
    echo -e "${GREEN}All services stopped. Goodbye!${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

echo -e "${YELLOW}Services running... Press Ctrl+C to stop${NC}"
echo ""
echo "Tailing logs (Ctrl+C to stop):"
echo "─────────────────────────────────────────"

# Keep script running and show logs
tail -f logs/backend.log logs/frontend.log 2>/dev/null &
TAIL_PID=$!

# Wait indefinitely
wait $TAIL_PID
