"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

export function FormModal({ isOpen, onClose, onSubmit, title, fields = [], initialData = {}, isLoading = false }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
      setErrors({})
    }
  }, [isOpen, initialData])

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es obligatorio`
      }

      if (field.type === "email" && formData[field.name] && !/\S+@\S+\.\S+/.test(formData[field.name])) {
        newErrors[field.name] = "Email inválido"
      }

      if (field.type === "number" && formData[field.name] && formData[field.name] <= 0) {
        newErrors[field.name] = "Debe ser mayor a 0"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      onChange: (e) => handleChange(field.name, e.target.value),
      className: errors[field.name] ? "border-destructive" : "",
    }

    // Para campos que no son file, checkbox o select, agregar value
    if (field.type !== "file" && field.type !== "checkbox" && field.type !== "select") {
      commonProps.value = formData[field.name] || ""
    }

    switch (field.type) {
      case "select":
        return (
          <Select value={formData[field.name] || ""} onValueChange={(value) => handleChange(field.name, value)}>
            <SelectTrigger className={errors[field.name] ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "textarea":
        return <Textarea {...commonProps} placeholder={field.placeholder} rows={3} />

      case "checkbox":
        return (
          <Checkbox
            id={field.name}
            checked={formData[field.name] || false}
            onCheckedChange={(checked) => handleChange(field.name, checked)}
          />
        )

      case "file":
        return (
          <Input
            {...commonProps}
            type="file"
            accept={field.accept}
            onChange={(e) => handleChange(field.name, e.target.files[0])}
          />
        )

      default:
        return <Input {...commonProps} type={field.type || "text"} placeholder={field.placeholder} />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name} className={`space-y-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                <Label htmlFor={field.name} className="flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                {renderField(field)}
                {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
