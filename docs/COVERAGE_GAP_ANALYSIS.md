# Sprint 10 Coverage Gap Analysis

**Current Coverage:** 79.44%  
**Target:** 85%  
**Gap:** 5.56 percentage points

## Detailed Breakdown of Uncovered Lines

### Priority 1: Quick Wins (Potentially +2-3pp)

#### 1. analytics.ts - 74.46% (12 uncovered lines)
**Lines:** 62-63, 83-84, 111-112, 132-133, 153-154, 191-192
**Type:** All catch blocks (error handlers)
**Potential gain:** ~1.5pp
**Approach:** Mock database errors with jest.spyOn

#### 2. User.ts Model - 88.88% (2 uncovered lines)
**Lines:** 90, 101
**Type:** Bcrypt error handlers in pre-save hook and comparePassword
**Potential gain:** ~0.1pp
**Approach:** Mock bcrypt to throw errors

#### 3. admin.ts - 96.77% (3 uncovered lines)
**Lines:** 51, 188, 229
**Type:** Catch block error handlers
**Potential gain:** ~0.2pp
**Approach:** Mock database errors

#### 4. email.config.ts - 84.61% (2 uncovered lines)
**Lines:** 21-22
**Type:** Email connection test error handler
**Potential gain:** ~0.1pp
**Approach:** Mock nodemailer connection failure

#### 5. validate.ts - 92.3% (1 uncovered line)
**Line:** 27
**Type:** Validation error handler
**Potential gain:** ~0.05pp
**Approach:** Trigger validation error

#### 6. auth.ts middleware - 84% (10 uncovered lines)
**Lines:** 42-46, 74-78
**Type:** User not found and role validation
**Potential gain:** ~0.3pp
**Approach:** Test with inactive users and missing req.user

### Priority 2: Medium Effort (+1-2pp)

#### 7. contact.routes.ts - 86.84% (6 uncovered lines)
**Lines:** 99, 110-111, 154-155
**Type:** Async email error catch, submission error, admin error
**Potential gain:** ~0.3pp

#### 8. downloads.ts - 85.18% (4 uncovered lines)
**Lines:** 59-60, 97-98
**Type:** Error handlers for download tracking
**Potential gain:** ~0.2pp

#### 9. newsletter.routes.ts - 89.36% (9 uncovered lines)
**Lines:** 142-143, 203, 210, 224-225, 275-276
**Type:** Various error handlers
**Potential gain:** ~0.4pp

#### 10. email.service.ts - 91.66% (2 uncovered lines)
**Lines:** 23-24
**Type:** Email send error logging
**Potential gain:** ~0.1pp

### Priority 3: Controllers (Highest Impact, +1-1.5pp)

#### 11. user.controller.ts - 73.62% (24 uncovered lines)
**Lines:** 12-13, 19-20, 25-26, 36-37, 64-65, 73-74, 84-85, 113-114, 132-133, 143-144, 157-158, 175-176
**Type:** All try-catch error handlers (12 pairs)
**Potential gain:** ~1pp
**Functions:** getCurrentUser, updateProfile, updatePassword, getUsers, getUserById, deleteUser

#### 12. auth.controller.ts - 83.52% (23 uncovered lines)
**Lines:** 47, 65, 92-96, 137, 158, 201, 213, 260, 274-278, 283-287, 304
**Type:** Error handlers in register, login, forgotPassword, resetPassword, getMe
**Potential gain:** ~0.8pp

### Priority 4: Infrastructure (Low Priority)

#### 13. database.ts - 63.63% (9 uncovered lines)
**Lines:** 8, 22-24, 34, 38, 43-45
**Type:** Connection error handling
**Potential gain:** ~0.3pp
**Note:** Complex to test, requires mocking mongoose connection

#### 14. errorHandler.ts - 10.25% (Very low, 90+ uncovered lines)
**Lines:** 18-22, 36-102, 112-113, 126
**Type:** Global error middleware
**Potential gain:** ~0.5pp
**Note:** Rarely executed, complex to test

#### 15. createAdmin.ts - 0% (52 uncovered lines)
**Type:** CLI script, not part of app runtime
**Potential gain:** ~0pp (excluded from coverage calculation)
**Note:** Should be excluded from coverage

## Strategic Plan to Reach 85%

### Phase 1: Quick Wins (~2-2.5pp) [30 minutes]
1. ✅ Test analytics.ts error handlers with database mocks
2. ✅ Test User.ts bcrypt errors
3. ✅ Test admin.ts catch blocks
4. ✅ Test auth middleware inactive user paths
5. ✅ Test validate.ts error path

**Expected Result:** 79.44% → 81.9%

### Phase 2: Route Error Handlers (~1pp) [30 minutes]
6. ✅ Test contact.routes.ts errors
7. ✅ Test downloads.ts errors
8. ✅ Test newsletter.routes.ts errors
9. ✅ Test email.service.ts errors

**Expected Result:** 81.9% → 82.9%

### Phase 3: Controller Error Handlers (~1.8pp) [45 minutes]
10. ✅ Test user.controller.ts all error paths
11. ✅ Test auth.controller.ts remaining errors

**Expected Result:** 82.9% → 84.7%

### Phase 4: Final Push (~0.5pp) [15 minutes]
12. ✅ Test database.ts connection errors
13. ✅ Test email.config.ts connection test

**Expected Result:** 84.7% → 85.2% ✅ **TARGET REACHED**

## Testing Strategy

### Approach 1: Database Error Mocking
```typescript
jest.spyOn(Model, 'find').mockRejectedValueOnce(new Error('DB Error'));
jest.spyOn(Model, 'countDocuments').mockRejectedValueOnce(new Error('DB Error'));
```

### Approach 2: Service Error Mocking
```typescript
jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error('Bcrypt Error'));
jest.spyOn(EmailService, 'send').mockRejectedValueOnce(new Error('Email Error'));
```

### Approach 3: Mongoose Instance Method Mocking
```typescript
const mockSave = jest.fn().mockRejectedValueOnce(new Error('Save failed'));
const mockUser = { save: mockSave, ... };
```

## Files Excluded from Coverage
- `scripts/createAdmin.ts` - CLI tool, not runtime code
- `__tests__/**` - Test files themselves
- `authHelper.helper.ts` - Test helper (0% is expected)

## Success Metrics
- [ ] Reach 85%+ overall coverage
- [ ] Maintain 100% test pass rate
- [ ] Keep test execution time under 30 seconds
- [ ] All mocks properly cleaned up (no test interference)

## Estimated Total Time: 2 hours
