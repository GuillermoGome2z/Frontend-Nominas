import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../services/authService'
import axios from 'axios'

vi.mock('axios')

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('debería leer el refresh token del header X-Refresh-Token', async () => {
      const mockResponse = {
        data: {
          token: 'mock-access-token',
          nombreUsuario: 'Test User',
          rol: 'Admin',
        },
        headers: {
          'x-refresh-token': 'mock-refresh-token',
        },
      }

      vi.mocked(axios.create).mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
      } as any)

      const result = await authService.login('test@test.com', 'password')

      expect(result.loginData.token).toBe('mock-access-token')
      expect(result.refreshToken).toBe('mock-refresh-token')
    })

    it('debería lanzar error si no hay refresh token en header', async () => {
      const mockResponse = {
        data: {
          token: 'mock-access-token',
          nombreUsuario: 'Test User',
          rol: 'Admin',
        },
        headers: {},
      }

      vi.mocked(axios.create).mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
      } as any)

      await expect(
        authService.login('test@test.com', 'password')
      ).rejects.toThrow('Backend no devolvió refresh token')
    })
  })

  describe('refresh', () => {
    it('debería enviar refresh token en el body', async () => {
      const mockPost = vi.fn().mockResolvedValue({
        data: {
          token: 'new-access-token',
          refreshToken: 'new-refresh-token',
        },
      })

      vi.mocked(axios.create).mockReturnValue({
        post: mockPost,
      } as any)

      const result = await authService.refresh('old-refresh-token')

      expect(mockPost).toHaveBeenCalledWith('/Auth/refresh', {
        refreshToken: 'old-refresh-token',
      })
      expect(result.token).toBe('new-access-token')
      expect(result.refreshToken).toBe('new-refresh-token')
    })
  })

  describe('logout', () => {
    it('debería enviar refresh token en el body y devolver void', async () => {
      const mockPost = vi.fn().mockResolvedValue({ status: 204 })

      vi.mocked(axios.create).mockReturnValue({
        post: mockPost,
      } as any)

      await authService.logout('refresh-token')

      expect(mockPost).toHaveBeenCalledWith('/Auth/logout', {
        refreshToken: 'refresh-token',
      })
    })
  })
})
