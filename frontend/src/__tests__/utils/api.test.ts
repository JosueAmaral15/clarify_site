// @vitest-environment node
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { AxiosError } from 'axios';
import api from '../../services/api';

describe('API Service', () => {
  it('should have correct base URL', () => {
    expect(api.defaults.baseURL).toBeDefined();
    expect(typeof api.defaults.baseURL).toBe('string');
  });

  it('should have authorization interceptor', () => {
    expect(api.interceptors.request).toBeDefined();
  });

  it('should have response interceptor', () => {
    expect(api.interceptors.response).toBeDefined();
  });
});

describe('API routing for Vercel Services', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  async function loadClient(baseURL: string) {
    vi.stubEnv('VITE_API_URL', baseURL);
    vi.resetModules();
    return (await import('../../services/api')).default;
  }

  it('uses the same origin and preserves the API prefix', async () => {
    const client = await loadClient('');
    expect(client.getUri({ url: '/downloads/stats' })).toBe('/api/downloads/stats');
    expect(client.getUri({ url: '/auth/login' })).toBe('/api/auth/login');
  });

  it('defaults whitespace-only configuration to the same origin', async () => {
    const client = await loadClient('   ');
    expect(client.defaults.baseURL).toBe('/api');
  });

  it('supports a public API override without duplicate slashes', async () => {
    const client = await loadClient(' https://api.example.com/api/// ');
    expect(client.getUri({ url: '/auth/login' })).toBe('https://api.example.com/api/auth/login');
  });

  it('refreshes authentication through the same API base before retrying', async () => {
    const client = await loadClient('');
    const refreshedAxios = (await import('axios')).default;
    const post = vi.spyOn(refreshedAxios, 'post').mockResolvedValue({
      data: { accessToken: 'new-access-token' },
    });
    localStorage.setItem('refreshToken', 'test-refresh-token');
    let attempts = 0;
    client.defaults.adapter = async (config) => {
      attempts += 1;
      if (attempts === 1) {
        throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
          status: 401, statusText: 'Unauthorized', data: {}, headers: {}, config,
        });
      }
      expect(config.headers.Authorization).toBe('Bearer new-access-token');
      return { status: 200, statusText: 'OK', data: { ok: true }, headers: {}, config };
    };

    const response = await client.get('/users/me');
    expect(response.data).toEqual({ ok: true });
    expect(attempts).toBe(2);
    expect(post).toHaveBeenCalledWith('/api/auth/refresh',
      { refreshToken: 'test-refresh-token' }, { withCredentials: true });
  });

  it('subscribes to the newsletter without duplicating the API prefix', async () => {
    const client = await loadClient('');
    client.defaults.adapter = async (config) => {
      expect(client.getUri(config)).toBe('/api/newsletter/subscribe');
      expect(JSON.parse(config.data)).toEqual({ email: 'reader@example.com' });
      return {
        status: 200, statusText: 'OK', headers: {}, config,
        data: { success: true, message: 'Subscribed' },
      };
    };
    const newsletter = (await import('../../services/newsletterService')).default;
    expect(await newsletter.subscribe('reader@example.com')).toEqual({
      success: true, message: 'Subscribed',
    });
  });
});
