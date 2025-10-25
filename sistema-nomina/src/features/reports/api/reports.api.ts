/**
 * api/reports.api.ts
 * Cliente API para el módulo de Reportes
 * Conectado al ReportesController del backend
 */

import { api } from '@/lib/api'
import type {
  ReporteNomina,
  ReporteExpediente,
  ReporteDocumentosEmpleado,
  ReportePorTipoDocumento,
  ReporteGeneral,
  ReporteAjuste,
  ReporteAuditoria,
  ReporteNominaFilters,
  ReporteExpedienteFilters,
  ReporteGeneralFilters,
  ReporteAuditoriaFilters,
} from '../types/Reports'

// ==================== MAPPERS ====================

function mapReporteNomina(raw: any): ReporteNomina {
  return {
    id: raw.Id ?? raw.id,
    nombre: raw.Nombre ?? raw.nombre,
    periodo: raw.Periodo ?? raw.periodo,
    fechaGeneracion: raw.FechaGeneracion ?? raw.fechaGeneracion,
    fechaInicio: raw.FechaInicio ?? raw.fechaInicio,
    fechaFin: raw.FechaFin ?? raw.fechaFin,
    estado: raw.Estado ?? raw.estado,
    totalEmpleados: raw.TotalEmpleados ?? raw.totalEmpleados ?? 0,
    totalBruto: raw.TotalBruto ?? raw.totalBruto ?? 0,
    totalDeducciones: raw.TotalDeducciones ?? raw.totalDeducciones ?? 0,
    totalNeto: raw.TotalNeto ?? raw.totalNeto ?? 0,
  }
}

function mapReporteExpediente(raw: any): ReporteExpediente {
  return {
    empleadoId: raw.EmpleadoId ?? raw.empleadoId,
    nombreCompleto: raw.NombreCompleto ?? raw.nombreCompleto,
    puesto: raw.Puesto ?? raw.puesto,
    departamento: raw.Departamento ?? raw.departamento,
    documentosRequeridos: raw.DocumentosRequeridos ?? raw.documentosRequeridos ?? 0,
    documentosEntregados: raw.DocumentosEntregados ?? raw.documentosEntregados ?? 0,
    porcentajeCompletitud: raw.PorcentajeCompletitud ?? raw.porcentajeCompletitud ?? 0,
    estado: raw.Estado ?? raw.estado,
    ultimaActualizacion: raw.UltimaActualizacion ?? raw.ultimaActualizacion,
  }
}

// ==================== REPORTES GENERALES ====================

/**
 * Obtiene el reporte general de empleados
 */
export async function getReporteGeneral(filters?: ReporteGeneralFilters): Promise<ReporteGeneral> {
  const params = new URLSearchParams()
  if (filters?.estadoLaboral) params.append('estadoLaboral', filters.estadoLaboral)

  const response = await api.get(`/reportes/general?${params.toString()}`)
  return response.data
}

/**
 * Obtiene el resumen de todas las nóminas
 */
export async function getReporteNominas(filters?: ReporteNominaFilters): Promise<ReporteNomina[]> {
  const params = new URLSearchParams()
  if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio)
  if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin)
  if (filters?.estado) params.append('estado', filters.estado)

  const response = await api.get(`/reportes/Nominas?${params.toString()}`)
  const data = Array.isArray(response.data) ? response.data : []
  return data.map(mapReporteNomina)
}

/**
 * Obtiene el estado de expedientes por empleado
 */
export async function getReporteExpedientes(filters?: ReporteExpedienteFilters): Promise<ReporteExpediente[]> {
  const params = new URLSearchParams()
  if (filters?.departamentoId) params.append('departamentoId', filters.departamentoId.toString())
  if (filters?.estado) params.append('estado', filters.estado)

  const response = await api.get(`/reportes/Expedientes?${params.toString()}`)
  const data = Array.isArray(response.data) ? response.data : []
  return data.map(mapReporteExpediente)
}

/**
 * Obtiene estadísticas por tipo de documento
 */
export async function getReportePorTipoDocumento(): Promise<ReportePorTipoDocumento[]> {
  const response = await api.get('/reportes/PorTipoDocumento')
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Obtiene documentos entregados por cada empleado
 */
export async function getReporteDocumentosPorEmpleado(): Promise<ReporteDocumentosEmpleado[]> {
  const response = await api.get('/reportes/DocumentosPorEmpleado')
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Obtiene reporte de ajustes manuales
 */
export async function getReporteAjustes(nominaId?: number): Promise<ReporteAjuste[]> {
  const params = nominaId ? `?nominaId=${nominaId}` : ''
  const response = await api.get(`/reportes/Ajustes${params}`)
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Obtiene logs de auditoría
 */
export async function getReporteAuditoria(filters?: ReporteAuditoriaFilters): Promise<ReporteAuditoria[]> {
  const params = new URLSearchParams()
  if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio)
  if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin)
  if (filters?.usuario) params.append('usuario', filters.usuario)
  if (filters?.modulo) params.append('modulo', filters.modulo)

  const response = await api.get(`/reportes/Auditoria?${params.toString()}`)
  return Array.isArray(response.data) ? response.data : []
}

// ==================== EXPORTACIONES PDF ====================

/**
 * Descarga PDF de expedientes
 */
export async function downloadExpedientesPDF(filters?: ReporteExpedienteFilters): Promise<void> {
  const params = new URLSearchParams()
  if (filters?.departamentoId) params.append('departamentoId', filters.departamentoId.toString())

  const response = await api.get(`/reportes/Expedientes/pdf?${params.toString()}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `reporte-expedientes-${new Date().toISOString().split('T')[0]}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga PDF de información académica
 */
export async function downloadInformacionAcademicaPDF(): Promise<void> {
  const response = await api.get('/reportes/InformacionAcademica/pdf', {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `reporte-informacion-academica-${new Date().toISOString().split('T')[0]}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga PDF de ajustes manuales
 */
export async function downloadAjustesPDF(nominaId?: number): Promise<void> {
  const params = nominaId ? `?nominaId=${nominaId}` : ''
  const response = await api.get(`/reportes/Ajustes/pdf${params}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `reporte-ajustes-${new Date().toISOString().split('T')[0]}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga PDF de auditoría
 */
export async function downloadAuditoriaPDF(filters?: ReporteAuditoriaFilters): Promise<void> {
  const params = new URLSearchParams()
  if (filters?.fechaInicio) params.append('fechaInicio', filters.fechaInicio)
  if (filters?.fechaFin) params.append('fechaFin', filters.fechaFin)

  const response = await api.get(`/reportes/Auditoria/pdf?${params.toString()}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `reporte-auditoria-${new Date().toISOString().split('T')[0]}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga PDF resumen de nómina
 */
export async function downloadNominaPDF(nominaId: number): Promise<void> {
  const response = await api.get(`/reportes/nomina/${nominaId}/pdf`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `nomina-${nominaId}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga recibo individual de empleado
 */
export async function downloadReciboEmpleadoPDF(nominaId: number, empleadoId: number): Promise<void> {
  const response = await api.get(`/reportes/nomina/${nominaId}/empleado/${empleadoId}/pdf`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `recibo-nomina-${nominaId}-empleado-${empleadoId}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// ==================== EXPORTACIONES CSV/EXCEL ====================

/**
 * Descarga CSV de empleados
 */
export async function downloadEmpleadosCSV(): Promise<void> {
  const response = await api.get('/reportes/empleados.csv', {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `empleados-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga Excel de empleados
 */
export async function downloadEmpleadosExcel(): Promise<void> {
  const response = await api.get('/reportes/empleados.xlsx', {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `empleados-${new Date().toISOString().split('T')[0]}.xlsx`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga CSV de nómina
 */
export async function downloadNominaCSV(nominaId: number): Promise<void> {
  const response = await api.get(`/reportes/nomina.csv?nominaId=${nominaId}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `nomina-${nominaId}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Descarga Excel de nómina
 */
export async function downloadNominaExcel(nominaId: number): Promise<void> {
  const response = await api.get(`/reportes/nomina.xlsx?nominaId=${nominaId}`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `nomina-${nominaId}.xlsx`)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
