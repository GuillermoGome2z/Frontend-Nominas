// src/features/employees/normalize.ts
import type { EmployeeDTO } from './api'

/** Extrae arreglo de items desde varias formas comunes de payload */
export function extractItems(payload: any): any[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  if (Array.isArray(payload.items)) return payload.items
  if (payload.result && Array.isArray(payload.result)) return payload.result
  return []
}

/** Adapta propiedades PascalCase / alternativas → EmployeeDTO usado en tu UI */
export function normalizeEmployee(api: any): EmployeeDTO {
  const id =
    api.id ?? api.ID ?? api.Id ?? api.idEmpleado ?? api.IdEmpleado ?? api.empleadoId ?? 0

  return {
    id: Number(id) || 0,
    nombreCompleto: api.nombreCompleto ?? api.NombreCompleto ?? api.nombre ?? api.Nombre ?? '',
    nombreDepartamento: api.nombreDepartamento ?? api.NombreDepartamento ?? api.departamento ?? api.Departamento ?? null,
    estadoLaboral: api.estadoLaboral ?? api.EstadoLaboral ?? api.estado ?? api.Estado ?? null,
    salarioMensual: api.salarioMensual ?? api.SalarioMensual ?? api.salario ?? api.Salario ?? null,

    // Campos detallados (para detalle/editar):
    dpi: api.dpi ?? api.DPI ?? null,
    nit: api.nit ?? api.NIT ?? null,
    correo: api.correo ?? api.Email ?? api.email ?? null,
    telefono: api.telefono ?? api.Telefono ?? null,
    direccion: api.direccion ?? api.Direccion ?? null,
    fechaNacimiento: api.fechaNacimiento ?? api.FechaNacimiento ?? null,
    fechaContratacion: api.fechaContratacion ?? api.FechaContratacion ?? null,
    departamentoId: api.departamentoId ?? api.DepartamentoId ?? api.idDepartamento ?? api.IdDepartamento ?? null,
    puestoId: api.puestoId ?? api.PuestoId ?? api.idPuesto ?? api.IdPuesto ?? null,
  } as EmployeeDTO
}
