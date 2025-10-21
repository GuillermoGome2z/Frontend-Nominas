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

// Cliente Axios
export const api = axios.create({
  baseURL: computeBaseURL(),
  // timeout: 15000,
})

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

  // ✅ devolver siempre config
  return config
})

// ===================== RESPONSE INTERCEPTOR =====================
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

    // Evitar posible bucle si ya estás en /login
    if (status === 401) {
      const { logout } = useAuthStore.getState()
      logout()

      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
      // No redirigimos aquí, dejamos que los componentes manejen la redirección

      return Promise.reject({ status, message })
    }

    if (status === 403 || status === 422) {
      return Promise.reject({ status, message, errors: (data as any)?.errors })
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
