import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'   // 👈 cambio clave
import { useAuthStore } from './useAuthStore'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />
  return <>{children}</>
}
