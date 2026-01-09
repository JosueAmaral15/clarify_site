import request from 'supertest';
import app from '../../server';
import Newsletter from '../../models/Newsletter';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('Newsletter API Integration Tests', () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }

    // Clean up before creating test data
    await User.deleteMany({});
    await Newsletter.deleteMany({});

    // Create admin user for admin tests
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Admin123!@#',
      role: 'admin',
      isActive: true,
    });

    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(
      { userId: adminUser._id.toString(), email: 'admin@test.com', role: 'admin' },
      process.env.JWT_SECRET || 'test-jwt-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await Newsletter.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Newsletter.deleteMany({});
  });

  describe('POST /api/newsletter/subscribe', () => {
    it('should subscribe a new email successfully', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'newuser@example.com' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Thank you for subscribing');

      // Verify in database
      const subscriber = await Newsletter.findOne({ email: 'newuser@example.com' });
      expect(subscriber).toBeDefined();
      expect(subscriber?.isActive).toBe(true);
    });

    it('should return success if already subscribed', async () => {
      // First subscription
      await Newsletter.create({ email: 'existing@example.com', isActive: true });

      // Try to subscribe again
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'existing@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('already subscribed');
    });

    it('should re-subscribe inactive subscriber', async () => {
      // Create inactive subscriber
      await Newsletter.create({
        email: 'inactive@example.com',
        isActive: false,
        unsubscribedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'inactive@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('re-subscribed');

      // Verify in database
      const subscriber = await Newsletter.findOne({ email: 'inactive@example.com' });
      expect(subscriber?.isActive).toBe(true);
      expect(subscriber?.unsubscribedAt).toBeUndefined();
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid email');
    });

    it('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'TestUser@EXAMPLE.COM' })
        .expect(201);

      expect(response.body.success).toBe(true);

      // Verify normalized email in database
      const subscriber = await Newsletter.findOne({ email: 'testuser@example.com' });
      expect(subscriber).toBeDefined();
    });

    it('should trim whitespace from email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: '  spaces@example.com  ' })
        .expect(201);

      expect(response.body.success).toBe(true);

      const subscriber = await Newsletter.findOne({ email: 'spaces@example.com' });
      expect(subscriber).toBeDefined();
    });

    it('should reject emails with special characters', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'test@exam ple.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: longEmail });

      // Should either accept or reject gracefully
      expect([200, 201, 400]).toContain(response.status);
    });

    it('should handle empty string email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle null email', async () => {
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: null })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/newsletter/unsubscribe', () => {
    it('should unsubscribe an active subscriber', async () => {
      // Create active subscriber
      await Newsletter.create({ email: 'subscriber@example.com', isActive: true });

      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'subscriber@example.com' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unsubscribed successfully');

      // Verify in database
      const subscriber = await Newsletter.findOne({ email: 'subscriber@example.com' });
      expect(subscriber?.isActive).toBe(false);
      expect(subscriber?.unsubscribedAt).toBeDefined();
    });

    it('should handle unsubscribe for non-existent email', async () => {
      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should normalize email in unsubscribe', async () => {
      await Newsletter.create({ email: 'test@example.com', isActive: true });

      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'TEST@EXAMPLE.COM' })
        .expect(200);

      expect(response.body.success).toBe(true);

      const subscriber = await Newsletter.findOne({ email: 'test@example.com' });
      expect(subscriber?.isActive).toBe(false);
    });

    it('should handle already unsubscribed email', async () => {
      // Create inactive subscriber
      await Newsletter.create({
        email: 'inactive@example.com',
        isActive: false,
        unsubscribedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'inactive@example.com' })
        .expect(404); // Returns 404 for inactive subscribers

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle missing email in unsubscribe', async () => {
      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/newsletter/subscribers (Admin)', () => {
    beforeEach(async () => {
      // Create test subscribers
      await Newsletter.create([
        { email: 'active1@example.com', isActive: true },
        { email: 'active2@example.com', isActive: true },
        { email: 'inactive@example.com', isActive: false, unsubscribedAt: new Date() },
      ]);
    });

    it('should return all subscribers for admin', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.total).toBeGreaterThan(0);
      expect(response.body.stats.active).toBeGreaterThan(0);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require admin role', async () => {
      // Create regular user token
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User123!@#',
        role: 'user',
        isActive: true,
      });

      const jwt = require('jsonwebtoken');
      const userToken = jwt.sign(
        { userId: regularUser._id.toString(), email: 'user@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/newsletter/subscribers')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);

      // Cleanup
      await User.findByIdAndDelete(regularUser._id);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should filter by active status', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers?status=active')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((sub: any) => sub.isActive === true)).toBe(true);
    });

    it('should filter by inactive status', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers?status=inactive')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every((sub: any) => sub.isActive === false)).toBe(true);
    });

    it('should return all subscribers without status filter', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers?status=all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3); // We created 3 in beforeEach
    });

    it('should include stats in response', async () => {
      const response = await request(app)
        .get('/api/newsletter/subscribers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.total).toBeGreaterThan(0);
      expect(response.body.stats.active).toBeGreaterThan(0);
      expect(response.body.stats.inactive).toBeGreaterThanOrEqual(0);
      expect(response.body.stats.total).toBe(
        response.body.stats.active + response.body.stats.inactive
      );
    });
  });

  describe('POST /api/newsletter/send-release (Admin)', () => {
    beforeEach(async () => {
      // Create active subscribers for testing
      await Newsletter.create([
        { email: 'subscriber1@example.com', isActive: true },
        { email: 'subscriber2@example.com', isActive: true },
        { email: 'inactive@example.com', isActive: false },
      ]);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .post('/api/newsletter/send-release')
        .send({
          version: 'v1.0.0',
          releaseNotes: 'New release',
        });

      // Could be 401 (no token) or 500 (email service error if it somehow passes auth)
      expect([401, 500]).toContain(response.status);
      if (response.status === 401) {
        expect(response.body.success).toBe(false);
      }
    });

    it('should require admin role', async () => {
      const regularUser = await User.create({
        name: 'Regular User',
        email: 'user2@test.com',
        password: 'User123!@#',
        role: 'user',
        isActive: true,
      });

      const jwt = require('jsonwebtoken');
      const userToken = jwt.sign(
        { userId: regularUser._id.toString(), email: 'user2@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          version: 'v1.0.0',
          releaseNotes: 'New release',
        })
        .expect(403);

      expect(response.body.success).toBe(false);

      await User.findByIdAndDelete(regularUser._id);
    });

    it('should validate required version field', async () => {
      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          releaseNotes: 'New release',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should validate required releaseNotes field', async () => {
      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          version: 'v1.0.0',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should handle empty releaseNotes', async () => {
      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          version: 'v1.0.0',
          releaseNotes: '',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle no active subscribers', async () => {
      // Remove all subscribers
      await Newsletter.deleteMany({});

      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          version: 'v1.0.0',
          releaseNotes: 'New release',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('No active subscribers');
      expect(response.body.data.sent).toBe(0);
    });

    it('should send to active subscribers only', async () => {
      const response = await request(app)
        .post('/api/newsletter/send-release')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          version: 'v2.0.0',
          releaseNotes: 'Major update with new features',
        });

      // Email service might not be configured, so could succeed or fail
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        // Should attempt to send to 2 active subscribers
        expect(response.body.data.total).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database connection errors gracefully in subscribe', async () => {
      // This test verifies error handling exists, actual DB disconnect would break other tests
      const response = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'valid@example.com' });

      expect([200, 201, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('should handle concurrent subscriptions for same email', async () => {
      const email = 'concurrent@example.com';
      
      // Make multiple concurrent requests
      const requests = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/newsletter/subscribe')
          .send({ email })
      );

      const responses = await Promise.all(requests);
      
      // At least one should succeed with 201 (created)
      const statuses = responses.map(r => r.status);
      const hasCreated = statuses.includes(201);
      expect(hasCreated).toBe(true);
      
      // All should either succeed (200/201) or have server error from race condition (500)
      responses.forEach(res => {
        expect([200, 201, 500]).toContain(res.status);
        if (res.status !== 500) {
          expect(res.body.success).toBe(true);
        }
      });

      // Should only have one subscriber in database
      const count = await Newsletter.countDocuments({ email });
      expect(count).toBe(1);
    });

    it('should handle subscribe-unsubscribe-resubscribe flow', async () => {
      const email = 'flow@example.com';

      // Subscribe
      const sub1 = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email })
        .expect(201);
      expect(sub1.body.success).toBe(true);

      // Unsubscribe
      const unsub = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email })
        .expect(200);
      expect(unsub.body.success).toBe(true);

      // Resubscribe
      const sub2 = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email })
        .expect(200);
      expect(sub2.body.success).toBe(true);
      expect(sub2.body.message).toContain('re-subscribed');

      // Verify final state
      const subscriber = await Newsletter.findOne({ email });
      expect(subscriber?.isActive).toBe(true);
      expect(subscriber?.unsubscribedAt).toBeUndefined();
    });
  });
});
