# Testing Guide - Clarify Site

## Overview

This guide covers testing strategies and procedures for the Clarify Site application.

---

## Testing Stack

- **Frontend:**
  - Vitest - Unit/Integration testing
  - React Testing Library - Component testing
  - Playwright/Cypress - E2E testing (optional)

- **Backend:**
  - Jest - Unit/Integration testing
  - Supertest - API testing
  - MongoDB Memory Server - Database testing

---

## Setup

### Backend Testing

```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest mongodb-memory-server
```

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

### Frontend Testing

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Create `vitest.config.ts`:

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
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ]
    }
  }
});
```

---

## Backend Tests

### Unit Tests - Models

Create `backend/src/models/__tests__/Contact.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Contact from '../Contact';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Contact Model', () => {
  it('should create a valid contact', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    expect(savedContact._id).toBeDefined();
    expect(savedContact.name).toBe(contactData.name);
    expect(savedContact.email).toBe(contactData.email);
    expect(savedContact.status).toBe('new');
  });

  it('should require name field', async () => {
    const contact = new Contact({
      email: 'test@example.com',
      message: 'Test message'
    });

    await expect(contact.save()).rejects.toThrow();
  });

  it('should validate email format', async () => {
    const contact = new Contact({
      name: 'Test',
      email: 'invalid-email',
      message: 'Test'
    });

    await expect(contact.save()).rejects.toThrow();
  });
});
```

### Integration Tests - API

Create `backend/src/routes/__tests__/contacts.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import Contact from '../../models/Contact';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Contact.deleteMany({});
});

describe('POST /api/contacts', () => {
  it('should create a new contact', async () => {
    const contactData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I am interested in Clarify'
    };

    const response = await request(app)
      .post('/api/contacts')
      .send(contactData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.contactId).toBeDefined();
  });

  it('should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/contacts')
      .send({ name: 'Test' })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});

describe('GET /api/contacts', () => {
  it('should require authentication', async () => {
    await request(app)
      .get('/api/contacts')
      .expect(401);
  });

  it('should return contacts with valid token', async () => {
    // Create test contact
    await Contact.create({
      name: 'Test',
      email: 'test@example.com',
      message: 'Test message'
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123'
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.contacts).toHaveLength(1);
  });
});
```

### Run Backend Tests

```bash
cd backend
npm test
npm run test:coverage
npm run test:watch
```

---

## Frontend Tests

### Component Tests

Create `frontend/src/components/__tests__/ContactForm.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm', () => {
  it('renders form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn();
    render(<ContactForm onSubmit={mockSubmit} />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
    });
  });

  it('displays success message after submission', async () => {
    render(<ContactForm />);
    
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
```

### Hook Tests

Create `frontend/src/hooks/__tests__/useAuth.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@example.com', 'password123');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
```

### Run Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
npm run test:ui
```

---

## Manual Testing

### Frontend Manual Tests

#### Test Checklist

**Homepage:**
- [ ] Hero section loads correctly
- [ ] Navigation works
- [ ] Buttons are clickable
- [ ] Images load properly
- [ ] Animations work
- [ ] Responsive design (mobile, tablet, desktop)

**Contact Form:**
- [ ] Form fields accept input
- [ ] Validation shows errors
- [ ] Success message displays
- [ ] Form resets after submission
- [ ] Email validation works

**Download Section:**
- [ ] Download buttons work
- [ ] Platform detection works
- [ ] Download tracking works

**Admin Dashboard:**
- [ ] Login form works
- [ ] Protected routes redirect
- [ ] Logout works
- [ ] Analytics display correctly
- [ ] Contact management works
- [ ] Status updates work

#### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

#### Performance Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

---

## API Testing

### Using cURL

```bash
# Test contact submission
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Test protected endpoint
curl -X GET http://localhost:5000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import API collection from `docs/postman_collection.json`
2. Set environment variables
3. Run collection tests
4. Review results

---

## Load Testing

### Using Artillery

```bash
npm install -g artillery

# Create test scenario
cat > load-test.yml << EOF
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Contact submission"
    flow:
      - post:
          url: "/api/contacts"
          json:
            name: "Load Test User"
            email: "test@example.com"
            message: "Load test message"
EOF

# Run test
artillery run load-test.yml
```

---

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
      - name: Coverage
        run: cd backend && npm run test:coverage

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Coverage
        run: cd frontend && npm run test:coverage
```

---

## Test Coverage Goals

- **Unit Tests:** > 80%
- **Integration Tests:** > 70%
- **E2E Tests:** Critical paths covered
- **Overall Coverage:** > 75%

---

## Best Practices

1. **Write tests first** (TDD when possible)
2. **Keep tests isolated** and independent
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Test edge cases** and error scenarios
6. **Maintain test data fixtures**
7. **Run tests before commits**
8. **Review test coverage regularly**

---

## Troubleshooting Tests

### MongoDB Memory Server Issues
```bash
npm install --save-dev mongodb-memory-server-core
```

### Port Already in Use
```bash
lsof -ti:5000 | xargs kill -9
```

### Test Timeouts
Increase timeout in test files:
```typescript
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
