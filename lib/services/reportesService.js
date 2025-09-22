import { apiService } from '../api';

export const reportesApiService = {
  // Reportes
  getReportes: async (params = {}) => {
    return await apiService.get('/api/reportes/reportes/', params);
  },

  getReporte: async (id) => {
    return await apiService.get(`/api/reportes/reportes/${id}/`);
  },

  createReporte: async (reporteData) => {
    return await apiService.post('/api/reportes/reportes/', reporteData);
  },

  updateReporte: async (id, reporteData) => {
    return await apiService.patch(`/api/reportes/reportes/${id}/`, reporteData);
  },

  deleteReporte: async (id) => {
    return await apiService.delete(`/api/reportes/reportes/${id}/`);
  },

  // Generar reporte específico
  generarReporte: async (tipoReporte, parametros = {}) => {
    return await apiService.post(`/api/reportes/reportes/generar/${tipoReporte}/`, parametros);
  },

  // Descargar reporte
  descargarReporte: async (id, formato = 'pdf') => {
    return await apiService.get(`/api/reportes/reportes/${id}/descargar/?formato=${formato}`);
  },
};
