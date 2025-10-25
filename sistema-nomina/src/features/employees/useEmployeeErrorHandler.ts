import { useToast } from '../../components/ui/Toast'
import { parseValidationError } from './api'

export function useEmployeeErrorHandler() {
  const { success, warning, info, error: toastError } = useToast()

  const handleError = (e: any, context?: string) => {
    const status = e?.response?.status as number | undefined

    // Errores de validación (400/422)
    if (status === 400 || status === 422) {
      const msg = parseValidationError(e)
      warning(msg ?? 'Hay errores de validación. Revisa los campos.')
      if (context) console.warn(`Validación ${context} (${status}):`, e?.response?.data ?? e)
      return
    }

    // Recurso no encontrado (404)
    if (status === 404) {
      info('Recurso no encontrado.')
      if (context) console.warn(`404 ${context}:`, e?.response?.data ?? e)
      return
    }

    // Archivo muy grande (413)
    if (status === 413) {
      toastError('Archivo excede el tamaño permitido.')
      if (context) console.warn(`413 ${context}:`, e?.response?.data ?? e)
      return
    }

    // Error genérico
    const requestId = e?.response?.headers?.['x-request-id'] ?? e?.response?.data?.requestId
    const generic = e?.response?.data?.message ?? e?.message ?? 'Ocurrió un error inesperado.'
    const errorMsg = requestId ? `${generic} (ID: ${String(requestId)})` : generic
    
    toastError(errorMsg)
    if (context) console.error(`Error ${context}:`, e?.response?.data ?? e)
  }

  return {
    handleError,
    success,
    warning,
    info,
    toastError
  }
}