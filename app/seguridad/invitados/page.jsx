"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { seguridadApiService } from "@/lib/services/seguridadService"
import { useCrud } from "@/hooks/useApi"

export default function InvitadosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const invitadosApi = useMemo(() => ({
    get: seguridadApiService.getInvitados,
    create: seguridadApiService.createInvitado,
    update: seguridadApiService.updateInvitado,
    delete: seguridadApiService.deleteInvitado,
  }), [])

  const {
    items: invitados,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(invitadosApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "documento", label: "Documento" },
    { key: "tipoDocumento", label: "Tipo Doc.", type: "badge" },
    { key: "patenteVehiculo", label: "Patente" },
    { key: "fechaHoraVisita", label: "Fecha/Hora Visita", type: "datetime" },
    { key: "motivoVisita", label: "Motivo" },
    { key: "numeroAcompanantes", label: "Acompañantes", type: "number" },
    { key: "residente", label: "Residente" },
    { key: "estado", label: "Estado", type: "badge" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Nombre completo" },
    { name: "documento", label: "Documento", type: "text", required: false, placeholder: "12345678" },
    {
      name: "tipoDocumento",
      label: "Tipo de Documento",
      type: "select",
      required: false,
      options: [
        { value: "ci", label: "Cédula de Identidad" },
        { value: "pasaporte", label: "Pasaporte" },
        { value: "licencia", label: "Licencia de Conducir" },
        { value: "otros", label: "Otros" },
      ],
    },
    { name: "patenteVehiculo", label: "Patente del Vehículo", type: "text", required: false, placeholder: "ABC-1234" },
    { name: "fechaHoraVisita", label: "Fecha y Hora de Visita", type: "datetime-local", required: true },
    { 
      name: "motivoVisita", 
      label: "Motivo de Visita", 
      type: "textarea", 
      required: false, 
      placeholder: "Motivo de la visita",
      fullWidth: true 
    },
    { name: "numeroAcompanantes", label: "Número de Acompañantes", type: "number", required: false, placeholder: "0", min: 0 },
    { name: "residente", label: "Residente", type: "hidden", required: true }, // Se autocompleta desde sesión
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
    if (confirm("¿Está seguro de que desea eliminar este invitado?")) {
      await deleteItem(item.id)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      // Autocompletar el residente desde la sesión actual
      const currentUser = JSON.parse(localStorage.getItem('condominium_user_data') || '{}')
      formData.residente = currentUser.id || 1

      if (editingItem) {
        await updateItem(editingItem.id, formData)
      } else {
        await createItem(formData)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('Error al guardar invitado:', error)
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
        data={invitados}
        columns={columns}
        title="Invitados"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar invitados..."
        addButtonText="Agregar Invitado"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Invitado" : "Agregar Invitado"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
