# Temporary Archive - Legacy Auth Files

**Date Archived**: January 11, 2026  
**Reason**: Dead code removal during Sprint 10 test coverage expansion

## Archived Files

### 1. `routes/auth.ts` (115 lines)
- **Original Path**: `backend/src/routes/auth.ts`
- **Description**: Legacy authentication routes with inline handlers
- **Status**: Not mounted in server.ts, replaced by `auth.routes.ts`
- **Coverage**: 40.42% (60 of 115 lines untested)
- **Functionality**: Register and login endpoints with inline bcrypt/jwt logic

### 2. `tests/auth.test.ts` (48 lines)
- **Original Path**: `backend/src/tests/auth.test.ts`
- **Description**: Basic validation tests for legacy auth routes
- **Status**: Only tests the archived routes, not needed
- **Tests**: 3 simple validation tests (missing fields, weak password)

## Why These Were Archived

**Duplicate Implementation Found:**
- ✅ **Active**: `auth.routes.ts` → `auth.controller.ts` (100% + 84.61% coverage)
- ❌ **Legacy**: `auth.ts` (40.42% coverage, not in use)

**Impact of Removal:**
- Removes 163 lines of dead code
- Improves overall test coverage by removing untested files
- Follows Simplicidade 3: Don't waste time testing dead code

## Active Auth Implementation

The current (active) authentication system uses:
- `backend/src/routes/auth.routes.ts` - Route definitions (31 lines, 100% coverage)
- `backend/src/controllers/auth.controller.ts` - Business logic (309 lines, 84.61% coverage)
- `backend/src/middleware/auth.ts` - Auth middleware (90 lines, 85.18% coverage)
- `backend/src/__tests__/integration/auth.test.ts` - Integration tests (424 lines, 23 tests)
- `backend/src/__tests__/unit/auth.test.ts` - Unit tests (89 lines, 14 tests)

## Recovery Instructions

If these files need to be restored:
```bash
# From repository root
cp temporary-archive/routes/auth.ts backend/src/routes/
cp temporary-archive/tests/auth.test.ts backend/src/tests/
```

## Permanent Deletion

After confirming the application works correctly without these files, this archive folder can be safely deleted.
