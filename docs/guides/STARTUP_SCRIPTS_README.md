# 🚀 Startup Scripts - Usage Guide

This folder contains cross-platform scripts to easily start the Clarify Site development environment.

---

## 📁 Available Scripts

| Script | Platform | Purpose | Mode |
|--------|----------|---------|------|
| `start-dev.bat` | Windows | Start backend + frontend | Background |
| `start-dev.sh` | Linux/Mac | Start backend + frontend + logs | Background |
| `start-dev-fg.sh` | Linux/Mac | Start with live logs | Foreground ⭐ |
| `stop-dev.sh` | Linux/Mac | Stop all services | - |

---

## 🎯 Quick Start

### Windows:
```cmd
start-dev.bat
```

### Linux/Mac (Recommended - Foreground with Live Logs):
```bash
chmod +x start-dev-fg.sh  # First time only
./start-dev-fg.sh
```

Press **Ctrl+C** to stop all services (both backend and frontend will stop together).

### Linux/Mac (Background Mode):
```bash
chmod +x start-dev.sh  # First time only
./start-dev.sh
# To stop: ./stop-dev.sh
```

---

## 🔀 Choosing the Right Script

### Use `start-dev-fg.sh` (Foreground) when:
- ✅ You want to see live logs from both backend and frontend
- ✅ You want one-command stop (Ctrl+C stops everything)
- ✅ You're actively developing and debugging
- ✅ **Recommended for most developers**

### Use `start-dev.sh` (Background) when:
- You want services to run in background
- You need the terminal for other commands
- You want separate log files (logs/backend.log, logs/frontend.log)

### Use `start-dev.bat` (Windows):
- You're on Windows
- Services run in separate windows

---

## 🔧 What These Scripts Do

1. ✅ **Check Node.js** is installed
2. ✅ **Install dependencies** (if `node_modules` missing)
3. ✅ **Start backend** on port 5000 (separate window/process)
4. ✅ **Start frontend** on port 5173 (separate window/process)
5. ✅ **Open browser** to http://localhost:5173
6. ✅ **Create logs** (Linux/Mac only): `logs/backend.log`, `logs/frontend.log`

---

## 🌐 Default URLs

After startup, access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:5173/admin/login
- **Health Check**: http://localhost:5000/health

---

## 🛑 Stopping Services

### Windows:
Close the terminal windows that opened (Backend & Frontend)

### Linux/Mac:
```bash
./stop-dev.sh
```

Or manually:
```bash
# Kill processes
kill $(cat logs/backend.pid)
kill $(cat logs/frontend.pid)

# Or kill by port
lsof -ti:5000 | xargs kill
lsof -ti:5173 | xargs kill
```

---

## 📋 Prerequisites

### Required:
- **Node.js 18+** ([Download](https://nodejs.org))
- **npm 9+** (comes with Node.js)

### Optional:
- **MongoDB** (local or MongoDB Atlas for database)

---

## ⚙️ Environment Variables

Scripts will warn if `.env` files are missing:

### backend/.env (required):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clarify_site
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=http://localhost:5173
```

### frontend/.env (created automatically if missing):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

### "Node.js is not installed"
Install Node.js 18+ from https://nodejs.org

### "Port 5000/5173 is already in use" (Linux/Mac)
The script automatically kills existing processes on these ports.

Manually:
```bash
# Check what's using the port
lsof -i :5000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### "Permission denied" (Linux/Mac)
```bash
chmod +x start-dev.sh stop-dev.sh
```

### Backend starts but frontend doesn't connect
1. Check `frontend/.env` has correct `VITE_API_BASE_URL`
2. Verify backend is running: curl http://localhost:5000/health
3. Check browser console for CORS errors

### MongoDB connection error
1. Start local MongoDB: `mongod` or `sudo systemctl start mongod`
2. Or use MongoDB Atlas (cloud database)
3. Update `MONGODB_URI` in `backend/.env`

---

## 📊 Viewing Logs (Linux/Mac)

```bash
# View real-time logs
tail -f logs/backend.log
tail -f logs/frontend.log

# View both simultaneously
tail -f logs/*.log

# View last 50 lines
tail -n 50 logs/backend.log
```

---

## 🔄 Manual Start (Without Scripts)

If scripts don't work, start manually:

### Terminal 1 - Backend:
```bash
cd backend
npm install  # First time only
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install  # First time only
npm run dev
```

---

## 📝 Notes

- **First run**: Scripts will install dependencies (~2-3 minutes)
- **Subsequent runs**: Start in ~3-5 seconds
- **Logs location**: `./logs/` (Linux/Mac only)
- **PID files**: `./logs/backend.pid`, `./logs/frontend.pid` (Linux/Mac)

---

## 🆘 Still Having Issues?

1. Delete `node_modules` and reinstall:
   ```bash
   cd backend && rm -rf node_modules && npm install
   cd ../frontend && rm -rf node_modules && npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

3. Read full documentation:
   - [QUICK_START.md](QUICK_START.md)
   - [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)

---

**Created**: January 06, 2026  
**Last Updated**: January 06, 2026  
**Maintained by**: Josué Amaral
