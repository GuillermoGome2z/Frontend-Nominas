import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type {
  LoginRequestDto,
  LoginResponseDto,
  RefreshRequestDto,
  RefreshResponseDto,
  LogoutRequestDto,
} from '../types/auth'

// Cliente Axios sin interceptores para auth (evitar bucles)
function createAuthClient(): AxiosInstance {
  const baseURL = import.meta.env.VITE_API_URL || '/api'
  return axios.create({
    baseURL: baseURL.replace(/\/+$/, ''),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const authClient = createAuthClient()

// ==================== Auth Service ====================

export const authService = {
  /**
   * POST /api/Auth/login
   * Devuelve token en body y refresh token en header X-Refresh-Token
   */
  async login(
    correo: string,
    contraseña: string
  ): Promise<{ loginData: LoginResponseDto; refreshToken: string }> {
    const payload: LoginRequestDto = { correo, contraseña }
    const response = await authClient.post<LoginResponseDto>('/Auth/login', payload)

    // Leer header X-Refresh-Token (case-insensitive)
    const refreshToken =
      response.headers['x-refresh-token'] ||
      response.headers['X-Refresh-Token'] ||
      ''

    if (!refreshToken) {
      throw new Error('Backend no devolvió refresh token en header X-Refresh-Token')
    }

    return {
      loginData: response.data,
      refreshToken,
    }
  },

  /**
   * POST /api/Auth/refresh
   * Body: { refreshToken }
   * Devuelve nuevos tokens en body
   */
  async refresh(refreshToken: string): Promise<RefreshResponseDto> {
    const payload: RefreshRequestDto = { refreshToken }
    const response = await authClient.post<RefreshResponseDto>('/Auth/refresh', payload)
    return response.data
  },

  /**
   * POST /api/Auth/logout
   * Body: { refreshToken }
   * Devuelve 204 NoContent
   */
  async logout(refreshToken: string): Promise<void> {
    const payload: LogoutRequestDto = { refreshToken }
    await authClient.post('/Auth/logout', payload)
  },
}
