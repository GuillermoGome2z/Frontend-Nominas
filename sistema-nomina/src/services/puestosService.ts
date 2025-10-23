import { api } from '../lib/http'
import type { PuestoDto, PuestoCreateUpdateDto } from '../types/puesto'

export const puestosService = {
  /**
   * GET /api/Puestos?departamentoId=&soloActivos=true|false
   * 200
   */
  async getAll(filters?: { departamentoId?: number; soloActivos?: boolean }): Promise<PuestoDto[]> {
    const params = new URLSearchParams()
    
    if (filters?.departamentoId) params.append('departamentoId', String(filters.departamentoId))
    if (filters?.soloActivos !== undefined) params.append('soloActivos', String(filters.soloActivos))

    const response = await api.get<PuestoDto[]>(`/Puestos?${params.toString()}`)
    return response.data
  },

  /**
   * GET /api/Puestos/{id}
   * 200 | 404
   */
  async getById(id: number): Promise<PuestoDto> {
    const response = await api.get<PuestoDto>(`/Puestos/${id}`)
    return response.data
  },

  /**
   * POST /api/Puestos
   * 201 | 400 | 422
   */
  async create(data: PuestoCreateUpdateDto): Promise<PuestoDto> {
    const response = await api.post<PuestoDto>('/Puestos', data)
    return response.data
  },

  /**
   * PUT /api/Puestos/{id}
   * 204 NoContent | 400 | 404 | 422
   */
  async update(id: number, data: PuestoCreateUpdateDto): Promise<void> {
    await api.put(`/Puestos/${id}`, data)
  },

  /**
   * PUT /api/Puestos/{id}/activar
   * 204 NoContent
   */
  async activar(id: number): Promise<void> {
    await api.put(`/Puestos/${id}/activar`)
  },

  /**
   * PUT /api/Puestos/{id}/desactivar
   * 204 NoContent
   */
  async desactivar(id: number): Promise<void> {
    await api.put(`/Puestos/${id}/desactivar`)
  },
}
