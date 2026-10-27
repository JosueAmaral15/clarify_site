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
      expect(response.body.message).toContain('Thank you for contacting us');
      
      // Verify in database
      const contact = await Contact.findById(response.body.data.id);
      expect(contact).toBeDefined();
      expect(contact?.name).toBe(contactData.name);
      expect(contact?.status).toBe('new');
    });

    it('should reject contact without required fields', async () => {
      const invalidData = {
        name: 'Test User'
        // missing email, subject and message
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'This is a test message with at least 10 characters'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });

    it('should reject message that is too short', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Short' // Less than 10 characters
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it('should reject name that is too short', async () => {
      const invalidData = {
        name: 'T', // Only 1 character
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message with more than 10 characters'
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it('should reject subject that is too short', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Hi', // Less than 3 characters
        message: 'This is a valid message with more than 10 characters'
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it('should store IP address and user agent', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message'
      };

      const response = await request(app)
        .post('/api/contact')
        .set('User-Agent', 'Test Browser')
        .send(contactData)
        .expect(201);

      const contact = await Contact.findById(response.body.data.id);
      expect(contact?.userAgent).toBeDefined();
      expect(contact?.ipAddress).toBeDefined();
    });

    it.skip('should enforce rate limiting', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for rate limiting'
      };

      // Send 5 requests (rate limit is 5 per hour)
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

  describe('GET /api/contact', () => {
    beforeEach(async () => {
      // Create test contacts with different statuses
      await Contact.create([
        { name: 'User 1', email: 'user1@test.com', subject: 'Subject 1', message: 'Test message for user 1', status: 'new' },
        { name: 'User 2', email: 'user2@test.com', subject: 'Subject 2', message: 'Test message for user 2', status: 'read' },
        { name: 'User 3', email: 'user3@test.com', subject: 'Subject 3', message: 'Test message for user 3', status: 'replied' },
      ]);
    });

    it('should return all contacts for admin', async () => {
      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(3);
    });

    it('should filter contacts by status', async () => {
      const response = await request(app)
        .get('/api/contact?status=new')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].status).toBe('new');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/contact?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.pages).toBe(2);
    });

    it('should not expose IP address and user agent', async () => {
      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const contact = response.body.data[0];
      expect(contact).not.toHaveProperty('ipAddress');
      expect(contact).not.toHaveProperty('userAgent');
    });

    it('should sort contacts by most recent first', async () => {
      const response = await request(app)
        .get('/api/contact')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const contacts = response.body.data;
      expect(contacts.length).toBeGreaterThan(1);
      
      // Verify descending order
      for (let i = 0; i < contacts.length - 1; i++) {
        const current = new Date(contacts[i].createdAt);
        const next = new Date(contacts[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
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
