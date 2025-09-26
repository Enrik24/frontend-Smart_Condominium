import axios from 'axios';
import { authService } from './auth';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const OFFLINE_MODE = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';

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

// Utilidades de mock en modo offline
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const idFromUrl = (url) => {
  const m = url.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : undefined;
};

const mockApi = async (method, url, payload = {}, params = {}) => {
  // Simula latencia de red
  await sleep(120);

  // Respuestas específicas para auth
  if (url.startsWith('/api/auth/login/') && method === 'POST') {
    const email = payload?.email || 'admin@smartcondo.com';
    return { success: true, data: { token: 'mock-token', user: { name: 'Administrador Principal', email, role: 'admin' } } };
  }
  if (url.startsWith('/api/auth/') && (method === 'POST' || method === 'PATCH')) {
    return { success: true, data: { id: Date.now(), ...payload } };
  }
  if (url.startsWith('/api/auth/usuarios/') && method === 'GET') {
    return { success: true, data: { results: [] } };
  }

  // Listados genéricos -> colecciones vacías
  if (method === 'GET' && url.endsWith('/')) {
    return { success: true, data: { results: [] } };
  }

  // Crear -> eco con id simulado
  if (method === 'POST') {
    return { success: true, data: { id: Date.now(), ...payload } };
  }

  // Actualizar -> fusiona datos
  if (method === 'PUT' || method === 'PATCH') {
    const id = idFromUrl(url) || payload?.id || Date.now();
    return { success: true, data: { id, ...payload } };
  }

  // Eliminar -> retorno mínimo
  if (method === 'DELETE') {
    return { success: true, data: { detail: 'deleted' } };
  }

  // Fallback
  return { success: true, data: {} };
};

// Funciones de utilidad para manejar errores
export const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      message: data?.message || data?.detail || `Error ${status}`,
      status,
      data: data,
    };
  } else if (error.request) {
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
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
    if (OFFLINE_MODE) return mockApi('GET', url, undefined, params);
    try {
      const response = await apiClient.get(url, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // POST
  post: async (url, data = {}) => {
    if (OFFLINE_MODE) return mockApi('POST', url, data);
    try {
      const response = await apiClient.post(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // PUT
  put: async (url, data = {}) => {
    if (OFFLINE_MODE) return mockApi('PUT', url, data);
    try {
      const response = await apiClient.put(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // PATCH
  patch: async (url, data = {}) => {
    if (OFFLINE_MODE) return mockApi('PATCH', url, data);
    try {
      const response = await apiClient.patch(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },

  // DELETE
  delete: async (url) => {
    if (OFFLINE_MODE) return mockApi('DELETE', url);
    try {
      const response = await apiClient.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: handleApiError(error) };
    }
  },
};

export default apiClient;
