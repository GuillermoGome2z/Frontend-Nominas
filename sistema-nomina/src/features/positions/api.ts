import { api } from '../../lib/api'

export interface PositionDTO {
  id: number
  nombre: string
  salarioBase: number
  activo: boolean
}

export interface PosFilters { page?: number; pageSize?: number; activo?: boolean }
export interface PosListResponse { data: PositionDTO[]; meta:{ total:number; page:number; pageSize:number } }

function mapPos(x:any): PositionDTO {
  return {
    id: x.id ?? x.Id,
    nombre: x.nombre ?? x.Nombre,
    salarioBase: x.salarioBase ?? x.SalarioBase ?? 0,
    activo: x.activo ?? x.Activo ?? true,
  }
}

export async function listPositions(f: PosFilters = {}): Promise<PosListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(f.page ?? 1))
  params.set('pageSize', String(f.pageSize ?? 10))
  if (typeof f.activo === 'boolean') params.set('activo', String(f.activo))

  const r = await api.get(`/Puestos?${params.toString()}`)
  const rawTotal = (r.headers?.['x-total-count'] ?? r.headers?.['X-Total-Count'] ?? 0) as any
  const total = Number(rawTotal) || 0
  const data = Array.isArray(r.data) ? r.data.map(mapPos) : []
  return { data, meta:{ total, page: f.page ?? 1, pageSize: f.pageSize ?? 10 } }
}

export async function getPosition(id:number): Promise<PositionDTO> {
  const r = await api.get(`/Puestos/${id}`)
  return mapPos(r.data)
}

export async function createPosition(p: Partial<PositionDTO>) {
  const body = { Nombre: p.nombre, SalarioBase: p.salarioBase ?? 0, Activo: p.activo ?? true }
  const r = await api.post('/Puestos', body)
  return r.data
}

export async function updatePosition(id:number, p: Partial<PositionDTO>) {
  const body = { Id: id, Nombre: p.nombre, SalarioBase: p.salarioBase ?? 0, Activo: p.activo ?? true }
  const r = await api.put(`/Puestos/${id}`, body)
  return r.status
}

export async function togglePositionActive(id:number, activo:boolean) {
  const current = await getPosition(id)
  const body = { Id: id, Nombre: current.nombre, SalarioBase: current.salarioBase, Activo: activo }
  const r = await api.put(`/Puestos/${id}`, body)
  return r.status
}
