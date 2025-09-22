import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, AlertTriangle, Eye, Clock } from "lucide-react"

export function SecurityDashboard() {
  // This would come from API
  const securityData = {
    personalActivo: 3,
    totalPersonal: 4,
    invitadosDentro: 5,
    totalInvitadosHoy: 23,
    infraccionesAbiertas: 2,
    totalInfraccionesMes: 8,
    accesosHoy: 127,
    alertasActivas: 1,
  }

  const alertasRecientes = [
    {
      id: 1,
      tipo: "infraccion",
      mensaje: "Nueva infracción reportada - Unidad 1A",
      tiempo: "Hace 15 min",
      prioridad: "media",
    },
    {
      id: 2,
      tipo: "acceso",
      mensaje: "Acceso denegado - Tarjeta inválida",
      tiempo: "Hace 1 hora",
      prioridad: "baja",
    },
  ]

  const personalEnTurno = [
    { nombre: "Carlos Seguridad", turno: "Mañana", estado: "activo" },
    { nombre: "Ana Portero", turno: "Tarde", estado: "activo" },
    { nombre: "Miguel Nocturno", turno: "Noche", estado: "inactivo" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Panel de Seguridad</h2>
        <p className="text-muted-foreground">Estado actual de la seguridad del condominio</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Personal Activo</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {securityData.personalActivo}/{securityData.totalPersonal}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Personal en servicio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Invitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {securityData.invitadosDentro}/{securityData.totalInvitadosHoy}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Dentro/Total hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Infracciones</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {securityData.infraccionesAbiertas}/{securityData.totalInfraccionesMes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Abiertas/Total mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accesos Hoy</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{securityData.accesosHoy}</div>
            <p className="text-xs text-muted-foreground mt-1">Entradas y salidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal en turno */}
        <Card>
          <CardHeader>
            <CardTitle>Personal en Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {personalEnTurno.map((personal, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{personal.nombre}</p>
                    <p className="text-xs text-muted-foreground">{personal.turno}</p>
                  </div>
                  <Badge variant={personal.estado === "activo" ? "default" : "secondary"}>
                    {personal.estado === "activo" ? "En Servicio" : "Fuera de Turno"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertasRecientes.map((alerta) => (
                <div key={alerta.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alerta.mensaje}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{alerta.tiempo}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alerta.prioridad === "alta"
                        ? "destructive"
                        : alerta.prioridad === "media"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {alerta.prioridad}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
