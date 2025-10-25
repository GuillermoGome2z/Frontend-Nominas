import { api } from '../../lib/api'

export interface PositionDTO {
  id: number
  nombre: string
  salarioBase: number
  activo: boolean
  departamentoId?: number
}

export interface PosFilters {
  page?: number
  pageSize?: number
  activo?: boolean
  departamentoId?: number
}
export interface PosListResponse {
  data: PositionDTO[]
  meta: { total:number; page:number; pageSize:number }
}

function mapPos(x:any): PositionDTO {
  return {
    id: x.id ?? x.Id,
    nombre: x.nombre ?? x.Nombre,
    salarioBase: x.salarioBase ?? x.SalarioBase ?? 0,
    activo: x.activo ?? x.Activo ?? true,
    departamentoId: x.departamentoId ?? x.DepartamentoId ?? undefined,
  }
}

export async function listPositions(f: PosFilters = {}): Promise<PosListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(f.page ?? 1))
  params.set('pageSize', String(f.pageSize ?? 10))
  if (typeof f.activo === 'boolean') params.set('activo', String(f.activo))
  if (typeof f.departamentoId === 'number') params.set('departamentoId', String(f.departamentoId))

  const r = await api.get(`/Puesto?${params.toString()}`)
  const rawTotal = (r.headers?.['x-total-count'] ?? r.headers?.['X-Total-Count'] ?? 0) as any
  const total = Number(rawTotal) || 0
  let data = Array.isArray(r.data) ? r.data.map(mapPos) : []

  // Fallback FE si el backend ignora el filtro:
  if (typeof f.departamentoId === 'number') {
    data = data.filter(p => p.departamentoId === f.departamentoId)
  }

  return { data, meta:{ total: total || data.length, page: f.page ?? 1, pageSize: f.pageSize ?? data.length } }
}

export async function getPosition(id:number): Promise<PositionDTO> {
  const r = await api.get(`/Puesto/${id}`)
  return mapPos(r.data)
}

export async function createPosition(p: Partial<PositionDTO>) {
  const body = {
    Nombre: p.nombre,
    SalarioBase: p.salarioBase ?? 0,
    Activo: p.activo ?? true,
    DepartamentoId: p.departamentoId ?? null,
  }
  const r = await api.post('/Puesto', body)
  return r.data
}

export async function updatePosition(id:number, p: Partial<PositionDTO>) {
  const body = {
    Id: id,
    Nombre: p.nombre,
    SalarioBase: p.salarioBase ?? 0,
    Activo: p.activo ?? true,
    DepartamentoId: p.departamentoId ?? null,
  }
  const r = await api.put(`/Puesto/${id}`, body)
  return r.status
}

export async function togglePositionActive(id:number, activo:boolean) {
  const endpoint = activo ? `/Puesto/${id}/activar` : `/Puesto/${id}/desactivar`;
  const r = await api.put(endpoint)
  return r.status
}
