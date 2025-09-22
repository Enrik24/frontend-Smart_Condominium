import { apiService } from '../api';

export const configuracionApiService = {
  // Configuraciones
  getConfiguraciones: async (params = {}) => {
    return await apiService.get('/api/config/configuraciones/', params);
  },

  getConfiguracion: async (id) => {
    return await apiService.get(`/api/config/configuraciones/${id}/`);
  },

  createConfiguracion: async (configuracionData) => {
    return await apiService.post('/api/config/configuraciones/', configuracionData);
  },

  updateConfiguracion: async (id, configuracionData) => {
    return await apiService.patch(`/api/config/configuraciones/${id}/`, configuracionData);
  },

  deleteConfiguracion: async (id) => {
    return await apiService.delete(`/api/config/configuraciones/${id}/`);
  },

  // Obtener configuración por clave
  getConfiguracionByKey: async (clave) => {
    return await apiService.get(`/api/config/configuraciones/?clave=${clave}`);
  },
};
