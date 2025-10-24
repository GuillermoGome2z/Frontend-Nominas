/**
 * hooks/useExpedientes.ts
 * React Query hooks para el módulo de Expedientes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listExpedientes,
  getExpediente,
  getDocumentosChecklist,
  getExpedienteStats,
  listDocumentos,
  getDocumento,
  subirDocumento,
  actualizarDocumento,
  eliminarDocumento,
  listTiposDocumento,
} from '../api/expedientes.api'
import type {
  ExpedienteFilters,
  DocumentoFilters,
  SubirDocumentoDto,
  ActualizarDocumentoDto,
} from '../types/Expediente'

// ==================== EXPEDIENTES ====================

/**
 * Hook para listar expedientes
 */
export function useExpedientes(filters: ExpedienteFilters = {}) {
  return useQuery({
    queryKey: ['expedientes', 'list', filters],
    queryFn: () => listExpedientes(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para obtener un expediente específico
 */
export function useExpediente(empleadoId: number | null) {
  return useQuery({
    queryKey: ['expedientes', empleadoId],
    queryFn: () => getExpediente(empleadoId!),
    enabled: empleadoId !== null,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obtener checklist de documentos
 */
export function useDocumentosChecklist(empleadoId: number | null) {
  return useQuery({
    queryKey: ['expedientes', empleadoId, 'checklist'],
    queryFn: () => getDocumentosChecklist(empleadoId!),
    enabled: empleadoId !== null,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para obtener estadísticas de expedientes
 */
export function useExpedienteStats() {
  return useQuery({
    queryKey: ['expedientes', 'stats'],
    queryFn: getExpedienteStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// ==================== DOCUMENTOS ====================

/**
 * Hook para listar documentos
 */
export function useDocumentos(filters: DocumentoFilters = {}) {
  return useQuery({
    queryKey: ['documentos', 'list', filters],
    queryFn: () => listDocumentos(filters),
    enabled: !!filters.empleadoId, // Solo cargar si hay empleadoId
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

/**
 * Hook para obtener un documento específico
 */
export function useDocumento(documentoId: number | null) {
  return useQuery({
    queryKey: ['documentos', documentoId],
    queryFn: () => getDocumento(documentoId!),
    enabled: documentoId !== null,
  })
}

/**
 * Hook para subir un documento
 */
export function useSubirDocumento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubirDocumentoDto) => subirDocumento(data),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
      queryClient.invalidateQueries({ queryKey: ['documentos', 'list', { empleadoId: variables.empleadoId }] })
    },
  })
}

/**
 * Hook para actualizar un documento
 */
export function useActualizarDocumento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ documentoId, data }: { documentoId: number; data: ActualizarDocumentoDto }) =>
      actualizarDocumento(documentoId, data),
    onSuccess: (documento) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['documentos', documento.id] })
      queryClient.invalidateQueries({ queryKey: ['documentos', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
    },
  })
}

/**
 * Hook para eliminar un documento
 */
export function useEliminarDocumento() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (documentoId: number) => eliminarDocumento(documentoId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      queryClient.invalidateQueries({ queryKey: ['expedientes'] })
    },
  })
}

// ==================== TIPOS DE DOCUMENTO ====================

/**
 * Hook para listar tipos de documento
 */
export function useTiposDocumento() {
  return useQuery({
    queryKey: ['tipos-documento'],
    queryFn: listTiposDocumento,
    staleTime: 30 * 60 * 1000, // 30 minutos (raramente cambia)
  })
}
