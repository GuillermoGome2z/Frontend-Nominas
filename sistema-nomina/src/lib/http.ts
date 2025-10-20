import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../features/auth/useAuthStore'

// baseURL: VITE_API_URL (sin "/" final) o '/api' (proxy dev)
function computeBaseURL() {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '')
  }
  return '/api'
}

// Exporta el cliente que usa el resto del proyecto
export const api = axios.create({
  baseURL: computeBaseURL(),
  // timeout: 15000,
})

// ===================== REQUEST INTERCEPTOR =====================
// - No añade Authorization en /auth/login o /auth/refresh
// - Evita "Bearer undefined" o "Bearer null"
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const path = (config.url || '').toLowerCase()

  if (path.includes('/auth/login') || path.includes('/auth/refresh')) {
    return config
  }

  const token = localStorage.getItem('token')
  if (token && token !== 'undefined' && token !== 'null') {
    // En Axios v1 los headers ya son un objeto de tipo AxiosHeaders,
    // podemos asignar directamente:
    config.headers.set?.('Authorization', `Bearer ${token}`)
    // fallback si set no existe (algunos bundlers viejos):
    if (!config.headers.get || !config.headers.set) {
      ;(config.headers as any)['Authorization'] = `Bearer ${token}`
    }
  }

  return config
})

// ===================== RESPONSE INTERCEPTOR =====================
// - 401: logout y redirect a /login (no reintentar)
// - 403/422: propaga con mensaje y (si hay) errors de validación
// - Otros: propaga status + message amigable
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    const status = err.response?.status
    const data = err.response?.data

    const message =
      (typeof data === 'string' && data) ||
      (typeof data?.title === 'string' && data.title) ||
      (typeof data?.detail === 'string' && data.detail) ||
      (typeof (data as any)?.Message === 'string' && (data as any).Message) ||
      'Ocurrió un error inesperado. Intente nuevamente.'

    if (status === 401) {
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
      return Promise.reject({ status, message })
    }

    if (status === 403 || status === 422) {
      return Promise.reject({ status, message, errors: (data as any)?.errors })
    }

    if (status) {
      return Promise.reject({ status, message })
    }

    return Promise.reject({
      status: 0,
      message: 'No fue posible conectar con el servidor.',
    })
  }
)
