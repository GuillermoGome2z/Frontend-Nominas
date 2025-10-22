import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeptFilters, DeptListResponse, DepartmentDTO } from './api'
import { listDepartments, getDepartment, createDepartment, updateDepartment, toggleDepartmentActive } from './api'

export function useDepartments(filters: DeptFilters) {
  return useQuery<DeptListResponse, Error>({
    queryKey: ['departments', filters],
    queryFn: () => listDepartments(filters),
    placeholderData: (p)=>p,
    staleTime: 30_000,
  })
}

export function useDepartment(id: number) {
  return useQuery<DepartmentDTO, Error>({
    queryKey: ['department', id],
    queryFn: () => getDepartment(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}

export function useCreateDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  })
}

export function useUpdateDepartment(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: Partial<DepartmentDTO>) => updateDepartment(id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['department', id] })
      qc.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}

export function useToggleDepartment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { id: number; activo: boolean }) => toggleDepartmentActive(p.id, p.activo),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ['department', v.id] })
      qc.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}
