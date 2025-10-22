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

/* ======================= Helpers ======================= */

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

/** Convierte cualquier fecha razonable a ISO (lo que ASP.NET parsea sin problemas). */
function toIso(d?: string | Date | null): string | undefined {
  if (!d) return undefined
  if (d instanceof Date) return d.toISOString()

  const s = String(d).trim()
  // ya viene ISO-ish
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const t = Date.parse(s)
    return Number.isNaN(t) ? undefined : new Date(t).toISOString()
  }
  // dd/MM/yyyy
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (m) {
    const [, dd, mm, yyyy] = m
    const dt = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return dt.toISOString()
  }
  // cualquier cosa parseable
  const t = Date.parse(s)
  return Number.isNaN(t) ? undefined : new Date(t).toISOString()
}

/** Devuelve string amigable si el backend respondió ValidationProblemDetails (422). */
export function parseValidationError(e: any): string | null {
  const vpd = e?.response?.data
  if (vpd?.errors && typeof vpd.errors === 'object') {
    const lines = Object.entries(vpd.errors).map(([k, v]: any) =>
      `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`
    )
    return lines.join('\n')
  }
  if (typeof vpd?.title === 'string') return vpd.title
  return null
}

/* ======================= API: Empleados ======================= */

export async function listEmployees(filters: EmployeeFilters = {}): Promise<EmployeesListResponse> {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.departamentoId) params.set('departamentoId', String(filters.departamentoId))
  if (filters.fechaInicio) params.set('fechaInicio', toIso(filters.fechaInicio) ?? '')
  if (filters.fechaFin) params.set('fechaFin', toIso(filters.fechaFin) ?? '')
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
  // --- Coerciones seguras ---
  const salario = Number(payload.salarioMensual)
  const depId = payload.departamentoId != null ? Number(payload.departamentoId) : undefined
  const pstId = payload.puestoId != null ? Number(payload.puestoId) : undefined

  // --- Validaciones mínimas en FE ---
  if (!payload.nombreCompleto?.trim()) throw new Error('El nombre es obligatorio.')
  if (!payload.correo?.trim()) throw new Error('El correo es obligatorio.')
  if (!payload.dpi?.trim()) throw new Error('El DPI es obligatorio.')
  if (!payload.nit?.trim()) throw new Error('El NIT es obligatorio.')
  if (!payload.telefono?.trim()) throw new Error('El teléfono es obligatorio.')
  if (!payload.direccion?.trim()) throw new Error('La dirección es obligatoria.')

  const fnIso = toIso(payload.fechaNacimiento)
  const fcIso = toIso(payload.fechaContratacion)
  if (!fnIso) throw new Error('La fecha de nacimiento es obligatoria y debe ser válida.')
  if (!fcIso) throw new Error('La fecha de contratación es obligatoria y debe ser válida.')

  if (!payload.estadoLaboral) throw new Error('El estado laboral es obligatorio.')
  if (!Number.isFinite(salario) || salario <= 0)
    throw new Error('El salario mensual es obligatorio y debe ser mayor a 0.')
  if (!Number.isFinite(depId!)) throw new Error('Debes seleccionar un departamento válido.')
  if (!Number.isFinite(pstId!)) throw new Error('Debes seleccionar un puesto válido.')

  // --- Cuerpo en PascalCase como espera EmpleadoCreacionDto ---
  const body = {
    NombreCompleto: payload.nombreCompleto.trim(),
    DPI: payload.dpi.trim(),
    NIT: payload.nit.trim(),
    Correo: payload.correo.trim(),
    Telefono: payload.telefono.trim(),
    Direccion: payload.direccion.trim(),
    FechaNacimiento: fnIso,                // ISO siempre
    FechaContratacion: fcIso,              // ISO siempre
    EstadoLaboral: payload.estadoLaboral,  // "ACTIVO" | "SUSPENDIDO" | "RETIRADO"
    SalarioBase: Number(salario.toFixed(2)),
    DepartamentoId: depId,
    PuestoId: pstId,
  }

  const res = await api.post('/Empleados', body)
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
    FechaNacimiento: toIso(payload.fechaNacimiento),
    FechaContratacion: toIso(payload.fechaContratacion),
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

/** Toggle ACTIVO/SUSPENDIDO (reusa PUT completo) */
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
    FechaNacimiento: toIso(current.fechaNacimiento),
    FechaContratacion: toIso(current.fechaContratacion),
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
