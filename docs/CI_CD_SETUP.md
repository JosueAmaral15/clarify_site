# CI/CD Setup - Clarify Site

**Author**: Josué Amaral  
**Created**: January 01, 2026  
**Protocol**: Simplicity Protocol 3 - Step 10.6 (MANDATORY)  
**Status**: 📋 Planned

---

## ⚠️ CRITICAL NOTE

CI/CD pipeline is **MANDATORY** per Simplicity Protocol 3 (Step 10.6).  
Automated quality gates prevent bad code from reaching production.

---

## 🎯 CI/CD Overview

### Pipeline Architecture:

```
┌─────────────────────────────────────────────────────────────┐
│  Developer                                                    │
│  ├── Write code                                              │
│  ├── Run tests locally                                        │
│  └── git push origin feature/xyz                             │
└──────────────────┬────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions (CI)                                         │
│  ├── Install dependencies                                     │
│  ├── Run ESLint + Prettier                                   │
│  ├── Run TypeScript check                                    │
│  ├── Run tests (Jest/Vitest)                                │
│  ├── Run security audit (npm audit)                         │
│  └── Build verification                                       │
└──────────────────┬────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Status Check                                                 │
│  ├── ✅ All checks passed → Allow merge                      │
│  └── ❌ Any check failed → Block merge                       │
└──────────────────┬────────────────────────────────────────────┘
                   │
                   ▼ (PR merged to main)
┌─────────────────────────────────────────────────────────────┐
│  GitHub Actions (CD)                                         │
│  ├── Deploy frontend → Vercel                                │
│  └── Deploy backend → Railway                                │
└──────────────────┬────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│  Production (Live)                                            │
│  ├── https://clarify-site.vercel.app                        │
│  └── https://clarify-site-backend.up.railway.app            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Quality Gates (Checks)

### Frontend Checks:
1. ✅ **Linting** (ESLint) - Code style enforcement
2. ✅ **Formatting** (Prettier) - Consistent formatting
3. ✅ **Type Checking** (tsc --noEmit) - TypeScript validation
4. ✅ **Unit Tests** (Vitest) - Component/logic tests
5. ✅ **Build Verification** (vite build) - Ensure app builds
6. ✅ **Security Audit** (npm audit) - Dependency vulnerabilities

### Backend Checks:
1. ✅ **Linting** (ESLint) - Code style enforcement
2. ✅ **Formatting** (Prettier) - Consistent formatting
3. ✅ **Type Checking** (tsc --noEmit) - TypeScript validation
4. ✅ **Unit Tests** (Jest) - API endpoint tests
5. ✅ **Integration Tests** (Jest + Supertest) - E2E API tests
6. ✅ **Security Audit** (npm audit --audit-level=high) - Critical vulnerabilities

---

## 🔧 GitHub Actions Workflows

### 1. Frontend CI Workflow

**File**: `.github/workflows/frontend-ci.yml`

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: TypeScript type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:ci
        env:
          CI: true

      - name: Build verification
        run: npm run build

      - name: Security audit
        run: npm audit --audit-level=moderate
        continue-on-error: true  # Don't fail build, just warn

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend
```

---

### 2. Backend CI Workflow

**File**: `.github/workflows/backend-ci.yml`

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    services:
      mongodb:
        image: mongo:7
        ports:
          - 27017:27017
        options: >-
          --health-cmd "mongosh --eval 'db.runCommand({ ping: 1 })'"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run Prettier check
        run: npm run format:check

      - name: TypeScript type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:ci
        env:
          CI: true
          MONGODB_URI: mongodb://localhost:27017/clarify_test
          JWT_SECRET: test-secret-key-for-ci-only

      - name: Run integration tests
        run: npm run test:integration
        env:
          CI: true
          MONGODB_URI: mongodb://localhost:27017/clarify_test
          JWT_SECRET: test-secret-key-for-ci-only

      - name: Security audit (HIGH/CRITICAL only)
        run: npm audit --audit-level=high

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json
          flags: backend
```

---

### 3. Deploy Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## 🔐 Secrets Configuration

### GitHub Secrets (Repository Settings → Secrets):

```bash
# Vercel
VERCEL_TOKEN=xxx               # Get from Vercel dashboard
VERCEL_ORG_ID=xxx              # From .vercel/project.json
VERCEL_PROJECT_ID=xxx          # From .vercel/project.json

# Railway
RAILWAY_TOKEN=xxx              # Get from Railway dashboard

# Optional: Codecov
CODECOV_TOKEN=xxx              # For coverage reports
```

---

## 📦 Package.json Scripts

### Frontend (`frontend/package.json`):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### Backend (`backend/package.json`):

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext ts --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",
    "test": "jest --watchAll",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:integration": "jest --testMatch='**/*.integration.test.ts' --runInBand"
  }
}
```

---

## 🧪 Testing Configuration

### Frontend (Vitest)

**File**: `frontend/vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}'
      ],
      threshold: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
```

### Backend (Jest)

**File**: `backend/jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/test/**',
    '!src/types/**'
  ],
  coverageThreshold: {
    global: {
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85
    }
  },
  coverageReporters: ['text', 'lcov', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts']
};
```

---

## 🚦 Branch Protection Rules

### GitHub Branch Protection (main branch):

```yaml
Settings → Branches → Add rule for 'main'

Required:
☑ Require a pull request before merging
  ☑ Require approvals: 1 (solo dev: auto-approve or skip)
  ☑ Dismiss stale reviews
  
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date
  ☑ Status checks:
     - frontend-ci / lint-and-test
     - backend-ci / lint-and-test
     
☑ Require conversation resolution before merging

☑ Include administrators (optional for solo dev)

☐ Allow force pushes (NOT RECOMMENDED)
☐ Allow deletions (NOT RECOMMENDED)
```

---

## 📊 Monitoring & Notifications

### Slack Notifications (Optional):

```yaml
# Add to workflows
- name: Slack notification on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'CI/CD pipeline failed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications:

GitHub automatically sends email on workflow failures to repository owner.

---

## 🎯 Deployment Strategy

### Environment Tiers:

1. **Development** (local)
   - Run locally: `npm run dev`
   - MongoDB: Local instance or Atlas dev cluster
   - No CI/CD

2. **Staging/Preview** (optional)
   - Vercel: PR previews (automatic)
   - Railway: PR deployments (manual)
   - Triggered on: Pull requests

3. **Production**
   - Vercel: https://clarify-site.vercel.app
   - Railway: https://clarify-site-backend.up.railway.app
   - Triggered on: Push to `main`
   - MongoDB Atlas: Production cluster

---

## 🔄 Deployment Flow

```
┌─────────────────┐
│  Feature Branch │
│  feature/auth   │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│  GitHub Actions │
│  Run CI checks  │
└────────┬────────┘
         │
         │ ✅ Pass
         ▼
┌─────────────────┐
│  Pull Request   │
│  to main        │
└────────┬────────┘
         │
         │ Merge
         ▼
┌─────────────────┐
│  main branch    │
└────────┬────────┘
         │
         │ Auto-trigger
         ▼
┌─────────────────┐
│  Deploy Actions │
│  Vercel+Railway │
└────────┬────────┘
         │
         │ Deploy
         ▼
┌─────────────────┐
│  Production 🚀  │
└─────────────────┘
```

---

## ⏱️ Pipeline Performance

### Target Times:

| Check | Frontend | Backend |
|-------|----------|---------|
| Checkout | <10s | <10s |
| Install deps | 30-60s | 30-60s |
| Linting | 10-20s | 10-20s |
| Type check | 10-20s | 10-20s |
| Tests | 30-60s | 1-2min |
| Build | 30-60s | 20-40s |
| **Total** | **2-4 min** | **3-5 min** |

### Optimization Tips:
- Use `npm ci` instead of `npm install` (faster, deterministic)
- Cache `node_modules` with `actions/setup-node@v3` cache
- Run jobs in parallel when possible
- Use `--maxWorkers=2` for Jest in CI (limit CPU usage)

---

## 📋 Pre-Production Checklist

Before enabling CI/CD:

- [ ] All GitHub secrets configured
- [ ] Branch protection rules enabled
- [ ] Workflow files committed (`.github/workflows/*.yml`)
- [ ] Package.json scripts complete
- [ ] Testing configuration complete
- [ ] Vercel project linked to GitHub
- [ ] Railway project linked to GitHub
- [ ] MongoDB Atlas production cluster ready
- [ ] Environment variables set in Vercel/Railway

---

## ✅ Success Criteria

CI/CD is successful when:
- ✅ All PRs run automated checks
- ✅ Failed checks block merging
- ✅ Merge to `main` auto-deploys to production
- ✅ Deployment takes <10 minutes
- ✅ Zero manual deployment steps
- ✅ Rollback possible within 5 minutes

---

**Last Updated**: January 01, 2026  
**Next Review**: After Sprint 1 (Infrastructure)  
**Protocol**: Simplicity 3 - Step 10.6 (MANDATORY)  
**Status**: 📋 Ready to Implement
