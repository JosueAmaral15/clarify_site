import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  adminUsers: number;
  newUsersLastWeek: number;
}

const adminService = {
  // Get all users with pagination and search
  getUsers: async (page = 1, limit = 10, search = ''): Promise<PaginatedUsers> => {
    const response = await api.get('/admin/users', {
      params: { page, limit, search },
    });
    return response.data.data;
  },

  // Get user details by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  },

  // Ban user
  banUser: async (id: string): Promise<User> => {
    const response = await api.put(`/admin/users/${id}/ban`);
    return response.data.data;
  },

  // Unban user
  unbanUser: async (id: string): Promise<User> => {
    const response = await api.put(`/admin/users/${id}/unban`);
    return response.data.data;
  },

  // Get admin statistics
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },
};

export default adminService;
