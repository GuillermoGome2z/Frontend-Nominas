// src/lib/mapBackendValidation.ts
import type { AxiosError } from 'axios'
type FieldErrors = Record<string, string>

export function extractFieldErrors(err: unknown): FieldErrors | null {
  const ax = err as AxiosError<any>
  const data = ax?.response?.data
  if (!data) return null

  // ASP.NET Core ProblemDetails + ModelState: { errors: { Field: ["msg1","msg2"], ... } }
  if (data.errors && typeof data.errors === 'object') {
    const out: FieldErrors = {}
    for (const k of Object.keys(data.errors)) {
      const arr = data.errors[k]
      if (Array.isArray(arr) && arr.length) out[k] = String(arr[0])
    }
    return Object.keys(out).length ? out : null
  }

  // Alternativa: { field: "dpi", message: "..." } ó [{field,message}]
  if (Array.isArray(data)) {
    const out: FieldErrors = {}
    for (const e of data) if (e?.field && e?.message) out[e.field] = String(e.message)
    return Object.keys(out).length ? out : null
  }
  if (data.field && data.message) return { [data.field]: String(data.message) }

  // Mensaje plano (no asignable a un campo): lo puedes usar como toast en el caller
  return null
}
