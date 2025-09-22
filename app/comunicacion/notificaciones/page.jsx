"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Search, Filter, Eye } from "lucide-react"

export default function NotificacionesPage() {
  const [filtros, setFiltros] = useState({
    tipo: "all",
    estado: "all",
    busqueda: "",
  })

  // Mock data - read-only notifications
  const [notificaciones] = useState([
    {
      id: 1,
      titulo: "Mantenimiento de Ascensores",
      mensaje: "Se realizará mantenimiento preventivo de ascensores el próximo lunes de 9:00 a 17:00 hs.",
      tipo: "mantenimiento",
      prioridad: "alta",
      fechaEnvio: "2024-03-15",
      horaEnvio: "08:30",
      estado: "enviada",
      destinatarios: "Todos los residentes",
      canalEnvio: "email_sms",
      leida: false,
    },
    {
      id: 2,
      titulo: "Reunión de Consorcio",
      mensaje: "Se convoca a reunión ordinaria para el día 30 de marzo a las 19:00 hs en el SUM.",
      tipo: "reunion",
      prioridad: "media",
      fechaEnvio: "2024-03-10",
      horaEnvio: "10:00",
      estado: "enviada",
      destinatarios: "Propietarios",
      canalEnvio: "email",
      leida: true,
    },
    {
      id: 3,
      titulo: "Corte de Agua Programado",
      mensaje: "Habrá corte de agua el miércoles 20 de marzo de 10:00 a 14:00 hs por trabajos en la red.",
      tipo: "emergencia",
      prioridad: "urgente",
      fechaEnvio: "2024-03-18",
      horaEnvio: "07:00",
      estado: "programada",
      destinatarios: "Todos los residentes",
      canalEnvio: "email_sms_push",
      leida: false,
    },
    {
      id: 4,
      titulo: "Nuevo Horario de Portería",
      mensaje: "A partir del 1 de abril, el horario de portería será de 8:00 a 20:00 hs.",
      tipo: "informativa",
      prioridad: "baja",
      fechaEnvio: "2024-03-12",
      horaEnvio: "14:30",
      estado: "enviada",
      destinatarios: "Todos los residentes",
      canalEnvio: "email",
      leida: true,
    },
  ])

  const notificacionesFiltradas = notificaciones.filter((notif) => {
    const cumpleTipo = filtros.tipo === "all" || notif.tipo === filtros.tipo
    const cumpleEstado = filtros.estado === "all" || notif.estado === filtros.estado
    const cumpleBusqueda =
      !filtros.busqueda ||
      notif.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      notif.mensaje.toLowerCase().includes(filtros.busqueda.toLowerCase())

    return cumpleTipo && cumpleEstado && cumpleBusqueda
  })

  const estadisticas = {
    total: notificaciones.length,
    enviadas: notificaciones.filter((n) => n.estado === "enviada").length,
    programadas: notificaciones.filter((n) => n.estado === "programada").length,
    noLeidas: notificaciones.filter((n) => !n.leida).length,
  }

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "urgente":
        return "bg-red-100 text-red-800"
      case "alta":
        return "bg-orange-100 text-orange-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "emergencia":
        return "bg-red-100 text-red-800"
      case "mantenimiento":
        return "bg-blue-100 text-blue-800"
      case "reunion":
        return "bg-purple-100 text-purple-800"
      case "informativa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const limpiarFiltros = () => {
    setFiltros({
      tipo: "all",
      estado: "all",
      busqueda: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notificaciones</h1>
          <p className="text-muted-foreground">Historial de notificaciones enviadas (Solo visualización)</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{estadisticas.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Enviadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estadisticas.enviadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticas.programadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">No Leídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estadisticas.noLeidas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={filtros.tipo}
                  onValueChange={(value) => setFiltros((prev) => ({ ...prev, tipo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="emergencia">Emergencia</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="reunion">Reunión</SelectItem>
                    <SelectItem value="informativa">Informativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={filtros.estado}
                  onValueChange={(value) => setFiltros((prev) => ({ ...prev, estado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="enviada">Enviada</SelectItem>
                    <SelectItem value="programada">Programada</SelectItem>
                    <SelectItem value="borrador">Borrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="busqueda">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="busqueda"
                    placeholder="Título o contenido"
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros((prev) => ({ ...prev, busqueda: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Notificaciones ({notificacionesFiltradas.length})</h2>
          {notificacionesFiltradas.map((notif) => (
            <Card key={notif.id} className={`${!notif.leida ? "border-l-4 border-l-primary" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-foreground">{notif.titulo}</h3>
                      {!notif.leida && (
                        <Badge variant="destructive" className="text-xs">
                          Nueva
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTipoColor(notif.tipo)}>{notif.tipo}</Badge>
                      <Badge className={getPrioridadColor(notif.prioridad)}>{notif.prioridad}</Badge>
                      <Badge variant={notif.estado === "enviada" ? "default" : "secondary"}>{notif.estado}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{notif.fechaEnvio}</p>
                    <p>{notif.horaEnvio}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-4">{notif.mensaje}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Destinatarios: </span>
                    <span className="text-foreground">{notif.destinatarios}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Canal: </span>
                    <span className="text-foreground">{notif.canalEnvio.replace(/_/g, " + ")}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {notificacionesFiltradas.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron notificaciones</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
