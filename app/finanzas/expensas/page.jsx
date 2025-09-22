"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { finanzasApiService } from "@/lib/services/finanzasService"
import { useCrud } from "@/hooks/useApi"

export default function ExpensasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: expensas,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: finanzasApiService.getExpensas,
    create: finanzasApiService.createExpensa,
    update: finanzasApiService.updateExpensa,
    delete: finanzasApiService.deleteExpensa,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "unidad", label: "Unidad" },
    { key: "periodo", label: "Período" },
    { key: "monto", label: "Monto", type: "currency" },
    { key: "fechaVencimiento", label: "Vencimiento", type: "date" },
    { key: "descripcion", label: "Descripción" },
  ]

  const formFields = [
    { 
      name: "unidad", 
      label: "Unidad", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "A-101" },
        { value: "2", label: "A-102" },
        { value: "3", label: "B-201" },
        { value: "4", label: "B-202" },
      ]
    },
    { name: "periodo", label: "Período", type: "month", required: true },
    { name: "monto", label: "Monto", type: "number", required: true, placeholder: "25000", min: 0.01 },
    { name: "fechaVencimiento", label: "Fecha Vencimiento", type: "date", required: true },
    { 
      name: "descripcion", 
      label: "Descripción", 
      type: "textarea", 
      required: false, 
      placeholder: "Expensa mensual",
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
    if (confirm("¿Está seguro de que desea eliminar esta expensa?")) {
      await deleteItem(item.id)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      // Calculate total amount
      const montoTotal = (formData.montoBase || 0) + (formData.gastosExtraordinarios || 0)
      const dataToSubmit = { ...formData, montoTotal }

      if (editingItem) {
        await updateItem(editingItem.id, dataToSubmit)
      } else {
        await createItem(dataToSubmit)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('Error al guardar expensa:', error)
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
        data={expensas}
        columns={columns}
        title="Expensas"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar expensas..."
        addButtonText="Agregar Expensa"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Expensa" : "Agregar Expensa"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
