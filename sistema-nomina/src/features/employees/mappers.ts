// src/features/employees/mappers.ts
export type EmployeeRow = {
  id: number
  nombreCompleto: string
  nombreDepartamento?: string
  estadoLaboral?: string
  salarioMensual?: number | null
}

export function mapEmpleado(api: any): EmployeeRow {
  // Soporta PascalCase o camelCase
  const id =
    api.id ?? api.ID ?? api.Id ?? api.idEmpleado ?? api.IdEmpleado ?? null

  return {
    id: Number(id ?? 0),
    nombreCompleto: api.nombreCompleto ?? api.NombreCompleto ?? '',
    nombreDepartamento: api.nombreDepartamento ?? api.NombreDepartamento ?? '',
    estadoLaboral: api.estadoLaboral ?? api.EstadoLaboral ?? '',
    salarioMensual:
      api.salarioMensual ?? api.SalarioMensual ?? api.salario ?? api.Salario ?? null,
  }
}

/** Extrae arreglo de items desde varias formas comunes de payload */
export function extractItems(payload: any): any[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  return []
}
