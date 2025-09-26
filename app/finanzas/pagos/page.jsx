"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { finanzasApiService } from "@/lib/services/finanzasService"
import { useCrud } from "@/hooks/useApi"

export default function PagosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const pagosApi = useMemo(() => ({
    get: finanzasApiService.getPagos,
    create: finanzasApiService.createPago,
    update: finanzasApiService.updatePago,
    delete: finanzasApiService.deletePago,
  }), [])

  const {
    items: pagos,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(pagosApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "expensa", label: "Expensa" },
    { key: "monto", label: "Monto", type: "currency" },
    { key: "metodo", label: "Método", type: "badge" },
    { key: "referencia", label: "Referencia" },
    { key: "fechaPago", label: "Fecha Pago", type: "date" },
  ]

  const formFields = [
    { 
      name: "expensa", 
      label: "Expensa", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "A-101 - 2024-03 - $25,000" },
        { value: "2", label: "A-102 - 2024-03 - $25,000" },
        { value: "3", label: "B-201 - 2024-03 - $25,000" },
      ]
    },
    { name: "monto", label: "Monto", type: "number", required: true, placeholder: "25000", min: 0.01 },
    {
      name: "metodo",
      label: "Método de Pago",
      type: "select",
      required: true,
      options: [
        { value: "transferencia", label: "Transferencia" },
        { value: "tarjeta", label: "Tarjeta" },
        { value: "efectivo", label: "Efectivo" },
        { value: "qr", label: "QR" },
      ],
    },
    { name: "comprobante", label: "Comprobante", type: "file", accept: "image/*,application/pdf", fullWidth: true },
    { name: "referencia", label: "Referencia", type: "text", required: false, placeholder: "Código de transferencia o número de operación" },
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
    if (confirm("¿Está seguro de que desea eliminar este pago?")) {
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
      console.error('Error al guardar pago:', error)
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
        data={pagos}
        columns={columns}
        title="Pagos"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar pagos..."
        addButtonText="Agregar Pago"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Pago" : "Agregar Pago"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
