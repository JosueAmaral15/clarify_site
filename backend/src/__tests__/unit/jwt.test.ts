import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { IUser } from '../../models/User';

describe('JWT Utils', () => {
  const createMockUser = (overrides = {}): IUser => ({
    _id: '507f1f77bcf86cd799439011' as any,
    email: 'test@example.com',
    role: 'user',
    name: 'Test User',
    password: 'hashedpassword',
    isActive: true,
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    refreshTokens: [],
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
    comparePassword: jest.fn(),
    save: jest.fn(),
    ...overrides,
  } as any);

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const mockUser = createMockUser();
      const token = generateAccessToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include payload data in token', () => {
      const mockUser = createMockUser();
      const token = generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(mockUser._id.toString());
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should set expiration time', () => {
      const mockUser = createMockUser();
      const token = generateAccessToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const mockUser = createMockUser();
      const token = generateRefreshToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include payload data in token', () => {
      const mockUser = createMockUser();
      const token = generateRefreshToken(mockUser);
      const decoded = jwt.decode(token) as any;

      expect(decoded.userId).toBe(mockUser._id.toString());
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should have longer expiration than access token', () => {
      const mockUser = createMockUser();
      const accessToken = generateAccessToken(mockUser);
      const refreshToken = generateRefreshToken(mockUser);

      const accessDecoded = jwt.decode(accessToken) as any;
      const refreshDecoded = jwt.decode(refreshToken) as any;

      const accessExpiry = accessDecoded.exp - accessDecoded.iat;
      const refreshExpiry = refreshDecoded.exp - refreshDecoded.iat;

      expect(refreshExpiry).toBeGreaterThan(accessExpiry);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify and decode a valid access token', () => {
      const mockUser = createMockUser();
      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded.userId).toBe(mockUser._id.toString());
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyAccessToken(invalidToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for malformed token', () => {
      expect(() => verifyAccessToken('not-a-jwt')).toThrow('Invalid or expired token');
    });

    it('should throw error for expired token', () => {
      // Create token with negative expiry (already expired)
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'user' };
      const expiredToken = jwt.sign(
        { ...payload, exp: Math.floor(Date.now() / 1000) - 3600 },
        process.env.JWT_SECRET || 'test-secret'
      );

      expect(() => verifyAccessToken(expiredToken)).toThrow('Invalid or expired token');
    });

    it('should throw error for token with wrong secret', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'user' };
      const tokenWithWrongSecret = jwt.sign(payload, 'wrong-secret');

      expect(() => verifyAccessToken(tokenWithWrongSecret)).toThrow('Invalid or expired token');
    });

    it('should throw error for empty token', () => {
      expect(() => verifyAccessToken('')).toThrow('Invalid or expired token');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify and decode a valid refresh token', () => {
      const mockUser = createMockUser();
      const token = generateRefreshToken(mockUser);
      const decoded = verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockUser._id.toString());
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should throw error for invalid refresh token', () => {
      const invalidToken = 'invalid.refresh.token';

      expect(() => verifyRefreshToken(invalidToken)).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for malformed refresh token', () => {
      expect(() => verifyRefreshToken('not-a-jwt')).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for expired refresh token', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'user' };
      const expiredToken = jwt.sign(
        { ...payload, exp: Math.floor(Date.now() / 1000) - 3600 },
        process.env.JWT_REFRESH_SECRET || 'test-refresh-secret'
      );

      expect(() => verifyRefreshToken(expiredToken)).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for refresh token with wrong secret', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'user' };
      const tokenWithWrongSecret = jwt.sign(payload, 'wrong-refresh-secret');

      expect(() => verifyRefreshToken(tokenWithWrongSecret)).toThrow('Invalid or expired refresh token');
    });

    it('should throw error for empty refresh token', () => {
      expect(() => verifyRefreshToken('')).toThrow('Invalid or expired refresh token');
    });

    it('should not accept access token as refresh token', () => {
      // Access token signed with JWT_SECRET, not JWT_REFRESH_SECRET
      const mockUser = createMockUser();
      const accessToken = generateAccessToken(mockUser);

      expect(() => verifyRefreshToken(accessToken)).toThrow('Invalid or expired refresh token');
    });
  });

  describe('Token interoperability', () => {
    it('should not accept refresh token as access token', () => {
      const mockUser = createMockUser();
      const refreshToken = generateRefreshToken(mockUser);

      expect(() => verifyAccessToken(refreshToken)).toThrow('Invalid or expired token');
    });

    it('should handle special characters in payload', () => {
      const mockUser = createMockUser({
        email: 'user+test@example.com',
        role: 'admin',
      });

      const token = generateAccessToken(mockUser);
      const decoded = verifyAccessToken(token);

      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });
  });
});
