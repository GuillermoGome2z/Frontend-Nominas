/**
 * hooks/useReports.ts
 * React Query hooks para el módulo de Reportes
 */

import { useQuery } from '@tanstack/react-query'
import {
  getReporteGeneral,
  getReporteNominas,
  getReporteExpedientes,
  getReportePorTipoDocumento,
  getReporteDocumentosPorEmpleado,
  getReporteAjustes,
  getReporteAuditoria,
} from '../api/reports.api'
import type {
  ReporteGeneralFilters,
  ReporteNominaFilters,
  ReporteExpedienteFilters,
  ReporteAuditoriaFilters,
} from '../types/Reports'

/**
 * Hook para obtener el reporte general
 */
export function useReporteGeneral(filters?: ReporteGeneralFilters) {
  return useQuery({
    queryKey: ['reportes', 'general', filters],
    queryFn: () => getReporteGeneral(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obtener el listado de nóminas
 */
export function useReporteNominas(filters?: ReporteNominaFilters) {
  return useQuery({
    queryKey: ['reportes', 'nominas', filters],
    queryFn: () => getReporteNominas(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para obtener el estado de expedientes
 */
export function useReporteExpedientes(filters?: ReporteExpedienteFilters) {
  return useQuery({
    queryKey: ['reportes', 'expedientes', filters],
    queryFn: () => getReporteExpedientes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obtener estadísticas por tipo de documento
 */
export function useReportePorTipoDocumento() {
  return useQuery({
    queryKey: ['reportes', 'por-tipo-documento'],
    queryFn: getReportePorTipoDocumento,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obtener documentos por empleado
 */
export function useReporteDocumentosPorEmpleado() {
  return useQuery({
    queryKey: ['reportes', 'documentos-por-empleado'],
    queryFn: getReporteDocumentosPorEmpleado,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obtener ajustes manuales
 */
export function useReporteAjustes(nominaId?: number) {
  return useQuery({
    queryKey: ['reportes', 'ajustes', nominaId],
    queryFn: () => getReporteAjustes(nominaId),
    enabled: nominaId !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para obtener logs de auditoría
 */
export function useReporteAuditoria(filters?: ReporteAuditoriaFilters) {
  return useQuery({
    queryKey: ['reportes', 'auditoria', filters],
    queryFn: () => getReporteAuditoria(filters),
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}
