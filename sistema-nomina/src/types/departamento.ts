// ==================== Departamento Types ====================

export interface DepartamentoDto {
  id: number
  nombre: string
  activo: boolean
}

export interface DepartamentoCreateUpdateDto {
  nombre: string
}
