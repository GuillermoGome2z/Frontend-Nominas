import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../features/auth/useAuthStore'
import { authService } from '../services/authService'

// baseURL: VITE_API_URL (sin "/" final) o '/api' (proxy dev)
function computeBaseURL() {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '')
  }
  return '/api'
}

// Cliente Axios
export const api = axios.create({
  baseURL: computeBaseURL(),
  // timeout: 15000,
})

// ===================== REFRESH TOKEN LOGIC =====================
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// ===================== REQUEST INTERCEPTOR =====================
// - No añade Authorization en /auth/login o /auth/refresh
// - Evita "Bearer undefined" o "Bearer null"
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const path = (config.url || '').toLowerCase()

  // Si es login/refresh, no tocar headers
  if (path.includes('/auth/login') || path.includes('/auth/refresh')) {
    return config
  }

  const { token } = useAuthStore.getState()
  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`)
    if (!config.headers.get || !config.headers.set) {
      ;(config.headers as any)['Authorization'] = `Bearer ${token}`
    }
  }

  return config
})

// ===================== RESPONSE INTERCEPTOR =====================
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    const originalRequest = err.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    const status = err.response?.status
    const data = err.response?.data

    const message =
      (typeof data === 'string' && data) ||
      (typeof data?.title === 'string' && data.title) ||
      (typeof data?.detail === 'string' && data.detail) ||
      (typeof (data as any)?.Message === 'string' && (data as any).Message) ||
      'Ocurrió un error inesperado. Intente nuevamente.'

    // ==================== HANDLE 401 (Unauthorized) ====================
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos refrescando, encolar este request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            // Reintentar con nuevo token
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const { refreshToken, updateTokens, logout } = useAuthStore.getState()

      if (!refreshToken) {
        // No hay refresh token, logout
        logout()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
        processQueue(new Error('No refresh token available'))
        isRefreshing = false
        return Promise.reject({ status, message: 'Sesión expirada' })
      }

      try {
        // Intentar refresh
        const refreshData = await authService.refresh(refreshToken)
        
        // Actualizar tokens
        updateTokens(refreshData.token, refreshData.refreshToken)

        // Procesar cola de requests
        processQueue()

        // Reintentar request original
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh falló, hacer logout
        processQueue(refreshError)
        logout()
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
        return Promise.reject({ status: 401, message: 'Sesión expirada' })
      } finally {
        isRefreshing = false
      }
    }

    // ==================== HANDLE OTHER ERRORS ====================
    if (status === 403) {
      return Promise.reject({ status, message: 'No tienes permisos para esta acción' })
    }

    if (status === 422) {
      return Promise.reject({ status, message, errors: (data as any)?.errors })
    }

    if (status === 413) {
      return Promise.reject({ status, message: 'El archivo es demasiado grande' })
    }

    if (status) {
      return Promise.reject({ status, message })
    }

    // Network error / CORS / servidor caído
    return Promise.reject({
      status: 0,
      message:
        'No fue posible conectar con el servidor. Verifica que el backend esté arriba y que VITE_API_URL apunte correctamente.',
    })
  }
)
