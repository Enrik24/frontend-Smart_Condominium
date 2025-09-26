"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { reportesApiService } from "@/lib/services/reportesService"
import { useCrud } from "@/hooks/useApi"

export default function ReportesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const reportesApi = useMemo(() => ({
    get: reportesApiService.getReportes,
    create: reportesApiService.createReporte,
    update: reportesApiService.updateReporte,
    delete: reportesApiService.deleteReporte,
  }), [])

  const {
    items: reportes,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(reportesApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "formato", label: "Formato", type: "badge" },
    { key: "periodoInicio", label: "Período Inicio", type: "date" },
    { key: "periodoFin", label: "Período Fin", type: "date" },
    { key: "fechaGeneracion", label: "Fecha Generación", type: "datetime" },
    { key: "estado", label: "Estado", type: "badge" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Reporte de Finanzas Mensual" },
    {
      name: "tipo",
      label: "Tipo de Reporte",
      type: "select",
      required: true,
      options: [
        { value: "financiero", label: "Financiero" },
        { value: "seguridad", label: "Seguridad" },
        { value: "uso_areas", label: "Uso de Áreas" },
        { value: "mantenimiento", label: "Mantenimiento" },
        { value: "usuarios", label: "Usuarios" },
        { value: "multas", label: "Multas" },
        { value: "pagos", label: "Pagos" },
        { value: "reservas", label: "Reservas" },
        { value: "invitados", label: "Invitados" },
        { value: "infracciones", label: "Infracciones" },
      ],
    },
    {
      name: "formato",
      label: "Formato",
      type: "select",
      required: true,
      options: [
        { value: "pdf", label: "PDF" },
        { value: "excel", label: "Excel" },
        { value: "json", label: "JSON" },
      ],
    },
    { name: "periodoInicio", label: "Período Inicio", type: "date", required: false },
    { name: "periodoFin", label: "Período Fin", type: "date", required: false },
    { 
      name: "parametros", 
      label: "Parámetros", 
      type: "textarea", 
      required: false, 
      placeholder: "Parámetros adicionales en formato JSON (se llena automáticamente según el tipo)",
      fullWidth: true 
    },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (confirm("¿Está seguro de que desea eliminar este reporte?")) {
      await deleteItem(item.id)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData)
      } else {
        await createItem(formData)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('Error al guardar reporte:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      <DataTable
        data={reportes}
        columns={columns}
        title="Reportes"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar reportes..."
        addButtonText="Agregar Reporte"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Reporte" : "Agregar Reporte"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
