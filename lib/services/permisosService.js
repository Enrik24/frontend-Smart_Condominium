import { apiService } from '../api';

export const permisosApiService = {
  get: async (params = {}) => {
    return await apiService.get('/api/auth/permisos/', params);
  },
  getById: async (id) => {
    return await apiService.get(`/api/auth/permisos/${id}/`);
  },
  create: async (data) => {
    return await apiService.post('/api/auth/permisos/', data);
  },
  update: async (id, data) => {
    return await apiService.patch(`/api/auth/permisos/${id}/`, data);
  },
  delete: async (id) => {
    return await apiService.delete(`/api/auth/permisos/${id}/`);
  },
};
