import api from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/me');
    return response.data.user;
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put('/users/me', data);
    return response.data.user;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/users/me/password', data);
  },

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    await api.delete('/users/me', { data: { password } });
  },
};

export default userService;
