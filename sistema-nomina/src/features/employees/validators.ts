import { z } from 'zod'

// util: sólo dígitos
const digitsOnly = (s: string) => s.replace(/\D+/g, '')

export const employeeCreateSchema = z.object({
  nombreCompleto: z.string().trim().min(3, 'Nombre demasiado corto'),
  correo: z.string().trim().email('Correo inválido'),
  dpi: z.string()
    .transform(digitsOnly)
    .refine(v => /^\d{13}$/.test(v), 'DPI debe tener exactamente 13 dígitos'),
  nit: z.string()
    .transform(digitsOnly)
    .refine(v => /^\d{13}$/.test(v), 'NIT debe tener exactamente 13 dígitos'),
  telefono: z.string()
    .transform(digitsOnly)
    .refine(v => /^\d{7,15}$/.test(v), 'Teléfono debe tener entre 7 y 15 dígitos'),
  direccion: z.string().trim().min(3, 'Dirección muy corta'),
  fechaNacimiento: z.string().refine(v => {
    const d = new Date(v); const now = new Date()
    if (isNaN(d.getTime())) return false
    const age = now.getFullYear() - d.getFullYear()
      - ((now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) ? 1 : 0)
    return age >= 18 && d <= now
  }, 'Debe ser mayor de edad'),
  fechaContratacion: z.string().refine(v => {
    const d = new Date(v); const now = new Date()
    return !isNaN(d.getTime()) && d <= now
  }, 'Fecha de contratación inválida'),
  estadoLaboral: z.enum(['ACTIVO', 'SUSPENDIDO', 'RETIRADO']),
  salarioMensual: z.coerce.number().positive('Salario debe ser mayor que 0'),
  departamentoId: z.coerce.number().int().positive('Departamento requerido'),
  puestoId: z.coerce.number().int().positive('Puesto requerido'),
})
.refine((d) => new Date(d.fechaContratacion) >= new Date(d.fechaNacimiento), {
  message: 'La contratación no puede ser anterior al nacimiento',
  path: ['fechaContratacion'],
})
