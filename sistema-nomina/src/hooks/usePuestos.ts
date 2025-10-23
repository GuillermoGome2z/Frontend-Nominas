import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { puestosService } from '../services/puestosService'
import type { PuestoCreateUpdateDto } from '../types/puesto'

export const PUESTOS_QUERY_KEY = 'puestos'

/**
 * Hook para listar puestos con filtros
 */
export function usePuestos(filters?: { departamentoId?: number; soloActivos?: boolean }) {
  return useQuery({
    queryKey: [PUESTOS_QUERY_KEY, 'list', filters],
    queryFn: () => puestosService.getAll(filters),
  })
}

/**
 * Hook para obtener un puesto por ID
 */
export function usePuesto(id: number, enabled = true) {
  return useQuery({
    queryKey: [PUESTOS_QUERY_KEY, 'detail', id],
    queryFn: () => puestosService.getById(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook para crear un puesto
 */
export function useCreatePuesto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: PuestoCreateUpdateDto) => puestosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para actualizar un puesto
 */
export function useUpdatePuesto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PuestoCreateUpdateDto }) =>
      puestosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para activar un puesto
 */
export function useActivarPuesto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => puestosService.activar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para desactivar un puesto
 */
export function useDesactivarPuesto() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => puestosService.desactivar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [PUESTOS_QUERY_KEY, 'list'] })
    },
  })
}
