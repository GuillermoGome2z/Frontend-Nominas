// src/features/payroll/api.ts
import { api } from '../../lib/api'

export interface PayrollDTO {
  id: number
  periodo: string
  fechaCreacion: string
  total: number
  estado: string
}

export interface PayrollFilters {
  page?: number
  pageSize?: number
  q?: string
  periodo?: string
}

export interface PayrollListResponse {
  data: PayrollDTO[]
  meta: { total: number; page: number; pageSize: number }
}

function mapPayroll(x: Record<string, unknown>): PayrollDTO {
  return {
    id: (x['id'] ?? x['Id']) as number,
    periodo: String(x['periodo'] ?? x['Periodo'] ?? ''),
    fechaCreacion: String(x['fechaCreacion'] ?? x['FechaCreacion'] ?? ''),
    total: Number(x['total'] ?? x['Total'] ?? 0),
    estado: String(x['estado'] ?? x['Estado'] ?? 'BORRADOR'),
  }
}

export async function listPayrolls(
  f: PayrollFilters = {},
): Promise<PayrollListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(f.page ?? 1))
  params.set('pageSize', String(f.pageSize ?? 10))
  if (f.q) params.set('q', f.q)
  if (f.periodo) params.set('periodo', f.periodo)

  const r = await api.get(`/Nominas?${params.toString()}`)
  const rawTotal = r.headers?.['x-total-count'] ?? r.headers?.['X-Total-Count'] ?? '0'
  const total = Number(String(rawTotal)) || 0
  const data = Array.isArray(r.data) ? r.data.map(mapPayroll) : []
  return { data, meta: { total, page: f.page ?? 1, pageSize: f.pageSize ?? 10 } }
}

export async function getPayroll(id: number): Promise<PayrollDTO> {
  const r = await api.get(`/Nominas/${id}`)
  return mapPayroll(r.data)
}

export async function createPayroll(p: Partial<PayrollDTO>) {
  const body = { Periodo: p.periodo, Total: p.total }
  const r = await api.post('/Nominas', body)
  return r.data
}

export async function generatePayroll(id: number) {
  const r = await api.post(`/Nominas/${id}/generar`)
  return r.data
}
