"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { FinancialChart } from "@/components/dashboard/financial-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Shield, AlertTriangle, Calendar, Users, Building } from "lucide-react"
import { dashboardApiService } from "@/lib/services/dashboardService"

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-80" />
        </div>
        <div>
          <Skeleton className="h-80" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await dashboardApiService.getDashboardData()
        
        if (result.success) {
          setData(result.data)
        } else {
          setError(result.error.message)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setError("Error al cargar los datos del dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <DashboardLayout>
      {loading ? (
        <DashboardLoadingSkeleton />
      ) : error ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general del condominio</p>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general del condominio</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Resumen Financiero</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard {...data.stats.expensas} icon={DollarSign} />
              <StatsCard {...data.stats.morosidad} icon={AlertTriangle} />
              <StatsCard {...data.stats.multas} icon={AlertTriangle} />
              <StatsCard {...data.stats.reservas} icon={Calendar} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Estado de Seguridad</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard {...data.stats.accesos} icon={Shield} />
              <StatsCard {...data.stats.alertas} icon={AlertTriangle} />
              <StatsCard {...data.stats.infracciones} icon={AlertTriangle} />
              <StatsCard {...data.stats.visitantes} icon={Users} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FinancialChart paymentData={data.charts.paymentData} violationData={data.charts.violationData} />
            </div>
            <div>
              <RecentActivity activities={data.activities} />
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  )
}