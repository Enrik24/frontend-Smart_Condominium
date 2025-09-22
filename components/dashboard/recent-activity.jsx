import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// The component now receives 'activities' as a prop
export function RecentActivity({ activities = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status === "completed" && "Completado"}
                  {activity.status === "warning" && "Alerta"}
                  {activity.status === "info" && "Info"}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No hay actividad reciente.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}