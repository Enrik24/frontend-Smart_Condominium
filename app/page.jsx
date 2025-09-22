"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">Smart Condominium</h1>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  )
}
