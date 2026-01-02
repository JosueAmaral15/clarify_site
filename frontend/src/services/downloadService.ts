import api from './api';

export interface DownloadTrackingData {
  platform: 'windows' | 'macos' | 'linux';
  version?: string;
  source?: string;
}

export interface DownloadStats {
  total: number;
  byPlatform: {
    windows: number;
    macos: number;
    linux: number;
  };
  recent: Array<{
    platform: string;
    timestamp: string;
    count: number;
  }>;
}

class DownloadService {
  async trackDownload(data: DownloadTrackingData) {
    try {
      const response = await api.post('/downloads/track', data);
      return response.data;
    } catch (error) {
      console.error('Failed to track download:', error);
      throw error;
    }
  }

  async getDownloadStats(): Promise<DownloadStats> {
    try {
      const response = await api.get('/downloads/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch download stats:', error);
      throw error;
    }
  }

  async getDownloadLink(platform: 'windows' | 'macos' | 'linux'): Promise<string> {
    try {
      const response = await api.get(`/downloads/link/${platform}`);
      return response.data.url;
    } catch (error) {
      console.error('Failed to get download link:', error);
      throw error;
    }
  }
}

export default new DownloadService();
