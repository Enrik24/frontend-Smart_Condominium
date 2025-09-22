"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Default data with fallback values
const defaultPaymentData = [
  { name: "Pagadas", value: 75, color: "#22c55e" },
  { name: "Pendientes", value: 20, color: "#f59e0b" },
  { name: "Vencidas", value: 5, color: "#ef4444" },
]

const defaultViolationData = [
  { name: "Ruido", value: 12 },
  { name: "Estacionamiento", value: 8 },
  { name: "Mascotas", value: 5 },
]

// The component now receives its data as props
export function FinancialChart({ paymentData = defaultPaymentData, violationData = defaultViolationData }) {
  // Ensure we have valid data
  const safePaymentData = paymentData && paymentData.length > 0 ? paymentData : defaultPaymentData
  const safeViolationData = violationData && violationData.length > 0 ? violationData : defaultViolationData

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={safePaymentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {safePaymentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Infracciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={safeViolationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelStyle={{ color: '#374151' }}
              />
              <Bar 
                dataKey="value" 
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}