import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './useAuthStore'

type Role = 'ADMIN' | 'RRHH' | 'EMP'

export default function RoleGuard({
  roles,
  children,
}: {
  roles: Role[]
  children: ReactNode
}) {
  const { token, role } = useAuthStore()
  const location = useLocation()

  // Si no hay sesión, manda al login
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />

  // Si hay sesión pero no rol permitido → 403
  if (role && !roles.includes(role)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
