# Maintenance Guide - Clarify Site

## Overview

This guide provides instructions for maintaining and updating the Clarify Site application.

---

## Regular Maintenance Tasks

### Daily Tasks

#### Monitor Application Health

```bash
# Check backend status
pm2 status clarify-backend
pm2 monit

# Check logs for errors
pm2 logs clarify-backend --lines 100 | grep -i error

# Check disk space
df -h

# Check memory usage
free -m
```

#### Review Error Logs

```bash
# Backend logs
tail -f backend/logs/error.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u clarify-backend -n 50
```

### Weekly Tasks

#### Update Dependencies

```bash
# Check for outdated packages
cd backend && npm outdated
cd frontend && npm outdated

# Update minor/patch versions
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

#### Database Maintenance

```bash
# Check database size
mongo
use clarify_prod
db.stats()

# Check collection sizes
db.contacts.stats()
db.downloads.stats()

# Compact database
db.runCommand({ compact: 'contacts' })
db.runCommand({ compact: 'downloads' })
```

#### Backup Verification

```bash
# Verify latest backup exists
ls -lh /backups/ | head

# Test restore (on test environment)
mongorestore --uri="mongodb://localhost:27017/test_restore" /backups/latest
```

### Monthly Tasks

#### Security Updates

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Update Node.js
nvm install --lts
nvm use --lts

# Update global packages
npm update -g npm
npm update -g pm2
```

#### Performance Review

```bash
# Run Lighthouse audit
lighthouse https://your-domain.com --view

# Check bundle sizes
cd frontend
npm run build -- --analyze

# Review API response times
# Check logs for slow queries
grep "slow query" backend/logs/app.log
```

#### Certificate Renewal

```bash
# Check SSL certificate expiration
sudo certbot certificates

# Renew if needed (auto-renews with cron)
sudo certbot renew --dry-run
```

---

## Database Maintenance

### Cleaning Old Data

#### Remove Old Contacts (90+ days)

```javascript
// MongoDB shell
use clarify_prod

db.contacts.deleteMany({
  status: 'resolved',
  createdAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
})
```

#### Archive Old Downloads

```javascript
// Move old downloads to archive collection
db.downloads.aggregate([
  { $match: { timestamp: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
  { $out: 'downloads_archive' }
])

// Remove from main collection
db.downloads.deleteMany({
  timestamp: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
})
```

### Database Optimization

```javascript
// Rebuild indexes
db.contacts.reIndex()
db.downloads.reIndex()

// Check index usage
db.contacts.aggregate([{ $indexStats: {} }])

// Remove unused indexes
db.contacts.dropIndex('old_index_name')
```

### Database Backup

```bash
# Manual backup
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out=/backups/manual_$DATE

# Automated backup script
cat > /scripts/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
MONGODB_URI="your-mongodb-uri"

# Create backup
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/mongo_$DATE"

# Compress
tar -czf "$BACKUP_DIR/mongo_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE"
rm -rf "$BACKUP_DIR/mongo_$DATE"

# Keep only last 30 backups
ls -t $BACKUP_DIR/mongo_*.tar.gz | tail -n +31 | xargs rm -f

# Upload to cloud (optional)
# aws s3 cp "$BACKUP_DIR/mongo_$DATE.tar.gz" s3://your-bucket/backups/
EOF

chmod +x /scripts/backup-db.sh

# Add to cron (daily at 2 AM)
crontab -e
0 2 * * * /scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

---

## Log Management

### Log Rotation

Create `/etc/logrotate.d/clarify`:

```
/var/log/clarify/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Log Analysis

```bash
# Count errors by type
grep ERROR backend/logs/app.log | cut -d' ' -f5 | sort | uniq -c | sort -rn

# Find slow requests (>1s)
grep "Response time" backend/logs/app.log | awk '$NF > 1000' | tail -20

# Top IP addresses
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10
```

---

## Performance Monitoring

### Application Metrics

```bash
# Install monitoring tools
npm install -g clinic

# Profile CPU
clinic doctor -- node backend/dist/server.js

# Profile memory
clinic heapprofiler -- node backend/dist/server.js

# Profile I/O
clinic bubbleprof -- node backend/dist/server.js
```

### Database Monitoring

```javascript
// Enable profiling
db.setProfilingLevel(1, { slowms: 100 })

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 }).limit(10)

// Current operations
db.currentOp()

// Server status
db.serverStatus()
```

### System Monitoring

```bash
# Install monitoring stack
sudo apt install -y prometheus node-exporter grafana

# Or use cloud services
# - DataDog
# - New Relic
# - Sentry (error tracking)
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 status
pm2 status

# View error logs
pm2 logs clarify-backend --err --lines 50

# Restart application
pm2 restart clarify-backend

# Check port availability
lsof -i :5000

# Verify environment variables
pm2 env clarify-backend
```

### Database Connection Issues

```bash
# Test connection
mongo "$MONGODB_URI"

# Check network
ping your-db-host

# Verify credentials
# Check .env file

# Check IP whitelist (MongoDB Atlas)
# Add current server IP
```

### High Memory Usage

```bash
# Check memory usage
free -m
pm2 monit

# Restart application
pm2 restart clarify-backend

# Check for memory leaks
node --inspect backend/dist/server.js
# Use Chrome DevTools for debugging
```

### Slow Response Times

```bash
# Check database indexes
db.contacts.getIndexes()

# Enable query profiling
db.setProfilingLevel(2)

# Check for long-running queries
db.currentOp({ "active": true, "secs_running": { $gt: 1 } })

# Review N+1 queries in code
# Add caching layer if needed
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Restart nginx
sudo systemctl restart nginx

# Check certificate validity
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

---

## Updating the Application

### Minor Updates

```bash
# Pull latest code
git pull origin main

# Backend update
cd backend
npm install
npm run build
pm2 restart clarify-backend

# Frontend update
cd frontend
npm install
npm run build
# Nginx serves static files automatically
```

### Major Updates

```bash
# Create backup first
./scripts/backup-db.sh

# Stop application
pm2 stop clarify-backend

# Pull updates
git pull origin main

# Update dependencies
cd backend && npm ci
cd ../frontend && npm ci

# Run migrations (if any)
npm run migrate

# Build
cd backend && npm run build
cd ../frontend && npm run build

# Restart
pm2 restart clarify-backend

# Verify
curl http://localhost:5000/api/health
```

### Rollback Procedure

```bash
# Stop application
pm2 stop clarify-backend

# Revert to previous version
git log --oneline -10
git checkout <previous-commit-hash>

# Reinstall dependencies
cd backend && npm ci && npm run build
cd frontend && npm ci && npm run build

# Restore database (if needed)
mongorestore --uri="$MONGODB_URI" --drop /backups/before-update

# Restart
pm2 restart clarify-backend
```

---

## Scaling

### Vertical Scaling (Single Server)

```bash
# Increase PM2 instances
pm2 scale clarify-backend +2

# Or use max CPU cores
pm2 delete clarify-backend
pm2 start ecosystem.config.js --env production
```

### Horizontal Scaling (Multiple Servers)

1. **Load Balancer Setup** (Nginx)

```nginx
upstream backend_servers {
    least_conn;
    server 10.0.0.1:5000 weight=1;
    server 10.0.0.2:5000 weight=1;
    server 10.0.0.3:5000 weight=1;
}

server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://backend_servers;
        proxy_next_upstream error timeout http_500;
    }
}
```

2. **Shared Database** - Use MongoDB Atlas or replica set

3. **Shared Sessions** - Use Redis for session storage

4. **Shared File Storage** - Use S3 or NFS

---

## Security Maintenance

### Regular Security Checks

```bash
# Check for vulnerabilities
npm audit

# Update dependencies with vulnerabilities
npm audit fix

# Check for outdated packages with known issues
npx npm-check-updates -u
```

### Review Access Logs

```bash
# Suspicious activity
grep "401\|403\|404" /var/log/nginx/access.log | tail -100

# Rate limiting violations
grep "rate limit" /var/log/nginx/error.log

# Failed login attempts
grep "login failed" backend/logs/app.log | wc -l
```

### Update Security Headers

```typescript
// backend/src/middleware/security.ts
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
})
```

---

## Documentation Updates

### Keep Documentation Current

- Update README when adding features
- Document API changes in API_REFERENCE.md
- Update CHANGELOG.md for all releases
- Keep deployment guides accurate
- Document configuration changes

### Version Documentation

```bash
# Tag releases
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin v1.2.0

# Update CHANGELOG
cat >> CHANGELOG.md << EOF
## [1.2.0] - $(date +%Y-%m-%d)
### Added
- New feature X
### Fixed
- Bug Y
EOF
```

---

## Health Checks

### Automated Health Check Script

```bash
#!/bin/bash
# /scripts/health-check.sh

# Check backend
if ! curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "Backend unhealthy, restarting..."
    pm2 restart clarify-backend
    # Send alert
fi

# Check database
if ! mongo "$MONGODB_URI" --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "Database connection failed!"
    # Send alert
fi

# Check disk space
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage above 80%: $DISK_USAGE%"
    # Send alert
fi
```

Add to cron (every 5 minutes):
```bash
*/5 * * * * /scripts/health-check.sh >> /var/log/health-check.log 2>&1
```

---

## Support Contacts

- **Development Team:** dev@clarify.com
- **Infrastructure:** ops@clarify.com
- **Security Issues:** security@clarify.com
- **On-Call:** +1-XXX-XXX-XXXX

---

## Additional Resources

- [MongoDB Operations Checklist](https://docs.mongodb.com/manual/administration/production-checklist-operations/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Optimization](https://www.nginx.com/blog/tuning-nginx/)
