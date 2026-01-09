import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('User API Integration Tests', () => {
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'TestPass123!',
      role: 'user',
      isActive: true,
    });

    userId = testUser._id.toString();

    // Generate token
    const jwt = require('jsonwebtoken');
    userToken = jwt.sign(
      { userId: userId, email: 'testuser@example.com', role: 'user' },
      process.env.JWT_SECRET || 'test-jwt-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('testuser@example.com');
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile name', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.user.name).toBe('Updated Name');

      // Verify in database
      const user = await User.findById(userId);
      expect(user?.name).toBe('Updated Name');
    });

    it.skip('should update user profile email', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'newemail@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newemail@example.com');

      // Revert for other tests
      await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'testuser@example.com' });
    });

    it.skip('should validate email format', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it.skip('should prevent updating to existing email', async () => {
      // Create another user
      await User.create({
        name: 'Other User',
        email: 'otheruser@example.com',
        password: 'OtherPass123!',
        role: 'user',
        isActive: true,
      });

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ email: 'otheruser@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already in use');

      // Cleanup
      await User.deleteOne({ email: 'otheruser@example.com' });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .send({ name: 'New Name' })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('PUT /api/users/me/password', () => {
    it.skip('should change password with valid current password', async () => {
      const response = await request(app)
        .put('/api/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'TestPass123!',
          newPassword: 'NewPass123!',
        })
        .expect(200);

      expect(response.body.message).toContain('Password changed successfully');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'NewPass123!',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);

      // Change back for other tests
      await request(app)
        .put('/api/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'NewPass123!',
          newPassword: 'TestPass123!',
        });
    });

    it.skip('should reject wrong current password', async () => {
      const response = await request(app)
        .put('/api/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewPass123!',
        })
        .expect(401);

      expect(response.body.message).toContain('Current password is incorrect');
    });

    it('should validate new password strength', async () => {
      const response = await request(app)
        .put('/api/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'TestPass123!',
          newPassword: 'weak',
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should require both passwords', async () => {
      const response = await request(app)
        .put('/api/users/me/password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'TestPass123!',
        })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/users/me/password')
        .send({
          currentPassword: 'TestPass123!',
          newPassword: 'NewPass123!',
        })
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('DELETE /api/users/me', () => {
    it.skip('should soft delete user account', async () => {
      // Create a user to delete
      const userToDelete = await User.create({
        name: 'Delete User',
        email: 'delete@example.com',
        password: 'DeletePass123!',
        role: 'user',
        isActive: true,
      });

      const jwt = require('jsonwebtoken');
      const deleteToken = jwt.sign(
        { userId: userToDelete._id.toString(), email: 'delete@example.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${deleteToken}`)
        .expect(200);

      expect(response.body.message).toContain('Account deleted successfully');

      // Verify soft delete (user still exists but isActive = false)
      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.isActive).toBe(false);

      // Cleanup
      await User.findByIdAndDelete(userToDelete._id);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/users/me')
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    it.skip('should not allow login after account deletion', async () => {
      // Create a user
      const user = await User.create({
        name: 'Temp User',
        email: 'temp@example.com',
        password: 'TempPass123!',
        role: 'user',
        isActive: true,
      });

      const jwt = require('jsonwebtoken');
      const tempToken = jwt.sign(
        { userId: user._id.toString(), email: 'temp@example.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      // Delete account
      await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${tempToken}`)
        .expect(200);

      // Try to login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'temp@example.com',
          password: 'TempPass123!',
        })
        .expect(403);

      expect(loginResponse.body.message).toContain('deactivated');

      // Cleanup
      await User.findByIdAndDelete(user._id);
    });
  });
});
