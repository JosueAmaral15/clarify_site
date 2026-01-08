import request from 'supertest';
import app from '../../server';
import Contact from '../../models/Contact';
import mongoose from 'mongoose';

describe('Contact API', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }
  });

  afterAll(async () => {
    await Contact.deleteMany({});
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

      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(contactData.name);
      expect(response.body.email).toBe(contactData.email);
      expect(response.body.status).toBe('new');
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
        message: 'Test message'
      };

      await request(app)
        .post('/api/contact')
        .send(invalidData)
        .expect(400);
    });

    it('should enforce rate limiting', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
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

  describe('GET /api/contacts', () => {
    it('should return all contacts for admin', async () => {
      // Create test contacts
      await Contact.create([
        { name: 'User 1', email: 'user1@test.com', subject: 'Subject 1', message: 'Message 1' },
        { name: 'User 2', email: 'user2@test.com', subject: 'Subject 2', message: 'Message 2' }
      ]);

      const response = await request(app)
        .get('/api/contacts')
        .set('Authorization', 'Bearer admin-token') // Mock admin auth
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PATCH /api/contacts/:id', () => {
    it('should update contact status', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'Test Subject',
        message: 'Test message',
        status: 'new'
      });

      const response = await request(app)
        .patch(`/api/contacts/${contact._id}`)
        .set('Authorization', 'Bearer admin-token')
        .send({ status: 'contacted' })
        .expect(200);

      expect(response.body.status).toBe('contacted');
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete contact', async () => {
      const contact = await Contact.create({
        name: 'Test User',
        email: 'test@test.com',
        subject: 'Test Subject',
        message: 'Test message'
      });

      await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set('Authorization', 'Bearer admin-token')
        .expect(200);

      const deleted = await Contact.findById(contact._id);
      expect(deleted).toBeNull();
    });
  });
});
