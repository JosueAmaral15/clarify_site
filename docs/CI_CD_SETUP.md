# CI/CD Pipeline Documentation

**Author**: Josué Amaral  
**Created**: January 04, 2026  
**Sprint 7**: CI/CD & Testing  

---

## ✅ Implemented Workflows

### 1. Frontend CI (`.github/workflows/frontend-ci.yml`)
- ESLint + TypeScript + Vitest
- Build verification
- Security audit
- Coverage reports

### 2. Backend CI (`.github/workflows/backend-ci.yml`)
- ESLint + TypeScript + Jest
- MongoDB integration tests
- Security audit (high level)
- Coverage reports

### 3. Deploy (`.github/workflows/deploy.yml`)
- Auto-deploy frontend to Vercel
- Auto-deploy backend to Railway

---

## 🧪 Testing

**Backend**: Jest + Supertest  
**Frontend**: Vitest + React Testing Library  
**Coverage Goals**: Backend >85%, Frontend >80%

---

**Status**: ✅ Complete
