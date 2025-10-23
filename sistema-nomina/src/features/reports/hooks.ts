import { useQuery, useMutation } from '@tanstack/react-query'
import {
  generarReporteGeneral,
  exportarReporteExcel,
  exportarReportePDF,
  type ReportFilter,
  type ReportesResponse
} from './api'

// Hook principal para obtener reportes
export function useReportes(filters: ReportFilter) {
  return useQuery<ReportesResponse, Error>({
    queryKey: ['reportes', filters] as const,
    queryFn: () => generarReporteGeneral(filters),
    staleTime: 60_000, // Los reportes pueden ser cache por 1 minuto
    placeholderData: (prev) => prev,
  })
}

// Hook para exportar a Excel
export function useExportExcel() {
  return useMutation({
    mutationFn: (filters: ReportFilter) => exportarReporteExcel(filters),
  })
}

// Hook para exportar a PDF
export function useExportPDF() {
  return useMutation({
    mutationFn: (filters: ReportFilter) => exportarReportePDF(filters),
  })
}