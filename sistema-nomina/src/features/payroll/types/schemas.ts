/**
 * types/schemas.ts
 * Esquemas de validación Zod para Nómina
 */

import { z } from 'zod'

// ==================== MENSAJES DE ERROR ====================

export const VALIDATION_MESSAGES = {
  NOMBRE_REQUIRED: 'El nombre del periodo es requerido',
  NOMBRE_MIN: 'El nombre debe tener al menos 3 caracteres',
  TIPO_REQUIRED: 'Debe seleccionar un tipo de periodo',
  FECHA_INICIO_REQUIRED: 'La fecha de inicio es requerida',
  FECHA_FIN_REQUIRED: 'La fecha de fin es requerida',
  FECHA_PAGO_REQUIRED: 'La fecha de pago es requerida',
  FECHA_INVALID: 'Fecha inválida',
  FECHA_FIN_BEFORE_INICIO: 'La fecha de fin debe ser posterior a la fecha de inicio',
  FECHA_PAGO_BEFORE_FIN: 'La fecha de pago debe ser posterior a la fecha de fin',
  MONTO_REQUIRED: 'El monto es requerido',
  MONTO_MIN: 'El monto debe ser mayor o igual a 0',
  MOTIVO_REQUIRED: 'El motivo del ajuste es requerido',
  MOTIVO_MIN: 'El motivo debe tener al menos 10 caracteres',
  CONCEPTO_REQUIRED: 'Debe seleccionar un concepto',
  PERIODO_CERRADO: 'El periodo está cerrado y no se pueden hacer cambios'
}

// ==================== SCHEMA DE PERIODO ====================

export const periodFormSchema = z.object({
  nombre: z
    .string({ message: VALIDATION_MESSAGES.NOMBRE_REQUIRED })
    .min(3, VALIDATION_MESSAGES.NOMBRE_MIN)
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  
  tipo: z
    .enum(['Quincenal', 'Mensual', 'Semanal'] as const, {
      message: VALIDATION_MESSAGES.TIPO_REQUIRED
    }),
  
  fechaInicio: z
    .string({ message: VALIDATION_MESSAGES.FECHA_INICIO_REQUIRED })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: VALIDATION_MESSAGES.FECHA_INVALID
    }),
  
  fechaFin: z
    .string({ message: VALIDATION_MESSAGES.FECHA_FIN_REQUIRED })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: VALIDATION_MESSAGES.FECHA_INVALID
    }),
  
  fechaPago: z
    .string({ message: VALIDATION_MESSAGES.FECHA_PAGO_REQUIRED })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: VALIDATION_MESSAGES.FECHA_INVALID
    })
}).refine(
  (data) => new Date(data.fechaFin) >= new Date(data.fechaInicio),
  {
    message: VALIDATION_MESSAGES.FECHA_FIN_BEFORE_INICIO,
    path: ['fechaFin']
  }
).refine(
  (data) => new Date(data.fechaPago) >= new Date(data.fechaFin),
  {
    message: VALIDATION_MESSAGES.FECHA_PAGO_BEFORE_FIN,
    path: ['fechaPago']
  }
)

export type PeriodFormSchema = z.infer<typeof periodFormSchema>

// ==================== SCHEMA DE AJUSTE ====================

export const adjustmentFormSchema = z.object({
  lineaId: z
    .number({ message: 'Línea de nómina requerida' })
    .positive(),
  
  conceptoId: z
    .number({ message: VALIDATION_MESSAGES.CONCEPTO_REQUIRED })
    .positive(VALIDATION_MESSAGES.CONCEPTO_REQUIRED),
  
  monto: z
    .number({ message: VALIDATION_MESSAGES.MONTO_REQUIRED })
    .min(0, VALIDATION_MESSAGES.MONTO_MIN)
    .max(1000000, 'El monto no puede exceder GTQ 1,000,000'),
  
  motivo: z
    .string({ message: VALIDATION_MESSAGES.MOTIVO_REQUIRED })
    .min(10, VALIDATION_MESSAGES.MOTIVO_MIN)
    .max(500, 'El motivo no puede exceder 500 caracteres')
    .trim()
})

export type AdjustmentFormSchema = z.infer<typeof adjustmentFormSchema>

// ==================== SCHEMAS DE FILTROS ====================

export const periodFiltersSchema = z.object({
  q: z.string().optional(),
  tipo: z.enum(['Quincenal', 'Mensual', 'Semanal'] as const).optional(),
  estado: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  page: z.number().positive().default(1),
  pageSize: z.number().positive().max(100).default(10)
})

// ==================== HELPERS DE VALIDACIÓN ====================

export function validatePeriodDates(
  fechaInicio: string,
  fechaFin: string,
  fechaPago: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  const inicio = new Date(fechaInicio)
  const fin = new Date(fechaFin)
  const pago = new Date(fechaPago)
  
  if (isNaN(inicio.getTime())) {
    errors.push('Fecha de inicio inválida')
  }
  
  if (isNaN(fin.getTime())) {
    errors.push('Fecha de fin inválida')
  }
  
  if (isNaN(pago.getTime())) {
    errors.push('Fecha de pago inválida')
  }
  
  if (errors.length === 0) {
    if (fin < inicio) {
      errors.push(VALIDATION_MESSAGES.FECHA_FIN_BEFORE_INICIO)
    }
    
    if (pago < fin) {
      errors.push(VALIDATION_MESSAGES.FECHA_PAGO_BEFORE_FIN)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export function canModifyPeriod(estado: string): boolean {
  return estado !== 'Cerrado'
}

// ==================== BACKEND ERROR MAPPING ====================

export interface BackendError {
  codigo?: string
  mensaje?: string
  errores?: Record<string, string[]>
}

export function mapBackendError(error: BackendError): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (error.codigo === 'PERIODO_CERRADO') {
    errors._form = VALIDATION_MESSAGES.PERIODO_CERRADO
  }
  
  if (error.codigo === 'FECHAS_SOLAPADAS') {
    errors.fechaInicio = 'Las fechas se solapan con otro periodo existente'
  }
  
  if (error.errores) {
    Object.entries(error.errores).forEach(([field, messages]) => {
      errors[field.toLowerCase()] = messages[0]
    })
  }
  
  return errors
}
