"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, FileText, BarChart3, PieChart, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const ReportGenerator = () => {
  const [reportConfig, setReportConfig] = useState({
    type: "",
    dateFrom: "",
    dateTo: "",
    format: "pdf",
    filters: {},
  })

  const reportTypes = [
    { id: "financial", name: "Reporte Financiero", icon: BarChart3, description: "Ingresos, gastos y morosidad" },
    {
      id: "maintenance",
      name: "Reporte de Mantenimiento",
      icon: FileText,
      description: "Tareas y costos de mantenimiento",
    },
    { id: "security", name: "Reporte de Seguridad", icon: PieChart, description: "Incidentes y accesos" },
    { id: "occupancy", name: "Reporte de Ocupación", icon: TrendingUp, description: "Estadísticas de unidades" },
  ]

  const handleGenerateReport = () => {
    console.log("Generando reporte:", reportConfig)
    // Aquí se conectaría con la API para generar el reporte
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                reportConfig.type === type.id ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
              }`}
              onClick={() => setReportConfig((prev) => ({ ...prev, type: type.id }))}
            >
              <CardContent className="p-4 text-center">
                <type.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {reportConfig.type && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Configuración del Reporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateFrom">Fecha Desde</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={reportConfig.dateFrom}
                    onChange={(e) => setReportConfig((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">Fecha Hasta</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={reportConfig.dateTo}
                    onChange={(e) => setReportConfig((prev) => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="format">Formato de Exportación</Label>
                <Select
                  value={reportConfig.format}
                  onValueChange={(value) => setReportConfig((prev) => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateReport}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={!reportConfig.dateFrom || !reportConfig.dateTo}
              >
                <Download className="h-4 w-4 mr-2" />
                Generar Reporte
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default ReportGenerator
