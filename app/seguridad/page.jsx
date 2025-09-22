import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SecurityDashboard } from "@/components/seguridad/security-dashboard"

export default function SeguridadPage() {
  return (
    <DashboardLayout>
      <SecurityDashboard />
    </DashboardLayout>
  )
}
