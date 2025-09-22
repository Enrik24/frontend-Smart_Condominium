"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { unidadesApiService } from "@/lib/services/unidadesService"
import { useCrud } from "@/hooks/useApi"

export default function UnidadesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: unidades,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: unidadesApiService.getUnidades,
    create: unidadesApiService.createUnidad,
    update: unidadesApiService.updateUnidad,
    delete: unidadesApiService.deleteUnidad,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "numero", label: "Número" },
    { key: "bloque", label: "Bloque" },
    { key: "metrosCuadrados", label: "M²", type: "number" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "residentes", label: "Residentes" },
  ]

  const formFields = [
    { name: "numero", label: "Número", type: "text", required: true, placeholder: "A-101" },
    { name: "bloque", label: "Bloque", type: "text", required: false, placeholder: "A" },
    { name: "metrosCuadrados", label: "Metros Cuadrados", type: "number", required: true, placeholder: "85.5", min: 0.01 },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      required: true,
      options: [
        { value: "departamento", label: "Departamento" },
        { value: "casa", label: "Casa" },
        { value: "penthouse", label: "Penthouse" },
      ],
    },
    { 
      name: "residentes", 
      label: "Residentes", 
      type: "select", 
      required: false,
      multiple: true,
      options: [
        { value: "1", label: "Juan Pérez" },
        { value: "2", label: "María García" },
        { value: "3", label: "Carlos López" },
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
    if (confirm("¿Está seguro de que desea eliminar esta unidad?")) {
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
      console.error('Error al guardar unidad:', error)
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
        data={unidades}
        columns={columns}
        title="Unidades Habitacionales"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar unidades..."
        addButtonText="Agregar Unidad"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Unidad" : "Agregar Unidad"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
