import request from 'supertest';
import { verifyEmailConnection } from '../../config/email.config';

jest.mock('../../config/database', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../config/email.config', () => ({
  verifyEmailConnection: jest.fn().mockResolvedValue(false),
  transporter: { sendMail: jest.fn() },
  FROM_EMAIL: 'test@example.com',
  ADMIN_EMAIL: 'admin@example.com',
}));

import app from '../../server';

describe('Public Vercel service routing', () => {
  const originalMongoURI = process.env.MONGODB_URI;

  afterEach(() => {
    process.env.MONGODB_URI = originalMongoURI;
  });

  it('does not verify SMTP when credentials are absent', () => {
    expect(verifyEmailConnection).not.toHaveBeenCalled();
  });

  it('serves API metadata at the exact public prefix', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
    expect(response.body.endpoints.health).toBe('/api/health');
  });

  it.each(['/api/health', '/health'])('serves health at %s', async (path) => {
    const response = await request(app).get(path);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('retains API authentication on prefixed routes', async () => {
    const response = await request(app).get('/api/users/me');
    expect(response.status).toBe(401);
  });

  it('fails fast when a database-backed route has no database configuration', async () => {
    delete process.env.MONGODB_URI;

    const response = await request(app).get('/api/downloads/stats');

    expect(response.status).toBe(503);
    expect(response.body.message).toBe('Database service is unavailable');
  });

  it('returns an API 404 rather than SPA HTML for unknown endpoints', async () => {
    const response = await request(app).get('/api/not-a-route');
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
