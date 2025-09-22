# Guía de Integración con API - Smart Condominium

## Configuración Inicial

### 1. Archivo de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Optional: Add other environment variables as needed
# NEXT_PUBLIC_APP_NAME=Smart Condominium
# NEXT_PUBLIC_APP_VERSION=1.0.0
```

**Importante:** Reemplaza `http://127.0.0.1:8000` con la URL real de tu API.

### 2. Estructura de Servicios Creada

Se han creado los siguientes servicios de API en `lib/services/`:

- `authService.js` - Autenticación y usuarios
- `unidadesService.js` - Unidades habitacionales y vehículos
- `finanzasService.js` - Expensas, pagos y multas
- `comunicacionService.js` - Avisos, notificaciones y lecturas
- `areasComunesService.js` - Áreas comunes y reservas
- `mantenimientoService.js` - Tareas y gastos de mantenimiento
- `seguridadService.js` - Invitados, entradas/salidas e infracciones
- `reportesService.js` - Generación de reportes
- `configuracionService.js` - Configuraciones del sistema
- `bitacoraService.js` - Registro de actividades
- `dashboardService.js` - Datos del dashboard principal

### 3. Cliente HTTP Configurado

Se ha configurado un cliente HTTP robusto en `lib/api.js` que incluye:

- Interceptores para agregar tokens de autenticación automáticamente
- Manejo de errores 401 (token expirado)
- Redirección automática al login cuando el token expira
- Funciones de utilidad para manejo de errores

## Cómo Usar los Servicios

### Ejemplo Básico

```javascript
import { finanzasApiService } from '@/lib/services/finanzasService';

// Obtener expensas
const result = await finanzasApiService.getExpensas();
if (result.success) {
  console.log('Expensas:', result.data);
} else {
  console.error('Error:', result.error.message);
}

// Crear nueva expensa
const newExpensa = await finanzasApiService.createExpensa({
  periodo: '2024-03',
  unidad: '1A',
  montoBase: 25000,
  // ... otros campos
});
```

### Usando Hooks Personalizados

```javascript
import { useCrud } from '@/hooks/useApi';
import { finanzasApiService } from '@/lib/services/finanzasService';

function ExpensasPage() {
  const {
    items: expensas,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: finanzasApiService.getExpensas,
    create: finanzasApiService.createExpensa,
    update: finanzasApiService.updateExpensa,
    delete: finanzasApiService.deleteExpensa,
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ... resto del componente
}
```

## Endpoints de la API

Basándome en las URLs que proporcionaste, los servicios están configurados para consumir:

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/` - Registrar usuario
- `POST /api/auth/change-password/` - Cambiar contraseña

### Unidades
- `GET /api/unidades/unidades/` - Listar unidades
- `POST /api/unidades/unidades/` - Crear unidad
- `GET /api/unidades/vehiculos/` - Listar vehículos
- `POST /api/unidades/vehiculos/` - Crear vehículo

### Finanzas
- `GET /api/finanzas/expensas/` - Listar expensas
- `POST /api/finanzas/expensas/` - Crear expensa
- `GET /api/finanzas/pagos/` - Listar pagos
- `GET /api/finanzas/multas/` - Listar multas

### Comunicación
- `GET /api/comunicacion/avisos/` - Listar avisos
- `GET /api/comunicacion/notificaciones/` - Listar notificaciones

### Áreas Comunes
- `GET /api/areas-comunes/areas-comunes/` - Listar áreas
- `GET /api/areas-comunes/reservas/` - Listar reservas

### Mantenimiento
- `GET /api/mantenimiento/tareas-mantenimiento/` - Listar tareas
- `GET /api/mantenimiento/gastos-mantenimiento/` - Listar gastos

### Seguridad
- `GET /api/seguridad/invitados/` - Listar invitados
- `GET /api/seguridad/entradas-salidas/` - Listar accesos
- `GET /api/seguridad/infracciones/` - Listar infracciones

### Reportes
- `GET /api/reportes/reportes/` - Listar reportes
- `POST /api/reportes/reportes/generar/{tipo}/` - Generar reporte

## Componentes Actualizados

### Dashboard
El dashboard principal (`app/dashboard/page.jsx`) ha sido actualizado para:
- Consumir datos reales de la API
- Mostrar estadísticas calculadas dinámicamente
- Manejar estados de carga y error

### Expensas
La página de expensas (`app/finanzas/expensas/page.jsx`) ha sido actualizada para:
- Usar el hook `useCrud` para operaciones CRUD
- Manejar estados de carga y error
- Integrar con el servicio de finanzas

## Próximos Pasos

1. **Actualizar otras páginas**: Aplica el mismo patrón a las demás páginas del sistema
2. **Manejo de errores**: Personaliza los mensajes de error según tu API
3. **Validación**: Agrega validación de formularios usando Zod o similar
4. **Cache**: Considera implementar cache para mejorar el rendimiento
5. **Paginación**: Implementa paginación para listas grandes

## Estructura de Respuesta Esperada

Los servicios esperan que tu API devuelva respuestas en el formato:

```json
{
  "results": [...], // Para listas paginadas
  "count": 100,
  "next": "http://api.com/endpoint/?page=2",
  "previous": null
}
```

O para elementos individuales:

```json
{
  "id": 1,
  "campo1": "valor1",
  "campo2": "valor2",
  // ... otros campos
}
```

## Manejo de Autenticación

El sistema maneja automáticamente:
- Agregar el token Bearer a las peticiones
- Redirigir al login cuando el token expira
- Almacenar el token y datos del usuario en localStorage

## Notas Importantes

1. **CORS**: Asegúrate de que tu API tenga configurado CORS para permitir peticiones desde el frontend
2. **Tokens**: El sistema espera tokens JWT en el formato `Bearer {token}`
3. **Errores**: Los errores se manejan de forma consistente en toda la aplicación
4. **Loading States**: Todos los servicios incluyen estados de carga

¿Necesitas ayuda con algún aspecto específico de la integración?
