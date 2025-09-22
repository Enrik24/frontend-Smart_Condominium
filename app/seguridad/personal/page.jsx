"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/shared/data-table"
import { FormModal } from "@/components/shared/form-modal"

export default function PersonalSeguridadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [personal, setPersonal] = useState([
    {
      id: 1,
      nombre: "Carlos Seguridad",
      dni: "12345678",
      telefono: "+54 11 1111-1111",
      email: "carlos@seguridad.com",
      turno: "mañana",
      fechaIngreso: "2024-01-15",
      estado: "activo",
      certificaciones: "Curso de Seguridad Privada",
      observaciones: "Experiencia de 5 años",
    },
    {
      id: 2,
      nombre: "Ana Portero",
      dni: "87654321",
      telefono: "+54 11 2222-2222",
      email: "ana@seguridad.com",
      turno: "tarde",
      fechaIngreso: "2024-02-01",
      estado: "activo",
      certificaciones: "Primeros Auxilios",
      observaciones: "Muy responsable",
    },
    {
      id: 3,
      nombre: "Miguel Nocturno",
      dni: "11223344",
      telefono: "+54 11 3333-3333",
      email: "miguel@seguridad.com",
      turno: "noche",
      fechaIngreso: "2024-01-20",
      estado: "activo",
      certificaciones: "Seguridad Privada, Manejo de Crisis",
      observaciones: "Guardia nocturno experimentado",
    },
  ])

  const columns = [
    { key: "nombre", label: "Nombre" },
    { key: "dni", label: "DNI" },
    { key: "telefono", label: "Teléfono" },
    { key: "turno", label: "Turno", type: "badge" },
    { key: "fechaIngreso", label: "Fecha Ingreso", type: "date" },
    { key: "estado", label: "Estado", type: "badge" },
    { key: "certificaciones", label: "Certificaciones" },
  ]

  const formFields = [
    { name: "nombre", label: "Nombre Completo", type: "text", required: true, placeholder: "Carlos Seguridad" },
    { name: "dni", label: "DNI", type: "text", required: true, placeholder: "12345678" },
    { name: "telefono", label: "Teléfono", type: "tel", required: true, placeholder: "+54 11 1111-1111" },
    { name: "email", label: "Email", type: "email", placeholder: "carlos@seguridad.com" },
    {
      name: "turno",
      label: "Turno",
      type: "select",
      required: true,
      options: [
        { value: "mañana", label: "Mañana (06:00 - 14:00)" },
        { value: "tarde", label: "Tarde (14:00 - 22:00)" },
        { value: "noche", label: "Noche (22:00 - 06:00)" },
        { value: "rotativo", label: "Rotativo" },
      ],
    },
    { name: "fechaIngreso", label: "Fecha de Ingreso", type: "date", required: true },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: "activo", label: "Activo" },
        { value: "inactivo", label: "Inactivo" },
        { value: "licencia", label: "En Licencia" },
        { value: "suspendido", label: "Suspendido" },
      ],
    },
    {
      name: "certificaciones",
      label: "Certificaciones",
      type: "textarea",
      placeholder: "Cursos y certificaciones del personal",
    },
    {
      name: "observaciones",
      label: "Observaciones",
      type: "textarea",
      placeholder: "Notas adicionales sobre el personal",
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

  const handleDelete = (item) => {
    if (confirm("¿Está seguro de que desea eliminar este personal?")) {
      setPersonal((prev) => prev.filter((p) => p.id !== item.id))
    }
  }

  const handleSubmit = async (formData) => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingItem) {
      setPersonal((prev) => prev.map((p) => (p.id === editingItem.id ? { ...p, ...formData } : p)))
    } else {
      const newPersonal = {
        id: Date.now(),
        ...formData,
      }
      setPersonal((prev) => [...prev, newPersonal])
    }

    setIsLoading(false)
    setIsModalOpen(false)
  }

  return (
    <DashboardLayout>
      <DataTable
        data={personal}
        columns={columns}
        title="Personal de Seguridad"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar personal..."
        addButtonText="Agregar Personal"
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title={editingItem ? "Editar Personal" : "Agregar Personal"}
        fields={formFields}
        initialData={editingItem || {}}
        isLoading={isLoading}
      />
    </DashboardLayout>
  )
}
