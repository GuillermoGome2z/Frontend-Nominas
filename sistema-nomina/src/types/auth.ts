// ==================== Auth Types ====================

export interface LoginRequestDto {
  correo: string
  contraseña: string
}

export interface LoginResponseDto {
  token: string
  nombreUsuario: string
  rol: string
}

export interface RefreshRequestDto {
  refreshToken: string
}

export interface RefreshResponseDto {
  token: string
  refreshToken: string
}

export interface LogoutRequestDto {
  refreshToken: string
}

// ==================== Role Types ====================

export type BackendRole = 'Admin' | 'RRHH' | 'Usuario'
export type FrontRole = 'admin' | 'rrhh' | 'usuario'

export const ROLES = {
  ADMIN: 'admin' as const,
  RRHH: 'rrhh' as const,
  USUARIO: 'usuario' as const,
}

// Helper para mapear rol del backend al frontend
export function mapBackendRole(backendRole: string): FrontRole {
  const normalized = backendRole.toLowerCase()
  if (normalized === 'admin') return ROLES.ADMIN
  if (normalized === 'rrhh') return ROLES.RRHH
  return ROLES.USUARIO
}
