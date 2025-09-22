import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Building, MessageSquare, Clock } from "lucide-react"

export function CommunicationDashboard() {
  // This would come from API
  const communicationData = {
    notificacionesEnviadas: 12,
    notificacionesPendientes: 3,
    reservasActivas: 5,
    reservasPendientes: 2,
    areasDisponibles: 6,
    areasMantenimiento: 1,
  }

  const reservasProximas = [
    {
      id: 1,
      area: "SUM",
      solicitante: "Juan Pérez",
      fecha: "2024-03-25",
      hora: "19:00",
      estado: "confirmada",
    },
    {
      id: 2,
      area: "Quincho",
      solicitante: "María García",
      fecha: "2024-03-30",
      hora: "12:00",
      estado: "pendiente",
    },
    {
      id: 3,
      area: "Pileta",
      solicitante: "Carlos López",
      fecha: "2024-04-05",
      hora: "15:00",
      estado: "confirmada",
    },
  ]

  const notificacionesRecientes = [
    {
      id: 1,
      titulo: "Mantenimiento de Ascensores",
      tipo: "mantenimiento",
      fecha: "2024-03-15",
      estado: "enviada",
    },
    {
      id: 2,
      titulo: "Reunión de Consorcio",
      tipo: "reunion",
      fecha: "2024-03-10",
      estado: "enviada",
    },
    {
      id: 3,
      titulo: "Corte de Agua Programado",
      tipo: "emergencia",
      fecha: "2024-03-18",
      estado: "programada",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Panel de Comunicación</h2>
        <p className="text-muted-foreground">Estado de notificaciones y reservas del condominio</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notificaciones</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{communicationData.notificacionesEnviadas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {communicationData.notificacionesPendientes} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{communicationData.reservasActivas}</div>
            <p className="text-xs text-muted-foreground mt-1">{communicationData.reservasPendientes} pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Áreas Comunes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{communicationData.areasDisponibles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {communicationData.areasMantenimiento} en mantenimiento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas reservas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reservasProximas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {reserva.area} - {reserva.solicitante}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {reserva.fecha} a las {reserva.hora}
                      </p>
                    </div>
                  </div>
                  <Badge variant={reserva.estado === "confirmada" ? "default" : "secondary"}>{reserva.estado}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notificaciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notificacionesRecientes.map((notif) => (
                <div key={notif.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{notif.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{notif.fecha}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={
                        notif.tipo === "emergencia"
                          ? "destructive"
                          : notif.tipo === "mantenimiento"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {notif.tipo}
                    </Badge>
                    <Badge variant={notif.estado === "enviada" ? "default" : "secondary"} className="text-xs">
                      {notif.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
