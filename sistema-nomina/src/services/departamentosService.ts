import { api } from '../lib/http'
import type { DepartamentoDto, DepartamentoCreateUpdateDto } from '../types/departamento'
import type { PuestoDto } from '../types/puesto'

export const departamentosService = {
  /**
   * GET /api/Departamentos
   * 200
   */
  async getAll(): Promise<DepartamentoDto[]> {
    const response = await api.get<DepartamentoDto[]>('/Departamentos')
    return response.data
  },

  /**
   * GET /api/Departamentos/{id}
   * 200 | 404
   */
  async getById(id: number): Promise<DepartamentoDto> {
    const response = await api.get<DepartamentoDto>(`/Departamentos/${id}`)
    return response.data
  },

  /**
   * POST /api/Departamentos
   * 201 | 400 | 422
   */
  async create(data: DepartamentoCreateUpdateDto): Promise<DepartamentoDto> {
    const response = await api.post<DepartamentoDto>('/Departamentos', data)
    return response.data
  },

  /**
   * PUT /api/Departamentos/{id}
   * 204 NoContent | 400 | 404 | 422
   */
  async update(id: number, data: DepartamentoCreateUpdateDto): Promise<void> {
    await api.put(`/Departamentos/${id}`, data)
  },

  /**
   * PUT /api/Departamentos/{id}/activar
   * 204 NoContent
   */
  async activar(id: number): Promise<void> {
    await api.put(`/Departamentos/${id}/activar`)
  },

  /**
   * PUT /api/Departamentos/{id}/desactivar
   * 204 NoContent
   */
  async desactivar(id: number): Promise<void> {
    await api.put(`/Departamentos/${id}/desactivar`)
  },

  /**
   * GET /api/Departamentos/{id}/Puestos
   * Devuelve solo puestos activos del departamento, ordenados por nombre
   * 200
   */
  async getPuestos(id: number): Promise<PuestoDto[]> {
    const response = await api.get<PuestoDto[]>(`/Departamentos/${id}/Puestos`)
    return response.data
  },
}
