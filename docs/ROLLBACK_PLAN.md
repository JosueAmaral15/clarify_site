# Rollback Plan - Clarify Site

**Author**: Josué Amaral  
**Created**: January 01, 2026  
**Protocol**: Simplicity Protocol 3 - Step 12.5 (MANDATORY)  
**Status**: ✅ Ready

---

## ⚠️ CRITICAL NOTE

This rollback plan is **MANDATORY** per Simplicity Protocol 3 (Step 12.5).  
Must be reviewed and updated before each production deployment.

---

## 🎯 Rollback Strategy Overview

### Quick Facts:
- **Estimated Rollback Time**: <5 minutes
- **Rollback Trigger**: Critical bugs, security issues, system down
- **Backup Frequency**: Daily (automated)
- **Decision Maker**: Josué Amaral (solo developer)

---

## 🚨 When to Rollback

### IMMEDIATE Rollback Triggers:
1. ✅ **Security Breach** - Unauthorized access detected
2. ✅ **Data Loss** - Users losing data
3. ✅ **Complete System Failure** - 500 errors on all endpoints
4. ✅ **Authentication Broken** - Users cannot login
5. ✅ **Payment Issues** - If e-commerce added later

### CONSIDER Rollback:
- Non-critical bugs affecting <10% users
- Performance degradation (>5s page load)
- UI broken on specific browsers
- Minor feature not working

### NO Rollback Needed:
- Cosmetic UI issues
- Non-blocking bugs with workarounds
- Analytics/logging issues
- Minor typos in text

---

## 📊 Deployment Components

### Component Overview:

| Component | Platform | Rollback Method | Time | Auto/Manual |
|-----------|----------|-----------------|------|-------------|
| Frontend | Vercel | Revert deployment | <1 min | Manual |
| Backend | Railway | Revert deployment | <2 min | Manual |
| Database | MongoDB Atlas | Restore backup | <2 min | Manual |
| **Total** | - | - | **<5 min** | - |

---

## 🔄 Rollback Procedures

### 1. Frontend Rollback (Vercel)

**Scenario**: Critical bug in UI, broken authentication flow

#### Steps:
```bash
# Option A: Via Vercel Dashboard (RECOMMENDED)
1. Login to Vercel dashboard
2. Go to clarify-site-frontend project
3. Click "Deployments" tab
4. Find last stable deployment (marked with ✅)
5. Click "..." menu → "Promote to Production"
6. Confirm rollback
# ✅ Done in <1 minute

# Option B: Via Vercel CLI
vercel rollback clarify-site-frontend
# Select previous deployment from list
# Confirm rollback
```

#### Verification:
```bash
# Check if rolled back version is live
curl https://clarify-site.vercel.app/api/version
# Should return previous version number

# Manual test
# 1. Open website in browser
# 2. Check version in footer
# 3. Test broken feature (should work now)
```

#### Rollback Time: **<1 minute**

---

### 2. Backend Rollback (Railway)

**Scenario**: API errors, database connection issues

#### Steps:
```bash
# Via Railway Dashboard (RECOMMENDED)
1. Login to Railway dashboard
2. Go to clarify-site-backend project
3. Click "Deployments" tab
4. Find last stable deployment
5. Click "Redeploy" on that commit
6. Wait for deployment (~2 min)
# ✅ Done in <2 minutes

# Via Railway CLI (Alternative)
railway rollback
# Select previous deployment
# Confirm rollback
```

#### Verification:
```bash
# Health check
curl https://clarify-site-backend.up.railway.app/health
# Expected: {"status": "ok", "version": "previous_version"}

# Test critical endpoint
curl -X POST https://clarify-site-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
# Should return JWT token (not 500 error)
```

#### Rollback Time: **<2 minutes**

---

### 3. Database Rollback (MongoDB Atlas)

**Scenario**: Data corruption, accidental deletion

#### A. Point-in-Time Restore (Preferred)

**Requirements**:
- MongoDB Atlas M10+ cluster (paid tier)
- Cloud backups enabled (automatic)

**Steps**:
```bash
# Via MongoDB Atlas Dashboard
1. Login to MongoDB Atlas
2. Go to Clusters → clarify-site-cluster
3. Click "Backup" tab
4. Click "Restore" on latest backup before issue
5. Choose "Download" or "Point-in-time restore"
6. Select exact timestamp before issue
7. Create new cluster OR overwrite existing
8. Update backend .env with new connection string
9. Redeploy backend with new connection string
# ✅ Done in <5 minutes (if new cluster)
# ✅ Done in <2 minutes (if download + manual restore)
```

#### B. Manual Backup Restore (Free Tier)

**Requirements**:
- Daily backups via `mongodump` (automated script)

**Steps**:
```bash
# Find latest backup
ls -lh backups/
# Output: clarify_site_2026-01-01.gz

# Restore from backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/clarify_site" \
  --gzip --archive=backups/clarify_site_2026-01-01.gz \
  --drop  # Drop existing data first
# ✅ Done in <2 minutes
```

#### Verification:
```bash
# Via MongoDB Compass or mongosh
use clarify_site
db.users.countDocuments()
# Should match expected count

# Test via API
curl https://clarify-site-backend.up.railway.app/api/users/count
# Should return correct user count
```

#### Rollback Time: **<2 minutes** (manual backup) OR **<5 minutes** (Atlas restore)

---

## 📋 Complete Rollback Checklist

### Pre-Rollback (1 minute):
- [ ] Confirm rollback is necessary (see triggers above)
- [ ] Identify affected component(s): Frontend / Backend / Database
- [ ] Note current deployment version/commit hash
- [ ] Screenshot error logs/metrics
- [ ] Notify users (if critical): "System maintenance in progress"

### During Rollback (3-5 minutes):
- [ ] **Frontend**: Revert to last stable deployment (Vercel)
- [ ] **Backend**: Revert to last stable deployment (Railway)
- [ ] **Database**: Restore backup (if needed) (MongoDB Atlas)
- [ ] Verify each component after rollback

### Post-Rollback (2 minutes):
- [ ] **Verify frontend** loads without errors
- [ ] **Test API** critical endpoints (login, register, get user)
- [ ] **Check database** data integrity (user count, recent records)
- [ ] **Monitor logs** for errors (first 5 minutes)
- [ ] **Update status page** (if exists): "System restored"
- [ ] **Notify users**: "Issue resolved, service restored"

### After Rollback (15-30 minutes):
- [ ] Root cause analysis (RCA)
- [ ] Document what went wrong
- [ ] Create bug ticket in GitHub Issues
- [ ] Fix issue in development environment
- [ ] Test fix thoroughly (unit + integration tests)
- [ ] Plan re-deployment with fix

---

## 🔍 Rollback Scenarios & Responses

### Scenario 1: Frontend React app broken (white screen)

**Symptoms**:
- Users see white screen or "Chunk load error"
- Console errors: `Failed to fetch dynamically imported module`

**Rollback**:
```bash
# 1. Revert frontend deployment (Vercel)
# Via dashboard: Deployments → Previous → Promote
# ✅ Time: <1 minute

# 2. Clear CDN cache (Vercel does this automatically)
# No action needed

# 3. Verify
curl -I https://clarify-site.vercel.app
# Check X-Vercel-Cache header
```

**Root Cause Investigation**:
- Likely: Vite build configuration error
- Check: vite.config.ts changes in failed deployment
- Fix: Revert vite.config changes, test locally, redeploy

---

### Scenario 2: Backend API returns 500 errors

**Symptoms**:
- All API calls return 500 Internal Server Error
- Login/register broken
- Logs show: `Cannot connect to MongoDB`

**Rollback**:
```bash
# 1. Revert backend deployment (Railway)
# Via dashboard: Deployments → Previous → Redeploy
# ✅ Time: <2 minutes

# 2. Check if MongoDB connection string changed
# If yes, restore previous connection string in Railway env vars

# 3. Verify
curl https://clarify-site-backend.up.railway.app/health
# Should return 200 OK
```

**Root Cause Investigation**:
- Check: MongoDB connection string in .env
- Check: Database schema changes (migrations)
- Check: New npm package breaking compatibility

---

### Scenario 3: Users cannot login (authentication broken)

**Symptoms**:
- Login returns "Invalid credentials" for correct passwords
- Register works, login fails
- JWT validation errors in logs

**Rollback**:
```bash
# 1. Revert backend deployment (Railway)
# Authentication logic likely changed

# 2. If JWT_SECRET changed accidentally:
# Restore previous JWT_SECRET in Railway env vars
# All existing tokens will be invalidated (users must re-login)

# 3. Verify
# Test login with known good credentials
curl -X POST https://clarify-site-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Root Cause Investigation**:
- Check: bcrypt hash rounds changed?
- Check: JWT signing algorithm changed?
- Check: JWT_SECRET accidentally rotated?

---

### Scenario 4: Data loss (users' data missing)

**Symptoms**:
- Users report missing profiles/data
- Database queries return fewer results than expected
- Recent data not found

**Rollback**:
```bash
# ⚠️ CRITICAL: Do NOT deploy further changes until resolved

# 1. Immediately stop backend (Railway)
# Dashboard → Settings → Pause deployment

# 2. Restore database from backup
mongorestore --uri="..." --archive=backups/latest.gz --drop

# 3. Verify data restored
# Check user count, recent records

# 4. Investigate root cause BEFORE restarting backend
# Likely: DELETE query without WHERE clause
# Check: Recent code changes in controllers/models

# 5. Once fixed, redeploy backend
```

**Root Cause Investigation**:
- Review all database write operations in recent deployment
- Check for missing WHERE clauses in DELETE/UPDATE
- Implement soft deletes to prevent future data loss

---

## 📊 Backup Strategy

### Automated Daily Backups:

**MongoDB Atlas** (Free Tier - Manual):
```bash
# Cron job (runs daily at 2 AM)
0 2 * * * /home/josue/scripts/backup_mongodb.sh
```

**Backup Script** (`backup_mongodb.sh`):
```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/home/josue/backups/clarify_site"
MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/clarify_site"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
mongodump --uri="$MONGODB_URI" \
  --gzip \
  --archive="$BACKUP_DIR/clarify_site_$DATE.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "clarify_site_*.gz" -mtime +7 -delete

echo "Backup completed: clarify_site_$DATE.gz"
```

**Retention Policy**:
- Daily backups: Keep last 7 days
- Weekly backups: Keep last 4 weeks
- Monthly backups: Keep last 3 months

---

## 🚨 Emergency Contacts

### Solo Developer:
- **Name**: Josué Amaral
- **Email**: josueamaral15@gmail.com
- **GitHub**: @JosueAmaral15

### Platform Support:
- **Vercel Support**: https://vercel.com/help
- **Railway Support**: https://railway.app/help
- **MongoDB Support**: https://support.mongodb.com

---

## 📈 Monitoring & Alerts

### Health Checks:
```bash
# Frontend health
curl https://clarify-site.vercel.app

# Backend health
curl https://clarify-site-backend.up.railway.app/health

# Database health (via backend)
curl https://clarify-site-backend.up.railway.app/api/health/db
```

### Uptime Monitoring (Optional):
- **UptimeRobot**: Free tier, 50 monitors, 5-min intervals
- **Pingdom**: Free tier, 1 monitor
- **Status Page**: https://uptimerobot.com (public status page)

---

## 📝 Rollback Log Template

After each rollback, document:

```markdown
## Rollback Log - [Date]

**Time**: [HH:MM UTC]
**Triggered By**: [Name/Automated]
**Reason**: [Brief description]

### Components Rolled Back:
- [ ] Frontend (Vercel) - Version X.Y.Z → X.Y.W
- [ ] Backend (Railway) - Commit abc123 → def456
- [ ] Database (MongoDB) - Backup 2026-01-01

### Impact:
- **Duration**: X minutes downtime
- **Users Affected**: ~X users
- **Data Loss**: None / [Description]

### Root Cause:
[Detailed explanation]

### Fix Applied:
[What was done to prevent recurrence]

### Lessons Learned:
- [Insight 1]
- [Insight 2]
```

---

## ✅ Rollback Readiness Checklist

Before each deployment:

- [ ] Verify last deployment is stable (no errors in logs)
- [ ] Confirm backup exists (<24h old)
- [ ] Test rollback procedure in staging (if exists)
- [ ] Note current versions (frontend/backend/db)
- [ ] Document changes in deployment
- [ ] Ensure CI/CD tests passed
- [ ] Plan rollback window (off-peak hours if possible)

---

## 🎯 Success Criteria

**Rollback is successful when**:
- ✅ Frontend loads without errors
- ✅ Backend API returns 200 OK
- ✅ Users can login/register
- ✅ Database queries work correctly
- ✅ No data loss
- ✅ System stable for >5 minutes

---

**Last Updated**: January 01, 2026  
**Next Review**: Before first production deployment  
**Protocol**: Simplicity 3 - Step 12.5 (MANDATORY)  
**Estimated Rollback Time**: **<5 minutes** ✅
