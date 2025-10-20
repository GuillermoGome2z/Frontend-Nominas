import { api } from '../../lib/http'

export interface EmployeeDTO {
  id: number
  nombreCompleto: string
  dpi: string
  nit: string
  correo: string
  direccion?: string
  telefono?: string
  fechaContratacion?: string
  fechaNacimiento?: string
  estadoLaboral?: string
  salarioMensual?: number
  departamentoId?: number
  puestoId?: number
  nombreDepartamento?: string
  nombrePuesto?: string
}

export interface CreateEmployeeDTO {
  nombreCompleto: string
  dpi: string
  nit: string
  correo: string
  // … añade los campos requeridos por tu backend
}

export interface UpdateEmployeeDTO extends Partial<CreateEmployeeDTO> {}

// GET /api/Empleados
export async function fetchEmployees(params?: {
  page?: number
  pageSize?: number
  q?: string
  departamentoId?: number
  fechaInicio?: string
  fechaFin?: string
}) {
  try {
    const res = await api.get<EmployeeDTO[]>('/Empleados', { params })
    return res.data
  } catch (e: any) {
    throw e // status/message viene del interceptor
  }
}

// GET /api/Empleados/{id}
export async function fetchEmployeeById(id: number) {
  try {
    const res = await api.get<EmployeeDTO>(`/Empleados/${id}`)
    return res.data
  } catch (e: any) {
    throw e
  }
}

// POST /api/Empleados
export async function createEmployee(payload: CreateEmployeeDTO) {
  try {
    const res = await api.post('/Empleados', payload)
    // backend debería responder 201 + Location o el recurso creado
    return res.data
  } catch (e: any) {
    throw e
  }
}

// PUT /api/Empleados/{id}
export async function updateEmployee(id: number, payload: UpdateEmployeeDTO) {
  try {
    const res = await api.put(`/Empleados/${id}`, payload)
    return res.data
  } catch (e: any) {
    throw e
  }
}

// DELETE /api/Empleados/{id}
export async function deleteEmployee(id: number) {
  try {
    const res = await api.delete(`/Empleados/${id}`)
    // 204 sin contenido
    return res.status
  } catch (e: any) {
    throw e
  }
}
