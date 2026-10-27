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

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/users?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeLessThanOrEqual(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.total).toBeGreaterThan(0);
      expect(response.body.data.pagination.pages).toBeGreaterThan(0);
    });

    it('should support search by name or email', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=testuser')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toBeInstanceOf(Array);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      const user = response.body.data.users[0];
      expect(
        user.email.toLowerCase().includes('testuser') || 
        user.name.toLowerCase().includes('testuser')
      ).toBe(true);
    });

    it('should support case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=ADMIN')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      const user = response.body.data.users.find((u: any) => u.role === 'admin');
      expect(user).toBeDefined();
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

    it('should handle invalid MongoDB ID format', async () => {
      const response = await request(app)
        .get('/api/admin/users/invalid-id-format')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    it('should return empty array when search has no matches', async () => {
      const response = await request(app)
        .get('/api/admin/users?search=nonexistentuser12345')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
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

    it('should handle invalid MongoDB ID gracefully', async () => {
      const response = await request(app)
        .get('/api/admin/users/not-a-valid-mongodb-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/admin/stats', () => {
    it('should return dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalUsers).toBeGreaterThan(0);
      expect(response.body.data.activeUsers).toBeGreaterThanOrEqual(0);
      expect(response.body.data.bannedUsers).toBeGreaterThanOrEqual(0);
      expect(response.body.data.adminUsers).toBeGreaterThan(0);
      expect(response.body.data.newUsersLastWeek).toBeGreaterThanOrEqual(0);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require admin role', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should count active and banned users correctly', async () => {
      // Ban test user
      await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`);

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.bannedUsers).toBeGreaterThanOrEqual(1);
      expect(response.body.data.totalUsers).toBe(
        response.body.data.activeUsers + response.body.data.bannedUsers
      );

      // Unban for other tests
      await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`);
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

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/contacts?page=1&limit=1')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.contacts.length).toBeLessThanOrEqual(1);
    });

    it('should support filtering by status', async () => {
      // Create contacts with different statuses
      await Contact.create({
        name: 'New Contact',
        email: 'new@test.com',
        subject: 'New Subject',
        message: 'New message',
        status: 'new',
      });
      await Contact.create({
        name: 'Read Contact',
        email: 'read@test.com',
        subject: 'Read Subject',
        message: 'Read message',
        status: 'read',
      });

      const response = await request(app)
        .get('/api/admin/contacts?status=new')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contacts.length).toBeGreaterThan(0);
      response.body.data.contacts.forEach((contact: any) => {
        expect(contact.status).toBe('new');
      });
    });

    it('should ignore invalid status filter', async () => {
      const response = await request(app)
        .get('/api/admin/contacts?status=invalid')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.contacts).toBeInstanceOf(Array);
    });

    it('should require admin authentication', async () => {
      const response = await request(app)
        .get('/api/admin/contacts')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require admin role for listing contacts', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/admin/contacts')
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

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

    it('should require admin role for status update', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .put(`/api/admin/contacts/${testContactId}/status`)
        .set('Authorization', `Bearer ${regularToken}`)
        .send({ status: 'read' })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should update contact to all valid status values', async () => {
      const statuses = ['new', 'read', 'replied', 'archived'];
      
      for (const status of statuses) {
        const response = await request(app)
          .put(`/api/admin/contacts/${testContactId}/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe(status);
      }
    });

    it('should handle missing status field', async () => {
      const response = await request(app)
        .put(`/api/admin/contacts/${testContactId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/admin/contacts/invalid-id/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read' })
        .expect(500);

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

    it('should require admin role for deletion', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .delete(`/api/admin/contacts/${testContactId}`)
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid MongoDB ID', async () => {
      const response = await request(app)
        .delete('/api/admin/contacts/not-valid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/ban - Edge Cases', () => {
    it('should handle already banned user', async () => {
      // Ban first time
      await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Ban again
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(false);

      // Clean up
      await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`);
    });

    it('should require admin role for banning', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/ban`)
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/admin/users/invalid-id-format/ban')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/admin/users/:id/unban - Edge Cases', () => {
    it('should handle already active user', async () => {
      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isActive).toBe(true);
    });

    it('should require admin role for unbanning', async () => {
      const regularToken = require('jsonwebtoken').sign(
        { userId: testUserId, email: 'testuser@test.com', role: 'user' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .put(`/api/admin/users/${testUserId}/unban`)
        .set('Authorization', `Bearer ${regularToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid MongoDB ID', async () => {
      const response = await request(app)
        .put('/api/admin/users/invalid-id-format/unban')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Token and Authentication Edge Cases', () => {
    it('should reject expired token', async () => {
      const expiredToken = require('jsonwebtoken').sign(
        { userId: adminUserId, email: 'admin@test.com', role: 'admin' },
        process.env.JWT_SECRET || 'test-jwt-secret',
        { expiresIn: '-1h' } // Already expired
      );

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject malformed token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalid-token-format')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject missing Bearer prefix', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', adminToken) // Missing "Bearer "
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject token with wrong secret', async () => {
      const wrongToken = require('jsonwebtoken').sign(
        { userId: adminUserId, email: 'admin@test.com', role: 'admin' },
        'wrong-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${wrongToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
