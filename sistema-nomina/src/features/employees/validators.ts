import { z } from 'zod';

export const employeeSchema = z.object({
  nombreCompleto: z.string().min(3, 'Mínimo 3 caracteres'),
  dpi: z.string().min(6, 'DPI inválido'),
  nit: z.string().min(6, 'NIT inválido'),
  correo: z.string().email('Correo inválido'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  fechaContratacion: z.string().optional(), // ISO (YYYY-MM-DD)
  fechaNacimiento: z.string().optional(),   // ISO
  estadoLaboral: z.enum(['ACTIVO', 'SUSPENDIDO', 'RETIRADO']).optional(),

  // 👇 MUY IMPORTANTE: usar coerce para que Zod convierta string->number y no quede "unknown"
  salarioMensual: z.coerce.number().min(0).optional(),
  departamentoId: z.coerce.number().int().positive().optional(),
  puestoId: z.coerce.number().int().positive().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
