"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { comunicacionApiService } from "@/lib/services/comunicacionService"
import { useCrud } from "@/hooks/useApi"

export default function AvisosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const apiService = useMemo(() => ({
    get: comunicacionApiService.getAvisos,
    create: comunicacionApiService.createAviso,
    update: comunicacionApiService.updateAviso,
    delete: comunicacionApiService.deleteAviso,
  }), []);

  // Usar el hook personalizado para manejar CRUD
  const {
    items: avisos,
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
    { key: "titulo", label: "Título" },
    { key: "destinatarios", label: "Destinatarios", type: "badge" },
    { key: "prioridad", label: "Prioridad", type: "badge" },
    { key: "importante", label: "Importante", type: "badge" },
    { key: "fechaPublicacion", label: "Fecha Publicación", type: "datetime" },
    { key: "administrador", label: "Administrador" },
  ]

  const formFields = [
    { name: "titulo", label: "Título", type: "text", required: true, placeholder: "Título del aviso" },
    { 
      name: "contenido", 
      label: "Contenido", 
      type: "textarea", 
      required: true, 
      placeholder: "Contenido del aviso",
      fullWidth: true 
    },
    {
      name: "destinatarios",
      label: "Destinatarios",
      type: "select",
      required: true,
      options: [
        { value: "todos", label: "Todos" },
        { value: "propietarios", label: "Propietarios" },
        { value: "inquilinos", label: "Inquilinos" },
        { value: "bloque", label: "Bloque" },
        { value: "unidad", label: "Unidad" },
      ],
    },
    {
      name: "prioridad",
      label: "Prioridad",
      type: "select",
      required: true,
      options: [
        { value: "alta", label: "Alta" },
        { value: "media", label: "Media" },
        { value: "baja", label: "Baja" },
      ],
    },
    { name: "importante", label: "Importante", type: "checkbox", required: false },
    { name: "fechaPublicacion", label: "Fecha de Publicación", type: "datetime-local", required: false },
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
    if (confirm("¿Está seguro de que desea eliminar este aviso?")) {
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
      console.error('Error al guardar aviso:', error)
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
        data={avisos}
        columns={columns}
        title="Avisos"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar avisos..."
        addButtonText="Agregar Aviso"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Aviso" : "Agregar Aviso"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
