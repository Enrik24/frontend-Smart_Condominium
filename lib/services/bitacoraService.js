import { apiService } from '../api';

export const bitacoraApiService = {
  // Bitácora
  getBitacora: async (params = {}) => {
    return await apiService.get('/api/bitacora/bitacora/', params);
  },

  getBitacoraEntry: async (id) => {
    return await apiService.get(`/api/bitacora/bitacora/${id}/`);
  },

  createBitacoraEntry: async (bitacoraData) => {
    return await apiService.post('/api/bitacora/bitacora/', bitacoraData);
  },

  updateBitacoraEntry: async (id, bitacoraData) => {
    return await apiService.patch(`/api/bitacora/bitacora/${id}/`, bitacoraData);
  },

  deleteBitacoraEntry: async (id) => {
    return await apiService.delete(`/api/bitacora/bitacora/${id}/`);
  },

  // Obtener bitácora por usuario
  getBitacoraByUser: async (userId, params = {}) => {
    return await apiService.get(`/api/bitacora/bitacora/?usuario=${userId}`, params);
  },

  // Obtener bitácora por fecha
  getBitacoraByDate: async (fechaInicio, fechaFin, params = {}) => {
    return await apiService.get(`/api/bitacora/bitacora/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`, params);
  },
};
