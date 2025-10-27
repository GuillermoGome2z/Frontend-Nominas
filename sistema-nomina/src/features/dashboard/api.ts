import { api } from '../../lib/http'

export type DepartamentoActivos = {
  departamento: string
  activos: number
}

export type DashboardActivity = {
  id: number
  tipo: string
  descripcion: string
  fecha: string
  usuario?: string
  entidad?: string
  entidadId?: number
}

export type DashboardAlert = {
  id: number
  tipo: 'warning' | 'error' | 'info' | 'success'
  titulo: string
  descripcion: string
  fecha: string
  leido: boolean
  accion?: string
  url?: string
}

export type Kpis = {
  totalEmpleados?: number
  nominaPendienteQ?: number
  proximoPago?: string // ISO
  nominasGeneradasEnMes?: number
  nominasGeneradasEnMesAnterior?: number
  activosPorDepartamento?: DepartamentoActivos[]
  // Campos extra del backend no romperán (se ignoran)
  [key: string]: unknown
}

export async function getKpis(): Promise<Kpis> {
  try {
    // Obtener estadísticas de nóminas y empleados en paralelo
    const [nominasRes, empleadosRes] = await Promise.allSettled([
      api.get('/nominas/stats'),
      api.get('/empleados?page=1&pageSize=1')
    ])
    
    // Mapear respuesta de nóminas
    let nominasData: any = {}
    if (nominasRes.status === 'fulfilled') {
      nominasData = nominasRes.value.data
    }
    
    // Obtener total de empleados desde header o metadata
    let totalEmpleados = 0
    if (empleadosRes.status === 'fulfilled') {
      const empRes = empleadosRes.value
      totalEmpleados = 
        Number(empRes.headers?.['x-total-count'] ?? 
               empRes.headers?.['X-Total-Count'] ?? 
               empRes.data?.total ?? 
               empRes.data?.Total ?? 
               0)
    }
    
    return {
      totalEmpleados: totalEmpleados || Number(nominasData.empleadosEnNomina ?? nominasData.EmpleadosEnNomina ?? 0),
      nominaPendienteQ: Number(nominasData.totalPagadoMesActual ?? nominasData.TotalPagadoMesActual ?? 0),
      proximoPago: nominasData.proximaFechaPago ?? nominasData.ProximaFechaPago,
      nominasGeneradasEnMes: Number(nominasData.nominasDelMes ?? nominasData.NominasDelMes ?? 0),
      nominasGeneradasEnMesAnterior: Number(nominasData.nominasPendientes ?? nominasData.NominasPendientes ?? 0),
      activosPorDepartamento: []
    }
  } catch (error) {
    console.warn('Error obteniendo estadísticas del dashboard:', error)
    // Devolver valores por defecto en caso de error
    return {
      totalEmpleados: 0,
      nominaPendienteQ: 0,
      proximoPago: undefined,
      nominasGeneradasEnMes: 0,
      nominasGeneradasEnMesAnterior: 0,
      activosPorDepartamento: []
    }
  }
}
