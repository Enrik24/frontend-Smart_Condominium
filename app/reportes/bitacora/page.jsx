"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, FileDown, Printer, Search } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { bitacoraApiService } from "@/lib/services/bitacoraService"

export default function BitacoraPage() {
  const [filters, setFilters] = useState({
    fechaDesde: "",
    fechaHasta: "",
    usuario: "todos",
    entidad: "todas",
    accion: "cualquier",
    ip: "",
  })
  const [titleSuffix, setTitleSuffix] = useState("Últimas 24 horas")

  const { data, loading, error, execute } = useApi(async (params) => {
    return await bitacoraApiService.getBitacora(params)
  }, [])

  // Cargar últimas 24 horas por defecto
  useEffect(() => {
    const now = new Date()
    const desde = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    setTitleSuffix("Últimas 24 horas")
    execute({ fecha_inicio: desde.toISOString(), fecha_fin: now.toISOString() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = useMemo(() => {
    const list = data?.results || data || []
    return Array.isArray(list)
      ? list.map((item, idx) => ({
          id: item.id || idx,
          hora: item.fecha || item.created_at || item.hora || new Date().toISOString(),
          usuario: item.usuario?.nombre || item.usuario || "Sistema",
          accion: item.accion || item.evento || "-",
          entidad: item.entidad || item.modulo || "-",
          ip: item.ip || "-",
        }))
      : []
  }, [data])

  const handleChange = (name, value) => setFilters((prev) => ({ ...prev, [name]: value }))

  const handleBuscar = async () => {
    const params = {}
    if (filters.fechaDesde) params.fecha_inicio = new Date(filters.fechaDesde).toISOString()
    if (filters.fechaHasta) params.fecha_fin = new Date(filters.fechaHasta).toISOString()
    if (filters.usuario && filters.usuario !== "todos") params.usuario = filters.usuario
    if (filters.entidad && filters.entidad !== "todas") params.entidad = filters.entidad
    if (filters.accion && filters.accion !== "cualquier") params.accion = filters.accion
    if (filters.ip) params.ip = filters.ip

    setTitleSuffix("Resultados")
    await execute(params)
  }

  const exportCSV = () => {
    const header = ["Hora", "Usuario", "Acción", "Entidad", "IP"]
    const lines = rows.map((r) => [r.hora, r.usuario, r.accion, r.entidad, r.ip])
    const csv = [header, ...lines].map((arr) => arr.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bitacora_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printReport = () => {
    const win = window.open("", "_blank")
    if (!win) return
    const tableHtml = `
      <html>
        <head>
          <title>Bitácora</title>
          <style>
            body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:16px}
            h1{font-size:18px;margin-bottom:12px}
            table{width:100%;border-collapse:collapse}
            th,td{border:1px solid #e5e7eb;padding:8px;text-align:left;font-size:12px}
            th{background:#f3f4f6}
          </style>
        </head>
        <body>
          <h1>Bitácora - ${titleSuffix}</h1>
          <table>
            <thead>
              <tr><th>Hora</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>IP</th></tr>
            </thead>
            <tbody>
              ${rows.map(r => `<tr><td>${new Date(r.hora).toLocaleString('es-AR')}</td><td>${r.usuario}</td><td>${r.accion}</td><td>${r.entidad}</td><td>${r.ip}</td></tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>`
    win.document.write(tableHtml)
    win.document.close()
    win.focus()
    win.print()
  }

  return (
    <DashboardLayout>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Bitácora del Sistema — {titleSuffix}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">Hora</th>
                  <th className="px-3 py-2 text-left">Usuario</th>
                  <th className="px-3 py-2 text-left">Acción</th>
                  <th className="px-3 py-2 text-left">Entidad</th>
                  <th className="px-3 py-2 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>No se encontraron resultados</td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2">{new Date(r.hora).toLocaleString("es-AR")}</td>
                      <td className="px-3 py-2">{r.usuario}</td>
                      <td className="px-3 py-2">{r.accion}</td>
                      <td className="px-3 py-2">{r.entidad}</td>
                      <td className="px-3 py-2">{r.ip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fechaDesde">Fecha desde</Label>
              <Input id="fechaDesde" type="date" value={filters.fechaDesde} onChange={(e) => handleChange("fechaDesde", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="fechaHasta">Fecha hasta</Label>
              <Input id="fechaHasta" type="date" value={filters.fechaHasta} onChange={(e) => handleChange("fechaHasta", e.target.value)} />
            </div>
            <div>
              <Label>Usuario</Label>
              <Select value={filters.usuario} onValueChange={(v) => handleChange("usuario", v)}>
                <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sistema">Sistema</SelectItem>
                  <SelectItem value="seguridad">Seguridad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Entidad</Label>
              <Select value={filters.entidad} onValueChange={(v) => handleChange("entidad", v)}>
                <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="Expensa">Expensa</SelectItem>
                  <SelectItem value="Multa">Multa</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="EntradaSal">EntradaSal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Acción</Label>
              <Select value={filters.accion} onValueChange={(v) => handleChange("accion", v)}>
                <SelectTrigger><SelectValue placeholder="Cualquier" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cualquier">Cualquier</SelectItem>
                  <SelectItem value="creo">Creó</SelectItem>
                  <SelectItem value="edito">Editó</SelectItem>
                  <SelectItem value="elimino">Eliminó</SelectItem>
                  <SelectItem value="registro">Registró</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ip">IP</Label>
              <Input id="ip" placeholder="192.168.1.1" value={filters.ip} onChange={(e) => handleChange("ip", e.target.value)} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={handleBuscar} disabled={loading}>
              <Search className="h-4 w-4 mr-2" /> Buscar
            </Button>
            <Button variant="outline" onClick={exportCSV}>
              <FileDown className="h-4 w-4 mr-2" /> Exportar CSV
            </Button>
            <Button variant="outline" onClick={printReport}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir reporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
