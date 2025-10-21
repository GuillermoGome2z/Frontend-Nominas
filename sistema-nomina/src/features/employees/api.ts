import { api } from '../../lib/api'; // <-- ajusta a '../../lib/http' si ese es tu cliente

// ================== Tipos (Empleados) ==================
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

export interface EmployeeFilters {
  q?: string;
  departamentoId?: number;
  fechaInicio?: string; // ISO
  fechaFin?: string;    // ISO
  page?: number;
  pageSize?: number;
}

export interface EmployeesListResponse {
  data: EmployeeDTO[];
  meta: { total: number; page: number; pageSize: number };
}

// ================== API Empleados ==================
export async function listEmployees(filters: EmployeeFilters = {}): Promise<EmployeesListResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.departamentoId) params.set('departamentoId', String(filters.departamentoId));
  if (filters.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
  if (filters.fechaFin) params.set('fechaFin', filters.fechaFin);
  params.set('page', String(filters.page ?? 1));
  params.set('pageSize', String(filters.pageSize ?? 10));

  const res = await api.get(`/Empleados?${params.toString()}`);
  // En Axios, los headers suelen venir en minúscula:
  const rawTotal = (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count'] ?? 0) as number | string;
  const total = typeof rawTotal === 'string' ? Number(rawTotal) : Number(rawTotal);

  return {
    data: res.data as EmployeeDTO[],
    meta: { total: Number.isFinite(total) ? total : 0, page: filters.page ?? 1, pageSize: filters.pageSize ?? 10 },
  };
}

export async function getEmployee(id: number): Promise<EmployeeDTO> {
  const res = await api.get(`/Empleados/${id}`);
  return res.data as EmployeeDTO;
}

export async function createEmployee(payload: Partial<EmployeeDTO>) {
  const res = await api.post('/Empleados', payload); // 201
  return res.data;
}

export async function updateEmployee(id: number, payload: Partial<EmployeeDTO>) {
  const res = await api.put(`/Empleados/${id}`, payload); // 204
  return res.status;
}

export async function deleteEmployee(id: number) {
  const res = await api.delete(`/Empleados/${id}`); // 204
  return res.status;
}

// ================== Tipos (Expediente) ==================
export interface EmployeeDocDTO {
  id: number;
  empleadoId: number;
  tipoDocumentoId: number;
  nombreOriginal: string;
  rutaArchivo: string;
  fechaSubida: string; // ISO
  nombreTipo?: string;
  nombreEmpleado?: string;
}

export interface EmployeeDocsResponse {
  data: EmployeeDocDTO[];
  meta: { total: number; page: number; pageSize: number };
}

// ================== API Expediente ==================
export async function listEmployeeDocs(
  empleadoId: number,
  page = 1,
  pageSize = 10
): Promise<EmployeeDocsResponse> {
  const res = await api.get(`/DocumentosEmpleado`, { params: { empleadoId, page, pageSize } });
  const rawTotal = (res.headers?.['x-total-count'] ?? res.headers?.['X-Total-Count'] ?? 0) as number | string;
  const total = typeof rawTotal === 'string' ? Number(rawTotal) : Number(rawTotal);

  return {
    data: res.data as EmployeeDocDTO[],
    meta: { total: Number.isFinite(total) ? total : 0, page, pageSize },
  };
}

export async function uploadEmployeeDoc(
  empleadoId: number,
  file: File,
  tipoDocumentoId: number
) {
  const form = new FormData();
  form.append('Archivo', file);
  form.append('TipoDocumentoId', String(tipoDocumentoId));

  // Maneja 413/422/503 en interceptores o en los catch del componente
  return api.post(`/DocumentosEmpleado/${empleadoId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteEmployeeDoc(id: number) {
  const res = await api.delete(`/DocumentosEmpleado/${id}`); // 204
  return res.status;
}
