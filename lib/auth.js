import { authApiService } from './services/authService';

// Authentication utilities for localStorage-based session management
export const AUTH_TOKEN_KEY = "condominium_auth_token"
export const USER_DATA_KEY = "condominium_user_data"

export const authService = {
  // Login function - connects to API
  login: async (email, password) => {
    const result = await authApiService.login(email, password);
    
    if (result.success) {
      // Guardar el token y los datos del usuario
      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token || result.data.access);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data.user || result.data));
      return { success: true, ...result.data };
    } else {
      throw new Error(result.error.message || "Credenciales inválidas");
    }
  },

  // Register function - connects to API
  register: async (userData) => {
    const result = await authApiService.register(userData);
    
    if (result.success) {
      // Guardar el token y los datos del usuario
      localStorage.setItem(AUTH_TOKEN_KEY, result.data.token || result.data.access);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(result.data.user || result.data));
      return { success: true, ...result.data };
    } else {
      throw new Error(result.error.message || "Error al registrar usuario");
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === "undefined") return false
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userData = localStorage.getItem(USER_DATA_KEY)
    
    // Si hay token o datos de usuario, considerar autenticado
    return !!(token || userData)
  },

  // Get current user data
  getCurrentUser: () => {
    if (typeof window === "undefined") return null
    const userData = localStorage.getItem(USER_DATA_KEY)
    
    if (userData) {
      return JSON.parse(userData)
    }
    
    // Si no hay datos de usuario, devolver datos de ejemplo
    return {
      id: 1,
      name: "Administrador Principal",
      email: "admin@smartcondo.com",
      role: "admin",
      avatar: "/placeholder-user.jpg"
    }
  },

  // Get auth token
  getToken: () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },
}
