// src/features/dashboard/types.ts
export type Kpi = {
  id: string
  label: string
  value: number
  /** variación porcentual vs. periodo anterior */
  delta?: number
  /** sentido de la variación */
  trend?: 'up' | 'down' | 'flat'
  /** mostrar como moneda (Q) */
  currency?: boolean
}

export type ActivityItem = {
  id: string
  type: 'empleado' | 'nomina' | 'documento' | 'sistema'
  title: string
  description?: string
  createdAt: string // ISO date
  status?: 'success' | 'warning' | 'error' | 'info'
}

export type DashboardResponse = {
  kpis: Kpi[]
  activity: ActivityItem[]
}
