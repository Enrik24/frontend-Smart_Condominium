import { apiService } from '../api';

export const rolesApiService = {
  get: async (params = {}) => {
    return await apiService.get('/api/auth/roles/', params);
  },
  getById: async (id) => {
    return await apiService.get(`/api/auth/roles/${id}/`);
  },
  create: async (data) => {
    return await apiService.post('/api/auth/roles/', data);
  },
  update: async (id, data) => {
    return await apiService.patch(`/api/auth/roles/${id}/`, data);
  },
  delete: async (id) => {
    return await apiService.delete(`/api/auth/roles/${id}/`);
  },
};
