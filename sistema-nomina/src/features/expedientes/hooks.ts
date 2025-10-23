import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExpedientes,
  getExpediente,
  createExpediente,
  updateExpediente,
  deleteExpediente,
  getExpedienteDownloadUrl,
  toggleExpedienteEstado,
  getTiposDocumento,
  getExpedientesStats,
  type ExpedienteFilter,
  type ExpedienteCreateDTO,
  type ExpedienteUpdateDTO,
  type ExpedientesResponse,
  type ExpedienteDTO,
  type TipoDocumentoDTO
} from './api'

// Hook principal para obtener expedientes con filtros y paginación
export function useExpedientes(
  filters: ExpedienteFilter = {}, 
  page: number = 1, 
  pageSize: number = 10
) {
  return useQuery<ExpedientesResponse, Error>({
    queryKey: ['expedientes', filters, page, pageSize] as const,
    queryFn: () => getExpedientes(filters, page, pageSize),
    staleTime: 2 * 60 * 1000, // 2 minutos
    placeholderData: (prev) => prev,
  })
}

// Hook para obtener un expediente específico
export function useExpediente(id: number, enabled: boolean = true) {
  return useQuery<ExpedienteDTO, Error>({
    queryKey: ['expediente', id] as const,
    queryFn: () => getExpediente(id),
    enabled: enabled && id > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener tipos de documento
export function useTiposDocumento() {
  return useQuery<TipoDocumentoDTO[], Error>({
    queryKey: ['tiposDocumento'] as const,
    queryFn: getTiposDocumento,
    staleTime: 10 * 60 * 1000, // 10 minutos - datos que cambian poco
  })
}

// Hook para obtener estadísticas
export function useExpedientesStats() {
  return useQuery({
    queryKey: ['expedientesStats'] as const,
    queryFn: getExpedientesStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para crear expediente (upload)
export function useCreateExpediente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: ExpedienteCreateDTO) => createExpediente(data),
    onSuccess: (newExpediente) => {
      // Invalidar todas las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
      queryClient.invalidateQueries({ queryKey: ['expedientesStats'] })
      
      // Si tenemos el empleado específico, invalidar sus documentos también
      queryClient.invalidateQueries({ 
        queryKey: ['employeeDocs', newExpediente.empleadoId] 
      })
    },
  })
}

// Hook para actualizar expediente
export function useUpdateExpediente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ExpedienteUpdateDTO }) => 
      updateExpediente(id, data),
    onSuccess: (updatedExpediente) => {
      // Actualizar cache del expediente específico
      queryClient.setQueryData(['expediente', updatedExpediente.id], updatedExpediente)
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
      queryClient.invalidateQueries({ queryKey: ['expedientesStats'] })
    },
  })
}

// Hook para eliminar expediente
export function useDeleteExpediente() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deleteExpediente(id),
    onSuccess: (_, deletedId) => {
      // Remover del cache específico
      queryClient.removeQueries({ queryKey: ['expediente', deletedId] })
      
      // Invalidar listas
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
      queryClient.invalidateQueries({ queryKey: ['expedientesStats'] })
    },
  })
}

// Hook para toggle estado (archivar/desarchivar)
export function useToggleExpedienteEstado() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => toggleExpedienteEstado(id),
    onSuccess: (updatedExpediente) => {
      // Actualizar cache del expediente específico
      queryClient.setQueryData(['expediente', updatedExpediente.id], updatedExpediente)
      
      // Invalidar listas para reflejar cambios
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
      queryClient.invalidateQueries({ queryKey: ['expedientesStats'] })
    },
  })
}

// Hook para descargar documento
export function useDownloadExpediente() {
  return useMutation({
    mutationFn: async (id: number) => {
      const { url } = await getExpedienteDownloadUrl(id)
      // Abrir en nueva pestaña
      window.open(url, '_blank', 'noopener,noreferrer')
      return url
    },
  })
}

// Hook personalizado para manejar filtros con debounce
import { useState, useEffect } from 'react'

export function useExpedientesWithFilters(initialFilters: ExpedienteFilter = {}) {
  const [filters, setFilters] = useState<ExpedienteFilter>(initialFilters)
  const [debouncedFilters, setDebouncedFilters] = useState<ExpedienteFilter>(initialFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters)
      setPage(1) // Resetear página cuando cambian filtros
    }, 300)

    return () => clearTimeout(timer)
  }, [filters])

  const query = useExpedientes(debouncedFilters, page, pageSize)

  const updateFilters = (newFilters: Partial<ExpedienteFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters({})
  }

  return {
    // Datos
    ...query,
    
    // Estado de filtros y paginación
    filters,
    debouncedFilters,
    page,
    pageSize,
    
    // Acciones
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
  }
}