import { apiService } from '../api';

export const areasComunesApiService = {
  // Áreas comunes
  getAreasComunes: async (params = {}) => {
    return await apiService.get('/api/areas-comunes/areas-comunes/', params);
  },

  getAreaComun: async (id) => {
    return await apiService.get(`/api/areas-comunes/areas-comunes/${id}/`);
  },

  createAreaComun: async (areaData) => {
    return await apiService.post('/api/areas-comunes/areas-comunes/', areaData);
  },

  updateAreaComun: async (id, areaData) => {
    return await apiService.patch(`/api/areas-comunes/areas-comunes/${id}/`, areaData);
  },

  deleteAreaComun: async (id) => {
    return await apiService.delete(`/api/areas-comunes/areas-comunes/${id}/`);
  },

  // Reservas
  getReservas: async (params = {}) => {
    return await apiService.get('/api/areas-comunes/reservas/', params);
  },

  getReserva: async (id) => {
    return await apiService.get(`/api/areas-comunes/reservas/${id}/`);
  },

  createReserva: async (reservaData) => {
    return await apiService.post('/api/areas-comunes/reservas/', reservaData);
  },

  updateReserva: async (id, reservaData) => {
    return await apiService.patch(`/api/areas-comunes/reservas/${id}/`, reservaData);
  },

  deleteReserva: async (id) => {
    return await apiService.delete(`/api/areas-comunes/reservas/${id}/`);
  },
};
