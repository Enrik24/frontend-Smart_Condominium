"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { unidadesApiService } from "@/lib/services/unidadesService"
import { useCrud } from "@/hooks/useApi"

export default function VehiculosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const {
    items: vehiculos,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud({
    get: unidadesApiService.getVehiculos,
    create: unidadesApiService.createVehiculo,
    update: unidadesApiService.updateVehiculo,
    delete: unidadesApiService.deleteVehiculo,
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "placa", label: "Placa" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "color", label: "Color" },
    { key: "residente", label: "Residente" },
    { key: "unidad_habitacional", label: "Unidad" },
    { key: "activo", label: "Estado", type: "badge" },
  ]

  const formFields = [
    { name: "placa", label: "Placa", type: "text", required: true, placeholder: "ABC-1234" },
    { name: "marca", label: "Marca", type: "text", required: true, placeholder: "Toyota" },
    { name: "modelo", label: "Modelo", type: "text", required: true, placeholder: "Corolla" },
    { name: "color", label: "Color", type: "text", required: true, placeholder: "Blanco" },
    { 
      name: "residente", 
      label: "Residente", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "Juan Pérez" },
        { value: "2", label: "María García" },
        { value: "3", label: "Carlos López" },
      ]
    },
    { 
      name: "unidad_habitacional", 
      label: "Unidad Habitacional", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "A-101" },
        { value: "2", label: "A-102" },
        { value: "3", label: "B-201" },
        { value: "4", label: "B-202" },
      ]
    },
    {
      name: "activo",
      label: "Estado",
      type: "select",
      required: false,
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ]
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
    if (confirm("¿Está seguro de que desea eliminar este vehículo?")) {
      await deleteItem(item.id)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    // Mapear estado string -> boolean para backend
    const payload = {
      ...formData,
      activo: typeof formData.activo === 'string' ? formData.activo === 'true' : !!formData.activo,
    }

    try {
      if (editingItem) {
        await updateItem(editingItem.id, payload)
      } else {
        await createItem(payload)
      }

      setIsModalOpen(false)
    } catch (error) {
      console.error('Error al guardar vehículo:', error)
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
        data={vehiculos}
        columns={columns}
        title="Vehículos"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar vehículos..."
        addButtonText="Agregar Vehículo"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Vehículo" : "Agregar Vehículo"}
        fields={formFields}
        initialData={editingItem ? { ...editingItem, activo: editingItem.activo !== undefined ? String(!!editingItem.activo) : "" } : {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
