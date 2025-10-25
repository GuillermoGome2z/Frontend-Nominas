import { api } from '../../lib/http'

export type DepartamentoActivos = {
  departamento: string
  activos: number
}

export type DashboardActivity = {
  id: number
  tipo: string
  descripcion: string
  fecha: string
  usuario?: string
  entidad?: string
  entidadId?: number
}

export type DashboardAlert = {
  id: number
  tipo: 'warning' | 'error' | 'info'
  titulo: string
  descripcion: string
  fecha: string
  leido: boolean
  accion?: string
  url?: string
}

export type Kpis = {
  totalEmpleados?: number
  nominaPendienteQ?: number
  proximoPago?: string // ISO
  nominasGeneradasEnMes?: number
  nominasGeneradasEnMesAnterior?: number
  activosPorDepartamento?: DepartamentoActivos[]
  // Campos extra del backend no romperán (se ignoran)
  [key: string]: unknown
}

export async function getKpis(): Promise<Kpis> {
  const res = await api.get('/Dashboard')
  return res.data as Kpis
}
