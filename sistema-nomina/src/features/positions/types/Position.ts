export type Jornada = 'COMPLETA' | 'PARCIAL' | 'MIXTA'

export const SALARIO_MIN = 3000
export const SALARIO_MAX = 100000

export interface Position {
  id: number
  codigo?: string
  nombre: string
  descripcion?: string
  salarioBase: number
  departamentoId: number
  departamentoNombre?: string
  jornada: Jornada
  cantidadEmpleados?: number
  estado: 'ACTIVO' | 'INACTIVO'
}

export interface PositionFilters {
  q?: string
  departamentoId?: number
  jornada?: Jornada
  activo?: boolean
  salarioMin?: number
  salarioMax?: number
  page?: number
  pageSize?: number
}

export interface PositionsListResponse {
  data: Position[]
  meta: { total: number; page: number; pageSize: number }
}
