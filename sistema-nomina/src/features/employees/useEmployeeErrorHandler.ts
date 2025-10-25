import { useAlert } from '@/components/ui/AlertContext'
import { parseValidationError } from './api'

export function useEmployeeErrorHandler() {
  const { showSuccess, showWarning, showInfo, showError } = useAlert()

  const handleError = (e: any, context?: string) => {
    const status = e?.response?.status as number | undefined

    // Errores de validación (400/422)
    if (status === 400 || status === 422) {
      const msg = parseValidationError(e)
      showWarning(msg ?? 'Hay errores de validación. Revisa los campos.')
      if (context) console.warn(`Validación ${context} (${status}):`, e?.response?.data ?? e)
      return
    }

    // Recurso no encontrado (404)
    if (status === 404) {
      showInfo('Recurso no encontrado.')
      if (context) console.warn(`404 ${context}:`, e?.response?.data ?? e)
      return
    }

    // Archivo muy grande (413)
    if (status === 413) {
      showError('Archivo excede el tamaño permitido.')
      if (context) console.warn(`413 ${context}:`, e?.response?.data ?? e)
      return
    }

    // Error genérico
    const requestId = e?.response?.headers?.['x-request-id'] ?? e?.response?.data?.requestId
    const generic = e?.response?.data?.message ?? e?.message ?? 'Ocurrió un error inesperado.'
    const errorMsg = requestId ? `${generic} (ID: ${String(requestId)})` : generic
    
    showError(errorMsg)
    if (context) console.error(`Error ${context}:`, e?.response?.data ?? e)
  }

  return {
    handleError,
    success: showSuccess,
    warning: showWarning,
    info: showInfo,
    error: showError
  }
}