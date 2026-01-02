import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    submittedAt: string;
  };
}

class ContactService {
  async submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await api.post('/contact', data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit contact form:', error);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data.message || 'Por favor, verifique os dados do formulário.'
        );
      }
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        throw new Error(
          'Você enviou muitas mensagens. Tente novamente mais tarde.'
        );
      }
      
      // Generic error
      throw new Error(
        'Falha ao enviar mensagem. Tente novamente mais tarde.'
      );
    }
  }
}

export default new ContactService();
