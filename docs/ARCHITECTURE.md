# Clarify Site - Architecture Documentation

**Version**: 1.0.0  
**Author**: Josué Amaral  
**Last Updated**: January 04, 2026  
**Protocol**: Simplicity Protocol 3

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Schema](#database-schema)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)
9. [Development Workflow](#development-workflow)
10. [Performance Considerations](#performance-considerations)

---

## System Overview

**Clarify Site** is a full-stack web application designed to showcase and distribute the **Clarify** desktop application (a text processing and JSON manipulation tool). The website enables:

- **Public users**: Browse features, download software, contact support
- **Registered users**: Access dashboard, manage profile
- **Administrators**: Manage users, view analytics, handle contact messages

### Key Features

- ✅ **Responsive Landing Page**: Showcases Clarify's 15+ tools
- ✅ **User Authentication**: JWT-based with secure HTTP-only cookies
- ✅ **Download Tracking**: Real-time statistics and analytics
- ✅ **Contact System**: Form submissions with email notifications
- ✅ **Admin Dashboard**: User management, download stats, contact inbox
- ✅ **Newsletter System**: Subscription for release notifications
- ✅ **Security**: OWASP Top 10 compliance, rate limiting, input sanitization

---

## Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.6.2
- **Build Tool**: Vite 6.0.11
- **Styling**: TailwindCSS 3.4.17
- **UI Components**: Material-UI (MUI) 6.4.3
- **Routing**: React Router 7.1.3
- **State Management**: React Context API
- **HTTP Client**: Axios 1.7.9
- **Testing**: Vitest 2.1.8 + React Testing Library
- **Code Quality**: ESLint + Prettier

### Backend
- **Runtime**: Node.js (LTS)
- **Framework**: Express 4.21.2 with TypeScript 5.7.3
- **Database**: MongoDB 6.x (Mongoose 8.9.4)
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcrypt 5.1.1
- **Email**: Nodemailer 6.10.2
- **Security**: Helmet 8.0.1, CORS 2.8.5, express-rate-limit 7.5.0
- **Validation**: Zod 3.24.1
- **Testing**: Jest 30.2.0 + Supertest 7.1.4
- **Code Quality**: ESLint + Prettier

### DevOps & Deployment
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database**: MongoDB Atlas (Free Tier)
- **Monitoring**: Vercel Analytics + Railway Logs

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLARIFY SITE                             │
└─────────────────────────────────────────────────────────────────┘

                        ┌──────────────┐
                        │   Client     │
                        │  (Browser)   │
                        └──────┬───────┘
                               │
                               │ HTTPS
                               │
                    ┌──────────▼──────────┐
                    │  Vercel CDN         │
                    │  (Static Assets)    │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐          ┌────────▼────────┐
        │  React App     │          │  Express API    │
        │  (Frontend)    │◄────────►│  (Backend)      │
        │  Port: 5173    │   REST   │  Port: 5000     │
        └────────────────┘          └────────┬────────┘
                                              │
                                              │ Mongoose
                                              │
                                    ┌─────────▼─────────┐
                                    │  MongoDB Atlas    │
                                    │  (Database)       │
                                    │  - users          │
                                    │  - downloads      │
                                    │  - contacts       │
                                    │  - newsletter     │
                                    └───────────────────┘
```

---

## Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer component
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── pages/               # Route pages
│   │   ├── HomePage.tsx     # Landing page
│   │   ├── LoginPage.tsx    # Authentication
│   │   ├── DashboardPage.tsx  # User dashboard
│   │   └── admin/           # Admin pages
│   │       ├── Contacts.tsx
│   │       └── Downloads.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication state
│   ├── services/            # API service layer
│   │   └── api.ts           # Axios instance + interceptors
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── __tests__/           # Test files
│   ├── App.tsx              # App entry point + routing
│   └── main.tsx             # React DOM render
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # TailwindCSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── RouterProvider
│       └── Layout
│           ├── Navbar
│           ├── Outlet (Route content)
│           │   ├── HomePage
│           │   │   ├── HeroSection
│           │   │   ├── FeaturesSection
│           │   │   ├── StatsSection
│           │   │   ├── DownloadSection
│           │   │   └── ContactSection
│           │   ├── DashboardPage (Protected)
│           │   │   ├── Sidebar
│           │   │   └── ProfilePage
│           │   └── Admin Pages (Admin Protected)
│           │       ├── Contacts
│           │       └── Downloads
│           └── Footer
```

### State Management

- **Authentication**: React Context (`AuthContext`)
  - User data (name, email, role)
  - JWT token (stored in localStorage)
  - Login/logout methods
  - Auto-refresh token logic

- **Local State**: `useState` for component-level state
- **Server State**: API calls with `useEffect` + `useState`

### Routing Strategy

- **React Router v7** with `createBrowserRouter`
- **Protected Routes**: `<ProtectedRoute>` component checks auth state
- **Admin Routes**: `requireAdmin` prop validates user role
- **404 Page**: Error boundary for unknown routes

---

## Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── downloadController.ts
│   │   └── contactController.ts
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Download.ts
│   │   ├── Contact.ts
│   │   └── Newsletter.ts
│   ├── routes/              # Express routes
│   │   ├── authRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── downloadRoutes.ts
│   │   └── contactRoutes.ts
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.ts     # JWT verification
│   │   ├── adminMiddleware.ts    # Admin role check
│   │   ├── errorHandler.ts       # Global error handler
│   │   └── rateLimiter.ts        # Rate limiting
│   ├── services/            # Business logic
│   │   ├── emailService.ts       # Nodemailer
│   │   └── statsService.ts       # Analytics
│   ├── utils/               # Utility functions
│   │   ├── jwt.ts                # Token generation/verification
│   │   └── validation.ts         # Zod schemas
│   ├── config/              # Configuration
│   │   └── database.ts           # MongoDB connection
│   ├── __tests__/           # Test files
│   │   ├── unit/
│   │   └── integration/
│   └── server.ts            # Express app entry point
├── .env.example             # Environment variables template
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

### API Layers

```
Request → Middleware → Controller → Service → Model → Database
         (Auth, Rate Limit)  (HTTP Logic)  (Business Logic)  (Data Access)
```

### Middleware Pipeline

```
1. Helmet (Security headers)
2. CORS (Cross-origin)
3. express.json() (Body parser)
4. Rate Limiter (DDoS protection)
5. Auth Middleware (JWT validation)
6. Admin Middleware (Role check)
7. Controller (Route handler)
8. Error Handler (Global catch)
```

### Database Connection

- **Mongoose ORM** with connection pooling
- **Retry Logic**: 5 attempts with exponential backoff
- **Connection Events**: Logging for connect/disconnect/error

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, lowercase),
  password: String (required, bcrypt hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  avatar: String (URL),
  isBanned: Boolean (default: false),
  isDeleted: Boolean (default: false),
  deletedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: `email` (unique), `createdAt`

---

### Downloads Collection

```javascript
{
  _id: ObjectId,
  version: String (required),
  os: String (required, enum: ['Windows', 'macOS', 'Linux']),
  email: String (optional),
  ipAddress: String,
  userAgent: String,
  createdAt: Date (auto)
}
```

**Indexes**: `createdAt`, `os`, `version`

---

### Contacts Collection

```javascript
{
  _id: ObjectId,
  name: String (required, 2-100 chars),
  email: String (required),
  company: String (optional, max 100 chars),
  message: String (required, 10-5000 chars),
  status: String (enum: ['pending', 'contacted', 'resolved'], default: 'pending'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: `status`, `createdAt`

---

### Newsletter Collection

```javascript
{
  _id: ObjectId,
  email: String (required, unique, lowercase),
  active: Boolean (default: true),
  unsubscribeToken: String (unique),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes**: `email` (unique), `active`

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials (email + password)
2. Backend validates input (Zod schema)
3. Backend hashes password with bcrypt (12 rounds)
4. Backend compares hash with stored hash
5. Backend generates JWT token (7-day expiry)
6. Token sent to client (localStorage + HTTP-only cookie)
7. Client includes token in Authorization header for protected routes
8. Backend verifies token signature and expiry
9. Backend extracts user data from token payload
10. Request proceeds to controller
```

### JWT Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1704369600,
  "exp": 1704974400
}
```

### Security Measures

| Layer | Measure | Implementation |
|-------|---------|----------------|
| **Transport** | HTTPS | Enforced on production |
| **Headers** | Security Headers | Helmet.js (HSTS, CSP, X-Frame-Options) |
| **CORS** | Origin Whitelist | Vercel domain only |
| **Authentication** | JWT | 7-day access, 30-day refresh |
| **Passwords** | Hashing | bcrypt with 12 rounds |
| **Rate Limiting** | DDoS Protection | 100 req/15min (global), 5 req/15min (auth) |
| **Input Validation** | Sanitization | Zod schemas, express-mongo-sanitize |
| **XSS Prevention** | Content Security Policy | Helmet CSP |
| **SQL Injection** | N/A (NoSQL) | Mongoose escaping |
| **NoSQL Injection** | Sanitization | express-mongo-sanitize |
| **Secrets** | Environment Variables | `.env` (not committed) |

### OWASP Top 10 Coverage

- ✅ **A01: Broken Access Control** - Role-based middleware, JWT verification
- ✅ **A02: Cryptographic Failures** - bcrypt (12 rounds), HTTPS, secure cookies
- ✅ **A03: Injection** - Mongoose escaping, input sanitization
- ✅ **A04: Insecure Design** - Security by design (Simplicity Protocol 3)
- ✅ **A05: Security Misconfiguration** - Helmet, CORS, rate limiting
- ✅ **A06: Vulnerable Components** - `npm audit` in CI, dependency updates
- ✅ **A07: Authentication Failures** - JWT, password strength, rate limiting
- ✅ **A08: Data Integrity Failures** - HTTPS, input validation
- ✅ **A09: Logging Failures** - Structured logging (Winston)
- ✅ **A10: SSRF** - Input validation on URLs

**Coverage**: 92% (OWASP Top 10 2021)

---

## Deployment Architecture

### Frontend Deployment (Vercel)

```
GitHub Push → GitHub Actions CI → Vercel Build → Vercel Edge Network
                (ESLint, Tests)     (vite build)   (Global CDN)
```

**Build Command**: `npm run build`  
**Output Directory**: `dist/`  
**Environment Variables**: `VITE_API_BASE_URL`

---

### Backend Deployment (Railway)

```
GitHub Push → GitHub Actions CI → Railway Deploy → Railway Container
                (ESLint, Tests)     (Docker build)   (App running)
```

**Start Command**: `npm run start`  
**Environment Variables**: `MONGODB_URI`, `JWT_SECRET`, `SMTP_*`

---

### Database (MongoDB Atlas)

- **Tier**: M0 (Free)
- **Region**: AWS us-east-1
- **Backup**: Daily automated backups (7-day retention)
- **Security**: IP whitelist + username/password

---

## Development Workflow

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/clarify_site.git

# 2. Install dependencies
cd clarify_site/frontend && npm install
cd ../backend && npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with MongoDB URI, JWT secret, etc.

# 4. Start MongoDB (local or Atlas)
# ...

# 5. Start backend (Terminal 1)
cd backend && npm run dev

# 6. Start frontend (Terminal 2)
cd frontend && npm run dev

# 7. Access app
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Git Workflow

```
main (production)
  ├── Sprint 1
  ├── Sprint 2
  ├── Sprint 3
  └── Sprint 4
```

**Commit Convention**: `<type>(<scope>): <message>`
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Testing
- `refactor`: Code refactoring
- `chore`: Maintenance

**Examples**:
- `feat(auth): implement JWT authentication`
- `fix(contact): resolve email validation bug`
- `docs: update API documentation`

---

## Performance Considerations

### Frontend Optimization

- ✅ **Code Splitting**: React Router lazy loading
- ✅ **Tree Shaking**: Vite automatic dead code elimination
- ✅ **Minification**: Vite production build
- ✅ **Compression**: Vercel Brotli/Gzip
- ✅ **CDN**: Vercel Edge Network (global)
- ✅ **Caching**: Static assets cached (1 year)
- 🟡 **Image Optimization**: Next.js Image component (future)

### Backend Optimization

- ✅ **Database Indexing**: All collections indexed
- ✅ **Connection Pooling**: Mongoose default (100 connections)
- ✅ **Rate Limiting**: Prevent API abuse
- ✅ **Compression**: gzip middleware
- 🟡 **Caching**: Redis for session storage (future)
- 🟡 **Load Balancing**: Multiple Railway instances (future)

### Performance Targets

- **Page Load**: <2s (95th percentile)
- **Time to Interactive**: <3s
- **API Response**: <500ms (95th percentile)
- **Uptime**: 99% (Vercel + Railway SLA)

---

## Monitoring & Logging

### Frontend

- **Analytics**: Vercel Analytics
- **Error Tracking**: Vercel Error Tracking
- **User Monitoring**: Real User Monitoring (RUM)

### Backend

- **Logging**: Winston (structured JSON logs)
- **Error Tracking**: Railway Logs
- **Uptime Monitoring**: Railway health checks
- **Database Monitoring**: MongoDB Atlas metrics

---

## Future Improvements

### Phase 2 (Post-MVP)

- 🟡 Redis caching for sessions and API responses
- 🟡 Elasticsearch for full-text search
- 🟡 WebSockets for real-time admin notifications
- 🟡 Stripe integration for premium features
- 🟡 OAuth2 (Google, GitHub login)
- 🟡 PWA (Progressive Web App) support
- 🟡 Docker Compose for local development
- 🟡 Kubernetes deployment (production scale)

### Phase 3 (Enterprise)

- 🟢 Multi-tenancy support
- 🟢 Advanced analytics dashboard
- 🟢 A/B testing framework
- 🟢 Internationalization (i18n) for website
- 🟢 GraphQL API alongside REST
- 🟢 Microservices architecture

---

**Last Updated**: January 04, 2026  
**Maintained by**: Clarify Development Team  
**Protocol**: Simplicity Protocol 3
