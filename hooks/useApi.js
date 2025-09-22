import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para manejar llamadas a la API
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message || 'Error desconocido',
        status: 0,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook para manejar operaciones CRUD
export const useCrud = (apiService) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.get(params);
      if (result.success) {
        setItems(result.data.results || result.data);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message || 'Error al cargar datos',
        status: 0,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const createItem = useCallback(async (itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.create(itemData);
      if (result.success) {
        setItems(prev => [result.data, ...prev]);
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message || 'Error al crear elemento',
        status: 0,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const updateItem = useCallback(async (id, itemData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.update(id, itemData);
      if (result.success) {
        setItems(prev => prev.map(item => 
          item.id === id ? result.data : item
        ));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message || 'Error al actualizar elemento',
        status: 0,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  const deleteItem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.delete(id);
      if (result.success) {
        setItems(prev => prev.filter(item => item.id !== id));
        return result;
      } else {
        setError(result.error);
        return result;
      }
    } catch (err) {
      const errorObj = {
        message: err.message || 'Error al eliminar elemento',
        status: 0,
      };
      setError(errorObj);
      return { success: false, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
