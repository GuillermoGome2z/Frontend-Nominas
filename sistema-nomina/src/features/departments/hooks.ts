// src/features/departments/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { DeptFilters, DeptListResponse, DepartmentDTO } from './api';
import {
  listDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  toggleDepartmentActive,
} from './api';
import { useToast } from '@/components/ui/Toast';

export function useDepartments(filters: DeptFilters) {
  return useQuery<DeptListResponse, Error>({
    queryKey: ['departments', filters],
    queryFn: () => listDepartments(filters),
    staleTime: 30_000,
    placeholderData: (p) => p,
  });
}

export function useDepartment(id: number) {
  return useQuery<DepartmentDTO, Error>({
    queryKey: ['department', id],
    queryFn: () => getDepartment(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  const { success, error } = useToast();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['departments'] });
      success('Departamento creado.');
    },
    onError: () => error('No se pudo crear el departamento.'),
  });
}

export function useUpdateDepartment(id: number) {
  const qc = useQueryClient();
  const { success, error } = useToast();
  return useMutation({
    mutationFn: (p: Partial<DepartmentDTO>) => updateDepartment(id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['department', id] });
      qc.invalidateQueries({ queryKey: ['departments'] });
      success('Departamento actualizado.');
    },
    onError: () => error('No se pudo actualizar el departamento.'),
  });
}

export function useToggleDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: number; activo: boolean }) =>
      toggleDepartmentActive(p.id, p.activo),
    onSuccess: (_d, v) => {
      // Invalidar queries para refrescar la tabla
      qc.invalidateQueries({ queryKey: ['department', v.id] });
      qc.invalidateQueries({ queryKey: ['departments'] });
    },
    // El manejo de errores y éxito se hace en el componente
  });
}
