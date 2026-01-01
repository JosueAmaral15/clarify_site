# OWASP Top 10 Security Checklist - Clarify Site

**Author**: Josué Amaral  
**Created**: January 01, 2026  
**Protocol**: Simplicity Protocol 3 - Step 6.5 (MANDATORY)  
**Status**: 🔄 In Progress

---

## ⚠️ CRITICAL NOTE

This checklist is **MANDATORY** per Simplicity Protocol 3 (Step 6.5).  
All items must be verified before production deployment.

---

## 🎯 OWASP Top 10 (2021 Edition)

### A01:2021 - Broken Access Control ⭐ CRITICAL

**Risk**: Users can act outside their permissions

#### Backend Checklist:
- [ ] JWT token validation on all protected routes
- [ ] Role-Based Access Control (RBAC) implemented
- [ ] Admin routes require `role: 'admin'`
- [ ] Users can only access/modify their own data
- [ ] File uploads restricted by user permissions
- [ ] API rate limiting per user

#### Frontend Checklist:
- [ ] Protected routes redirect unauthenticated users
- [ ] UI elements hidden based on user role
- [ ] Client-side checks (backup only, not security)

**Implementation**:
```typescript
// backend/src/middleware/auth.ts
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};
```

---

### A02:2021 - Cryptographic Failures ⭐ CRITICAL

**Risk**: Sensitive data exposed due to weak encryption

#### Checklist:
- [ ] **HTTPS enforced** in production (Vercel/Railway auto-https)
- [ ] Passwords hashed with **bcrypt** (12+ rounds)
- [ ] JWT secret stored in `.env` (never committed)
- [ ] MongoDB connection string encrypted
- [ ] No sensitive data in logs
- [ ] Secure cookies (`httpOnly`, `secure`, `sameSite`)

**Implementation**:
```typescript
// backend/src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string, 
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

**Cookie Configuration**:
```typescript
res.cookie('auth_token', token, {
  httpOnly: true,      // Prevent XSS access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

---

### A03:2021 - Injection ⭐ CRITICAL

**Risk**: SQL/NoSQL injection, command injection

#### Checklist:
- [ ] **All user inputs validated** (Zod schemas)
- [ ] MongoDB uses **parameterized queries** (Mongoose methods)
- [ ] No `eval()` or `Function()` with user input
- [ ] No shell commands with user input
- [ ] File paths sanitized (no `../` path traversal)
- [ ] Content-Type validation for uploads

**Implementation**:
```typescript
// backend/src/validation/user.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special char'),
  name: z.string().min(2).max(50)
});

// backend/src/middleware/validate.ts
export const validate = (schema: ZodSchema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };
};
```

**Safe Mongoose Query**:
```typescript
// ✅ SAFE - Parameterized
const user = await User.findOne({ email: req.body.email });

// ❌ UNSAFE - Never do this
const user = await User.findOne(req.body); // Can inject $where, $regex
```

---

### A04:2021 - Insecure Design ⭐ HIGH

**Risk**: Flawed architecture allows attacks

#### Checklist:
- [ ] **Rate limiting** on all routes (express-rate-limit)
- [ ] **CSRF tokens** on state-changing operations
- [ ] **Security headers** (Helmet.js)
- [ ] Account lockout after failed login attempts
- [ ] Email verification for registration
- [ ] Strong password policy enforced

**Implementation**:
```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const securityMiddleware = (app: Express) => {
  // Helmet - Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true
    }
  }));

  // CORS - Whitelist frontend origin
  app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  }));

  // Rate limiting - Global
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later'
  });
  app.use(limiter);

  // Rate limiting - Auth routes (stricter)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 min
    message: 'Too many login attempts'
  });
  app.use('/api/auth', authLimiter);
};
```

---

### A05:2021 - Security Misconfiguration ⭐ HIGH

**Risk**: Default configs, verbose errors

#### Checklist:
- [ ] Environment-specific configs (`.env` files)
- [ ] No default passwords or API keys
- [ ] Error messages don't leak stack traces in production
- [ ] Unused dependencies removed
- [ ] CORS restricted to specific origins
- [ ] MongoDB not publicly accessible

**Implementation**:
```typescript
// backend/src/middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log internally

  // Production: Hide stack trace
  if (process.env.NODE_ENV === 'production') {
    res.status(err.status || 500).json({
      error: 'Internal server error'
    });
  } else {
    // Development: Show details
    res.status(err.status || 500).json({
      error: err.message,
      stack: err.stack
    });
  }
};
```

**Environment Variables**:
```bash
# .env.example
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
FRONTEND_URL=https://clarify-site.vercel.app
```

---

### A06:2021 - Vulnerable and Outdated Components ⭐ HIGH

**Risk**: Using libraries with known vulnerabilities

#### Checklist:
- [ ] Run `npm audit` before every deployment
- [ ] Automated Dependabot alerts enabled
- [ ] Dependencies updated regularly (monthly)
- [ ] No dependencies with HIGH/CRITICAL vulnerabilities
- [ ] Lock files committed (`package-lock.json`)

**Commands**:
```bash
# Check for vulnerabilities
npm audit

# Auto-fix (if possible)
npm audit fix

# Force fix (breaking changes)
npm audit fix --force
```

**GitHub Actions** (auto-check):
```yaml
# .github/workflows/security-audit.yml
name: Security Audit
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run npm audit
        run: |
          cd backend && npm audit --audit-level=high
          cd ../frontend && npm audit --audit-level=high
```

---

### A07:2021 - Identification and Authentication Failures ⭐ CRITICAL

**Risk**: Broken authentication allows account takeover

#### Checklist:
- [ ] Multi-factor authentication (2FA) available
- [ ] Password reset requires email verification
- [ ] Session tokens expire (JWT `exp` claim)
- [ ] Token refresh mechanism implemented
- [ ] Brute force protection (rate limiting)
- [ ] No predictable user IDs (use UUIDs)

**Implementation**:
```typescript
// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' } // 7 days expiry
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_SECRET!,
    { expiresIn: '30d' } // 30 days expiry
  );
};
```

---

### A08:2021 - Software and Data Integrity Failures ⭐ MEDIUM

**Risk**: Unsigned updates, insecure CI/CD

#### Checklist:
- [ ] Code review before merging (solo dev: self-review)
- [ ] Signed Git commits (optional but recommended)
- [ ] Dependencies verified (lock files)
- [ ] CI/CD secrets stored securely (GitHub Secrets)
- [ ] No credentials in code or logs

---

### A09:2021 - Security Logging and Monitoring Failures ⭐ MEDIUM

**Risk**: Attacks not detected or logged

#### Checklist:
- [ ] **Winston** logger configured
- [ ] Log authentication attempts (success/failure)
- [ ] Log admin actions
- [ ] Log 4xx/5xx errors
- [ ] Logs sent to external service (optional: LogRocket, Sentry)
- [ ] No sensitive data in logs (passwords, tokens)

**Implementation**:
```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

### A10:2021 - Server-Side Request Forgery (SSRF) ⭐ MEDIUM

**Risk**: Server makes requests to internal systems

#### Checklist:
- [ ] Validate all URLs before external requests
- [ ] Whitelist allowed domains for external API calls
- [ ] No user-controlled URLs in fetch/axios
- [ ] Network segmentation (if using internal services)

**Implementation**:
```typescript
// backend/src/utils/httpClient.ts
const ALLOWED_DOMAINS = [
  'api.github.com',
  'oauth.google.com'
];

export const isAllowedUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ALLOWED_DOMAINS.some(domain => 
      parsed.hostname.endsWith(domain)
    );
  } catch {
    return false;
  }
};

export const safeFetch = async (url: string) => {
  if (!isAllowedUrl(url)) {
    throw new Error('URL not in whitelist');
  }
  return fetch(url);
};
```

---

## ✅ Verification Checklist

Before production deployment:

- [ ] All 10 OWASP categories addressed
- [ ] Security tests pass (penetration testing optional)
- [ ] Code review completed
- [ ] Dependencies audited (`npm audit`)
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] Rate limiting tested
- [ ] Authentication tested (login/logout/reset)
- [ ] Authorization tested (RBAC)
- [ ] Input validation tested (invalid data rejected)

---

## 📊 Security Score

**Target**: 10/10 categories implemented  
**Current**: 0/10 (🔴 Not Started)  
**Status**: ⏳ Pending Implementation

---

## 📚 Resources

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: January 01, 2026  
**Next Review**: After Sprint 1 (Security Implementation)  
**Protocol**: Simplicity 3 - Step 6.5 (MANDATORY)
