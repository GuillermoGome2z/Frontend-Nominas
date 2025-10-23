import { describe, it, expect, vi } from 'vitest'
import { empleadosService } from '../services/empleadosService'
import { api } from '../lib/http'

vi.mock('../lib/http')

describe('empleadosService', () => {
  describe('getAll', () => {
    it('debería leer X-Total-Count del header', async () => {
      const mockData = [
        { id: 1, nombreCompleto: 'John Doe', estadoLaboral: 'ACTIVO' },
        { id: 2, nombreCompleto: 'Jane Doe', estadoLaboral: 'ACTIVO' },
      ]

      const mockResponse = {
        data: mockData,
        headers: {
          'x-total-count': '50',
        },
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await empleadosService.getAll({ page: 1, pageSize: 10 })

      expect(result.data).toEqual(mockData)
      expect(result.total).toBe(50)
    })

    it('debería manejar ausencia de X-Total-Count con total 0', async () => {
      const mockResponse = {
        data: [],
        headers: {},
      }

      vi.mocked(api.get).mockResolvedValue(mockResponse)

      const result = await empleadosService.getAll()

      expect(result.total).toBe(0)
    })
  })

  describe('update', () => {
    it('debería manejar 204 NoContent sin parsear body', async () => {
      vi.mocked(api.put).mockResolvedValue({ status: 204, data: undefined })

      await expect(
        empleadosService.update(1, {
          nombreCompleto: 'Updated Name',
          fechaContratacion: '2023-01-01',
          salarioMensual: 5000,
        })
      ).resolves.toBeUndefined()
    })
  })
})
