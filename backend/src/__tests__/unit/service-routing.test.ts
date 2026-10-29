import request from 'supertest';

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

  it('returns an API 404 rather than SPA HTML for unknown endpoints', async () => {
    const response = await request(app).get('/api/not-a-route');
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
