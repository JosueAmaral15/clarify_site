#!/bin/bash
# ====================================================================
# Clarify Site - Stop Development Servers (Linux/Mac)
# ====================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo "========================================"
echo "  STOPPING DEVELOPMENT SERVERS"
echo "========================================"
echo ""

# Stop backend
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${GREEN}Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID
        rm logs/backend.pid
    else
        echo -e "${RED}Backend process not running${NC}"
        rm logs/backend.pid
    fi
else
    echo -e "${RED}Backend PID file not found${NC}"
fi

# Stop frontend
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${GREEN}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID
        rm logs/frontend.pid
    else
        echo -e "${RED}Frontend process not running${NC}"
        rm logs/frontend.pid
    fi
else
    echo -e "${RED}Frontend PID file not found${NC}"
fi

# Kill any remaining processes on ports
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

echo ""
echo -e "${GREEN}All development servers stopped${NC}"
echo ""
