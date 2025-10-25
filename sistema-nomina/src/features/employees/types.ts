export type EstadoLaboral = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO';

export const TipoDocumento = {
  DPI: 1,
  CV: 2,
  ANTECEDENTES_PENALES: 3,
  ANTECEDENTES_POLICIACOS: 4,
  CONSTANCIA_IGSS: 5,
  CERTIFICADO_NACIMIENTO: 6,
  TITULO: 7,
  CONTRATO_LABORAL: 8,
  OTRO: 9
} as const;

export type ExpedienteStatusType = 'completo' | 'incompleto' | 'pendiente';

export interface DocumentoRequerido {
  id: number;
  tipoDocumentoId: number;
  tipo: string;
  nombre: string;
  requerido: boolean;
  subido: boolean;
  descripcion?: string;
}

export interface EmployeeDTO {
  id: number;
  nombreCompleto: string;
  dpi: string;
  nit: string;
  correo: string;
  direccion?: string;
  telefono?: string;
  fechaContratacion?: string;  // ISO
  fechaNacimiento?: string;    // ISO
  estadoLaboral?: EstadoLaboral;
  salarioMensual?: number;
  departamentoId?: number;
  puestoId?: number;
  nombreDepartamento?: string;
  nombrePuesto?: string;
}

export interface EmployeeFilters {
  q?: string;
  departamentoId?: number;
  fechaInicio?: string; // ISO YYYY-MM-DD
  fechaFin?: string;    // ISO YYYY-MM-DD
  page?: number;
  pageSize?: number;
}

export interface EmployeesListResponse {
  data: EmployeeDTO[];
  meta: { total: number; page: number; pageSize: number };
}

export interface EmployeeDocDTO {
  id: number;
  empleadoId: number;
  tipoDocumentoId: number;
  nombreOriginal: string;
  rutaArchivo: string;
  fechaCreacion: string; // ISO
}

export interface EmployeeDocsResponse {
  data: EmployeeDocDTO[];
  meta: { total: number; page: number; pageSize: number };
}


