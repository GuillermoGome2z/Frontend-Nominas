import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployeeDocs,
  uploadEmployeeDoc,
  deleteEmployeeDoc,
  type EmployeesListResponse,
  type EmployeeDocsResponse,
} from './api';
import type { EmployeeFilters } from './api';

export function useEmployees(filters: EmployeeFilters) {
  return useQuery<EmployeesListResponse>({
    queryKey: ['employees', filters],
    queryFn: () => listEmployees(filters),
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployee(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

export function useUpdateEmployee(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => updateEmployee(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] });
      qc.invalidateQueries({ queryKey: ['employee', id] });
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employees'] }),
  });
}

// -------- Expediente --------
export function useEmployeeDocs(empleadoId: number, page = 1, pageSize = 10) {
  return useQuery<EmployeeDocsResponse>({
    queryKey: ['employeeDocs', empleadoId, page, pageSize],
    queryFn: () => listEmployeeDocs(empleadoId, page, pageSize),
    enabled: !!empleadoId,
  });
}

export function useUploadEmployeeDoc(empleadoId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { file: File; tipoDocumentoId: number }) =>
      uploadEmployeeDoc(empleadoId, p.file, p.tipoDocumentoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] }),
  });
}

export function useDeleteEmployeeDoc(empleadoId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployeeDoc,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] }),
  });
}
