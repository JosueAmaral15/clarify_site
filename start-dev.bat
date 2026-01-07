@echo off
REM ====================================================================
REM Clarify Site - Development Startup Script (Windows)
REM ====================================================================
REM Author: Josué Amaral
REM Date: January 06, 2026
REM Description: Starts both backend and frontend in development mode
REM ====================================================================

echo.
echo ========================================
echo  CLARIFY SITE - DEVELOPMENT STARTUP
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Navigate to backend
echo [1/4] Starting Backend Server...
cd backend
if not exist node_modules (
    echo [INFO] Installing backend dependencies...
    call npm install
)

REM Check if .env exists
if not exist .env (
    echo [WARNING] backend/.env file not found!
    echo Please create backend/.env with required variables.
    echo See backend/.env.example for reference.
    pause
)

echo [INFO] Starting backend on port 5000...
start "Clarify Backend" cmd /k "npm run dev"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak >nul

REM Navigate to frontend
cd ..\frontend
echo.
echo [2/4] Starting Frontend Server...
if not exist node_modules (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

REM Check if .env exists
if not exist .env (
    echo [WARNING] frontend/.env file not found!
    echo Please create frontend/.env with:
    echo VITE_API_BASE_URL=http://localhost:5000/api
    pause
)

echo [INFO] Starting frontend on port 5173...
start "Clarify Frontend" cmd /k "npm run dev"

REM Return to root
cd ..

echo.
echo [3/4] Services Started Successfully!
echo.
echo ========================================
echo  DEVELOPMENT SERVERS RUNNING
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo API Docs: http://localhost:5000/api
echo Admin:    http://localhost:5173/admin/login
echo.
echo [4/4] Opening browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo  TO STOP: Close the terminal windows
echo ========================================
echo.
pause
