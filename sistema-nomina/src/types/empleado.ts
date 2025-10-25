// ==================== Empleado Types ====================

export type EstadoLaboral = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO'

export interface EmpleadoDto {
  id: number
  nombreCompleto: string
  dpi?: string
  nit?: string
  correo?: string
  telefono?: string
  direccion?: string
  fechaNacimiento?: string // ISO date string
  fechaContratacion: string // ISO date string
  estadoLaboral: EstadoLaboral
  salarioMensual: number
  departamentoId?: number
  nombreDepartamento?: string
  puestoId?: number
  nombrePuesto?: string
}

export interface EmpleadoCreateUpdateDto {
  nombreCompleto: string
  dpi?: string
  nit?: string
  correo?: string
  telefono?: string
  direccion?: string
  fechaNacimiento?: string // ISO date string
  fechaContratacion: string // ISO date string (required)
  salarioMensual: number // required, >= 0
  departamentoId?: number
  puestoId?: number
}

export interface CambiarEstadoEmpleadoDto {
  estadoLaboral: EstadoLaboral
}

export interface EmpleadoFilters {
  page?: number
  pageSize?: number
  q?: string
  departamentoId?: number
  puestoId?: number
  estadoLaboral?: EstadoLaboral
  fechaInicio?: string // ISO date string
  fechaFin?: string // ISO date string
}

export interface EmpleadosListResponse {
  data: EmpleadoDto[]
  total: number
}
