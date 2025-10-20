import { create } from 'zustand'
import type { FrontRole } from '../../lib/roles'

interface AuthState {
  token: string | null
  role: FrontRole | null
  login: (token: string, role: FrontRole) => void
  logout: () => void
}

const initialToken = localStorage.getItem('token')
const initialRole = (localStorage.getItem('role') as FrontRole | null) ?? null

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  role: initialRole,
  login: (token, role) => {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    set({ token, role })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    set({ token: null, role: null })
  },
}))
