// ==================== Puesto Types ====================

export interface PuestoDto {
  id: number
  nombre: string
  salarioBase: number
  activo: boolean
  departamentoId?: number
}

export interface PuestoCreateUpdateDto {
  nombre: string
  salarioBase: number
  departamentoId?: number
}
