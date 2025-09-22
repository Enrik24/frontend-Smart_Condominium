"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Users,
  Car,
  DollarSign,
  Shield,
  MessageSquare,
  BarChart3,
  Settings,
  Building,
  Bell,
  Wrench,
  CreditCard,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Gestión Administrativa",
    icon: Settings,
    children: [
      { title: "Unidades Habitacionales", href: "/admin/unidades", icon: Building },
      { title: "Vehículos", href: "/admin/vehiculos", icon: Car },
      { title: "Usuarios", href: "/admin/usuarios", icon: Users },
      { title: "Roles", href: "/admin/roles", icon: UserCheck },
      { title: "Permisos", href: "/admin/permisos", icon: Shield },
      { title: "Avisos", href: "/admin/avisos", icon: Bell },
      { title: "Tareas Mantenimiento", href: "/admin/mantenimiento", icon: Wrench },
      { title: "Configuración", href: "/admin/configuracion", icon: Settings },
    ],
  },
  {
    title: "Gestión Financiera",
    icon: DollarSign,
    href: "/finanzas",
    children: [
      { title: "Expensas", href: "/finanzas/expensas", icon: CreditCard },
      { title: "Multas", href: "/finanzas/multas", icon: AlertTriangle },
      { title: "Pagos", href: "/finanzas/pagos", icon: DollarSign },
    ],
  },
  {
    title: "Seguridad con IA",
    icon: Shield,
    href: "/seguridad",
    children: [
      { title: "Personal Seguridad", href: "/seguridad/personal", icon: UserCheck },
      { title: "Invitados", href: "/seguridad/invitados", icon: Users },
      { title: "Entradas/Salidas", href: "/seguridad/entradas-salidas", icon: Shield },
      { title: "Infracciones", href: "/seguridad/infracciones", icon: AlertTriangle },
    ],
  },
  {
    title: "Comunicación y Servicios",
    icon: MessageSquare,
    href: "/comunicacion",
    children: [
      { title: "Notificaciones", href: "/comunicacion/notificaciones", icon: Bell },
      { title: "Reservas", href: "/comunicacion/reservas", icon: Calendar },
      { title: "Áreas Comunes", href: "/comunicacion/areas-comunes", icon: Building },
    ],
  },
  {
    title: "Reportes y Analítica",
    icon: BarChart3,
    href: "/reportes",
    children: [
      { title: "Reportes", href: "/reportes", icon: FileText },
      { title: "Bitácora", href: "/reportes/bitacora", icon: BarChart3 },
    ],
  },
]

export function Sidebar() {
  const [openItems, setOpenItems] = useState({})
  const pathname = usePathname()

  const toggleItem = (title) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (href) => pathname === href
  const isParentActive = (children) => children?.some((child) => pathname === child.href)

  return (
    <div className="w-64 bg-green-50 border-r border-green-200 h-full flex flex-col">
      <div className="p-6 border-b border-green-200">
        <h1 className="text-xl font-bold text-green-700">Smart Condominium</h1>
        <p className="text-sm text-gray-600">Sistema de Gestión</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon

          if (item.children) {
            const isOpen = openItems[item.title]
            const hasActiveChild = isParentActive(item.children)

            return (
              <Collapsible key={item.title} open={isOpen} onOpenChange={() => toggleItem(item.title)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between text-left font-normal ${
                      hasActiveChild
                        ? "bg-green-100 text-green-800"
                        : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 ml-4 mt-1">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon
                    return (
                      <Button
                        key={child.href}
                        variant="ghost"
                        asChild
                        className={`w-full justify-start text-left font-normal ${
                          isActive(child.href)
                            ? "bg-green-600 text-white"
                            : "text-gray-600 hover:bg-green-100 hover:text-green-800"
                        }`}
                      >
                        <Link href={child.href}>
                          <ChildIcon className="h-4 w-4 mr-3" />
                          {child.title}
                        </Link>
                      </Button>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            )
          }

          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={`w-full justify-start text-left font-normal ${
                isActive(item.href)
                  ? "bg-green-600 text-white"
                  : "text-gray-700 hover:bg-green-100 hover:text-green-800"
              }`}
            >
              <Link href={item.href}>
                <Icon className="h-4 w-4 mr-3" />
                {item.title}
              </Link>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
