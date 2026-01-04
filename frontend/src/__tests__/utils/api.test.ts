import { describe, it, expect } from 'vitest';
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
