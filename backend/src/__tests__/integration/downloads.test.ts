import request from 'supertest';
import app from '../../server';
import Download from '../../models/Download';
import mongoose from 'mongoose';

describe('Download API Integration Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/clarify_test');
    }
  });

  afterAll(async () => {
    await Download.deleteMany({});
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Download.deleteMany({});
  });

  describe('POST /api/downloads', () => {
    it('should track a download with valid data', async () => {
      const downloadData = {
        email: 'user@example.com',
        platform: 'windows',
      };

      const response = await request(app)
        .post('/api/downloads')
        .send(downloadData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sucesso');
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.timestamp).toBeDefined();

      // Verify in database
      const download = await Download.findById(response.body.data.id);
      expect(download).toBeDefined();
      expect(download?.email).toBe('user@example.com');
      expect(download?.platform).toBe('windows');
    });

    it('should track download with default platform if not provided', async () => {
      const downloadData = {
        email: 'user@example.com',
      };

      const response = await request(app)
        .post('/api/downloads')
        .send(downloadData)
        .expect(201);

      expect(response.body.success).toBe(true);

      // Verify default platform
      const download = await Download.findById(response.body.data.id);
      expect(download?.platform).toBe('other');
    });

    it('should reject invalid email format', async () => {
      const downloadData = {
        email: 'invalid-email',
        platform: 'windows',
      };

      const response = await request(app)
        .post('/api/downloads')
        .send(downloadData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject invalid platform', async () => {
      const downloadData = {
        email: 'user@example.com',
        platform: 'invalid-platform',
      };

      const response = await request(app)
        .post('/api/downloads')
        .send(downloadData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should accept all valid platforms', async () => {
      const platforms = ['windows', 'macos', 'linux', 'other'];

      for (const platform of platforms) {
        const response = await request(app)
          .post('/api/downloads')
          .send({
            email: `user-${platform}@example.com`,
            platform,
          })
          .expect(201);

        expect(response.body.success).toBe(true);
      }

      // Verify all were created
      const count = await Download.countDocuments();
      expect(count).toBe(4);
    });

    it('should store IP address and user agent', async () => {
      const response = await request(app)
        .post('/api/downloads')
        .set('User-Agent', 'Test Browser/1.0')
        .send({
          email: 'user@example.com',
          platform: 'windows',
        })
        .expect(201);

      const download = await Download.findById(response.body.data.id);
      expect(download?.userAgent).toBe('Test Browser/1.0');
      expect(download?.ipAddress).toBeDefined();
    });

    it('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/api/downloads')
        .send({
          email: 'USER@EXAMPLE.COM',
          platform: 'windows',
        })
        .expect(201);

      const download = await Download.findById(response.body.data.id);
      expect(download?.email).toBe('user@example.com');
    });
  });

  describe('GET /api/downloads/stats', () => {
    beforeEach(async () => {
      // Create test downloads
      await Download.create([
        { email: 'user1@test.com', platform: 'windows' },
        { email: 'user2@test.com', platform: 'windows' },
        { email: 'user3@test.com', platform: 'macos' },
        { email: 'user4@test.com', platform: 'linux' },
        { email: 'user5@test.com', platform: 'other' },
      ]);
    });

    it('should return download statistics', async () => {
      const response = await request(app)
        .get('/api/downloads/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.total).toBe(5);
      expect(response.body.data.last7Days).toBe(5);
      expect(Array.isArray(response.body.data.byPlatform)).toBe(true);
    });

    it('should group downloads by platform correctly', async () => {
      const response = await request(app)
        .get('/api/downloads/stats')
        .expect(200);

      const byPlatform = response.body.data.byPlatform;
      expect(byPlatform.length).toBeGreaterThan(0);

      // Find windows count
      const windowsStats = byPlatform.find((p: any) => p._id === 'windows');
      expect(windowsStats).toBeDefined();
      expect(windowsStats.count).toBe(2);

      // Find macos count
      const macosStats = byPlatform.find((p: any) => p._id === 'macos');
      expect(macosStats).toBeDefined();
      expect(macosStats.count).toBe(1);
    });

    it('should return zero stats when no downloads exist', async () => {
      // Clear all downloads
      await Download.deleteMany({});

      const response = await request(app)
        .get('/api/downloads/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(0);
      expect(response.body.data.last7Days).toBe(0);
      expect(response.body.data.byPlatform).toEqual([]);
    });

    it('should only count downloads from last 7 days', async () => {
      // Create old download (8 days ago)
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 8);
      
      await Download.create({
        email: 'old@test.com',
        platform: 'windows',
        timestamp: oldDate,
      });

      const response = await request(app)
        .get('/api/downloads/stats')
        .expect(200);

      // Total should be 6 (5 recent + 1 old)
      expect(response.body.data.total).toBe(6);
      // But last7Days should only be 5
      expect(response.body.data.last7Days).toBe(5);
    });
  });
});
