import axios from 'axios';
import { authService } from './auth';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      /*
      // Token expirado o inválido
      authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      */
    }
    return Promise.reject(error);
  }
);

// Funciones de utilidad para manejar errores
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    const { status, data } = error.response;
    return {
      message: data?.message || data?.detail || `Error ${status}`,
      status,
      data: data,
    };
  } else if (error.request) {
    // La petición se hizo pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
    // Algo más pasó
    return {
      message: error.message || 'Error desconocido',
      status: 0,
    };
  }
};

// Funciones genéricas para CRUD
export const apiService = {
  // GET
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // POST
  post: async (url, data = {}) => {
    try {
      const response = await apiClient.post(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // PUT
  put: async (url, data = {}) => {
    try {
      const response = await apiClient.put(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // PATCH
  patch: async (url, data = {}) => {
    try {
      const response = await apiClient.patch(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // DELETE
  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default apiClient;
