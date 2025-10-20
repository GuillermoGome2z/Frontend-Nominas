import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from './useAuthStore'

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/" replace />
  return <>{children}</>
}
