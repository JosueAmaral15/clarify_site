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
    it.skip('should subscribe a new email successfully', async () => {
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
      expect(response.body.message).toContain('successfully unsubscribed');

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
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('already unsubscribed');
    });

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'invalid-email' })
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
      expect(response.body.data.subscribers).toBeInstanceOf(Array);
      expect(response.body.data.subscribers.length).toBeGreaterThan(0);
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
  });
});
