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
      const stats = response.data.data || response.data;
      
      // Transform backend format to frontend format
      return {
        total: stats.total || 0,
        byPlatform: {
          windows: stats.byPlatform?.find((p: any) => p._id === 'windows')?.count || 0,
          macos: stats.byPlatform?.find((p: any) => p._id === 'macos')?.count || 0,
          linux: stats.byPlatform?.find((p: any) => p._id === 'linux')?.count || 0,
        },
        recent: stats.recent || [],
      };
    } catch (error) {
      console.error('Failed to fetch download stats:', error);
      // Return default stats instead of throwing
      return {
        total: 0,
        byPlatform: { windows: 0, macos: 0, linux: 0 },
        recent: [],
      };
    }
  }

  // Alias for admin panel
  async getStats(): Promise<DownloadStats> {
    return this.getDownloadStats();
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
