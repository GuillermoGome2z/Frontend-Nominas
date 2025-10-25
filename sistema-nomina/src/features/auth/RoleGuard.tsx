import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from './useAuthStore'

type Props = { 
  roles: Array<'ADMIN' | 'RRHH' | 'USUARIO' | 'EMP'>
  children: ReactNode 
}

export default function RoleGuard({ roles, children }: Props) {
  const role = useAuthStore((s) => s.role)
  
  if (!role) {
    return <Navigate to="/403" replace />
  }

  // Normalizar roles para comparación (convertir a minúsculas)
  const normalizedUserRole = role.toLowerCase()
  const normalizedAllowedRoles = roles.map(r => r.toLowerCase())
  
  // Si es admin, permitir acceso a todo
  if (normalizedUserRole === 'admin') {
    return <>{children}</>
  }
  
  // Para otros roles, verificar si está en la lista permitida
  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/403" replace />
  }
  
  return <>{children}</>
}
