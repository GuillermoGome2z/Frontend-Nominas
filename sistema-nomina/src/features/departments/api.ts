import { api } from '../../lib/api'

export interface DepartmentDTO {
  id: number
  nombre: string
  activo: boolean
}

export interface DeptFilters { page?: number; pageSize?: number; activo?: boolean }
export interface DeptListResponse { data: DepartmentDTO[]; meta:{ total:number; page:number; pageSize:number } }

function mapDept(x: any): DepartmentDTO {
  return { id: x.id ?? x.Id, nombre: x.nombre ?? x.Nombre, activo: x.activo ?? x.Activo ?? true }
}

export async function listDepartments(f: DeptFilters = {}): Promise<DeptListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(f.page ?? 1))
  params.set('pageSize', String(f.pageSize ?? 10))
  if (typeof f.activo === 'boolean') params.set('activo', String(f.activo))

  const r = await api.get(`/Departamentos?${params.toString()}`)
  const rawTotal = (r.headers?.['x-total-count'] ?? r.headers?.['X-Total-Count'] ?? 0) as any
  const total = Number(rawTotal) || 0
  const data = Array.isArray(r.data) ? r.data.map(mapDept) : []
  return { data, meta:{ total, page: f.page ?? 1, pageSize: f.pageSize ?? 10 } }
}

export async function getDepartment(id: number): Promise<DepartmentDTO> {
  const r = await api.get(`/Departamentos/${id}`)
  return mapDept(r.data)
}

export async function createDepartment(p: Partial<DepartmentDTO>) {
  const body = { Nombre: p.nombre, Activo: p.activo ?? true }
  const r = await api.post('/Departamentos', body)
  return r.data
}

export async function updateDepartment(id: number, p: Partial<DepartmentDTO>) {
  const body = { Id: id, Nombre: p.nombre, Activo: p.activo ?? true }
  const r = await api.put(`/Departamentos/${id}`, body)
  return r.status
}

export async function toggleDepartmentActive(id: number, activo: boolean) {
  const current = await getDepartment(id)
  const body = { Id: id, Nombre: current.nombre, Activo: activo }
  const r = await api.put(`/Departamentos/${id}`, body)
  return r.status
}
