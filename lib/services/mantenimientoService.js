import { apiService } from '../api';

export const mantenimientoApiService = {
  // Tareas de mantenimiento
  getTareasMantenimiento: async (params = {}) => {
    return await apiService.get('/api/mantenimiento/tareas-mantenimiento/', params);
  },

  getTareaMantenimiento: async (id) => {
    return await apiService.get(`/api/mantenimiento/tareas-mantenimiento/${id}/`);
  },

  createTareaMantenimiento: async (tareaData) => {
    return await apiService.post('/api/mantenimiento/tareas-mantenimiento/', tareaData);
  },

  updateTareaMantenimiento: async (id, tareaData) => {
    return await apiService.patch(`/api/mantenimiento/tareas-mantenimiento/${id}/`, tareaData);
  },

  deleteTareaMantenimiento: async (id) => {
    return await apiService.delete(`/api/mantenimiento/tareas-mantenimiento/${id}/`);
  },

  // Gastos de mantenimiento
  getGastosMantenimiento: async (params = {}) => {
    return await apiService.get('/api/mantenimiento/gastos-mantenimiento/', params);
  },

  getGastoMantenimiento: async (id) => {
    return await apiService.get(`/api/mantenimiento/gastos-mantenimiento/${id}/`);
  },

  createGastoMantenimiento: async (gastoData) => {
    return await apiService.post('/api/mantenimiento/gastos-mantenimiento/', gastoData);
  },

  updateGastoMantenimiento: async (id, gastoData) => {
    return await apiService.patch(`/api/mantenimiento/gastos-mantenimiento/${id}/`, gastoData);
  },

  deleteGastoMantenimiento: async (id) => {
    return await apiService.delete(`/api/mantenimiento/gastos-mantenimiento/${id}/`);
  },
};
