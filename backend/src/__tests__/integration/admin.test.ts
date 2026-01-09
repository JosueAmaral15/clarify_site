import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import Contact from '../../models/Contact';
import mongoose from 'mongoose';

describe('Admin API Integration Tests', () => {
  let adminToken: string;
  let adminUserId: string;
  let testUserId: string;
  let testContactId: string;

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

    // Generate token with actual admin user ID
    const payload = {
      userId: adminUserId,
      email: 'admin@test.com',
      role: 'admin',
    };
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(payload, process.env.JWT_SECRET || 'test-jwt-secret', { expiresIn: '1h' });

    // Create a test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'testuser@test.com',
      password: 'TestPass123!',
      role: 'user',
      isActive: true,
    });
    testUserId = testUser._id.toString();

    // Create a test contact
    const testContact = await Contact.create({
      name: 'Test Contact',
      email: 'contact@test.com',
      subject: 'Test Subject',
      message: 'This is a test contact message for admin tests',
      status: 'new',
    });
    testContactId = testContact._id.toString();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Contact.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/admin/users', () => {
    it('should return list of users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.total).toBeGreaterThan(0);
    });

    it.skip('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/users?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeLessThanOrEqual(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });

    it.skip('should support search by name or email', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=testuser')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeInstanceOf(Array);
      if (response.body.data.users.length > 0) {
        const user = response.body.data.users[0];
        expect(
          user.email.toLowerCase().includes('testuser') || 
          user.name.toLowerCase().includes('testuser')
        ).toBe(true);
      }
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require admin role', async () => {
      // Create regular user token
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/users/:id', () => {
    it('should get user details by admin', async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testUserId);
      expect(response.body.data.email).toBe('testuser@test.com');
      expect(response.body.data.password).toBeUndefined(); // Password should not be included
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/ban', () => {
    it('should ban user by admin', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('banned');
      expect(response.body.data.isActive).toBe(false);
    });

    it('should prevent banning admin users', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${adminUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Cannot ban admin');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/admin/users/${fakeId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/unban', () => {
    it('should unban user by admin', async () => {
      // First ban the user
      await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Then unban
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unbanned');
      expect(response.body.data.isActive).toBe(true);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/admin/users/${fakeId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/contacts', () => {
    it('should return list of contacts for admin', async () => {
      const response = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contacts).toBeInstanceOf(Array);
      expect(response.body.data.contacts.length).toBeGreaterThan(0);
    });

    it.skip('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/contacts?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
    });

    it.skip('should support filtering by status', async () => {
      const response = await request(app)
        .get('/api/admin/contacts?status=new')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.contacts.length > 0) {
        response.body.data.contacts.forEach((contact: any) => {
          expect(contact.status).toBe('new');
        });
      }
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/contacts')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/contacts/:id/status', () => {
    it('should update contact status', async () => {
      const response = await request(app)
        .put(`/api/admin/contacts/${testContactId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('read');
    });

    it('should validate status values', async () => {
      const response = await request(app)
        .put(`/api/admin/contacts/${testContactId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid status');
    });

    it('should return 404 for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/admin/contacts/${fakeId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'replied' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .put(`/api/admin/contacts/${testContactId}/status`)
        .send({ status: 'archived' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/admin/contacts/:id', () => {
    it('should delete contact by admin', async () => {
      // Create a contact to delete
      const contactToDelete = await Contact.create({
        name: 'Contact to Delete',
        email: 'deletecontact@test.com',
        subject: 'Test Subject',
        message: 'This is a test message to be deleted by admin',
        status: 'new',
      });

      const response = await request(app)
        .delete(`/api/admin/contacts/${contactToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify contact is deleted
      const deletedContact = await Contact.findById(contactToDelete._id);
      expect(deletedContact).toBeNull();
    });

    it('should return 404 for non-existent contact', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/admin/contacts/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .delete(`/api/admin/contacts/${testContactId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
