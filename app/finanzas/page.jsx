import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FinancialSummary } from "@/components/finanzas/financial-summary"

export default function FinanzasPage() {
  return (
    <DashboardLayout>
      <FinancialSummary />
    </DashboardLayout>
  )
}
