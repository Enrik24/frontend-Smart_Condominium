"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { configuracionApiService } from "@/lib/services/configuracionService"
import { useCrud } from "@/hooks/useApi"

export default function ConfiguracionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: configuraciones,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: configuracionApiService.getConfiguraciones,
    create: configuracionApiService.createConfiguracion,
    update: configuracionApiService.updateConfiguracion,
    delete: configuracionApiService.deleteConfiguracion,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "clave", label: "Clave" },
    { key: "valor", label: "Valor" },
    { key: "categoria", label: "Categoría", type: "badge" },
    { key: "descripcion", label: "Descripción" },
  ]

  const formFields = [
    { name: "clave", label: "Clave", type: "text", required: true, placeholder: "tasa_mora" },
    { 
      name: "valor", 
      label: "Valor", 
      type: "textarea", 
      required: true, 
      placeholder: "Valor de la configuración (puede ser número, JSON, etc.)",
      fullWidth: true 
    },
    { 
      name: "descripcion", 
      label: "Descripción", 
      type: "textarea", 
      required: false, 
      placeholder: "Descripción de la configuración",
      fullWidth: true 
    },
    {
      name: "categoria",
      label: "Categoría",
      type: "select",
      required: true,
      options: [
        { value: "general", label: "General" },
        { value: "finanzas", label: "Finanzas" },
        { value: "seguridad", label: "Seguridad" },
        { value: "comunicacion", label: "Comunicación" },
        { value: "mantenimiento", label: "Mantenimiento" },
        { value: "areas_comunes", label: "Áreas Comunes" },
        { value: "reportes", label: "Reportes" },
        { value: "usuarios", label: "Usuarios" },
      ],
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
    if (confirm("¿Está seguro de que desea eliminar esta configuración?")) {
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
      console.error('Error al guardar configuración:', error)
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
        data={configuraciones}
        columns={columns}
        title="Configuración"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar configuraciones..."
        addButtonText="Agregar Configuración"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Configuración" : "Agregar Configuración"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
