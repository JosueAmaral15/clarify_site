import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedContacts {
  contacts: ContactMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
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

  // Admin methods
  async getContacts(page = 1, limit = 20, status?: string): Promise<PaginatedContacts> {
    const response = await api.get('/admin/contacts', {
      params: { page, limit, status },
    });
    return response.data.data;
  }

  async updateContactStatus(id: string, status: string): Promise<ContactMessage> {
    const response = await api.put(`/admin/contacts/${id}/status`, { status });
    return response.data.data;
  }

  async deleteContact(id: string): Promise<void> {
    await api.delete(`/admin/contacts/${id}`);
  }
}

export default new ContactService();
