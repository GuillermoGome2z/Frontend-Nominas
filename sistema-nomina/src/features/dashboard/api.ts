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
    // Obtener estadísticas de nóminas y empleados agrupados por departamento en paralelo
    const [nominasRes, empleadosRes, empleadosFullRes] = await Promise.allSettled([
      api.get('/nominas/stats'),
      api.get('/empleados?page=1&pageSize=1'),
      api.get('/empleados?page=1&pageSize=1000&estado=activo') // Obtener empleados activos para agrupar
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
    
    // Agrupar empleados por departamento
    let activosPorDepartamento: DepartamentoActivos[] = []
    if (empleadosFullRes.status === 'fulfilled') {
      const empleados = empleadosFullRes.value.data?.empleados ?? empleadosFullRes.value.data?.data ?? empleadosFullRes.value.data ?? []
      
      if (Array.isArray(empleados)) {
        // Crear un mapa para contar empleados por departamento
        const departamentosMap = new Map<string, number>()
        
        empleados.forEach((emp: any) => {
          // Debug: ver la estructura del empleado
          if (import.meta.env?.DEV) {
            console.log('Empleado estructura:', emp)
          }
          
          const deptName = emp.departamento?.nombre ?? 
                          emp.departamento?.Nombre ?? 
                          emp.Departamento?.nombre ?? 
                          emp.Departamento?.Nombre ?? 
                          emp.departamentoNombre ?? 
                          emp.DepartamentoNombre ?? 
                          emp.departamento ?? 
                          emp.Departamento ?? 
                          'Sin Departamento'
          
          departamentosMap.set(deptName, (departamentosMap.get(deptName) || 0) + 1)
        })
        
        // Convertir el mapa a array y ordenar por cantidad descendente
        activosPorDepartamento = Array.from(departamentosMap.entries())
          .map(([departamento, activos]) => ({ departamento, activos }))
          .sort((a, b) => b.activos - a.activos)
      }
    }
    
    return {
      totalEmpleados: totalEmpleados || Number(nominasData.empleadosEnNomina ?? nominasData.EmpleadosEnNomina ?? 0),
      nominaPendienteQ: Number(nominasData.totalPagadoMesActual ?? nominasData.TotalPagadoMesActual ?? 0),
      proximoPago: nominasData.proximaFechaPago ?? nominasData.ProximaFechaPago,
      nominasGeneradasEnMes: Number(nominasData.nominasDelMes ?? nominasData.NominasDelMes ?? 0),
      nominasGeneradasEnMesAnterior: Number(nominasData.nominasPendientes ?? nominasData.NominasPendientes ?? 0),
      activosPorDepartamento: activosPorDepartamento
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
