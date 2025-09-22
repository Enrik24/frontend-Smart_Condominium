import { apiService } from '../api';

export const authApiService = {
  // Login
  login: async (email, password) => {
    return await apiService.post('/api/auth/login/', { email, password });
  },

  // Register
  register: async (userData) => {
    return await apiService.post('/api/auth/', userData);
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    return await apiService.post('/api/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  // Get current user profile
  getProfile: async () => {
    return await apiService.get('/api/auth/usuarios/');
  },

  // Update profile
  updateProfile: async (userData) => {
    return await apiService.patch('/api/auth/', userData);
  },
};
