"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"

export default function MultasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [multas, setMultas] = useState([
    {
      id: 1,
      residente: "Juan Pérez - 1A",
      tipo: "ruido",
      descripcion: "Música alta después de las 22:00 hs",
      monto: 5000,
      fecha: "2024-03-15",
      fechaLimitePago: "2024-03-30",
      administrador: "Portero Nocturno",
      evidencia: "foto_ruido.jpg",
    },
    {
      id: 2,
      residente: "María García - 2B",
      tipo: "estacionamiento",
      descripcion: "Vehículo mal estacionado en área común",
      monto: 3000,
      fecha: "2024-03-12",
      fechaLimitePago: "2024-03-27",
      administrador: "Administración",
      evidencia: "foto_estacionamiento.jpg",
    },
  ])

  const columns = [
    { key: "residente", label: "Residente" },
    { key: "tipo", label: "Tipo", type: "badge" },
    { key: "descripcion", label: "Descripción" },
    { key: "monto", label: "Monto", type: "currency" },
    { key: "fecha", label: "Fecha Infracción", type: "date" },
    { key: "fechaLimitePago", label: "Límite Pago", type: "date" },
    { key: "administrador", label: "Administrador" },
  ]

  const formFields = [
    { 
      name: "residente", 
      label: "Residente", 
      type: "select", 
      required: true,
      options: [
        { value: "1", label: "Juan Pérez - 1A" },
        { value: "2", label: "María García - 2B" },
        { value: "3", label: "Carlos López - 3C" },
      ]
    },
    {
      name: "tipo",
      label: "Tipo de Infracción",
      type: "select",
      required: true,
      options: [
        { value: "estacionamiento", label: "Estacionamiento" },
        { value: "ruido", label: "Ruido" },
        { value: "areas_comunes", label: "Áreas Comunes" },
        { value: "mascotas", label: "Mascotas" },
        { value: "basura", label: "Manejo de Basura" },
        { value: "obras", label: "Obras sin Autorización" },
        { value: "otros", label: "Otros" },
      ],
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "textarea",
      required: true,
      placeholder: "Descripción detallada de la infracción",
      fullWidth: true,
    },
    { name: "monto", label: "Monto de la Multa", type: "number", required: true, placeholder: "5000", min: 0.01 },
    { name: "fecha", label: "Fecha de Infracción", type: "date", required: true },
    { name: "fechaLimitePago", label: "Fecha Límite de Pago", type: "date", required: true },
    { 
      name: "administrador", 
      label: "Administrador", 
      type: "select", 
      required: false,
      options: [
        { value: "1", label: "Administrador Principal" },
        { value: "2", label: "Portero Nocturno" },
        { value: "3", label: "Personal Seguridad" },
      ]
    },
    { name: "evidencia", label: "Evidencia", type: "file", accept: "image/*", fullWidth: true },
  ]

  const handleAdd = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    if (confirm("¿Está seguro de que desea eliminar esta multa?")) {
      setMultas((prev) => prev.filter((m) => m.id !== item.id))
    }
  }

  const handleSubmit = async (formData) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingItem) {
      setMultas((prev) => prev.map((m) => (m.id === editingItem.id ? { ...m, ...formData } : m)))
    } else {
      const newMulta = {
        id: Date.now(),
        ...formData,
      }
      setMultas((prev) => [...prev, newMulta])
    }

    setIsLoading(false)
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout>
      <DataTable
        data={multas}
        columns={columns}
        title="Multas"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar multas..."
        addButtonText="Agregar Multa"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Multa" : "Agregar Multa"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isLoading}
      />
    </DashboardLayout>
  )
}
