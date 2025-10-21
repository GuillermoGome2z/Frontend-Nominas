export type EstadoLaboral = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO';

export interface EmployeeDTO {
  id: number;
  nombreCompleto: string;
  dpi: string;
  nit: string;
  correo: string;
  direccion?: string;
  telefono?: string;
  fechaContratacion?: string;   // ISO
  fechaNacimiento?: string;     // ISO
  estadoLaboral?: EstadoLaboral;
  salarioMensual?: number;
  departamentoId?: number;
  puestoId?: number;

  nombreDepartamento?: string;
  nombrePuesto?: string;
}

export interface EmployeesListResponse {
  data: EmployeeDTO[];
  meta: { total: number; page: number; pageSize: number };
}

export interface EmployeeFilters {
  q?: string;
  departamentoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  pageSize?: number;
}