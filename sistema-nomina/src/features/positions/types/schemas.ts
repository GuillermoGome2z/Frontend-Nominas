/**
 * types/schemas.ts
 * Esquemas de validación Zod para Puestos
 */

import { z } from 'zod'
import { SALARIO_MIN, SALARIO_MAX } from './Position'

// ==================== MENSAJES DE ERROR ====================

export const VALIDATION_MESSAGES = {
  NOMBRE_REQUIRED: 'El nombre del puesto es requerido',
  NOMBRE_MIN: 'El nombre debe tener al menos 3 caracteres',
  NOMBRE_MAX: 'El nombre no puede exceder 100 caracteres',
  CODIGO_MAX: 'El código no puede exceder 20 caracteres',
  CODIGO_DUPLICATE: 'Ya existe un puesto con este código',
  SALARIO_REQUIRED: 'El salario base es requerido',
  SALARIO_POSITIVE: 'El salario debe ser mayor a 0',
  SALARIO_MIN: `El salario debe ser al menos GTQ ${SALARIO_MIN.toLocaleString()}`,
  SALARIO_MAX: `El salario no puede exceder GTQ ${SALARIO_MAX.toLocaleString()}`,
  DEPARTAMENTO_REQUIRED: 'Debe seleccionar un departamento',
  JORNADA_INVALID: 'Jornada no válida',
  HAS_EMPLOYEES: 'No se puede desactivar: hay empleados activos en este puesto'
}

// ==================== SCHEMA PRINCIPAL ====================

export const positionFormSchema = z.object({
  nombre: z
    .string({ message: VALIDATION_MESSAGES.NOMBRE_REQUIRED })
    .min(3, VALIDATION_MESSAGES.NOMBRE_MIN)
    .max(100, VALIDATION_MESSAGES.NOMBRE_MAX)
    .trim(),
  
  codigo: z
    .string()
    .max(20, VALIDATION_MESSAGES.CODIGO_MAX)
    .trim()
    .optional()
    .or(z.literal('')),
  
  salarioBase: z
    .number({ message: VALIDATION_MESSAGES.SALARIO_REQUIRED })
    .positive(VALIDATION_MESSAGES.SALARIO_POSITIVE)
    .min(SALARIO_MIN, VALIDATION_MESSAGES.SALARIO_MIN)
    .max(SALARIO_MAX, VALIDATION_MESSAGES.SALARIO_MAX),
  
  departamentoId: z
    .number({ message: VALIDATION_MESSAGES.DEPARTAMENTO_REQUIRED })
    .positive(VALIDATION_MESSAGES.DEPARTAMENTO_REQUIRED),
  
  jornada: z
    .enum(['COMPLETA', 'PARCIAL', 'MIXTA'] as const)
    .optional(),
  
  descripcion: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),
  
  activo: z.boolean().default(true)
})

export type PositionFormSchema = z.infer<typeof positionFormSchema>

// ==================== SCHEMAS DE FILTROS ====================

export const positionFiltersSchema = z.object({
  q: z.string().optional(),
  departamentoId: z.number().positive().optional(),
  activo: z.boolean().optional(),
  salarioMin: z.number().positive().optional(),
  salarioMax: z.number().positive().optional(),
  page: z.number().positive().default(1),
  pageSize: z.number().positive().max(100).default(10)
})

// ==================== VALIDACIÓN ASYNC DE CÓDIGO ÚNICO ====================

/**
 * Valida si el código del puesto es único
 * Se debe llamar manualmente en el formulario
 */
export async function validateUniqueCode(
  codigo: string,
  _currentPositionId?: number
): Promise<boolean> {
  if (!codigo || codigo.trim() === '') return true
  
  try {
    // TODO: Implementar llamada al backend
    // const response = await api.get(`/puestos/check-codigo?codigo=${codigo}&excludeId=${currentPositionId}`)
    // return response.data.isUnique
    
    // Mock por ahora
    return true
  } catch (error) {
    console.error('Error validando código:', error)
    return false
  }
}

// ==================== HELPERS DE VALIDACIÓN ====================

export function formatSalario(value: number): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ'
  }).format(value)
}

export function parseSalarioInput(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

// ==================== BACKEND ERROR MAPPING ====================

export interface BackendError {
  codigo?: string
  mensaje?: string
  errores?: Record<string, string[]>
}

export function mapBackendError(error: BackendError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  // Errores específicos por código
  if (error.codigo === 'DUPLICATE_CODIGO') {
    errors.codigo = VALIDATION_MESSAGES.CODIGO_DUPLICATE
  }
  
  if (error.codigo === 'HAS_EMPLOYEES') {
    errors._form = VALIDATION_MESSAGES.HAS_EMPLOYEES
  }
  
  // Errores de validación del backend
  if (error.errores) {
    Object.entries(error.errores).forEach(([field, messages]) => {
      errors[field.toLowerCase()] = messages[0]
    })
  }
  
  return errors
}
