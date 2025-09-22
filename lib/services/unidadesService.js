import { apiService } from '../api';

export const unidadesApiService = {
  // Unidades habitacionales
  getUnidades: async (params = {}) => {
    return await apiService.get('/api/unidades/unidades/', params);
  },

  getUnidad: async (id) => {
    return await apiService.get(`/api/unidades/unidades/${id}/`);
  },

  createUnidad: async (unidadData) => {
    return await apiService.post('/api/unidades/unidades/', unidadData);
  },

  updateUnidad: async (id, unidadData) => {
    return await apiService.patch(`/api/unidades/unidades/${id}/`, unidadData);
  },

  deleteUnidad: async (id) => {
    return await apiService.delete(`/api/unidades/unidades/${id}/`);
  },

  // Vehículos
  getVehiculos: async (params = {}) => {
    return await apiService.get('/api/unidades/vehiculos/', params);
  },

  getVehiculo: async (id) => {
    return await apiService.get(`/api/unidades/vehiculos/${id}/`);
  },

  createVehiculo: async (vehiculoData) => {
    return await apiService.post('/api/unidades/vehiculos/', vehiculoData);
  },

  updateVehiculo: async (id, vehiculoData) => {
    return await apiService.patch(`/api/unidades/vehiculos/${id}/`, vehiculoData);
  },

  deleteVehiculo: async (id) => {
    return await apiService.delete(`/api/unidades/vehiculos/${id}/`);
  },
};
