"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { authService } from "@/lib/auth"

export function DashboardLayout({ children }) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsClient(true)

    /*
    if (!authService.isAuthenticated()) {
      router.push("/login")
    }
    */
  }, [router])

  // On the server and initial client render, `isClient` is false.
  // This ensures both renders are identical, preventing a hydration mismatch.
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  /*
  // A second check to prevent content flashing for unauthenticated users while redirecting
  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirigiendo al login...</p>
      </div>
    )
  }
  */

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
