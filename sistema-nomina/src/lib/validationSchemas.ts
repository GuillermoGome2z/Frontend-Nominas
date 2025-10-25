import { z } from 'zod'

// ==================== Empleado Validation ====================

export const EmpleadoSchema = z.object({
  nombreCompleto: z
    .string()
    .trim()
    .min(1, 'El nombre completo es requerido')
    .max(200, 'El nombre es demasiado largo'),
  
  dpi: z.string().optional(),
  nit: z.string().optional(),
  correo: z.string().email('Correo inválido').optional().or(z.literal('')),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  
  fechaNacimiento: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true
        const d = new Date(date)
        return !isNaN(d.getTime())
      },
      { message: 'Fecha inválida' }
    ),
  
  fechaContratacion: z
    .string()
    .min(1, 'La fecha de contratación es requerida')
    .refine(
      (date) => {
        const d = new Date(date)
        return !isNaN(d.getTime()) && d <= new Date()
      },
      { message: 'La fecha de contratación no puede ser futura' }
    ),
  
  salarioMensual: z
    .number({ message: 'El salario es requerido' })
    .min(0, 'El salario debe ser mayor o igual a 0'),
  
  departamentoId: z.number().optional(),
  puestoId: z.number().optional(),
})

export type EmpleadoFormValues = z.infer<typeof EmpleadoSchema>

// ==================== Estado Laboral Validation ====================

export const CambiarEstadoSchema = z.object({
  estadoLaboral: z.enum(['ACTIVO', 'SUSPENDIDO', 'RETIRADO'], {
    message: 'El estado es requerido',
  }),
})

export type CambiarEstadoFormValues = z.infer<typeof CambiarEstadoSchema>

// ==================== Departamento Validation ====================

export const DepartamentoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del departamento es requerido')
    .max(100, 'El nombre es demasiado largo'),
})

export type DepartamentoFormValues = z.infer<typeof DepartamentoSchema>

// ==================== Puesto Validation ====================

export const PuestoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del puesto es requerido')
    .max(100, 'El nombre es demasiado largo'),
  
  salarioBase: z
    .number({ message: 'El salario base es requerido' })
    .min(0, 'El salario debe ser mayor o igual a 0'),
  
  departamentoId: z.number().optional(),
})

export type PuestoFormValues = z.infer<typeof PuestoSchema>

// ==================== Helper: Mapear errores 422 de backend ====================

export function mapValidationErrors(errors?: Record<string, string[]>): Record<string, { message: string }> {
  if (!errors) return {}
  
  const mapped: Record<string, { message: string }> = {}
  
  for (const [field, messages] of Object.entries(errors)) {
    // Convertir primera letra a minúscula para match con react-hook-form
    const fieldName = field.charAt(0).toLowerCase() + field.slice(1)
    mapped[fieldName] = { message: messages[0] || 'Error de validación' }
  }
  
  return mapped
}
