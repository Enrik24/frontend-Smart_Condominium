import { apiService } from '../api';

export const dashboardApiService = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    // Como no hay un endpoint específico de dashboard, 
    // podemos hacer múltiples llamadas y combinar los datos
    const [expensasResult, pagosResult, multasResult, reservasResult, entradasResult, infraccionesResult] = await Promise.all([
      apiService.get('/api/finanzas/expensas/'),
      apiService.get('/api/finanzas/pagos/'),
      apiService.get('/api/finanzas/multas/'),
      apiService.get('/api/areas-comunes/reservas/'),
      apiService.get('/api/seguridad/entradas-salidas/'),
      apiService.get('/api/seguridad/infracciones/'),
    ]);

    // Procesar los datos para crear estadísticas
    const stats = {
      expensas: {
        title: "Expensas del Mes",
        value: `$${expensasResult.success ? expensasResult.data.results?.reduce((sum, exp) => sum + (exp.monto || 0), 0).toLocaleString() : '0'}`,
        description: `${pagosResult.success ? pagosResult.data.results?.length || 0 : 0} pagos realizados`,
        trend: { positive: true, value: "+12% vs mes anterior" }
      },
      morosidad: {
        title: "Morosidad",
        value: "15%",
        description: "3 unidades",
        trend: { positive: false, value: "+2% vs mes anterior" }
      },
      multas: {
        title: "Multas Aplicadas",
        value: `$${multasResult.success ? multasResult.data.results?.reduce((sum, multa) => sum + (multa.monto || 0), 0).toLocaleString() : '0'}`,
        description: `${multasResult.success ? multasResult.data.results?.length || 0 : 0} infracciones`
      },
      reservas: {
        title: "Ingresos por Reservas",
        value: `$${reservasResult.success ? reservasResult.data.results?.reduce((sum, res) => sum + (res.costo || 0), 0).toLocaleString() : '0'}`,
        description: `${reservasResult.success ? reservasResult.data.results?.length || 0 : 0} reservas`,
        trend: { positive: true, value: "+5% vs mes anterior" }
      },
      accesos: {
        title: "Accesos Hoy",
        value: `${entradasResult.success ? entradasResult.data.results?.filter(entrada => {
          const today = new Date().toDateString();
          const entradaDate = new Date(entrada.fecha_entrada).toDateString();
          return today === entradaDate;
        }).length || 0 : 0}`,
        description: "Residentes y visitantes"
      },
      alertas: {
        title: "Alertas Activas",
        value: "2",
        description: "Requieren atención"
      },
      infracciones: {
        title: "Infracciones",
        value: `${infraccionesResult.success ? infraccionesResult.data.results?.length || 0 : 0}`,
        description: "Este mes"
      },
      visitantes: {
        title: "Visitantes",
        value: `${entradasResult.success ? entradasResult.data.results?.filter(entrada => entrada.tipo === 'visitante').length || 0 : 0}`,
        description: "Registrados hoy"
      }
    };

    return { success: true, data: { stats } };
  },

  // Obtener actividades recientes
  getRecentActivities: async () => {
    // Combinar datos de diferentes fuentes para crear actividades recientes
    const [pagosResult, entradasResult, avisosResult] = await Promise.all([
      apiService.get('/api/finanzas/pagos/?limit=5'),
      apiService.get('/api/seguridad/entradas-salidas/?limit=5'),
      apiService.get('/api/comunicacion/avisos/?limit=5'),
    ]);

    const activities = [];

    // Agregar pagos recientes
    if (pagosResult.success && pagosResult.data.results) {
      pagosResult.data.results.forEach(pago => {
        activities.push({
          id: `pago-${pago.id}`,
          type: "payment",
          description: `Pago de expensa - ${pago.unidad || 'Unidad'}`,
          time: new Date(pago.fecha_pago).toLocaleString(),
          status: "completed"
        });
      });
    }

    // Agregar entradas recientes
    if (entradasResult.success && entradasResult.data.results) {
      entradasResult.data.results.forEach(entrada => {
        activities.push({
          id: `entrada-${entrada.id}`,
          type: "security",
          description: entrada.tipo === 'visitante' ? 'Nuevo visitante registrado' : 'Acceso de residente',
          time: new Date(entrada.fecha_entrada).toLocaleString(),
          status: "info"
        });
      });
    }

    // Agregar avisos recientes
    if (avisosResult.success && avisosResult.data.results) {
      avisosResult.data.results.forEach(aviso => {
        activities.push({
          id: `aviso-${aviso.id}`,
          type: "communication",
          description: `Nuevo aviso: ${aviso.titulo}`,
          time: new Date(aviso.fecha_creacion).toLocaleString(),
          status: "info"
        });
      });
    }

    // Ordenar por fecha y tomar los más recientes
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    return { success: true, data: activities.slice(0, 10) };
  },

  // Obtener datos para gráficos
  getChartData: async () => {
    try {
      const [pagosResult, infraccionesResult] = await Promise.all([
        apiService.get('/api/finanzas/pagos/'),
        apiService.get('/api/seguridad/infracciones/'),
      ]);

      // Datos de pagos para gráfico
      const paymentData = [
        { name: "Pagadas", value: pagosResult.success ? pagosResult.data.results?.length || 75 : 75, color: "#22c55e" },
        { name: "Pendientes", value: 20, color: "#f59e0b" },
        { name: "Vencidas", value: 5, color: "#ef4444" },
      ];

      // Datos de infracciones por tipo
      const violationData = [];
      if (infraccionesResult.success && infraccionesResult.data.results) {
        const violationsByType = infraccionesResult.data.results.reduce((acc, infraccion) => {
          const tipo = infraccion.tipo || 'Otro';
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        }, {});

        Object.entries(violationsByType).forEach(([tipo, count]) => {
          violationData.push({ name: tipo, value: count });
        });
      }

      // Si no hay datos de infracciones, usar datos de ejemplo
      const finalViolationData = violationData.length > 0 ? violationData : [
        { name: "Ruido", value: 12 },
        { name: "Estacionamiento", value: 8 },
        { name: "Mascotas", value: 5 },
      ];

      return { 
        success: true, 
        data: { 
          paymentData, 
          violationData: finalViolationData
        } 
      };
    } catch (error) {
      // En caso de error, devolver datos de ejemplo
      return {
        success: true,
        data: {
          paymentData: [
            { name: "Pagadas", value: 75, color: "#22c55e" },
            { name: "Pendientes", value: 20, color: "#f59e0b" },
            { name: "Vencidas", value: 5, color: "#ef4444" },
          ],
          violationData: [
            { name: "Ruido", value: 12 },
            { name: "Estacionamiento", value: 8 },
            { name: "Mascotas", value: 5 },
          ]
        }
      };
    }
  },

  // Obtener todos los datos del dashboard
  getDashboardData: async () => {
    try {
      const [statsResult, activitiesResult, chartsResult] = await Promise.all([
        dashboardApiService.getDashboardStats(),
        dashboardApiService.getRecentActivities(),
        dashboardApiService.getChartData(),
      ]);

      return {
        success: true,
        data: {
          stats: statsResult.data.stats,
          activities: activitiesResult.data,
          charts: chartsResult.data,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message || 'Error al cargar datos del dashboard',
          status: 0,
        }
      };
    }
  },
};
