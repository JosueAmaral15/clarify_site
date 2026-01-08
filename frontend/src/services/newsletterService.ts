import apiClient from './api';

interface NewsletterResponse {
  success: boolean;
  message: string;
}

class NewsletterService {
  /**
   * Subscribe to newsletter
   */
  async subscribe(email: string): Promise<NewsletterResponse> {
    try {
      const response = await apiClient.post('/api/newsletter/subscribe', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw new Error('Failed to subscribe to newsletter');
    }
  }
}

export default new NewsletterService();
