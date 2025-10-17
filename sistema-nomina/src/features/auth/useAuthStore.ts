import { create } from 'zustand'

type Role = 'ADMIN' | 'RRHH' | 'EMP'

interface AuthState {
  token: string | null
  role: Role | null
  login: (token: string, role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: null,
  login: (token, role) => {
    localStorage.setItem('token', token)
    set({ token, role })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, role: null })
  },
}))
