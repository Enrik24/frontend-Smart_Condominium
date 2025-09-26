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
      const value = formData[field.name]

      if (field.required) {
        if ((field.type === 'select' && field.multiple) || field.type === 'permissions') {
          if (!Array.isArray(value) || value.length === 0) {
            newErrors[field.name] = `${field.label} es obligatorio`
          }
        } else if (!value) {
          newErrors[field.name] = `${field.label} es obligatorio`
        }
      }

      if (field.type === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = "Email inválido"
      }

      if (field.type === "number" && (value || value === 0) && Number(value) <= 0) {
        newErrors[field.name] = "Debe ser mayor a 0"
      }

      if (typeof value === 'string') {
        if (field.minLength && value.length < field.minLength) {
          newErrors[field.name] = `${field.label} debe tener al menos ${field.minLength} caracteres`
        }
        if (field.maxLength && value.length > field.maxLength) {
          newErrors[field.name] = `${field.label} debe tener como máximo ${field.maxLength} caracteres`
        }
        if (field.pattern) {
          const regex = typeof field.pattern === 'string' ? new RegExp(field.pattern) : field.pattern
          if (!regex.test(value)) {
            newErrors[field.name] = field.patternMessage || `${field.label} tiene un formato inválido`
          }
        }
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
        if (field.multiple) {
          const selected = Array.isArray(formData[field.name]) ? formData[field.name] : []
          const toggle = (val) => {
            const exists = selected.includes(val)
            const next = exists ? selected.filter((v) => v !== val) : [...selected, val]
            handleChange(field.name, next)
          }
          return (
            <div className="grid gap-2">
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${field.name}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={() => toggle(option.value)}
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          )
        }
        return (
          <Select value={formData[field.name] !== undefined && formData[field.name] !== null ? String(formData[field.name]) : ""} onValueChange={(value) => handleChange(field.name, value)}>
            <SelectTrigger className={errors[field.name] ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "permissions":
        {
          const selected = Array.isArray(formData[field.name]) ? formData[field.name] : []
          const toggle = (val) => {
            const exists = selected.includes(val)
            const next = exists ? selected.filter((v) => v !== val) : [...selected, val]
            handleChange(field.name, next)
          }
          return (
            <div className="max-h-64 overflow-y-auto pr-1">
              {/* Para añadir/modificar categorías o traerlas desde API, edita field.categories a continuación */}
              <div className="grid gap-4">
                {field.categories?.map((cat) => (
                  <div key={cat.key || cat.name}>
                    <div className="mb-2 text-sm font-medium text-muted-foreground">{cat.name}</div>
                    <div className="grid gap-2">
                      {cat.items?.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`${field.name}-${opt.value}`}
                            checked={selected.includes(opt.value)}
                            onCheckedChange={() => toggle(opt.value)}
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

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
