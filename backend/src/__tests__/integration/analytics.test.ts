import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import Download from '../../models/Download';
import Contact from '../../models/Contact';
import Newsletter from '../../models/Newsletter';
import mongoose from 'mongoose';

describe('Analytics API Integration Tests', () => {
  let adminToken: string;
  let userToken: string;
  let adminUserId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }

    // Clean up
    await User.deleteMany({});
    await Download.deleteMany({});
    await Contact.deleteMany({});
    await Newsletter.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@analytics.com',
      password: 'AdminPass123!',
      role: 'admin',
      isActive: true,
    });
    adminUserId = adminUser._id.toString();

    // Create regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@analytics.com',
      password: 'UserPass123!',
      role: 'user',
      isActive: true,
    });

    // Generate tokens
    const jwt = require('jsonwebtoken');
    adminToken = jwt.sign(
      { userId: adminUserId, email: 'admin@analytics.com', role: 'admin' },
      process.env.JWT_SECRET || 'test-jwt-secret',
      { expiresIn: '1h' }
    );

    userToken = jwt.sign(
      { userId: regularUser._id.toString(), email: 'user@analytics.com', role: 'user' },
      process.env.JWT_SECRET || 'test-jwt-secret',
      { expiresIn: '1h' }
    );

    // Create test data with specific dates
    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Downloads - various platforms and dates
    await Download.insertMany([
      { email: 'test1@test.com', platform: 'windows', timestamp: now },
      { email: 'test2@test.com', platform: 'macos', timestamp: now },
      { email: 'test3@test.com', platform: 'linux', timestamp: now },
      { email: 'test4@test.com', platform: 'windows', timestamp: lastMonth },
      { email: 'test5@test.com', platform: 'macos', timestamp: twoMonthsAgo },
    ]);

    // Contacts - current and old
    await Contact.insertMany([
      { 
        name: 'Contact 1', 
        email: 'contact1@test.com', 
        subject: 'Test Subject 1', 
        message: 'Test message for contact 1', 
        status: 'new'
      },
      { 
        name: 'Contact 2', 
        email: 'contact2@test.com', 
        subject: 'Test Subject 2', 
        message: 'Test message for contact 2', 
        status: 'new'
      },
      { 
        name: 'Contact 3', 
        email: 'contact3@test.com', 
        subject: 'Test Subject 3', 
        message: 'Test message for contact 3', 
        status: 'read',
        createdAt: lastMonth,
        updatedAt: lastMonth
      },
    ]);

    // Newsletter subscribers
    await Newsletter.insertMany([
      { email: 'news1@test.com', isActive: true, subscribedAt: now },
      { email: 'news2@test.com', isActive: true, subscribedAt: now },
      { email: 'news3@test.com', isActive: false, subscribedAt: lastMonth },
    ]);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Download.deleteMany({});
    await Contact.deleteMany({});
    await Newsletter.deleteMany({});
  });

  describe('GET /api/analytics/stats', () => {
    it('should return dashboard statistics for admin', async () => {
      const response = await request(app)
        .get('/api/analytics/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      
      // Check structure
      expect(response.body.data.downloads).toBeDefined();
      expect(response.body.data.contacts).toBeDefined();
      expect(response.body.data.newsletter).toBeDefined();

      // Check downloads stats
      expect(response.body.data.downloads.total).toBe(5);
      expect(response.body.data.downloads.thisMonth).toBe(3);

      // Check contacts stats
      expect(response.body.data.contacts.total).toBe(3);
      expect(response.body.data.contacts.thisMonth).toBe(2);

      // Check newsletter stats
      expect(response.body.data.newsletter.total).toBe(3);
      expect(response.body.data.newsletter.thisMonth).toBe(2);
    });

    it('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/analytics/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/stats')
        .expect(401);
    });
  });

  describe('GET /api/analytics/downloads', () => {
    it('should return downloads list for admin', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(5);
      
      // Check first download (most recent)
      const download = response.body.data[0];
      expect(download).toHaveProperty('email');
      expect(download).toHaveProperty('platform');
      expect(download).toHaveProperty('timestamp');
    });

    it('should sort downloads by most recent first', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const downloads = response.body.data;
      expect(downloads.length).toBeGreaterThan(1);

      // Verify descending order by timestamp
      for (let i = 0; i < downloads.length - 1; i++) {
        const current = new Date(downloads[i].timestamp);
        const next = new Date(downloads[i + 1].timestamp);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should limit results to 100 downloads', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(100);
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/analytics/downloads')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/downloads')
        .expect(401);
    });
  });

  describe('GET /api/analytics/downloads/by-platform', () => {
    it('should return downloads grouped by platform', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/by-platform')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3); // windows, macos, linux

      // Check structure
      response.body.data.forEach((platformStat: any) => {
        expect(platformStat).toHaveProperty('_id'); // platform name
        expect(platformStat).toHaveProperty('count');
        expect(typeof platformStat.count).toBe('number');
      });
    });

    it('should sort platforms by count descending', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/by-platform')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const platforms = response.body.data;
      
      // Verify descending order by count
      for (let i = 0; i < platforms.length - 1; i++) {
        expect(platforms[i].count).toBeGreaterThanOrEqual(platforms[i + 1].count);
      }
    });

    it('should have correct counts per platform', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/by-platform')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const platforms = response.body.data;
      const windowsCount = platforms.find((p: any) => p._id === 'windows')?.count;
      const macosCount = platforms.find((p: any) => p._id === 'macos')?.count;
      const linuxCount = platforms.find((p: any) => p._id === 'linux')?.count;

      expect(windowsCount).toBe(2);
      expect(macosCount).toBe(2);
      expect(linuxCount).toBe(1);
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/analytics/downloads/by-platform')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/downloads/by-platform')
        .expect(401);
    });
  });

  describe('GET /api/analytics/contacts', () => {
    it('should return recent contacts for admin', async () => {
      const response = await request(app)
        .get('/api/analytics/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);

      // Check structure
      const contact = response.body.data[0];
      expect(contact).toHaveProperty('name');
      expect(contact).toHaveProperty('email');
      expect(contact).toHaveProperty('subject');
      expect(contact).toHaveProperty('message');
      expect(contact).toHaveProperty('createdAt');
      expect(contact).toHaveProperty('status');
    });

    it('should sort contacts by most recent first', async () => {
      const response = await request(app)
        .get('/api/analytics/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const contacts = response.body.data;
      
      // Verify descending order by createdAt
      for (let i = 0; i < contacts.length - 1; i++) {
        const current = new Date(contacts[i].createdAt);
        const next = new Date(contacts[i + 1].createdAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should limit results to 50 contacts', async () => {
      const response = await request(app)
        .get('/api/analytics/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(50);
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/analytics/contacts')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/contacts')
        .expect(401);
    });
  });

  describe('GET /api/analytics/newsletter', () => {
    it('should return newsletter subscribers for admin', async () => {
      const response = await request(app)
        .get('/api/analytics/newsletter')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);

      // Check structure
      const subscriber = response.body.data[0];
      expect(subscriber).toHaveProperty('email');
      expect(subscriber).toHaveProperty('isActive');
      expect(subscriber).toHaveProperty('subscribedAt');
      expect(typeof subscriber.isActive).toBe('boolean');
    });

    it('should sort subscribers by most recent first', async () => {
      const response = await request(app)
        .get('/api/analytics/newsletter')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const subscribers = response.body.data;
      
      // Verify descending order by subscribedAt
      for (let i = 0; i < subscribers.length - 1; i++) {
        const current = new Date(subscribers[i].subscribedAt);
        const next = new Date(subscribers[i + 1].subscribedAt);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    });

    it('should include both active and inactive subscribers', async () => {
      const response = await request(app)
        .get('/api/analytics/newsletter')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const subscribers = response.body.data;
      const hasActive = subscribers.some((s: any) => s.isActive === true);
      const hasInactive = subscribers.some((s: any) => s.isActive === false);

      expect(hasActive).toBe(true);
      expect(hasInactive).toBe(true);
    });

    it('should limit results to 100 subscribers', async () => {
      const response = await request(app)
        .get('/api/analytics/newsletter')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(100);
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/analytics/newsletter')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/newsletter')
        .expect(401);
    });
  });

  describe('GET /api/analytics/downloads/timeline', () => {
    it('should return downloads timeline for last 30 days', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/timeline')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      // Check structure
      if (response.body.data.length > 0) {
        const timelineEntry = response.body.data[0];
        expect(timelineEntry).toHaveProperty('_id'); // date string
        expect(timelineEntry).toHaveProperty('count');
        expect(typeof timelineEntry.count).toBe('number');
        
        // Verify date format (YYYY-MM-DD)
        expect(timelineEntry._id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('should sort timeline by date ascending', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/timeline')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const timeline = response.body.data;
      
      if (timeline.length > 1) {
        // Verify ascending order by date
        for (let i = 0; i < timeline.length - 1; i++) {
          const current = new Date(timeline[i]._id);
          const next = new Date(timeline[i + 1]._id);
          expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
        }
      }
    });

    it('should only include downloads from last 30 days', async () => {
      const response = await request(app)
        .get('/api/analytics/downloads/timeline')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const timeline = response.body.data;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Verify all dates are within last 30 days
      timeline.forEach((entry: any) => {
        const entryDate = new Date(entry._id);
        expect(entryDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
      });
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/analytics/downloads/timeline')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/analytics/downloads/timeline')
        .expect(401);
    });
  });
});
