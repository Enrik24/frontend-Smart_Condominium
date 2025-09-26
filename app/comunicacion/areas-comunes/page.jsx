"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { areasComunesApiService } from "@/lib/services/areasComunesService"
import { useCrud } from "@/hooks/useApi"

export default function AreasComunesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Usar el hook personalizado para manejar CRUD
  const areasApi = useMemo(() => ({
    get: areasComunesApiService.getAreasComunes,
    create: areasComunesApiService.createAreaComun,
    update: areasComunesApiService.updateAreaComun,
    delete: areasComunesApiService.deleteAreaComun,
  }), [])

  const {
    items: areas,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  } = useCrud(areasApi)

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "capacidad", label: "Capacidad", type: "number" },
    { key: "precioPorHora", label: "Precio/Hora", type: "currency" },
    { key: "estado", label: "Estado", type: "badge" },
    { key: "horarioApertura", label: "Apertura" },
    { key: "horarioCierre", label: "Cierre" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true, placeholder: "Salón de Eventos" },
    {
      name: "tipo",
      label: "Tipo",
      type: "select",
      required: true,
      options: [
        { value: "salon", label: "Salón" },
        { value: "piscina", label: "Piscina" },
        { value: "quincho", label: "Quincho" },
        { value: "gimnasio", label: "Gimnasio" },
        { value: "playground", label: "Playground" },
        { value: "terraza", label: "Terraza" },
        { value: "lavadero", label: "Lavadero" },
        { value: "otros", label: "Otros" },
      ],
    },
    { name: "capacidad", label: "Capacidad", type: "number", required: true, placeholder: "50", min: 1 },
    { name: "precioPorHora", label: "Precio por Hora", type: "number", required: true, placeholder: "2000", min: 0 },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "disponible", label: "Disponible" },
        { value: "mantenimiento", label: "Mantenimiento" },
        { value: "inactivo", label: "Inactivo" },
      ],
    },
    { name: "horarioApertura", label: "Horario Apertura", type: "time", required: false },
    { name: "horarioCierre", label: "Horario Cierre", type: "time", required: false },
    { 
      name: "reglasUso", 
      label: "Reglas de Uso", 
      type: "textarea", 
      required: false, 
      placeholder: "Reglas y condiciones de uso del área",
      fullWidth: true 
    },
    { name: "imagen", label: "Imagen", type: "file", accept: "image/*", fullWidth: true },
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
    if (confirm("¿Está seguro de que desea eliminar esta área común?")) {
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
      console.error('Error al guardar área común:', error)
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
        data={areas}
        columns={columns}
        title="Áreas Comunes"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar áreas comunes..."
        addButtonText="Agregar Área Común"
        loading={loading}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Área Común" : "Agregar Área Común"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  )
}
