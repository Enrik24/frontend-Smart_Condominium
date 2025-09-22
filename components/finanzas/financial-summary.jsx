import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

export function FinancialSummary() {
  // This would come from API
  const summaryData = {
    totalExpensas: 450000,
    totalCobrado: 382500,
    totalPendiente: 67500,
    totalMultas: 15000,
    multasCobradas: 8000,
    multasPendientes: 7000,
    porcentajeCobrado: 85,
    unidadesMorosas: 3,
    totalUnidades: 20,
  }

  const cards = [
    {
      title: "Total Expensas del Mes",
      value: `$${summaryData.totalExpensas.toLocaleString()}`,
      description: `${summaryData.porcentajeCobrado}% cobrado`,
      icon: DollarSign,
      trend: { positive: true, value: "+12% vs mes anterior" },
    },
    {
      title: "Monto Cobrado",
      value: `$${summaryData.totalCobrado.toLocaleString()}`,
      description: `${summaryData.totalUnidades - summaryData.unidadesMorosas} unidades al día`,
      icon: TrendingUp,
      trend: { positive: true, value: "+8% vs mes anterior" },
    },
    {
      title: "Monto Pendiente",
      value: `$${summaryData.totalPendiente.toLocaleString()}`,
      description: `${summaryData.unidadesMorosas} unidades morosas`,
      icon: TrendingDown,
      trend: { positive: false, value: "+15% vs mes anterior" },
    },
    {
      title: "Multas Aplicadas",
      value: `$${summaryData.totalMultas.toLocaleString()}`,
      description: `$${summaryData.multasCobradas.toLocaleString()} cobradas`,
      icon: AlertTriangle,
      trend: { positive: false, value: "+5% vs mes anterior" },
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Resumen Financiero</h2>
        <p className="text-muted-foreground">Estado actual de las finanzas del condominio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                {card.description && <p className="text-xs text-muted-foreground mt-1">{card.description}</p>}
                {card.trend && (
                  <div className={`text-xs mt-1 ${card.trend.positive ? "text-green-600" : "text-red-600"}`}>
                    {card.trend.value}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Estado de Cobranza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unidades al día</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{summaryData.totalUnidades - summaryData.unidadesMorosas}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(
                      ((summaryData.totalUnidades - summaryData.unidadesMorosas) / summaryData.totalUnidades) * 100,
                    )}
                    %
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Unidades morosas</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{summaryData.unidadesMorosas}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((summaryData.unidadesMorosas / summaryData.totalUnidades) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multas y Sanciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Multas cobradas</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-600">
                    ${summaryData.multasCobradas.toLocaleString()}
                  </span>
                  <Badge variant="default">
                    {Math.round((summaryData.multasCobradas / summaryData.totalMultas) * 100)}%
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Multas pendientes</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-600">
                    ${summaryData.multasPendientes.toLocaleString()}
                  </span>
                  <Badge variant="secondary">
                    {Math.round((summaryData.multasPendientes / summaryData.totalMultas) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
