"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { mantenimientoApiService } from "@/lib/services/mantenimientoService"
import { useCrud } from "@/hooks/useApi"

export default function MantenimientoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const mantenimientoApi = useMemo(() => ({
    get: mantenimientoApiService.getTareasMantenimiento,
    create: mantenimientoApiService.createTareaMantenimiento,
    update: mantenimientoApiService.updateTareaMantenimiento,
    delete: mantenimientoApiService.deleteTareaMantenimiento,
  }), [])

  const {
    items: tareas,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(mantenimientoApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "titulo", label: "Título" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "prioridad", label: "Prioridad", type: "badge" },
    { key: "fechaLimite", label: "Fecha Límite", type: "date" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "responsable", label: "Responsable" },
    { key: "costoEstimado", label: "Costo Estimado", type: "currency" },
  ]

  const formFields = [
    { name: "titulo", label: "Título", type: "text", required: true, placeholder: "Reparación de ascensor" },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      required: true,
      options: [
        { value: "preventivo", label: "Preventivo" },
        { value: "correctivo", label: "Correctivo" },
        { value: "urgente", label: "Urgente" },
      ],
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: true,
      placeholder: "Descripción detallada de la tarea",
      fullWidth: true,
    },
    { name: "fechaLimite", label: "Fecha Límite", type: "date", required: true },
    {
      name: "prioridad",
      label: "Prioridad",
      type: "select",
      required: true,
      options: [
        { value: "baja", label: "Baja" },
        { value: "media", label: "Media" },
        { value: "alta", label: "Alta" },
      ],
    },
    { name: "costoEstimado", label: "Costo Estimado", type: "number", required: false, placeholder: "50000", min: 0 },
    { name: "ubicacion", label: "Ubicación", type: "text", required: true, placeholder: "Ascensor principal" },
    { 
      name: "responsable", 
      label: "Responsable", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "Empresa de Mantenimiento ABC" },
        { value: "2", label: "Técnico Juan Pérez" },
        { value: "3", label: "Personal Interno" },
      ]
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
    if (confirm("¿Está seguro de que desea eliminar esta tarea?")) {
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
      console.error('Error al guardar tarea:', error)
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
        data={tareas}
        columns={columns}
        title="Tareas de Mantenimiento"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar tareas..."
        addButtonText="Agregar Tarea"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Tarea" : "Agregar Tarea"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
