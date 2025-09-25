// Exportar todos los servicios de API
export { authApiService } from './authService';
export { unidadesApiService } from './unidadesService';
export { finanzasApiService } from './finanzasService';
export { comunicacionApiService } from './comunicacionService';
export { areasComunesApiService } from './areasComunesService';
export { mantenimientoApiService } from './mantenimientoService';
export { seguridadApiService } from './seguridadService';
export { reportesApiService } from './reportesService';
export { configuracionApiService } from './configuracionService';
export { bitacoraApiService } from './bitacoraService';
export { dashboardApiService } from './dashboardService';
export { permisosApiService } from './permisosService';

// Exportar el servicio base de API
export { apiService, handleApiError } from '../api';
