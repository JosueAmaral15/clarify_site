import request from 'supertest';
import app from '../../server';
import Contact from '../../models/Contact';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('Contact API', () => {
  let adminToken: string;
  let adminUserId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }

    // Clean up before creating test data
    await User.deleteMany({});
    await Contact.deleteMany({});

    // Create admin user for tests
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Admin123!@#',
      role: 'admin',
      isActive: true,
    });

    adminUserId = adminUser._id.toString();

    // Generate token with actual user ID
    const payload = {
      userId: adminUserId,
      email: 'admin@test.com',
      role: 'admin',
    };
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(payload, process.env.JWT_SECRET || 'test-jwt-secret', { expiresIn: '1h' });
  });

  afterAll(async () => {
    await Contact.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Contact.deleteMany({});
  });

  describe('POST /api/contact', () => {
    it('should create a new contact message', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should reject contact without required fields', async () => {
      const invalidData = {
        name: 'Test User'
        // missing email and message
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with at least 10 characters'
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it.skip('should enforce rate limiting', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for rate limiting'
      };

      // Send 6 requests (rate limit is 5 per 15 min)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/contact')
          .send({ ...contactData, email: `test${i}@example.com` })
          .expect(201);
      }

      // 6th request should be rate limited
      const response = await request(app)
        .post('/api/contact')
        .send({ ...contactData, email: 'test6@example.com' })
        .expect(429);

      expect(response.body.message).toContain('Too many requests');
    });
  });

  describe('GET /api/admin/contacts', () => {
    it('should return all contacts for admin', async () => {
      // Create test contacts
      await Contact.create([
        { name: 'User 1', email: 'user1@test.com', subject: 'Subject 1', message: 'This is a test message for user 1' },
        { name: 'User 2', email: 'user2@test.com', subject: 'Subject 2', message: 'This is a test message for user 2' }
      ]);

      const response = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.contacts)).toBe(true);
      expect(response.body.data.contacts.length).toBe(2);
    });
  });

  describe('PUT /api/admin/contacts/:id/status', () => {
    it('should update contact status', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'Test Subject',
        message: 'Test message',
        status: 'new'
      });

      const response = await request(app)
        .put(`/api/admin/contacts/${contact._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('read');
    });
  });

  describe('DELETE /api/admin/contacts/:id', () => {
    it('should delete contact', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'Test Subject',
        message: 'Test message'
      });

      await request(app)
        .delete(`/api/admin/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const deleted = await Contact.findById(contact._id);
      expect(deleted).toBeNull();
    });
  });
});
