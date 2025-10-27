import { api } from '../../lib/api'

/* ======================= Tipos y DTOs ======================= */

export type EstadoNomina = 'BORRADOR' | 'APROBADA' | 'PAGADA' | 'ANULADA'
export type TipoNomina = 'ORDINARIA' | 'EXTRAORDINARIA' | 'AGUINALDO' | 'BONO14'

// DTO principal de nómina
export interface NominaDTO {
  id: number
  periodo: string // "2025-01" formato año-mes
  tipoNomina: TipoNomina
  estado: EstadoNomina
  fechaCreacion: string // ISO
  fechaAprobacion?: string // ISO
  fechaPago?: string // ISO
  
  // Totales generales
  totalBruto: number
  totalDeducciones: number
  totalNeto: number
  cantidadEmpleados: number
  
  // Deducciones desglosadas (NUEVO - Guatemala 2025)
  totalIgssEmpleado?: number
  totalIsr?: number
  
  // Aportes patronales (NUEVO - Guatemala 2025)
  totalIgssPatronal?: number
  totalIrtra?: number
  totalIntecap?: number
  
  // Auditoría
  creadoPor?: string
  aprobadoPor?: string
  observaciones?: string
}

// DTO para detalle de empleado en nómina - Actualizado Guatemala 2025
export interface NominaDetalleDTO {
  id: number
  nominaId: number
  empleadoId: number
  nombreCompleto: string
  nombreEmpleado: string // Nuevo campo del backend
  departamento: string
  nombreDepartamento: string // Nuevo campo del backend
  puesto: string
  nombrePuesto: string // Nuevo campo del backend
  diasTrabajados: number
  horasOrdinarias: number
  horasExtra50: number
  horasExtra100: number
  salarioBase: number
  salarioBruto: number // Campo principal del backend
  bonificaciones: number
  bonoDecreto: number // Separado del total de bonificaciones
  comisiones: number
  horasExtraValor: number
  totalDevengado: number
  
  // Deducciones detalladas (nuevos campos backend)
  igss: number
  isr: number
  prestamos: number
  anticipos: number
  otrasDeducciones: number // Renombrado para consistencia
  otrosDeducciones: number // Mantener compatibilidad
  
  totalDeducciones: number
  sueldoNeto: number
  salarioNeto: number // Campo alternativo del backend
  observaciones?: string
  
  // Campos adicionales para debugging/auditoría
  esPromedioAnual?: boolean // Indica si usa promedio 12 meses
  baseIgssCalculada?: number // Base real usada para IGSS
  exencionAplicada?: string // Tipo de exención aplicada
}

// DTO para crear nueva nómina
export interface NominaCreateDTO {
  periodo: string // "2025-01"
  tipoNomina: TipoNomina
  departamentoIds?: number[] // Si se quiere generar solo para ciertos departamentos
  empleadoIds?: number[] // Si se quiere generar solo para ciertos empleados
  observaciones?: string
}

// DTO para aprobar/rechazar nómina
export interface NominaAprobacionDTO {
  aprobada: boolean
  observaciones?: string
}

// Filtros para listado
export interface NominaFilters {
  periodo?: string // "2025-01"
  tipoNomina?: TipoNomina
  estado?: EstadoNomina
  fechaInicio?: string // ISO
  fechaFin?: string // ISO
  q?: string // búsqueda general
  page?: number
  pageSize?: number
}

// Respuesta de listado
export interface NominasListResponse {
  data: NominaDTO[]
  meta: { total: number; page: number; pageSize: number }
}

// Estadísticas del dashboard de nóminas
export interface NominaStatsDTO {
  nominasDelMes: number
  nominasPendientes: number
  totalPagadoMesActual: number
  totalPagadoMesAnterior: number
  porcentajeCambio: number
  proximaFechaPago?: string // ISO
  empleadosEnNomina: number
  promedioSueldoNeto: number
}

// DTO para cálculo previo (preview)
export interface NominaCalculoDTO {
  totalEmpleados: number
  totalBruto: number
  totalDeducciones: number
  totalNeto: number
  detallesPorDepartamento: {
    departamento: string
    empleados: number
    totalBruto: number
    totalNeto: number
  }[]
}

/* ======================= Mappers y Helpers ======================= */

function up(s?: string | null): string | undefined {
  if (!s || typeof s !== 'string') return undefined
  return s.toUpperCase()
}

function mapNomina(x: any): NominaDTO {
  // Mapear estado
  const estadoRaw = x.estado ?? x.Estado
  const estado: EstadoNomina = 
    up(estadoRaw) === 'BORRADOR' || up(estadoRaw) === 'APROBADA' || 
    up(estadoRaw) === 'PAGADA' || up(estadoRaw) === 'ANULADA'
      ? (up(estadoRaw) as EstadoNomina)
      : 'BORRADOR'

  // Mapear tipo
  const tipoRaw = x.tipoNomina ?? x.TipoNomina ?? x.tipo ?? x.Tipo
  const tipo: TipoNomina = 
    up(tipoRaw) === 'ORDINARIA' || up(tipoRaw) === 'EXTRAORDINARIA' ||
    up(tipoRaw) === 'AGUINALDO' || up(tipoRaw) === 'BONO14'
      ? (up(tipoRaw) as TipoNomina)
      : 'ORDINARIA'

  // Construir periodo desde múltiples posibles fuentes
  let periodo = x.periodo ?? x.Periodo
  
  // Si no hay periodo directo, construir desde Año/Mes
  if (!periodo && x.anio && x.mes) {
    periodo = `${x.anio}-${String(x.mes).padStart(2, '0')}`
  }
  if (!periodo && x.Anio && x.Mes) {
    periodo = `${x.Anio}-${String(x.Mes).padStart(2, '0')}`
  }
  
  // Si aún no hay periodo, intentar extraer de fechaGeneracion
  if (!periodo && x.fechaGeneracion) {
    const fecha = new Date(x.fechaGeneracion)
    periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
  }
  if (!periodo && x.FechaGeneracion) {
    const fecha = new Date(x.FechaGeneracion)
    periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
  }

  // Calcular cantidad de empleados desde detalles si existe
  const cantidadEmpleados = Array.isArray(x.detalles) 
    ? x.detalles.length 
    : Array.isArray(x.Detalles)
    ? x.Detalles.length
    : Number(x.cantidadEmpleados ?? x.CantidadEmpleados ?? 0)

  return {
    id: x.id ?? x.Id ?? 0,
    periodo: periodo ?? '',
    tipoNomina: tipo,
    estado: estado,
    fechaCreacion: x.fechaGeneracion ?? x.FechaGeneracion ?? x.fechaCreacion ?? x.FechaCreacion ?? '',
    fechaAprobacion: x.fechaAprobacion ?? x.FechaAprobacion,
    fechaPago: x.fechaPago ?? x.FechaPago,
    
    // Totales generales
    totalBruto: Number(x.totalBruto ?? x.TotalBruto ?? 0),
    totalDeducciones: Number(x.totalDeducciones ?? x.TotalDeducciones ?? 0),
    totalNeto: Number(x.totalNeto ?? x.TotalNeto ?? 0),
    cantidadEmpleados: cantidadEmpleados,
    
    // Deducciones desglosadas (Guatemala 2025)
    totalIgssEmpleado: Number(x.totalIgssEmpleado ?? x.TotalIgssEmpleado ?? 0),
    totalIsr: Number(x.totalIsr ?? x.TotalIsr ?? 0),
    
    // Aportes patronales (Guatemala 2025)
    totalIgssPatronal: Number(x.totalIgssPatronal ?? x.TotalIgssPatronal ?? x.aportesPatronales?.totalIgssPatronal ?? x.AportesPatronales?.TotalIgssPatronal ?? 0),
    totalIrtra: Number(x.totalIrtra ?? x.TotalIrtra ?? x.aportesPatronales?.totalIrtra ?? x.AportesPatronales?.TotalIrtra ?? 0),
    totalIntecap: Number(x.totalIntecap ?? x.TotalIntecap ?? x.aportesPatronales?.totalIntecap ?? x.AportesPatronales?.TotalIntecap ?? 0),
    
    // Auditoría
    creadoPor: x.creadoPor ?? x.CreadoPor,
    aprobadoPor: x.aprobadoPor ?? x.AprobadoPor,
    observaciones: x.observaciones ?? x.Observaciones ?? x.descripcion ?? x.Descripcion
  }
}

function mapNominaDetalle(x: any): NominaDetalleDTO {
  return {
    id: Number(x.id ?? x.Id ?? 0),
    nominaId: Number(x.nominaId ?? x.NominaId ?? 0),
    empleadoId: Number(x.empleadoId ?? x.EmpleadoId ?? 0),
    
    // Nombres (compatibilidad con nuevos campos backend)
    nombreCompleto: x.nombreEmpleado ?? x.NombreEmpleado ?? x.nombreCompleto ?? x.NombreCompleto ?? '',
    nombreEmpleado: x.nombreEmpleado ?? x.NombreEmpleado ?? x.nombreCompleto ?? x.NombreCompleto ?? '',
    departamento: x.nombreDepartamento ?? x.NombreDepartamento ?? x.departamento ?? x.Departamento ?? '',
    nombreDepartamento: x.nombreDepartamento ?? x.NombreDepartamento ?? x.departamento ?? x.Departamento ?? '',
    puesto: x.nombrePuesto ?? x.NombrePuesto ?? x.puesto ?? x.Puesto ?? '',
    nombrePuesto: x.nombrePuesto ?? x.NombrePuesto ?? x.puesto ?? x.Puesto ?? '',
    
    // Tiempo y horas
    diasTrabajados: Number(x.diasTrabajados ?? x.DiasTrabajados ?? x.dias ?? x.Dias ?? 30),
    horasOrdinarias: Number(x.horasOrdinarias ?? x.HorasOrdinarias ?? 0),
    horasExtra50: Number(x.horasExtra50 ?? x.HorasExtra50 ?? 0),
    horasExtra100: Number(x.horasExtra100 ?? x.HorasExtra100 ?? 0),
    
    // Salarios (usando nuevos campos del backend Guatemala 2025)
    salarioBase: Number(x.salarioBase ?? x.SalarioBase ?? x.salarioBruto ?? x.SalarioBruto ?? 0),
    salarioBruto: Number(x.salarioBruto ?? x.SalarioBruto ?? x.salarioBase ?? x.SalarioBase ?? 0),
    bonificaciones: Number(x.bonificaciones ?? x.Bonificaciones ?? 0),
    bonoDecreto: Number(x.bonoDecreto ?? x.BonoDecreto ?? 0), // Separado en nueva implementación
    comisiones: Number(x.comisiones ?? x.Comisiones ?? 0),
    horasExtraValor: Number(x.horasExtraValor ?? x.HorasExtraValor ?? 0),
    totalDevengado: Number(x.totalDevengado ?? x.TotalDevengado ?? x.salarioBruto ?? x.SalarioBruto ?? 0),
    
    // Deducciones detalladas (nuevos campos backend Guatemala 2025)
    igss: Number(x.igss ?? x.Igss ?? 0),
    isr: Number(x.isr ?? x.Isr ?? 0),
    prestamos: Number(x.prestamos ?? x.Prestamos ?? 0),
    anticipos: Number(x.anticipos ?? x.Anticipos ?? 0),
    otrasDeducciones: Number(x.otrasDeducciones ?? x.OtrasDeducciones ?? 0),
    otrosDeducciones: Number(x.otrosDeducciones ?? x.OtrosDeducciones ?? x.otrasDeducciones ?? x.OtrasDeducciones ?? 0),
    
    totalDeducciones: Number(x.totalDeducciones ?? x.TotalDeducciones ?? x.deducciones ?? x.Deducciones ?? 0),
    sueldoNeto: Number(x.sueldoNeto ?? x.SueldoNeto ?? x.salarioNeto ?? x.SalarioNeto ?? 0),
    salarioNeto: Number(x.salarioNeto ?? x.SalarioNeto ?? x.sueldoNeto ?? x.SueldoNeto ?? 0),
    
    // Campos adicionales para auditoría
    observaciones: x.observaciones ?? x.Observaciones,
    esPromedioAnual: x.esPromedioAnual ?? x.EsPromedioAnual ?? false,
    baseIgssCalculada: Number(x.baseIgssCalculada ?? x.BaseIgssCalculada ?? 0),
    exencionAplicada: x.exencionAplicada ?? x.ExencionAplicada ?? ''
  }
}

function toIso(d?: string | Date | null): string | undefined {
  if (!d) return undefined
  const date = d instanceof Date ? d : new Date(d)
  return isNaN(date.getTime()) ? undefined : date.toISOString()
}

/* ======================= API Functions ======================= */

// Listar nóminas con filtros
export async function listNominas(filters: NominaFilters = {}): Promise<NominasListResponse> {
  const params = new URLSearchParams()
  
  if (filters.q) params.set('q', filters.q)
  if (filters.periodo) params.set('periodo', filters.periodo)
  if (filters.tipoNomina) params.set('tipoNomina', filters.tipoNomina)
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.fechaInicio) params.set('fechaInicio', toIso(filters.fechaInicio) ?? '')
  if (filters.fechaFin) params.set('fechaFin', toIso(filters.fechaFin) ?? '')
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 10))

  try {
    const res = await api.get(`/nominas?${params.toString()}`)

    // Intentar obtener total del header
    let total = 0
    const totalHeader = res.headers['x-total-count'] || res.headers['X-Total-Count']
    if (totalHeader) {
      total = parseInt(totalHeader, 10) || 0
    }

    // Si la respuesta es un objeto con data/items y total
    if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      const data = res.data.data ?? res.data.items ?? res.data.nominas ?? []
      total = res.data.total ?? res.data.Total ?? total
      
      return {
        data: Array.isArray(data) ? data.map(mapNomina) : [],
        meta: {
          total,
          page: filters.page ?? 1,
          pageSize: filters.pageSize ?? 10
        }
      }
    }

    // Si la respuesta es un array directo
    const data = Array.isArray(res.data) ? res.data : []
    return {
      data: data.map(mapNomina),
      meta: {
        total: total || data.length,
        page: filters.page ?? 1,
        pageSize: filters.pageSize ?? 10
      }
    }
  } catch (error: any) {
    // Si el backend no está implementado, devolver datos mock
    if (error?.response?.status === 404) {
      console.warn('Endpoint /nominas no implementado, usando datos mock')
      return {
        data: [],
        meta: { total: 0, page: 1, pageSize: 10 }
      }
    }
    throw error
  }
}

// Obtener nómina por ID
export async function getNomina(id: number): Promise<NominaDTO> {
  const res = await api.get(`/nominas/${id}`)
  return mapNomina(res.data)
}

// Obtener detalle de nómina (empleados)
export async function getNominaDetalle(nominaId: number): Promise<NominaDetalleDTO[]> {
  try {
    const res = await api.get(`/nominas/${nominaId}/detalles`)
    
    // El backend devuelve los empleados en la propiedad 'items'
    const data = res.data.items ?? res.data.data ?? res.data ?? []
    const mappedData = Array.isArray(data) ? data.map(mapNominaDetalle) : []
    
    return mappedData
  } catch (error) {
    console.error('❌ Error obteniendo detalle de nómina:', error)
    throw error
  }
}

// Crear nueva nómina
export async function createNomina(payload: NominaCreateDTO): Promise<NominaDTO> {
  const body = {
    Periodo: payload.periodo,
    TipoNomina: payload.tipoNomina,
    DepartamentoIds: payload.departamentoIds,
    EmpleadoIds: payload.empleadoIds,
    Observaciones: payload.observaciones
  }

  const res = await api.post('/nominas', body)
  return mapNomina(res.data)
}

// Calcular nómina (preview sin guardar)
export async function calcularNomina(payload: NominaCreateDTO): Promise<NominaCalculoDTO> {
  const body = {
    Periodo: payload.periodo,
    TipoNomina: payload.tipoNomina,
    DepartamentoIds: payload.departamentoIds,
    EmpleadoIds: payload.empleadoIds
  }

  const res = await api.post('/nominas/calcular', body)
  
  return {
    totalEmpleados: res.data.totalEmpleados ?? res.data.TotalEmpleados ?? 0,
    totalBruto: Number(res.data.totalBruto ?? res.data.TotalBruto ?? 0),
    totalDeducciones: Number(res.data.totalDeducciones ?? res.data.TotalDeducciones ?? 0),
    totalNeto: Number(res.data.totalNeto ?? res.data.TotalNeto ?? 0),
    detallesPorDepartamento: (res.data.detallesPorDepartamento ?? res.data.DetallesPorDepartamento ?? []).map((d: any) => ({
      departamento: d.departamento ?? d.Departamento ?? '',
      empleados: Number(d.empleados ?? d.Empleados ?? 0),
      totalBruto: Number(d.totalBruto ?? d.TotalBruto ?? 0),
      totalNeto: Number(d.totalNeto ?? d.TotalNeto ?? 0)
    }))
  }
}

// Aprobar/rechazar nómina
export async function aprobarNomina(id: number, payload: NominaAprobacionDTO) {
  const body = {
    Aprobada: payload.aprobada,
    Observaciones: payload.observaciones
  }

  const res = await api.put(`/nominas/${id}/aprobar`, body)
  return res.status
}

// Marcar nómina como pagada
export async function marcarNominaPagada(id: number, fechaPago?: string) {
  const body = {
    FechaPago: toIso(fechaPago) ?? new Date().toISOString()
  }

  const res = await api.put(`/nominas/${id}/pagar`, body)
  return res.status
}

// Anular nómina
export async function anularNomina(id: number, motivo?: string) {
  const body = {
    Motivo: motivo
  }

  const res = await api.put(`/nominas/${id}/anular`, body)
  return res.status
}

// Eliminar nómina (solo si está en borrador)
export async function deleteNomina(id: number) {
  const res = await api.delete(`/nominas/${id}`)
  return res.status
}

// Obtener estadísticas
export async function getNominaStats(): Promise<NominaStatsDTO> {
  try {
    const res = await api.get('/nominas/stats')
    
    return {
      nominasDelMes: Number(res.data.nominasDelMes ?? res.data.NominasDelMes ?? 0),
      nominasPendientes: Number(res.data.nominasPendientes ?? res.data.NominasPendientes ?? 0),
      totalPagadoMesActual: Number(res.data.totalPagadoMesActual ?? res.data.TotalPagadoMesActual ?? 0),
      totalPagadoMesAnterior: Number(res.data.totalPagadoMesAnterior ?? res.data.TotalPagadoMesAnterior ?? 0),
      porcentajeCambio: Number(res.data.porcentajeCambio ?? res.data.PorcentajeCambio ?? 0),
      proximaFechaPago: res.data.proximaFechaPago ?? res.data.ProximaFechaPago,
      empleadosEnNomina: Number(res.data.empleadosEnNomina ?? res.data.EmpleadosEnNomina ?? 0),
      promedioSueldoNeto: Number(res.data.promedioSueldoNeto ?? res.data.PromedioSueldoNeto ?? 0)
    }
  } catch (error: any) {
    // Datos mock si el endpoint no existe
    if (error?.response?.status === 404) {
      console.warn('Endpoint /nominas/stats no implementado, usando datos mock')
      return {
        nominasDelMes: 0,
        nominasPendientes: 0,
        totalPagadoMesActual: 0,
        totalPagadoMesAnterior: 0,
        porcentajeCambio: 0,
        empleadosEnNomina: 0,
        promedioSueldoNeto: 0
      }
    }
    throw error
  }
}

// Descargar reporte de nómina (Excel/PDF)
export async function downloadNominaReport(id: number, formato: 'excel' | 'pdf'): Promise<string> {
  const res = await api.get(`/nominas/${id}/export/${formato}`, {
    responseType: 'blob'
  })
  
  // Si el backend devuelve una URL directa
  if (typeof res.data === 'string') {
    return res.data
  }
  
  // Si devuelve el archivo como blob, crear URL temporal
  const blob = new Blob([res.data])
  return URL.createObjectURL(blob)
}

// Enviar nómina por email
export async function enviarNominaPorEmail(id: number, emails: string[]) {
  const body = {
    Emails: emails
  }

  const res = await api.post(`/nominas/${id}/enviar-email`, body)
  return res.status
}