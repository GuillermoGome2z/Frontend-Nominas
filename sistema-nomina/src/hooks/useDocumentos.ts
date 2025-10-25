import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentosService } from '../services/documentosService'

export const DOCUMENTOS_QUERY_KEY = 'documentos'

/**
 * Hook para obtener documentos de un empleado
 */
export function useDocumentosEmpleado(empleadoId: number, enabled = true) {
  return useQuery({
    queryKey: [DOCUMENTOS_QUERY_KEY, 'empleado', empleadoId],
    queryFn: () => documentosService.getByEmpleado(empleadoId),
    enabled: enabled && !!empleadoId,
  })
}

/**
 * Hook para subir un documento
 */
export function useUploadDocumento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      empleadoId,
      file,
      tipoDocumento,
    }: {
      empleadoId: number
      file: File
      tipoDocumento?: string
    }) => documentosService.upload(empleadoId, file, tipoDocumento),
    onSuccess: (_, { empleadoId }) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTOS_QUERY_KEY, 'empleado', empleadoId] })
    },
  })
}

/**
 * Hook para eliminar un documento
 */
export function useDeleteDocumento() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id }: { id: number; empleadoId: number }) =>
      documentosService.delete(id),
    onSuccess: (_, { empleadoId }) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTOS_QUERY_KEY, 'empleado', empleadoId] })
    },
  })
}
