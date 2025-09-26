"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { seguridadApiService } from "@/lib/services/seguridadService"
import { useCrud } from "@/hooks/useApi"

export default function InfraccionesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const infraccionesApi = useMemo(() => ({
    get: seguridadApiService.getInfracciones,
    create: seguridadApiService.createInfraccion,
    update: seguridadApiService.updateInfraccion,
    delete: seguridadApiService.deleteInfraccion,
  }), [])

  const {
    items: infracciones,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(infraccionesApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "descripcion", label: "Descripción" },
    { key: "placaVehiculo", label: "Patente" },
    { key: "reportadoPor", label: "Reportado por" },
    { key: "fecha", label: "Fecha", type: "date" },
    { key: "estado", label: "Estado", type: "badge" },
  ]

  const formFields = [
    {
      name: "tipo",
      label: "Tipo de Infracción",
      type: "select",
      required: true,
      options: [
        { value: "estacionamiento", label: "Estacionamiento" },
        { value: "ruido", label: "Ruido" },
        { value: "areas_comunes", label: "Áreas Comunes" },
        { value: "mascotas", label: "Mascotas" },
        { value: "basura", label: "Manejo de Basura" },
        { value: "obras", label: "Obras sin Autorización" },
        { value: "otros", label: "Otros" },
      ],
    },
    { name: "ubicacion", label: "Ubicación", type: "text", required: true, placeholder: "Estacionamiento principal" },
    { 
      name: "descripcion", 
      label: "Descripción", 
      type: "textarea", 
      required: true, 
      placeholder: "Descripción detallada de la infracción",
      fullWidth: true 
    },
    { name: "placaVehiculo", label: "Patente del Vehículo", type: "text", required: false, placeholder: "ABC-1234" },
    { name: "evidencia", label: "Evidencia", type: "file", accept: "image/*", required: true, fullWidth: true },
    { name: "reportadoPor", label: "Reportado por", type: "hidden", required: true }, // Se autocompleta desde sesión
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
    if (confirm("¿Está seguro de que desea eliminar esta infracción?")) {
      await deleteItem(item.id)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      // Autocompletar el reportadoPor desde la sesión actual
      const currentUser = JSON.parse(localStorage.getItem('condominium_user_data') || '{}')
      formData.reportadoPor = currentUser.id || 1

      if (editingItem) {
        await updateItem(editingItem.id, formData)
      } else {
        await createItem(formData)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('Error al guardar infracción:', error)
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
        data={infracciones}
        columns={columns}
        title="Infracciones"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar infracciones..."
        addButtonText="Agregar Infracción"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Infracción" : "Agregar Infracción"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
