import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from './useAuthStore'

type Props = { roles: Array<'ADMIN' | 'RRHH' | 'EMP'>; children: ReactNode }

export default function RoleGuard({ roles, children }: Props) {
  const role = useAuthStore((s) => s.role)
  if (!role || !roles.includes(role)) return <Navigate to="/403" replace />
  return <>{children}</>
}
