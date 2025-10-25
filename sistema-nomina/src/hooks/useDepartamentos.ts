import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { departamentosService } from '../services/departamentosService'
import type { DepartamentoCreateUpdateDto } from '../types/departamento'

export const DEPARTAMENTOS_QUERY_KEY = 'departamentos'

/**
 * Hook para listar todos los departamentos
 */
export function useDepartamentos() {
  return useQuery({
    queryKey: [DEPARTAMENTOS_QUERY_KEY, 'list'],
    queryFn: () => departamentosService.getAll(),
  })
}

/**
 * Hook para obtener un departamento por ID
 */
export function useDepartamento(id: number, enabled = true) {
  return useQuery({
    queryKey: [DEPARTAMENTOS_QUERY_KEY, 'detail', id],
    queryFn: () => departamentosService.getById(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook para obtener puestos activos de un departamento
 */
export function useDepartamentoPuestos(departamentoId: number, enabled = true) {
  return useQuery({
    queryKey: [DEPARTAMENTOS_QUERY_KEY, 'puestos', departamentoId],
    queryFn: () => departamentosService.getPuestos(departamentoId),
    enabled: enabled && !!departamentoId,
  })
}

/**
 * Hook para crear un departamento
 */
export function useCreateDepartamento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: DepartamentoCreateUpdateDto) => departamentosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para actualizar un departamento
 */
export function useUpdateDepartamento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartamentoCreateUpdateDto }) =>
      departamentosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para activar un departamento
 */
export function useActivarDepartamento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => departamentosService.activar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para desactivar un departamento
 */
export function useDesactivarDepartamento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => departamentosService.desactivar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [DEPARTAMENTOS_QUERY_KEY, 'list'] })
    },
  })
}
