import { api } from '../../lib/api'

/* ======================= Tipos (Empleados) ======================= */

export type EstadoLaboral = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO'

export interface EmployeeDTO {
  id: number
  nombreCompleto: string
  dpi: string
  nit: string
  correo: string
  direccion?: string
  telefono?: string
  fechaContratacion?: string // ISO
  fechaNacimiento?: string   // ISO
  estadoLaboral?: EstadoLaboral
  salarioMensual?: number
  departamentoId?: number
  puestoId?: number
  nombreDepartamento?: string
  nombrePuesto?: string
}

export interface EmployeeFilters {
  q?: string
  departamentoId?: number
  fechaInicio?: string // ISO
  fechaFin?: string    // ISO
  page?: number
  pageSize?: number
}

export interface EmployeesListResponse {
  data: EmployeeDTO[]
  meta: { total: number; page: number; pageSize: number }
}

/* ======================= Mapeos helper ======================= */

function mapEmpleado(x: any): EmployeeDTO {
  return {
    id: x.Id,
    nombreCompleto: x.NombreCompleto,
    dpi: x.DPI,
    nit: x.NIT,
    correo: x.Correo,
    direccion: x.Direccion,
    telefono: x.Telefono,
    fechaContratacion: x.FechaContratacion,
    fechaNacimiento: x.FechaNacimiento,
    estadoLaboral: x.EstadoLaboral,
    salarioMensual: x.SalarioMensual,
    departamentoId: x.DepartamentoId,
    puestoId: x.PuestoId,
    nombreDepartamento: x.NombreDepartamento,
    nombrePuesto: x.NombrePuesto,
  }
}

/* ======================= API: Empleados ======================= */

export async function listEmployees(filters: EmployeeFilters = {}): Promise<EmployeesListResponse> {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.departamentoId) params.set('departamentoId', String(filters.departamentoId))
  if (filters.fechaInicio) params.set('fechaInicio', filters.fechaInicio)
  if (filters.fechaFin) params.set('fechaFin', filters.fechaFin)
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 10))

  const res = await api.get(`/Empleados?${params.toString()}`)
  const rawTotal = (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count'] ?? 0) as number | string
  const total = typeof rawTotal === 'string' ? Number(rawTotal) : Number(rawTotal)

  const data = Array.isArray(res.data) ? (res.data as any[]).map(mapEmpleado) : []

  return {
    data,
    meta: { total: Number.isFinite(total) ? total : 0, page: filters.page ?? 1, pageSize: filters.pageSize ?? 10 },
  }
}

export async function getEmployee(id: number): Promise<EmployeeDTO> {
  const res = await api.get(`/Empleados/${id}`)
  return mapEmpleado(res.data)
}

export async function createEmployee(payload: Partial<EmployeeDTO>) {
  // Backend espera EmpleadoCreacionDto (nombres PascalCase)
  const body = {
    NombreCompleto: payload.nombreCompleto,
    DPI: payload.dpi,
    NIT: payload.nit,
    Correo: payload.correo,
    Telefono: payload.telefono,
    Direccion: payload.direccion,
    FechaNacimiento: payload.fechaNacimiento,
    FechaContratacion: payload.fechaContratacion,
    EstadoLaboral: payload.estadoLaboral,
    SalarioBase: payload.salarioMensual, // ← en POST tu backend usa SalarioBase
    DepartamentoId: payload.departamentoId ?? 0,
    PuestoId: payload.puestoId,
  }
  const res = await api.post('/Empleados', body) // 201
  return res.data
}

export async function updateEmployee(id: number, payload: Partial<EmployeeDTO>) {
  const body = {
    Id: id,
    NombreCompleto: payload.nombreCompleto,
    DPI: payload.dpi,
    NIT: payload.nit,
    Correo: payload.correo,
    Telefono: payload.telefono,
    Direccion: payload.direccion,
    FechaNacimiento: payload.fechaNacimiento,
    FechaContratacion: payload.fechaContratacion,
    EstadoLaboral: payload.estadoLaboral,
    SalarioMensual: payload.salarioMensual,
    DepartamentoId: payload.departamentoId ?? 0,
    PuestoId: payload.puestoId,
  }
  const res = await api.put(`/Empleados/${id}`, body) // 204
  return res.status
}

export async function deleteEmployee(id: number) {
  const res = await api.delete(`/Empleados/${id}`) // 204
  return res.status
}

/** Toggle ACTIVO/SUSPENDIDO sin tocar backend (reusa PUT completo) */
export async function setEmployeeActive(id: number, activo: boolean) {
  const current = await getEmployee(id)
  const body = {
    Id: id,
    NombreCompleto: current.nombreCompleto,
    DPI: current.dpi,
    NIT: current.nit,
    Correo: current.correo,
    Telefono: current.telefono,
    Direccion: current.direccion,
    FechaNacimiento: current.fechaNacimiento,
    FechaContratacion: current.fechaContratacion,
    EstadoLaboral: activo ? 'ACTIVO' : 'SUSPENDIDO',
    SalarioMensual: current.salarioMensual,
    DepartamentoId: current.departamentoId ?? 0,
    PuestoId: current.puestoId,
  }
  const res = await api.put(`/Empleados/${id}`, body) // 204
  return res.status
}

/* ======================= Tipos (Expediente) ======================= */

export interface EmployeeDocDTO {
  id: number
  empleadoId: number
  tipoDocumentoId: number
  nombreOriginal?: string
  rutaArchivo: string
  fechaSubida: string // ISO
  nombreTipo?: string
  nombreEmpleado?: string
}

export interface EmployeeDocsResponse {
  data: EmployeeDocDTO[]
  meta: { total: number; page: number; pageSize: number }
}

function mapDoc(x: any): EmployeeDocDTO {
  return {
    id: x.Id,
    empleadoId: x.EmpleadoId,
    tipoDocumentoId: x.TipoDocumentoId,
    nombreOriginal: x.NombreOriginal,
    rutaArchivo: x.RutaArchivo,
    fechaSubida: x.FechaSubida,
    nombreTipo: x.NombreTipo,
    nombreEmpleado: x.NombreEmpleado,
  }
}

/* ======================= API: Expediente ======================= */

export async function listEmployeeDocs(
  empleadoId: number,
  page = 1,
  pageSize = 10
): Promise<EmployeeDocsResponse> {
  const res = await api.get(`/DocumentosEmpleado`, { params: { empleadoId, page, pageSize } })
  const rawTotal = (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count'] ?? 0) as number | string
  const total = typeof rawTotal === 'string' ? Number(rawTotal) : Number(rawTotal)
  const data = Array.isArray(res.data) ? (res.data as any[]).map(mapDoc) : []
  return { data, meta: { total: Number.isFinite(total) ? total : 0, page, pageSize } }
}

export async function uploadEmployeeDoc(empleadoId: number, file: File, tipoDocumentoId: number) {
  const form = new FormData()
  form.append('Archivo', file)
  form.append('TipoDocumentoId', String(tipoDocumentoId))
  return api.post(`/DocumentosEmpleado/${empleadoId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function deleteEmployeeDoc(empleadoId: number, documentoId: number) {
  const res = await api.delete(`/DocumentosEmpleado/${empleadoId}/${documentoId}`) // 204
  return res.status
}

/** SAS URL para ver/descargar desde Azure Blob */
export async function getEmployeeDocSignedUrl(
  empleadoId: number,
  documentoId: number,
  minutes?: number,
  download?: boolean
): Promise<{ url: string; path: string; expiresAt: string }> {
  const res = await api.get(`/DocumentosEmpleado/${empleadoId}/${documentoId}/download`, {
    params: { minutes, download },
  })
  const d = res.data || {}
  return { url: d.url ?? d.Url, path: d.path ?? d.Path, expiresAt: d.expiresAt ?? d.ExpiresAt }
}
