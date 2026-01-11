import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import mongoose from 'mongoose';
import crypto from 'crypto';

describe('Auth API Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('User registered successfully');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      // Verify user in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user?.name).toBe(userData.name);
      expect(user?.isActive).toBe(true);
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already registered');
    });

    it('should reject weak passwords', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123', // Too weak
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'John Doe' }) // Missing email and password
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123!',
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Login successful');
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPass123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }) // Missing password
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and login
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123!',
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!',
        });

      accessToken = loginRes.body.data.accessToken;
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logout successful');
    });

    it('should reject logout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      // Create a test user
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
      });
    });

    it('should send password reset for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('password reset link has been sent');

      // Verify token was set in database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user?.resetPasswordToken).toBeDefined();
      expect(user?.resetPasswordExpires).toBeDefined();
      expect(user?.resetPasswordExpires).toBeInstanceOf(Date);
      expect(user?.resetPasswordExpires!.getTime()).toBeGreaterThan(Date.now());
    });

    it('should not reveal if email does not exist (security)', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('password reset link has been sent');
      // Same message to prevent email enumeration
    });

    it('should reject request without email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return reset token in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      if (process.env.NODE_ENV === 'development') {
        expect(response.body.resetToken).toBeDefined();
      }

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('POST /api/auth/reset-password/:token', () => {
    let resetToken: string;

    beforeEach(async () => {
      // Create user and generate reset token
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'OldPass123!',
      });

      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      user.resetPasswordToken = tokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      resetToken = token;
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'NewPass123!';

      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ password: newPassword })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password reset successful');

      // Verify password was changed
      const user = await User.findOne({ email: 'test@example.com' }).select('+password');
      const isMatch = await user?.comparePassword(newPassword);
      expect(isMatch).toBe(true);

      // Verify token was cleared
      expect(user?.resetPasswordToken).toBeUndefined();
      expect(user?.resetPasswordExpires).toBeUndefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password/invalidtoken123')
        .send({ password: 'NewPass123!' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired reset token');
    });

    it('should reject expired token', async () => {
      // Set token to expired
      const user = await User.findOne({ email: 'test@example.com' });
      user!.resetPasswordExpires = new Date(Date.now() - 1000); // Expired 1 second ago
      await user!.save();

      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ password: 'NewPass123!' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid or expired reset token');
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ password: '123' }) // Too weak
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject missing password', async () => {
      const response = await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      // Register user
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPass123!',
        });

      accessToken = registerRes.body.data.accessToken;
      userId = registerRes.body.data.user.id;
    });

    it('should get current user info', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.name).toBe('Test User');
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken123')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
