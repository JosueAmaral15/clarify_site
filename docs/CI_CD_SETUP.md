# CI/CD Pipeline Documentation

**Author**: Josué Amaral  
**Created**: January 04, 2026  
**Sprint 7**: CI/CD & Testing  

---

## Implemented Workflows

### 1. Frontend CI (`.github/workflows/frontend-ci.yml`)
- ESLint + TypeScript + Vitest
- Build verification
- Security audit
- Coverage reporting pending a compatible Vitest coverage provider

### 2. Backend CI (`.github/workflows/backend-ci.yml`)
- ESLint + TypeScript + Jest
- MongoDB integration tests
- Security audit (high level)
- Coverage reports

### 3. Deployment (Vercel Git Integration)
- One Vercel project builds the frontend and backend services from the root
- Pull requests create Preview deployments
- Pushes to `main` create Production deployments
- No production deployment token is exposed to GitHub Actions

---

## 🧪 Testing

**Backend**: Jest + Supertest  
**Frontend**: Vitest + React Testing Library  
**Coverage Goals**: Backend >85%, Frontend >80%

---

**Status**: CI workflows configured; Vercel Git integration validation pending
