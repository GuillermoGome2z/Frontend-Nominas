import type { AxiosError } from 'axios'

export type HttpMapped =
  | { kind: 'success'; code: 200 | 201 | 204; message: string }
  | { kind: 'client'; code: 400 | 401 | 403 | 404 | 413 | 422; message: string; fieldErrors?: Record<string, string> }
  | { kind: 'server'; code: number; message: string; requestId?: string }

export function mapAxiosError(err: unknown): HttpMapped {
  const ax = err as AxiosError<any>
  const status = ax?.response?.status

  // SERVER (5xx / unknown)
  if (!status || status >= 500) {
    const requestId =
      (ax?.response?.headers?.['x-request-id'] as string | undefined) ??
      (ax?.response?.data?.requestId as string | undefined)
    return {
      kind: 'server',
      code: status ?? 500,
      message: ax?.response?.data?.message ?? 'Ocurrió un error inesperado en el servidor.',
      requestId
    }
  }

  // CLIENT
  if (status === 400 || status === 422) {
    const fieldErrors: Record<string, string> | undefined =
      ax?.response?.data?.errors // { field: "msg" } ó [{field,msg}]
        ? normalizeFieldErrors(ax.response.data.errors)
        : undefined

    return {
      kind: 'client',
      code: status,
      message: ax?.response?.data?.message ?? 'Hay errores de validación. Revisa los campos.',
      fieldErrors
    }
  }

  if (status === 401) return { kind: 'client', code: 401, message: 'Sesión expirada. Vuelve a iniciar sesión.' }
  if (status === 403) return { kind: 'client', code: 403, message: 'No tienes permisos para esta acción.' }
  if (status === 404) return { kind: 'client', code: 404, message: 'Recurso no encontrado.' }
  if (status === 413) return { kind: 'client', code: 413, message: 'Archivo excede el tamaño permitido.' }

  // 2xx manejos puntuales (se usan más en respuestas éxito, aquí solo por simetría)
  if (status === 200) return { kind: 'success', code: 200, message: 'Operación exitosa.' }
  if (status === 201) return { kind: 'success', code: 201, message: 'Creado con éxito.' }
  if (status === 204) return { kind: 'success', code: 204, message: 'Sin contenido para mostrar/exportar.' }

  return { kind: 'server', code: status, message: 'Error no clasificado.' }
}

function normalizeFieldErrors(raw: any): Record<string, string> {
  if (Array.isArray(raw)) {
    const map: Record<string, string> = {}
    for (const e of raw) {
      if (e?.field && e?.message) map[e.field] = String(e.message)
    }
    return map
  }
  if (raw && typeof raw === 'object') {
    const out: Record<string, string> = {}
    for (const k of Object.keys(raw)) out[k] = String(raw[k])
    return out
  }
  return {}
}
