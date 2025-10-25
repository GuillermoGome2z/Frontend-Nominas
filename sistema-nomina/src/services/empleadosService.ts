import { api } from '../lib/http'
import type {
  EmpleadoDto,
  EmpleadoCreateUpdateDto,
  CambiarEstadoEmpleadoDto,
  EmpleadoFilters,
  EmpleadosListResponse,
} from '../types/empleado'

export const empleadosService = {
  /**
   * GET /api/Empleados?page=&pageSize=&q=&departamentoId=&puestoId=&estadoLaboral=&fechaInicio=&fechaFin=
   * Lee header X-Total-Count para paginación
   */
  async getAll(filters?: EmpleadoFilters): Promise<EmpleadosListResponse> {
    const params = new URLSearchParams()
    
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize))
    if (filters?.q) params.append('q', filters.q)
    if (filters?.departamentoId) params.append('departamentoId', String(filters.departamentoId))
    if (filters?.puestoId) params.append('puestoId', String(filters.puestoId))
    if (filters?.estadoLaboral) params.append('estadoLaboral', filters.estadoLaboral)
    if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio)
    if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin)

    const response = await api.get<EmpleadoDto[]>(`/Empleados?${params.toString()}`)
    
    // Leer header X-Total-Count
    const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'] || '0'
    const total = parseInt(totalHeader, 10) || 0

    return {
      data: response.data,
      total,
    }
  },

  /**
   * GET /api/Empleados/{id}
   * 200 | 404
   */
  async getById(id: number): Promise<EmpleadoDto> {
    const response = await api.get<EmpleadoDto>(`/Empleados/${id}`)
    return response.data
  },

  /**
   * POST /api/Empleados
   * 201 Created | 400 | 422
   * Lee header Location
   */
  async create(data: EmpleadoCreateUpdateDto): Promise<EmpleadoDto> {
    const response = await api.post<EmpleadoDto>('/Empleados', data)
    return response.data
  },

  /**
   * PUT /api/Empleados/{id}
   * 204 NoContent | 400 | 404 | 422
   */
  async update(id: number, data: EmpleadoCreateUpdateDto): Promise<void> {
    await api.put(`/Empleados/${id}`, data)
  },

  /**
   * PUT /api/Empleados/{id}/estado
   * 204 NoContent | 400 | 404
   */
  async cambiarEstado(id: number, data: CambiarEstadoEmpleadoDto): Promise<void> {
    await api.put(`/Empleados/${id}/estado`, data)
  },
}
