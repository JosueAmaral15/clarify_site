// Test helper utilities
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

/**
 * Generate a test JWT token for a mock user
 */
export const generateTestToken = (role: 'user' | 'admin' = 'user'): string => {
  const payload = {
    userId: '507f1f77bcf86cd799439011',
    email: role === 'admin' ? 'admin@test.com' : 'user@test.com',
    role: role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Generate an admin test token
 */
export const generateAdminToken = (): string => {
  return generateTestToken('admin');
};

/**
 * Generate a user test token
 */
export const generateUserToken = (): string => {
  return generateTestToken('user');
};

/**
 * Mock user object for testing
 */
export const mockUser = {
  _id: '507f1f77bcf86cd799439011' as any,
  name: 'Test User',
  email: 'user@test.com',
  role: 'user' as const,
};

/**
 * Mock admin object for testing
 */
export const mockAdmin = {
  _id: '507f1f77bcf86cd799439012' as any,
  name: 'Admin User',
  email: 'admin@test.com',
  role: 'admin' as const,
};
