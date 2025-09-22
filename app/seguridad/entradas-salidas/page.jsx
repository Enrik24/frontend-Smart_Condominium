"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"

export default function EntradasSalidasPage() {
  const [filtros, setFiltros] = useState({
    fecha: "",
    unidad: "",
    tipo: "all", // Updated default value to "all"
    busqueda: "",
  })

  // Mock data - would come from API (read-only)
  const [registros] = useState([
    {
      id: 1,
      fecha: "2024-03-15",
      hora: "08:30",
      tipo: "entrada",
      persona: "Juan Pérez",
      dni: "12345678",
      unidad: "1A",
      tipoPersona: "residente",
      metodoAcceso: "tarjeta",
      puertaAcceso: "Principal",
      observaciones: "",
    },
    {
      id: 2,
      fecha: "2024-03-15",
      hora: "09:15",
      tipo: "entrada",
      persona: "Pedro Visitante",
      dni: "98765432",
      unidad: "1A",
      tipoPersona: "invitado",
      metodoAcceso: "porteria",
      puertaAcceso: "Principal",
      observaciones: "Autorizado por Juan Pérez",
    },
    {
      id: 3,
      fecha: "2024-03-15",
      hora: "17:45",
      tipo: "salida",
      persona: "Juan Pérez",
      dni: "12345678",
      unidad: "1A",
      tipoPersona: "residente",
      metodoAcceso: "tarjeta",
      puertaAcceso: "Cochera",
      observaciones: "",
    },
    {
      id: 4,
      fecha: "2024-03-15",
      hora: "18:20",
      tipo: "salida",
      persona: "Pedro Visitante",
      dni: "98765432",
      unidad: "1A",
      tipoPersona: "invitado",
      metodoAcceso: "porteria",
      puertaAcceso: "Principal",
      observaciones: "Visita finalizada",
    },
  ])

  const columns = [
    { key: "fecha", label: "Fecha", type: "date" },
    { key: "hora", label: "Hora" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "persona", label: "Persona" },
    { key: "dni", label: "DNI" },
    { key: "unidad", label: "Unidad" },
    { key: "tipoPersona", label: "Tipo Persona", type: "badge" },
    { key: "metodoAcceso", label: "Método", type: "badge" },
    { key: "puertaAcceso", label: "Puerta" },
  ]

  const registrosFiltrados = registros.filter((registro) => {
    const cumpleFecha = !filtros.fecha || registro.fecha === filtros.fecha
    const cumpleUnidad = !filtros.unidad || registro.unidad.includes(filtros.unidad)
    const cumpleTipo = filtros.tipo === "all" || registro.tipo === filtros.tipo
    const cumpleBusqueda =
      !filtros.busqueda ||
      registro.persona.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      registro.dni.includes(filtros.busqueda)

    return cumpleFecha && cumpleUnidad && cumpleTipo && cumpleBusqueda
  })

  const estadisticas = {
    totalHoy: registros.filter((r) => r.fecha === "2024-03-15").length,
    entradasHoy: registros.filter((r) => r.fecha === "2024-03-15" && r.tipo === "entrada").length,
    salidasHoy: registros.filter((r) => r.fecha === "2024-03-15" && r.tipo === "salida").length,
    personasDentro:
      registros.filter((r) => r.fecha === "2024-03-15" && r.tipo === "entrada").length -
      registros.filter((r) => r.fecha === "2024-03-15" && r.tipo === "salida").length,
  }

  const limpiarFiltros = () => {
    setFiltros({
      fecha: "",
      unidad: "",
      tipo: "all", // Updated default value to "all"
      busqueda: "",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entradas y Salidas</h1>
          <p className="text-muted-foreground">Registro de accesos al edificio (Solo lectura)</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{estadisticas.totalHoy}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Entradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{estadisticas.entradasHoy}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Salidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estadisticas.salidasHoy}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Personas Dentro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{estadisticas.personasDentro}</div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={filtros.fecha}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, fecha: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad">Unidad</Label>
                <Input
                  id="unidad"
                  placeholder="Ej: 1A"
                  value={filtros.unidad}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, unidad: e.target.value }))}
                />
              </div>
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
                    <SelectItem value="all">Todos</SelectItem> // Updated value prop to "all"
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="busqueda">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="busqueda"
                    placeholder="Nombre o DNI"
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

        {/* Tabla de registros */}
        <DataTable
          data={registrosFiltrados}
          columns={columns}
          title={`Registros de Acceso (${registrosFiltrados.length})`}
          searchPlaceholder="Buscar en registros..."
        />
      </div>
    </DashboardLayout>
  )
}
