import { api } from '../../lib/api'

/* ======================= Tipos (Reportes) ======================= */

export interface ReportFilter {
  fechaInicio?: string  // ISO YYYY-MM-DD
  fechaFin?: string     // ISO YYYY-MM-DD
  departamentoId?: number
  puestoId?: number
  estadoLaboral?: 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO' | '' | undefined
}

export interface EmpleadoReporte {
  id: number
  nombreCompleto: string
  dpi: string
  correo: string
  departamento: string
  puesto: string
  estadoLaboral: string
  salarioMensual: number
  fechaContratacion: string
  antiguedadAnios: number
}

export interface DepartamentoReporte {
  id: number
  nombre: string
  totalEmpleados: number
  empleadosActivos: number
  empleadosSuspendidos: number
  empleadosRetirados: number
  masasSalarialMensual: number
}

export interface ResumenGeneral {
  totalEmpleados: number
  empleadosActivos: number
  empleadosSuspendidos: number
  empleadosRetirados: number
  totalDepartamentos: number
  totalPuestos: number
  masaSalarialTotal: number
  promedioSalarial: number
}

export interface ReportesResponse {
  resumen: ResumenGeneral
  empleados: EmpleadoReporte[]
  departamentos: DepartamentoReporte[]
  fechaGeneracion: string
}

/* ======================= Helpers ======================= */

function toIso(dateStr?: string | null): string | null {
  if (!dateStr) return null
  try {
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  } catch {
    return null
  }
}

function mapEmpleadoReporte(x: any): EmpleadoReporte {
  return {
    id: x.id ?? x.Id ?? 0,
    nombreCompleto: x.nombreCompleto ?? x.NombreCompleto ?? '',
    dpi: x.dpi ?? x.DPI ?? '',
    correo: x.correo ?? x.Correo ?? '',
    departamento: x.departamento ?? x.Departamento ?? x.nombreDepartamento ?? x.NombreDepartamento ?? '',
    puesto: x.puesto ?? x.Puesto ?? x.nombrePuesto ?? x.NombrePuesto ?? '',
    estadoLaboral: x.estadoLaboral ?? x.EstadoLaboral ?? 'ACTIVO',
    salarioMensual: Number(x.salarioMensual ?? x.SalarioMensual ?? 0),
    fechaContratacion: x.fechaContratacion ?? x.FechaContratacion ?? '',
    antiguedadAnios: Number(x.antiguedadAnios ?? x.AntiguedadAnios ?? 0)
  }
}

function mapDepartamentoReporte(x: any): DepartamentoReporte {
  return {
    id: x.id ?? x.Id ?? 0,
    nombre: x.nombre ?? x.Nombre ?? '',
    totalEmpleados: Number(x.totalEmpleados ?? x.TotalEmpleados ?? 0),
    empleadosActivos: Number(x.empleadosActivos ?? x.EmpleadosActivos ?? 0),
    empleadosSuspendidos: Number(x.empleadosSuspendidos ?? x.EmpleadosSuspendidos ?? 0),
    empleadosRetirados: Number(x.empleadosRetirados ?? x.EmpleadosRetirados ?? 0),
    masasSalarialMensual: Number(x.masasSalarialMensual ?? x.MasasSalarialMensual ?? 0)
  }
}

/* ======================= API ======================= */

export async function generarReporteGeneral(filters: ReportFilter = {}): Promise<ReportesResponse> {
  try {
    const params = new URLSearchParams()
    
    // Solo agregar parámetros si tienen valores válidos
    const fechaInicioISO = toIso(filters.fechaInicio)
    if (fechaInicioISO) params.set('fechaInicio', fechaInicioISO)
    
    const fechaFinISO = toIso(filters.fechaFin)
    if (fechaFinISO) params.set('fechaFin', fechaFinISO)
    
    if (filters.departamentoId && filters.departamentoId > 0) {
      params.set('departamentoId', String(filters.departamentoId))
    }
    
    if (filters.puestoId && filters.puestoId > 0) {
      params.set('puestoId', String(filters.puestoId))
    }
    
    if (filters.estadoLaboral && filters.estadoLaboral.trim() !== '') {
      params.set('estadoLaboral', filters.estadoLaboral)
    }

    const url = `/reportes/general?${params.toString()}`
    console.log('📊 API Request URL:', url)
    console.log('📊 Filters processed:', filters)
    
    const res = await api.get(url)
    const data = res.data

    return {
      resumen: {
        totalEmpleados: Number(data.resumen?.totalEmpleados ?? data.resumen?.TotalEmpleados ?? 0),
        empleadosActivos: Number(data.resumen?.empleadosActivos ?? data.resumen?.EmpleadosActivos ?? 0),
        empleadosSuspendidos: Number(data.resumen?.empleadosSuspendidos ?? data.resumen?.EmpleadosSuspendidos ?? 0),
        empleadosRetirados: Number(data.resumen?.empleadosRetirados ?? data.resumen?.EmpleadosRetirados ?? 0),
        totalDepartamentos: Number(data.resumen?.totalDepartamentos ?? data.resumen?.TotalDepartamentos ?? 0),
        totalPuestos: Number(data.resumen?.totalPuestos ?? data.resumen?.TotalPuestos ?? 0),
        masaSalarialTotal: Number(data.resumen?.masaSalarialTotal ?? data.resumen?.MasaSalarialTotal ?? 0),
        promedioSalarial: Number(data.resumen?.promedioSalarial ?? data.resumen?.PromedioSalarial ?? 0)
      },
      empleados: Array.isArray(data.empleados) ? data.empleados.map(mapEmpleadoReporte) : [],
      departamentos: Array.isArray(data.departamentos) ? data.departamentos.map(mapDepartamentoReporte) : [],
      fechaGeneracion: data.fechaGeneracion ?? data.FechaGeneracion ?? new Date().toISOString()
    }
  } catch (error: any) {
    console.error('❌ Error en generarReporteGeneral:', error)
    
    // Manejo específico de errores CORS
    if (error?.code === 'ERR_NETWORK' || error?.message?.includes('CORS')) {
      console.warn('🚫 Error de CORS detectado - el backend necesita configurar CORS para el puerto 5175')
      const corsError = new Error('Error de CORS: El backend no permite peticiones desde este origen. Contacta al desarrollador del backend para configurar CORS.')
      corsError.name = 'CORSError'
      throw corsError
    }
    
    // Si el endpoint no existe, devolver datos vacíos para desarrollo
    if (error?.response?.status === 404 || error?.response?.status === 500) {
      console.warn('⚠️ Endpoint de reportes no implementado en el backend, usando datos vacíos')
      return {
        resumen: {
          totalEmpleados: 0,
          empleadosActivos: 0,
          empleadosSuspendidos: 0,
          empleadosRetirados: 0,
          totalDepartamentos: 0,
          totalPuestos: 0,
          masaSalarialTotal: 0,
          promedioSalarial: 0
        },
        empleados: [],
        departamentos: [],
        fechaGeneracion: new Date().toISOString()
      }
    }
    
    throw error
  }
}

export async function exportarReporteExcel(filters: ReportFilter = {}): Promise<Blob> {
  const params = new URLSearchParams()
  
  // Solo agregar parámetros si tienen valores válidos
  const fechaInicioISO = toIso(filters.fechaInicio)
  if (fechaInicioISO) params.set('fechaInicio', fechaInicioISO)
  
  const fechaFinISO = toIso(filters.fechaFin)
  if (fechaFinISO) params.set('fechaFin', fechaFinISO)
  
  if (filters.departamentoId && filters.departamentoId > 0) {
    params.set('departamentoId', String(filters.departamentoId))
  }
  
  if (filters.puestoId && filters.puestoId > 0) {
    params.set('puestoId', String(filters.puestoId))
  }
  
  if (filters.estadoLaboral && filters.estadoLaboral.trim() !== '') {
    params.set('estadoLaboral', filters.estadoLaboral)
  }

  const res = await api.get(`/reportes/excel?${params.toString()}`, {
    responseType: 'blob'
  })
  return res.data
}

export async function exportarReportePDF(filters: ReportFilter = {}): Promise<Blob> {
  const params = new URLSearchParams()
  
  // Solo agregar parámetros si tienen valores válidos
  const fechaInicioISO = toIso(filters.fechaInicio)
  if (fechaInicioISO) params.set('fechaInicio', fechaInicioISO)
  
  const fechaFinISO = toIso(filters.fechaFin)
  if (fechaFinISO) params.set('fechaFin', fechaFinISO)
  
  if (filters.departamentoId && filters.departamentoId > 0) {
    params.set('departamentoId', String(filters.departamentoId))
  }
  
  if (filters.puestoId && filters.puestoId > 0) {
    params.set('puestoId', String(filters.puestoId))
  }
  
  if (filters.estadoLaboral && filters.estadoLaboral.trim() !== '') {
    params.set('estadoLaboral', filters.estadoLaboral)
  }

  const res = await api.get(`/reportes/pdf?${params.toString()}`, {
    responseType: 'blob'
  })
  return res.data
}