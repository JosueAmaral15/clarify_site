# Deployment Guide - Clarify Site

## Overview

This guide covers deploying the Clarify Site full-stack application to production environments.

---

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Domain name configured
- SSL certificate
- Git repository access

---

## Environment Variables

### Backend (.env)

Create `/backend/.env.production`:

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clarify_prod

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=https://your-domain.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.production)

Create `/frontend/.env.production`:

```env
VITE_API_URL=https://your-domain.com/api
```

---

## Deployment Options

### Option 1: Traditional Server (VPS/Dedicated)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Clone and Build

```bash
# Clone repository
git clone https://github.com/your-repo/clarify_site.git
cd clarify_site

# Backend setup
cd backend
npm install --production
npm run build

# Frontend setup
cd ../frontend
npm install
npm run build
```

#### 3. PM2 Configuration

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'clarify-backend',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

Start application:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 4. Nginx Configuration

Create `/etc/nginx/sites-available/clarify`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /path/to/clarify_site/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/clarify /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Setup

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

---

### Option 2: Docker Deployment

#### 1. Backend Dockerfile

Create `/backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

#### 2. Frontend Dockerfile

Create `/frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Frontend nginx.conf:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 3. Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped

volumes:
  mongo-data:
```

Deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

### Option 3: Cloud Platforms

#### Vercel (Frontend)

```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Heroku (Backend)

Create `Procfile` in backend:

```
web: node dist/server.js
```

Deploy:

```bash
cd backend
heroku create clarify-backend
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
```

#### Railway / Render

Both platforms support automatic deployment from Git repositories. Simply:
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster
3. Create database user
4. Whitelist your server IP
5. Get connection string
6. Update `MONGODB_URI` in environment variables

### Self-hosted MongoDB

```bash
# Install MongoDB
sudo apt install -y mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["root"]
})
```

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW)
- [ ] Set up MongoDB authentication
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure environment variables
- [ ] Enable security headers
- [ ] Regular backups
- [ ] Monitor logs

---

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs clarify-backend
pm2 status
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Check resource usage
htop
df -h
free -m
```

---

## Backup Strategy

### Database Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out=/backups/mongo_$DATE

# Add to cron
crontab -e
0 2 * * * /path/to/backup-script.sh
```

### Application Backup

```bash
# Backup application files
tar -czf clarify_backup_$(date +%Y%m%d).tar.gz /path/to/clarify_site
```

---

## Rollback Procedure

```bash
# Stop application
pm2 stop clarify-backend

# Restore previous version
git checkout previous-tag
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build

# Restart
pm2 restart clarify-backend
```

---

## Performance Optimization

1. **Enable Gzip compression** (Nginx)
2. **Use CDN** for static assets
3. **Enable caching** headers
4. **Optimize images** before deployment
5. **Use PM2 cluster mode**
6. **Database indexing**
7. **Monitor and optimize queries**

---

## Troubleshooting

### Backend not starting
```bash
pm2 logs clarify-backend --lines 100
```

### Database connection issues
```bash
# Test MongoDB connection
mongo "$MONGODB_URI"
```

### Frontend not loading
```bash
sudo nginx -t
sudo systemctl status nginx
```

### SSL issues
```bash
sudo certbot renew --dry-run
```

---

## Maintenance

### Update Dependencies
```bash
npm audit
npm update
```

### Renew SSL
```bash
sudo certbot renew
```

### Monitor Logs
```bash
pm2 logs --lines 1000
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Support

For deployment issues, contact: support@clarify.com
