import { apiService } from '../api';

export const comunicacionApiService = {
  // Avisos
  getAvisos: async (params = {}) => {
    return await apiService.get('/api/comunicacion/avisos/', params);
  },

  getAviso: async (id) => {
    return await apiService.get(`/api/comunicacion/avisos/${id}/`);
  },

  createAviso: async (avisoData) => {
    return await apiService.post('/api/comunicacion/avisos/', avisoData);
  },

  updateAviso: async (id, avisoData) => {
    return await apiService.patch(`/api/comunicacion/avisos/${id}/`, avisoData);
  },

  deleteAviso: async (id) => {
    return await apiService.delete(`/api/comunicacion/avisos/${id}/`);
  },

  // Notificaciones
  getNotificaciones: async (params = {}) => {
    return await apiService.get('/api/comunicacion/notificaciones/', params);
  },

  getNotificacion: async (id) => {
    return await apiService.get(`/api/comunicacion/notificaciones/${id}/`);
  },

  createNotificacion: async (notificacionData) => {
    return await apiService.post('/api/comunicacion/notificaciones/', notificacionData);
  },

  updateNotificacion: async (id, notificacionData) => {
    return await apiService.patch(`/api/comunicacion/notificaciones/${id}/`, notificacionData);
  },

  deleteNotificacion: async (id) => {
    return await apiService.delete(`/api/comunicacion/notificaciones/${id}/`);
  },

  // Lecturas de avisos
  getLecturasAviso: async (params = {}) => {
    return await apiService.get('/api/comunicacion/lecturas-aviso/', params);
  },

  getLecturaAviso: async (id) => {
    return await apiService.get(`/api/comunicacion/lecturas-aviso/${id}/`);
  },

  createLecturaAviso: async (lecturaData) => {
    return await apiService.post('/api/comunicacion/lecturas-aviso/', lecturaData);
  },

  updateLecturaAviso: async (id, lecturaData) => {
    return await apiService.patch(`/api/comunicacion/lecturas-aviso/${id}/`, lecturaData);
  },

  deleteLecturaAviso: async (id) => {
    return await apiService.delete(`/api/comunicacion/lecturas-aviso/${id}/`);
  },
};
