export type FrontRole = 'ADMIN' | 'RRHH' | 'EMP'

// Mapea roles de backend → frontend
export function mapBackendRole(rol: string | null | undefined): FrontRole {
  switch (rol) {
    case 'Admin':
      return 'ADMIN'
    case 'RRHH':
      return 'RRHH'
    case 'Empleado':
    case 'Usuario':
    default:
      return 'EMP'
  }
}
