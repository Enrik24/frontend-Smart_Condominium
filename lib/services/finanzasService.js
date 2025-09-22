import { apiService } from '../api';

export const finanzasApiService = {
  // Expensas
  getExpensas: async (params = {}) => {
    return await apiService.get('/api/finanzas/expensas/', params);
  },

  getExpensa: async (id) => {
    return await apiService.get(`/api/finanzas/expensas/${id}/`);
  },

  createExpensa: async (expensaData) => {
    return await apiService.post('/api/finanzas/expensas/', expensaData);
  },

  updateExpensa: async (id, expensaData) => {
    return await apiService.patch(`/api/finanzas/expensas/${id}/`, expensaData);
  },

  deleteExpensa: async (id) => {
    return await apiService.delete(`/api/finanzas/expensas/${id}/`);
  },

  // Pagos
  getPagos: async (params = {}) => {
    return await apiService.get('/api/finanzas/pagos/', params);
  },

  getPago: async (id) => {
    return await apiService.get(`/api/finanzas/pagos/${id}/`);
  },

  createPago: async (pagoData) => {
    return await apiService.post('/api/finanzas/pagos/', pagoData);
  },

  updatePago: async (id, pagoData) => {
    return await apiService.patch(`/api/finanzas/pagos/${id}/`, pagoData);
  },

  deletePago: async (id) => {
    return await apiService.delete(`/api/finanzas/pagos/${id}/`);
  },

  // Multas
  getMultas: async (params = {}) => {
    return await apiService.get('/api/finanzas/multas/', params);
  },

  getMulta: async (id) => {
    return await apiService.get(`/api/finanzas/multas/${id}/`);
  },

  createMulta: async (multaData) => {
    return await apiService.post('/api/finanzas/multas/', multaData);
  },

  updateMulta: async (id, multaData) => {
    return await apiService.patch(`/api/finanzas/multas/${id}/`, multaData);
  },

  deleteMulta: async (id) => {
    return await apiService.delete(`/api/finanzas/multas/${id}/`);
  },
};
