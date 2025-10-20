import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  type CreateEmployeeDTO,
  type UpdateEmployeeDTO,
  type EmployeeDTO,
} from './api'

export function useEmployeesList(params?: {
  page?: number
  pageSize?: number
  q?: string
  departamentoId?: number
  fechaInicio?: string
  fechaFin?: string
}) {
  return useQuery<EmployeeDTO[]>({
  queryKey: ['employees', params],
  queryFn: () => fetchEmployees(params),
})
}

export function useEmployeeDetail(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => fetchEmployeeById(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEmployeeDTO) => createEmployee(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

export function useUpdateEmployee(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateEmployeeDTO) => updateEmployee(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employees', id] })
    },
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}
