# 🚀 Clarify Site - Quick Start Guide

**Version**: 1.0.0  
**Created**: January 06, 2026

---

## 📦 Prerequisites

- **Node.js**: 18+ ([Download](https://nodejs.org))
- **npm**: 9+ (comes with Node.js)
- **MongoDB**: Atlas account OR local installation
- **Git**: For version control

---

## ⚡ Quick Start (Development)

### Option 1: Automated with Live Logs (Recommended for Linux/Mac)

```bash
./start-dev-fg.sh
```

**Benefits**:
- See backend and frontend logs in real-time
- Press Ctrl+C to stop everything at once
- Best for active development and debugging

### Option 2: Automated in Background (Linux/Mac)

```bash
./start-dev.sh
# When done: ./stop-dev.sh
```

### Option 3: Automated (Windows)

```cmd
start-dev.bat
```

This will:
1. Install dependencies (if needed)
2. Start backend on port 5000
3. Start frontend on port 5173
4. Open browser automatically

### Option 2: Manual

#### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Admin Credentials

**Email**: `josueamaral15@gmail.com`  
**Password**: `Admin@123456`

⚠️ **IMPORTANT**: Change password after first login!

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Main website |
| Backend API | http://localhost:5000 | REST API |
| Admin Login | http://localhost:5173/admin/login | Admin dashboard |
| API Health | http://localhost:5000/health | Health check |

---

## 📁 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clarify_site
JWT_SECRET=your-secret-key-32-characters-min
JWT_REFRESH_SECRET=your-refresh-secret-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Run All Tests:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Run Tests with Coverage:
```bash
npm run test:coverage
```

---

## 🚀 Next Steps

1. **Read Documentation**: See `docs/POST_MVP_SPRINTS.md`
2. **Choose a Sprint**: Start with Sprint 8 (Production Deployment)
3. **Track Progress**: Update `docs/TASKS.md`
4. **Follow Protocol**: Simplicidade 3 methodology

---

## 📚 Key Documentation

| Document | Description |
|----------|-------------|
| [POST_MVP_SPRINTS.md](docs/POST_MVP_SPRINTS.md) | 6 planned sprints (22-30h) |
| [TASKS.md](docs/TASKS.md) | All tasks (completed + planned) |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Production deployment |
| [API_REFERENCE.md](docs/API_REFERENCE.md) | API documentation |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures |
| [ROLLBACK_PLAN.md](docs/ROLLBACK_PLAN.md) | Rollback procedures |

---

## 🐛 Troubleshooting

### Backend won't start:
```bash
# Check MongoDB is running
mongo --version

# Check if port 5000 is free
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows
```

### Frontend won't start:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 5173 is free
lsof -i :5173  # Linux/Mac
netstat -ano | findstr :5173  # Windows
```

### Can't login:
- Verify backend is running
- Check `VITE_API_BASE_URL` in frontend/.env
- Check browser console for CORS errors
- Verify admin user exists in database

---

## 📞 Support

**Developer**: Josué Amaral  
**Email**: josueamaral15@gmail.com  
**Protocol**: Simplicidade 3 - Solo Developer in Production

---

**Last Updated**: January 06, 2026
