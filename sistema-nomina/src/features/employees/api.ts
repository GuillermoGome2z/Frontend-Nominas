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

/** Upper seguro para strings que pueden venir en minúsculas o capitalizadas */
function up(s?: string | null): string | undefined {
  return typeof s === 'string' ? s.toUpperCase() : undefined
}

/** Convierte cualquier “shape” del backend a nuestro DTO camelCase */
function mapEmpleado(x: any): EmployeeDTO {
  // salario puede venir como SalarioMensual ó SalarioBase (algunas proyecciones)
  const salario =
    x.salarioMensual ?? x.SalarioMensual ?? x.salarioBase ?? x.SalarioBase

  // estado puede venir "Activo" | "SUSPENDIDO" | etc.
  const estadoRaw = x.estadoLaboral ?? x.EstadoLaboral
  const estado: EstadoLaboral | undefined =
    up(estadoRaw) === 'ACTIVO' || up(estadoRaw) === 'SUSPENDIDO' || up(estadoRaw) === 'RETIRADO'
      ? (up(estadoRaw) as EstadoLaboral)
      : undefined

  return {
    id:
      x.id ?? x.Id ?? x.idEmpleado ?? x.IdEmpleado ?? 0,
    nombreCompleto:
      x.nombreCompleto ?? x.NombreCompleto ?? x.nombre ?? x.Nombre ?? '',
    dpi: x.dpi ?? x.DPI ?? '',
    nit: x.nit ?? x.NIT ?? '',
    correo: x.correo ?? x.Correo ?? '',
    direccion: x.direccion ?? x.Direccion ?? '',
    telefono: x.telefono ?? x.Telefono ?? '',
    fechaContratacion:
      x.fechaContratacion ?? x.FechaContratacion ?? undefined,
    fechaNacimiento:
      x.fechaNacimiento ?? x.FechaNacimiento ?? undefined,
    estadoLaboral: estado,
    salarioMensual: Number.isFinite(Number(salario))
      ? Number(salario)
      : undefined,
    departamentoId:
      x.departamentoId ?? x.DepartamentoId ?? undefined,
    puestoId: x.puestoId ?? x.PuestoId ?? undefined,
    nombreDepartamento:
      x.nombreDepartamento ?? x.NombreDepartamento ?? undefined,
    nombrePuesto:
      x.nombrePuesto ?? x.NombrePuesto ?? undefined,
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

/**
 * Acepta tanto:
 *  - Respuesta como ARRAY (y total en header X-Total-Count)
 *  - Respuesta como OBJETO { items/data/lista/Lista: [...], total/Total: n }
 */
export async function listEmployees(filters: EmployeeFilters = {}): Promise<EmployeesListResponse> {
  try {
    const params = new URLSearchParams()
    if (filters.q) params.set('q', filters.q)
    if (filters.departamentoId) params.set('departamentoId', String(filters.departamentoId))
    if (filters.fechaInicio) params.set('fechaInicio', toIso(filters.fechaInicio) ?? '')
    if (filters.fechaFin) params.set('fechaFin', toIso(filters.fechaFin) ?? '')
    params.set('page', String(filters.page ?? 1))
    params.set('pageSize', String(filters.pageSize ?? 10))

    const res = await api.get(`/Empleados?${params.toString()}`)

    // 1) Intento 1: header
    const rawHeaderTotal = (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count']) as number | string | undefined
    let totalFromHeader = 0
    if (typeof rawHeaderTotal === 'string') totalFromHeader = Number(rawHeaderTotal)
    else if (typeof rawHeaderTotal === 'number') totalFromHeader = rawHeaderTotal

    // 2) Cuerpo puede ser array o envoltura
    const body = res.data
    const itemsRaw: any[] =
      Array.isArray(body)
        ? body
        : (body?.items ?? body?.Items ?? body?.data ?? body?.Data ?? body?.lista ?? body?.Lista ?? [])

    const totalFromBody =
      (body?.total ?? body?.Total ?? body?.count ?? body?.Count ?? itemsRaw.length) as number

    const total = Number.isFinite(totalFromHeader) && totalFromHeader > 0
      ? totalFromHeader
      : (Number.isFinite(totalFromBody) ? totalFromBody : itemsRaw.length)

    const data = Array.isArray(itemsRaw) ? itemsRaw.map(mapEmpleado) : []

    return {
      data,
      meta: {
        total,
        page: filters.page ?? (body?.page ?? body?.Page ?? 1),
        pageSize: filters.pageSize ?? (body?.pageSize ?? body?.PageSize ?? data.length),
      },
    }
  } catch (error: any) {
    console.error('Error en listEmployees:', error)
    // Si el backend falla (500), devolver lista vacía en lugar de fallar
    if (error?.response?.status === 500) {
      console.warn('Backend devolvió 500, retornando lista vacía')
      return {
        data: [],
        meta: { total: 0, page: filters.page ?? 1, pageSize: filters.pageSize ?? 10 }
      }
    }
    throw error
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
    NombreCompleto: payload.nombreCompleto!.trim(),
    DPI: payload.dpi!.trim(),
    NIT: payload.nit!.trim(),
    Correo: payload.correo!.trim(),
    Telefono: payload.telefono!.trim(),
    Direccion: payload.direccion!.trim(),
    FechaNacimiento: toIso(payload.fechaNacimiento)!,
    FechaContratacion: toIso(payload.fechaContratacion)!,
    EstadoLaboral: payload.estadoLaboral,
    SalarioMensual: Number(salario.toFixed(2)),   // ⟵ unificado
    DepartamentoId: depId,
    PuestoId: pstId,
  }

  const res = await api.post('/Empleados', body)
  // Algunas APIs devuelven { mensaje, empleadoId }, otras devuelven el objeto
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
    id: x.id ?? x.Id,
    empleadoId: x.empleadoId ?? x.EmpleadoId,
    tipoDocumentoId: x.tipoDocumentoId ?? x.TipoDocumentoId,
    nombreOriginal: x.nombreOriginal ?? x.NombreOriginal,
    rutaArchivo: x.rutaArchivo ?? x.RutaArchivo,
    fechaSubida: x.fechaSubida ?? x.FechaSubida,
    nombreTipo: x.nombreTipo ?? x.NombreTipo,
    nombreEmpleado: x.nombreEmpleado ?? x.NombreEmpleado,
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
  const body = res.data
  const arr = Array.isArray(body) ? body : (body?.items ?? body?.Items ?? body?.data ?? body?.Data ?? [])
  const data = Array.isArray(arr) ? arr.map(mapDoc) : []
  return { data, meta: { total: Number.isFinite(total) ? total : data.length, page, pageSize } }
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
