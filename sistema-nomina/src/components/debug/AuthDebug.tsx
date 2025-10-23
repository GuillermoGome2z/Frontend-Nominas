// DEBUG: Componente para verificar estado de autenticación
import { useAuthStore } from '../../features/auth/useAuthStore'

export default function AuthDebug() {
  const token = useAuthStore((s) => s.token)
  const role = useAuthStore((s) => s.role)
  const refreshToken = useAuthStore((s) => s.refreshToken)

  if (import.meta.env.MODE !== 'development') return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 Auth Debug</div>
      <div>Token: {token ? '✅ ' + token.substring(0, 20) + '...' : '❌ No token'}</div>
      <div>Refresh: {refreshToken ? '✅ Existe' : '❌ No existe'}</div>
      <div style={{ 
        marginTop: '8px', 
        padding: '4px', 
        background: role ? 'green' : 'red',
        borderRadius: '4px'
      }}>
        Role: {role || '❌ No role'}
      </div>
      <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
        localStorage role: {localStorage.getItem('role')}
      </div>
    </div>
  )
}
