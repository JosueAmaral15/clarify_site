# 🚀 Clarify Site - Quick Start Guide

**Version**: 1.0  
**Last Updated**: January 04, 2026  
**Status**: Production Ready

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or MongoDB Atlas account)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

---

## 🔧 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd clarify_site
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```bash
# Server
NODE_ENV=development
PORT=5000

# MongoDB (use your connection string)
MONGODB_URI=mongodb://localhost:27017/clarify_site
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clarify_site

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret-minimum-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=http://localhost:5173

# Email (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Clarify Team <your-email@gmail.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Generate JWT Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Start Backend:**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Backend will run at: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

**Start Frontend:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🧪 Testing the Application

### Test Backend API:

```bash
# Health check
curl http://localhost:5000/health

# Expected: {"status":"ok","mongodb":"connected"}
```

### Test Frontend:
1. Open browser: `http://localhost:5173`
2. You should see the Clarify homepage
3. Test contact form
4. Test download buttons
5. Test admin login at `/admin/login`

---

## 👤 Creating First Admin User

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!@#",
    "name": "Admin User",
    "role": "admin"
  }'
```

Or use Postman/Insomnia to send the POST request.

**Login credentials:**
- Email: `admin@example.com`
- Password: `Admin123!@#`

---

## 🗄️ MongoDB Setup Options

### Option 1: Local MongoDB

```bash
# Install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Option 2: MongoDB Atlas (Cloud - FREE)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

---

## 📧 Email Service Setup (Gmail)

### Enable Gmail SMTP:

1. Enable 2-Factor Authentication on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an "App Password" for "Mail"
4. Copy the 16-character password
5. Use it in `EMAIL_PASSWORD` env variable

**Note**: Never commit real email credentials to Git!

---

## 🏗️ Project Structure

```
clarify_site/
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.ts        # Entry point
│   ├── tests/               # Jest tests
│   ├── .env                 # Environment variables (create this)
│   └── package.json
│
├── frontend/                # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main component
│   ├── public/              # Static assets
│   ├── .env                 # Environment variables (create this)
│   └── package.json
│
├── docs/                    # Documentation
│   ├── TASKS.md
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── PROJECT_COMPLETION_SUMMARY.md
│
└── README.md
```

---

## 🔍 Available Scripts

### Backend:
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
npm test             # Run Jest tests
npm run lint         # Run ESLint
```

### Frontend:
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run Vitest tests
npm run lint         # Run ESLint
```

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error:
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running locally or check Atlas connection string.

### CORS Error in Browser:
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Check `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Port Already in Use:
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill the process using that port:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### Email Not Sending:
**Solution**: 
1. Verify Gmail app password is correct
2. Check email credentials in `.env`
3. Ensure 2FA is enabled on Gmail

---

## 📚 Useful Resources

- **React Docs**: https://react.dev/
- **Express Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/
- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **Vite Docs**: https://vitejs.dev/guide/
- **TailwindCSS Docs**: https://tailwindcss.com/docs

---

## 🧪 Running Tests

### Backend Tests:
```bash
cd backend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

### Frontend Tests:
```bash
cd frontend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- --coverage      # With coverage
```

---

## 📦 Production Build

### Build Both Projects:
```bash
# Backend
cd backend
npm run build
# Output: dist/ folder

# Frontend
cd frontend
npm run build
# Output: dist/ folder
```

### Test Production Build Locally:
```bash
# Backend
cd backend
npm start

# Frontend (in new terminal)
cd frontend
npm run preview
```

---

## 🚀 Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed deployment instructions to:
- Railway (Backend)
- Vercel (Frontend)
- MongoDB Atlas (Database)

---

## 🔐 Security Notes

- **Never commit `.env` files** to Git
- Use strong JWT secrets (32+ characters)
- Use app-specific passwords for Gmail
- Keep dependencies updated: `npm audit fix`
- Review security checklist in **OWASP_CHECKLIST.md**

---

## 💡 Development Tips

1. **Use TypeScript strict mode** - Catch bugs early
2. **Follow Simplicity Protocol 3** - Keep files <500 LOC
3. **Commit frequently** - After each completed task
4. **Write tests first** - TDD approach recommended
5. **Document as you go** - Update docs when changing code

---

## 📞 Need Help?

- **Documentation**: Check `docs/` folder
- **API Reference**: See `API_DOCUMENTATION.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Issues**: Create GitHub issue
- **Contact**: josueamaral15@gmail.com

---

## 🎯 Next Steps After Setup

1. ✅ Verify backend is running
2. ✅ Verify frontend is running
3. ✅ Create admin user
4. ✅ Test admin dashboard
5. ✅ Test contact form
6. ✅ Test download tracking
7. ✅ Review documentation
8. 🚀 Start building!

---

**Happy Coding! 🎉**

---

**Version**: 1.0  
**Last Updated**: January 04, 2026  
**Maintained by**: Josué Amaral
