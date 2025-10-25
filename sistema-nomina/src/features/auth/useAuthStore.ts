import { create } from 'zustand'
import type { FrontRole } from '../../types/auth'

interface AuthState {
  token: string | null
  refreshToken: string | null
  role: FrontRole | null
  login: (token: string, refreshToken: string, role: FrontRole) => void
  updateTokens: (token: string, refreshToken: string) => void
  logout: () => void
}

const initialToken = localStorage.getItem('token')
const initialRefreshToken = localStorage.getItem('refreshToken')
const initialRole = localStorage.getItem('role') as FrontRole | null

// Si falta alguno de los tres, no inicializamos ninguno
const hasValidSession = initialToken && initialRefreshToken && initialRole

export const useAuthStore = create<AuthState>((set) => ({
  token: hasValidSession ? initialToken : null,
  refreshToken: hasValidSession ? initialRefreshToken : null,
  role: hasValidSession ? initialRole : null,
  login: (token, refreshToken, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('role', role)
    set({ token, refreshToken, role })
  },
  updateTokens: (token, refreshToken) => {
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', refreshToken)
    set({ token, refreshToken })
  },
  logout: () => {
    localStorage.clear() // Limpia todo el localStorage
    set({ token: null, refreshToken: null, role: null })
    // Forzar una recarga del estado de la aplicación
    window.dispatchEvent(new Event('storage'))
  },
}))
