# 🚀 Clarify Site - Deployment Guide

**Created**: January 04, 2026  
**Last Updated**: January 04, 2026  
**Product**: Clarify v2.9.111 Landing Page

---

## 📋 Pre-Deployment Checklist

### Backend Requirements:
- [x] MongoDB Atlas account (free tier)
- [x] Node.js 18+ installed
- [x] Gmail account for SMTP (or alternative email service)
- [x] Environment variables configured
- [x] JWT secret generated (32+ characters)

### Frontend Requirements:
- [x] Node.js 18+ installed
- [x] Build successful (no TypeScript errors)
- [x] Environment variables configured
- [x] API base URL set correctly

---

## 🔧 Environment Variables Setup

### Backend (.env)
Create `backend/.env` with the following variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clarify_site?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-32-characters-minimum
JWT_REFRESH_SECRET=your-refresh-token-secret-32-characters-minimum
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app

# Email Service (Gmail SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Clarify Team <your-email@gmail.com>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (.env)
Create `frontend/.env` with:

```bash
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Login
3. Create a new **FREE** M0 cluster
4. Choose a cloud provider (AWS recommended)
5. Choose region closest to your users

### 2. Configure Database Access
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `clarify_admin`
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Read and write to any database"

### 3. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address

### 4. Get Connection String
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `clarify_site`

Example:
```
mongodb+srv://clarify_admin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/clarify_site?retryWrites=true&w=majority
```

### 5. Create Collections (Optional - Auto-created)
The following collections will be auto-created on first use:
- `users`
- `downloads`
- `contacts`
- `newsletters`

---

## 📧 Email Service Setup (Gmail)

### 1. Enable 2-Factor Authentication
1. Go to Google Account settings
2. Security > 2-Step Verification
3. Enable it

### 2. Generate App Password
1. Go to Google Account > Security
2. Select "App passwords"
3. Generate a new app password for "Mail"
4. Copy the 16-character password
5. Use this in `EMAIL_PASSWORD` env variable

---

## 🖥️ Backend Deployment (Railway)

### Option 1: GitHub Integration (Recommended)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select `backend` folder as root directory
7. Railway will auto-detect Node.js

### Option 2: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
cd backend
railway link

# Deploy
railway up
```

### Configure Environment Variables on Railway:
1. Go to your project dashboard
2. Click "Variables"
3. Add all environment variables from backend/.env
4. Important: Set `NODE_ENV=production`

### Add Start Script:
Ensure `backend/package.json` has:
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc"
  }
}
```

Railway will automatically run:
```bash
npm install
npm run build
npm start
```

---

## 🌐 Frontend Deployment (Vercel)

### Option 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_API_BASE_URL`: Your Railway backend URL + `/api`

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
# Set root directory to frontend
# Add environment variables when prompted
```

### Environment Variables on Vercel:
1. Go to Project Settings
2. Click "Environment Variables"
3. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend.railway.app/api`
   - Environment: Production

---

## 🔐 Security Checklist

### Before Going Live:
- [ ] Change all default passwords
- [ ] Use strong JWT secrets (32+ random characters)
- [ ] Enable HTTPS only (enforced by Vercel/Railway)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Review rate limiting settings
- [ ] Enable MongoDB Atlas IP whitelist (production)
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Test all authentication flows
- [ ] Test admin panel access control

### Generate Secure JWT Secrets:
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🧪 Testing Production

### 1. Backend Health Check
```bash
curl https://your-backend.railway.app/health

# Expected: {"status":"ok","mongodb":"connected"}
```

### 2. Test API Endpoints
```bash
# Test contact form
curl -X POST https://your-backend.railway.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing production API"
  }'

# Test download tracking
curl -X POST https://your-backend.railway.app/api/downloads/track \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "platform": "linux"
  }'
```

### 3. Test Frontend
1. Visit your Vercel URL
2. Test contact form submission
3. Test download buttons
4. Test responsive design (mobile/desktop)
5. Test admin login at `/admin/login`

---

## 🔄 CI/CD Setup (GitHub Actions)

### Backend CI Workflow
Already configured in `.github/workflows/backend-ci.yml`

Triggers on:
- Push to `main` branch
- Pull requests to `main`

Runs:
- ESLint checks
- TypeScript compilation
- Jest tests
- Security audit

### Frontend CI Workflow
Already configured in `.github/workflows/frontend-ci.yml`

Triggers on:
- Push to `main` branch
- Pull requests to `main`

Runs:
- ESLint checks
- TypeScript compilation
- Vitest tests
- Build verification

### Auto-Deployment
- **Vercel**: Auto-deploys on push to `main`
- **Railway**: Auto-deploys on push to `main`

---

## 📊 Monitoring & Logs

### Railway Logs:
1. Go to Railway dashboard
2. Click on your project
3. Click "Deployments"
4. View logs in real-time

### Vercel Logs:
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on a deployment to view logs

### MongoDB Logs:
1. Go to MongoDB Atlas
2. Click "Clusters"
3. Go to "Metrics" tab
4. View database performance

---

## 🐛 Troubleshooting

### Backend won't start:
- Check Railway logs for errors
- Verify all environment variables are set
- Check MongoDB connection string
- Ensure port is not hardcoded (use `process.env.PORT`)

### Frontend API calls fail:
- Check CORS configuration in backend
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for errors
- Test backend health endpoint directly

### Database connection fails:
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions
- Test connection locally first

### Emails not sending:
- Verify Gmail app password is correct
- Check email service logs in Railway
- Ensure 2FA is enabled on Gmail account
- Test with a different email provider if needed

---

## 📈 Post-Deployment Tasks

### 1. Create First Admin User
```bash
# Using curl or Postman
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "name": "Admin User",
    "role": "admin"
  }'
```

### 2. Test Admin Dashboard
1. Go to https://your-frontend.vercel.app/admin/login
2. Login with admin credentials
3. Verify analytics are displaying
4. Test contacts management
5. Test downloads management

### 3. Add Custom Domain (Optional)
#### Vercel:
1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### Railway:
1. Go to Project Settings
2. Click "Generate Domain" or add custom domain
3. Update CORS settings in backend

### 4. Setup Monitoring
Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: Traffic analytics
- **Uptime Robot**: Uptime monitoring

---

## 🔄 Rollback Procedure

### If deployment fails:
1. **Vercel**: Go to Deployments > Select previous working deployment > "Promote to Production"
2. **Railway**: Go to Deployments > Click on previous deployment > "Redeploy"

### Emergency rollback:
```bash
# Revert last commit
git revert HEAD
git push origin main

# Or roll back to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## 📝 Maintenance Checklist

### Weekly:
- [ ] Review application logs
- [ ] Check error rates
- [ ] Monitor database size
- [ ] Review contact form submissions

### Monthly:
- [ ] Update dependencies (`npm update`)
- [ ] Run security audit (`npm audit`)
- [ ] Review MongoDB Atlas metrics
- [ ] Check email sending rates
- [ ] Review download statistics

### Quarterly:
- [ ] Review and rotate JWT secrets
- [ ] Update SSL certificates (auto-renewed by platforms)
- [ ] Database backup verification
- [ ] Performance optimization review

---

## 🎯 Success Metrics

After deployment, monitor:
- **Uptime**: Should be >99%
- **Response Time**: API <200ms, Page load <2s
- **Error Rate**: <0.1%
- **Download Conversions**: Track via admin dashboard
- **Contact Form Submissions**: Track via admin dashboard

---

## 📞 Support

### Resources:
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

### Contact:
- **Developer**: josueamaral15@gmail.com
- **GitHub Issues**: Create issue on repository

---

**Deployment Guide Version**: 1.0  
**Last Updated**: January 04, 2026  
**Status**: Production Ready ✅
