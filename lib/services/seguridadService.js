import { apiService } from '../api';

export const seguridadApiService = {
  // Invitados
  getInvitados: async (params = {}) => {
    return await apiService.get('/api/seguridad/invitados/', params);
  },

  getInvitado: async (id) => {
    return await apiService.get(`/api/seguridad/invitados/${id}/`);
  },

  createInvitado: async (invitadoData) => {
    return await apiService.post('/api/seguridad/invitados/', invitadoData);
  },

  updateInvitado: async (id, invitadoData) => {
    return await apiService.patch(`/api/seguridad/invitados/${id}/`, invitadoData);
  },

  deleteInvitado: async (id) => {
    return await apiService.delete(`/api/seguridad/invitados/${id}/`);
  },

  // Entradas y salidas
  getEntradasSalidas: async (params = {}) => {
    return await apiService.get('/api/seguridad/entradas-salidas/', params);
  },

  getEntradaSalida: async (id) => {
    return await apiService.get(`/api/seguridad/entradas-salidas/${id}/`);
  },

  createEntradaSalida: async (entradaData) => {
    return await apiService.post('/api/seguridad/entradas-salidas/', entradaData);
  },

  updateEntradaSalida: async (id, entradaData) => {
    return await apiService.patch(`/api/seguridad/entradas-salidas/${id}/`, entradaData);
  },

  deleteEntradaSalida: async (id) => {
    return await apiService.delete(`/api/seguridad/entradas-salidas/${id}/`);
  },

  // Infracciones
  getInfracciones: async (params = {}) => {
    return await apiService.get('/api/seguridad/infracciones/', params);
  },

  getInfraccion: async (id) => {
    return await apiService.get(`/api/seguridad/infracciones/${id}/`);
  },

  createInfraccion: async (infraccionData) => {
    return await apiService.post('/api/seguridad/infracciones/', infraccionData);
  },

  updateInfraccion: async (id, infraccionData) => {
    return await apiService.patch(`/api/seguridad/infracciones/${id}/`, infraccionData);
  },

  deleteInfraccion: async (id) => {
    return await apiService.delete(`/api/seguridad/infracciones/${id}/`);
  },
};
