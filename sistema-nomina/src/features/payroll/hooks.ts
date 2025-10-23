import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { 
  NominaDTO, 
  NominaFilters, 
  NominasListResponse, 
  NominaCreateDTO, 
  NominaAprobacionDTO,
  NominaStatsDTO,
  NominaDetalleDTO,
  NominaCalculoDTO
} from './api'

import {
  listNominas,
  getNomina,
  getNominaDetalle,
  createNomina,
  calcularNomina,
  aprobarNomina,
  marcarNominaPagada,
  anularNomina,
  deleteNomina,
  getNominaStats,
  downloadNominaReport,
  enviarNominaPorEmail
} from './api'

// Hook para listar nóminas
export function useNominas(filters: NominaFilters = {}) {
  return useQuery<NominasListResponse, Error>({
    queryKey: ['nominas', filters],
    queryFn: () => listNominas(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook personalizado para nóminas con filtros (similar a expedientes)
export function useNominasWithFilters(
  initialFilters: NominaFilters = {}
) {
  const [filters, setFilters] = useState(initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters)

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  const query = useNominas(debouncedFilters)

  const updateFilters = useCallback(
    (newFilters: Partial<NominaFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }))
    },
    []
  )

  const resetFilters = useCallback(() => {
    const defaultFilters: NominaFilters = { page: 1, pageSize: 10 }
    setFilters(defaultFilters)
    setDebouncedFilters(defaultFilters)
  }, [])

  return {
    ...query,
    filters,
    updateFilters,
    resetFilters,
    activeFiltersCount: useMemo(() => {
      let count = 0
      if (filters.q) count++
      if (filters.periodo) count++
      if (filters.tipoNomina) count++
      if (filters.estado) count++
      if (filters.fechaInicio) count++
      if (filters.fechaFin) count++
      return count
    }, [filters])
  }
}

// Hook para obtener nómina específica
export function useNomina(id: number | undefined) {
  return useQuery<NominaDTO, Error>({
    queryKey: ['nomina', id],
    queryFn: () => getNomina(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

// Hook para obtener detalle de nómina (empleados)
export function useNominaDetalle(nominaId: number | undefined) {
  return useQuery<NominaDetalleDTO[], Error>({
    queryKey: ['nomina-detalle', nominaId],
    queryFn: () => getNominaDetalle(nominaId!),
    enabled: !!nominaId,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para estadísticas de nóminas
export function useNominaStats() {
  return useQuery<NominaStatsDTO, Error>({
    queryKey: ['nomina-stats'],
    queryFn: getNominaStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  })
}

// Hook para crear nómina
export function useCreateNomina() {
  const queryClient = useQueryClient()
  
  return useMutation<NominaDTO, Error, NominaCreateDTO>({
    mutationFn: createNomina,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['nominas'] })
      queryClient.invalidateQueries({ queryKey: ['nomina-stats'] })
    },
  })
}

// Hook para calcular nómina (preview)
export function useCalcularNomina() {
  return useMutation<NominaCalculoDTO, Error, NominaCreateDTO>({
    mutationFn: calcularNomina,
    // No invalidamos nada porque es solo un cálculo preview
  })
}

// Hook para aprobar nómina
export function useAprobarNomina() {
  const queryClient = useQueryClient()
  
  return useMutation<number, Error, { id: number; payload: NominaAprobacionDTO }>({
    mutationFn: ({ id, payload }) => aprobarNomina(id, payload),
    onSuccess: (_, { id }) => {
      // Invalidar la nómina específica y la lista
      queryClient.invalidateQueries({ queryKey: ['nomina', id] })
      queryClient.invalidateQueries({ queryKey: ['nominas'] })
      queryClient.invalidateQueries({ queryKey: ['nomina-stats'] })
    },
  })
}

// Hook para marcar como pagada
export function useMarcarNominaPagada() {
  const queryClient = useQueryClient()
  
  return useMutation<number, Error, { id: number; fechaPago?: string }>({
    mutationFn: ({ id, fechaPago }) => marcarNominaPagada(id, fechaPago),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nomina', id] })
      queryClient.invalidateQueries({ queryKey: ['nominas'] })
      queryClient.invalidateQueries({ queryKey: ['nomina-stats'] })
    },
  })
}

// Hook para anular nómina
export function useAnularNomina() {
  const queryClient = useQueryClient()
  
  return useMutation<number, Error, { id: number; motivo?: string }>({
    mutationFn: ({ id, motivo }) => anularNomina(id, motivo),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['nomina', id] })
      queryClient.invalidateQueries({ queryKey: ['nominas'] })
      queryClient.invalidateQueries({ queryKey: ['nomina-stats'] })
    },
  })
}

// Hook para eliminar nómina
export function useDeleteNomina() {
  const queryClient = useQueryClient()
  
  return useMutation<number, Error, number>({
    mutationFn: deleteNomina,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nominas'] })
      queryClient.invalidateQueries({ queryKey: ['nomina-stats'] })
    },
  })
}

// Hook para descargar reporte
export function useDownloadNominaReport() {
  return useMutation<string, Error, { id: number; formato: 'excel' | 'pdf' }>({
    mutationFn: ({ id, formato }) => downloadNominaReport(id, formato),
    onSuccess: (url) => {
      // Abrir el archivo en nueva pestaña o descargar
      if (url.startsWith('blob:')) {
        // Si es un blob, forzar descarga
        const link = document.createElement('a')
        link.href = url
        link.download = 'nomina-reporte'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // Limpiar el objeto URL después de un tiempo
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } else {
        // Si es una URL externa, abrir en nueva pestaña
        window.open(url, '_blank')
      }
    },
  })
}

// Hook para enviar por email
export function useEnviarNominaPorEmail() {
  return useMutation<number, Error, { id: number; emails: string[] }>({
    mutationFn: ({ id, emails }) => enviarNominaPorEmail(id, emails),
  })
}

// Hook combinado para obtener todos los datos necesarios en la página principal
export function useNominaPageData() {
  const stats = useNominaStats()
  const nominas = useNominas({ page: 1, pageSize: 5 }) // Últimas 5 nóminas
  
  return {
    stats,
    recentNominas: nominas,
    isLoading: stats.isLoading || nominas.isLoading,
    error: stats.error || nominas.error,
  }
}

// Imports necesarios para hooks con estado
import { useState, useEffect, useCallback } from 'react'

// Función helper para formatear números como moneda
export function formatCurrency(amount?: number): string {
  if (!amount || amount === 0) return 'Q 0.00'
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(amount)
}

// Función helper para formatear período (ej: "2025-01" -> "Enero 2025")
export function formatPeriodo(periodo: string): string {
  if (!periodo || !periodo.includes('-')) return periodo
  
  const [year, month] = periodo.split('-')
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  const monthIndex = parseInt(month, 10) - 1
  const monthName = monthNames[monthIndex] || month
  
  return `${monthName} ${year}`
}

// Función helper para obtener color del estado
export function getEstadoNominaColor(estado: string): string {
  switch (estado.toUpperCase()) {
    case 'BORRADOR':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    case 'APROBADA':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'PAGADA':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'ANULADA':
      return 'bg-red-100 text-red-700 border-red-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

// Función helper para obtener color del tipo de nómina
export function getTipoNominaColor(tipo: string): string {
  switch (tipo.toUpperCase()) {
    case 'ORDINARIA':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'EXTRAORDINARIA':
      return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'AGUINALDO':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'BONO14':
      return 'bg-orange-100 text-orange-700 border-orange-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}