import { api } from '../../lib/http'

export type DepartamentoActivos = {
  departamento: string
  activos: number
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
