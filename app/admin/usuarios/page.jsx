"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { authApiService } from "@/lib/services/authService"
import { useCrud } from "@/hooks/useApi"

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const apiService = useMemo(() => ({
    // TODO: Reemplazar con el endpoint correcto para obtener la lista de usuarios.
    // La función get actual es incorrecta y está causando un bucle infinito.
    get: () => Promise.resolve({ success: true, data: [] }),
    create: authApiService.register,
    update: authApiService.updateProfile,
    delete: () => Promise.resolve({ success: false, error: { message: "No se puede eliminar usuarios" } }),
  }), []);

  // Usar el hook personalizado para manejar CRUD
  const {
    items: usuarios,
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
    { key: "email", label: "Email" },
    { key: "telefono", label: "Teléfono" },
    { key: "activo", label: "Activo", type: "badge" },
    { key: "fechaRegistro", label: "Fecha Registro", type: "date" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Nombre completo" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "usuario@email.com" },
    { name: "telefono", label: "Teléfono", type: "tel", required: false, placeholder: "+598 99 123 456" },
    { name: "password", label: "Contraseña", type: "password", required: true, placeholder: "Mínimo 6 caracteres" },
    { name: "activo", label: "Activo", type: "checkbox", required: false },
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
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
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
      console.error('Error al guardar usuario:', error)
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
        data={usuarios}
        columns={columns}
        title="Usuarios"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar usuarios..."
        addButtonText="Agregar Usuario"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Usuario" : "Agregar Usuario"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}