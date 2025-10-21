import { create } from 'zustand'
import type { FrontRole } from '../../lib/roles'

interface AuthState {
  token: string | null
  role: FrontRole | null
  login: (token: string, role: FrontRole) => void
  logout: () => void
}

const initialToken = localStorage.getItem('token')
const initialRole = localStorage.getItem('role') as FrontRole | null

// Si falta alguno de los dos, no inicializamos ninguno
const hasValidSession = initialToken && initialRole

export const useAuthStore = create<AuthState>((set) => ({
  token: hasValidSession ? initialToken : null,
  role: hasValidSession ? initialRole : null,
  login: (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    set({ token, role })
  },
  logout: () => {
    localStorage.clear() // Limpia todo el localStorage
    set({ token: null, role: null })
    // Forzar una recarga del estado de la aplicación
    window.dispatchEvent(new Event('storage'))
  },
}))
