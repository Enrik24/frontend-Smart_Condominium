"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { rolesApiService } from "@/lib/services/rolesService"
import { useCrud } from "@/hooks/useApi"

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const apiService = useMemo(() => ({
    get: rolesApiService.get,
    create: rolesApiService.create,
    update: rolesApiService.update,
    delete: rolesApiService.delete,
  }), []);

  // Usar el hook personalizado para manejar CRUD
  const {
    items: roles,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(apiService)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "permisos", label: "Permisos", type: "tags" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Administrador", minLength: 3, maxLength: 50 },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: true,
      placeholder: "Breve explicación del rol",
      minLength: 5,
      maxLength: 200,
      fullWidth: true
    },
    {
      name: "permisos",
      label: "Permisos",
      type: "select",
      required: false,
      multiple: true,
      options: [
        { value: "ver_dashboard", label: "Ver Dashboard" },
        { value: "gestionar_usuarios", label: "Gestionar Usuarios" },
        { value: "gestionar_multas", label: "Gestionar Multas" },
        { value: "gestionar_avisos", label: "Gestionar Avisos" },
        { value: "gestionar_reportes", label: "Gestionar Reportes" },
        { value: "gestionar_configuracion", label: "Gestionar Configuración" },
      ],
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
    if (confirm("¿Está seguro de que desea eliminar este rol?")) {
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
      console.error('Error al guardar rol:', error)
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
        data={roles}
        columns={columns}
        title="Roles"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar roles..."
        addButtonText="Agregar Rol"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Rol" : "Agregar Rol"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
