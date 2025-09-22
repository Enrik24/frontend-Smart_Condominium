import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCard({ title, value, description, icon: Icon, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`text-xs mt-1 ${trend.positive ? "text-green-600" : "text-red-600"}`}>{trend.value}</div>
        )}
      </CardContent>
    </Card>
  )
}
