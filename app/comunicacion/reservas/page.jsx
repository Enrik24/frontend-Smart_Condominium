"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { areasComunesApiService } from "@/lib/services/areasComunesService"
import { useCrud } from "@/hooks/useApi"

export default function ReservasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: reservas,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: areasComunesApiService.getReservas,
    create: areasComunesApiService.createReserva,
    update: areasComunesApiService.updateReserva,
    delete: areasComunesApiService.deleteReserva,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "areaComun", label: "Área Común" },
    { key: "fecha", label: "Fecha", type: "date" },
    { key: "horaInicio", label: "Hora Inicio" },
    { key: "horaFin", label: "Hora Fin" },
    { key: "motivo", label: "Motivo" },
    { key: "invitadosEstimados", label: "Invitados", type: "number" },
    { key: "montoTotal", label: "Total", type: "currency" },
    { key: "estado", label: "Estado", type: "badge" },
  ]

  const formFields = [
    { 
      name: "areaComun", 
      label: "Área Común", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "Salón de Eventos - Capacidad: 50" },
        { value: "2", label: "Piscina - Capacidad: 30" },
        { value: "3", label: "Quincho - Capacidad: 20" },
        { value: "4", label: "Gimnasio - Capacidad: 15" },
      ]
    },
    { name: "fecha", label: "Fecha", type: "date", required: true },
    { name: "horaInicio", label: "Hora Inicio", type: "time", required: true },
    { name: "horaFin", label: "Hora Fin", type: "time", required: true },
    { 
      name: "motivo", 
      label: "Motivo", 
      type: "textarea", 
      required: true, 
      placeholder: "Descripción del evento o actividad",
      fullWidth: true 
    },
    { name: "invitadosEstimados", label: "Invitados Estimados", type: "number", required: true, placeholder: "10", min: 1 },
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
    if (confirm("¿Está seguro de que desea eliminar esta reserva?")) {
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
      console.error('Error al guardar reserva:', error)
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
        data={reservas}
        columns={columns}
        title="Reservas"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar reservas..."
        addButtonText="Agregar Reserva"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Reserva" : "Agregar Reserva"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}