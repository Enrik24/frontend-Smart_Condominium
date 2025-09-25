"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { permisosApiService } from "@/lib/services/permisosService"
import { useCrud } from "@/hooks/useApi"

export default function PermisosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: permisos,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: permisosApiService.get,
    create: permisosApiService.create,
    update: permisosApiService.update,
    delete: permisosApiService.delete,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "recurso", label: "Recurso" },
    { key: "codigo", label: "Código" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Gestionar Multas", minLength: 3, maxLength: 50 },
    {
      name: "recurso",
      label: "Recurso",
      type: "select",
      required: true,
      options: [
        { value: "multas", label: "Multas" },
        { value: "avisos", label: "Avisos" },
        { value: "usuarios", label: "Usuarios" },
        { value: "reportes", label: "Reportes" },
        { value: "configuracion", label: "Configuración" },
        { value: "dashboard", label: "Dashboard" },
        { value: "finanzas", label: "Finanzas" },
        { value: "seguridad", label: "Seguridad" },
        { value: "mantenimiento", label: "Mantenimiento" },
        { value: "areas_comunes", label: "Áreas Comunes" },
      ]
    },
    { name: "codigo", label: "Código", type: "text", required: true, placeholder: "multas.gestionar", minLength: 3, maxLength: 100, pattern: "^[a-z0-9._-]+$", patternMessage: "Solo letras minúsculas, números, punto, guion y guion bajo" },
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
    if (confirm("¿Está seguro de que desea eliminar este permiso?")) {
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
      console.error('Error al guardar permiso:', error)
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
        data={permisos}
        columns={columns}
        title="Permisos"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar permisos..."
        addButtonText="Agregar Permiso"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Permiso" : "Agregar Permiso"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
