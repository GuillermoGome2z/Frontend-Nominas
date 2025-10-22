export type EstadoLaboral = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO';

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


