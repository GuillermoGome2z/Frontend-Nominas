// src/features/departments/api.ts
import { api } from '../../lib/api';

export interface DepartmentDTO {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface DeptFilters {
  page?: number;
  pageSize?: number;
  activo?: boolean;
}
export interface DeptListResponse {
  data: DepartmentDTO[];
  meta: { total: number; page: number; pageSize: number };
}

function mapDept(x: any): DepartmentDTO {
  return {
    id: x.id ?? x.Id,
    nombre: x.nombre ?? x.Nombre,
    activo: x.activo ?? x.Activo ?? true,
  };
}

export async function listDepartments(
  f: DeptFilters = {},
): Promise<DeptListResponse> {
  try {
    const params = new URLSearchParams();
    params.set('page', String(f.page ?? 1));
    params.set('pageSize', String(f.pageSize ?? 10));
    if (typeof f.activo === 'boolean') params.set('activo', String(f.activo));

    const r = await api.get(`/departamentos?${params.toString()}`);
    const rawTotal = (r.headers?.['x-total-count'] ??
      r.headers?.['X-Total-Count'] ??
      0) as any;
    const total = Number(rawTotal) || 0;
    const data = Array.isArray(r.data) ? r.data.map(mapDept) : [];
    return { data, meta: { total, page: f.page ?? 1, pageSize: f.pageSize ?? 10 } };
  } catch (error) {
    throw error;
  }
}

export async function getDepartment(id: number): Promise<DepartmentDTO> {
  try {
    const r = await api.get(`/departamentos/${id}`);
    return mapDept(r.data);
  } catch (error) {
    throw error;
  }
}

export async function createDepartment(p: Partial<DepartmentDTO>) {
  try {
    const body = { Nombre: p.nombre, Activo: p.activo ?? true };
    const r = await api.post('/departamentos', body);
    return r.data;
  } catch (error) {
    throw error;
  }
}

export async function updateDepartment(id: number, p: Partial<DepartmentDTO>) {
  try {
    const body = { Id: id, Nombre: p.nombre, Activo: p.activo ?? true };
    const r = await api.put(`/departamentos/${id}`, body);
    return r.status;
  } catch (error) {
    throw error;
  }
}

/**
 * Toggle activo: usa endpoints específicos del backend
 */
export async function toggleDepartmentActive(id: number, activo: boolean) {
  try {
    const endpoint = activo ? `/departamentos/${id}/activar` : `/departamentos/${id}/desactivar`;
    const r = await api.put(endpoint);
    return r.status;
  } catch (error) {
    throw error;
  }
}
