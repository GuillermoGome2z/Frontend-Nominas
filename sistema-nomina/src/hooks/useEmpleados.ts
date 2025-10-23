import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { empleadosService } from '../services/empleadosService'
import type {
  EmpleadoFilters,
  EmpleadoCreateUpdateDto,
  CambiarEstadoEmpleadoDto,
} from '../types/empleado'

export const EMPLEADOS_QUERY_KEY = 'empleados'

/**
 * Hook para listar empleados con paginación y filtros
 */
export function useEmpleados(filters?: EmpleadoFilters) {
  return useQuery({
    queryKey: [EMPLEADOS_QUERY_KEY, 'list', filters],
    queryFn: () => empleadosService.getAll(filters),
  })
}

/**
 * Hook para obtener un empleado por ID
 */
export function useEmpleado(id: number, enabled = true) {
  return useQuery({
    queryKey: [EMPLEADOS_QUERY_KEY, 'detail', id],
    queryFn: () => empleadosService.getById(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook para crear un empleado
 */
export function useCreateEmpleado() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: EmpleadoCreateUpdateDto) => empleadosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLEADOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para actualizar un empleado
 */
export function useUpdateEmpleado() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmpleadoCreateUpdateDto }) =>
      empleadosService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLEADOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [EMPLEADOS_QUERY_KEY, 'list'] })
    },
  })
}

/**
 * Hook para cambiar estado de un empleado
 */
export function useCambiarEstadoEmpleado() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CambiarEstadoEmpleadoDto }) =>
      empleadosService.cambiarEstado(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [EMPLEADOS_QUERY_KEY, 'detail', id] })
      queryClient.invalidateQueries({ queryKey: [EMPLEADOS_QUERY_KEY, 'list'] })
    },
  })
}
