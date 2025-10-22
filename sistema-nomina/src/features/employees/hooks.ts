import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployeeDocs,
  uploadEmployeeDoc,
  deleteEmployeeDoc,
  getEmployeeDocSignedUrl,
  setEmployeeActive,
} from './api'
import type {
  EmployeesListResponse,
  EmployeeDocsResponse,
  EmployeeDTO,
  EmployeeFilters,
} from './api'

// Normalizadores para la vista (lista)
import { extractItems, normalizeEmployee } from './normalize'

/* ======================= Empleados ======================= */

// LISTA (paginación + filtros)
export function useEmployees(filters: EmployeeFilters) {
  return useQuery<EmployeesListResponse, Error>({
    queryKey: ['employees', filters] as const,
    queryFn: () => listEmployees(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}

// DETALLE
export function useEmployee(id: number) {
  return useQuery<EmployeeDTO, Error>({
    queryKey: ['employee', id] as const,
    queryFn: () => getEmployee(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}

// CREATE
export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<EmployeeDTO>) => createEmployee(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

// UPDATE
export function useUpdateEmployee(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<EmployeeDTO>) => updateEmployee(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employee', id] })
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

// DELETE (si aún lo usas en algún sitio)
export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteEmployee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['employees'] })
    },
  })
}

/** TOGGLE ACTIVO/SUSPENDIDO (recomendado en lugar de delete) */
export function useToggleEmployeeActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { id: number; activo: boolean }) => setEmployeeActive(p.id, p.activo),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['employees'] })
      qc.invalidateQueries({ queryKey: ['employee', variables.id] })
    },
  })
}

/* ======================= Expediente (Documentos) ======================= */

export function useEmployeeDocs(empleadoId: number, page = 1, pageSize = 10) {
  return useQuery<EmployeeDocsResponse, Error>({
    queryKey: ['employeeDocs', empleadoId, page, pageSize] as const,
    queryFn: () => listEmployeeDocs(empleadoId, page, pageSize),
    enabled: Number.isFinite(empleadoId) && empleadoId > 0,
    placeholderData: (prev) => prev,
  })
}

export function useUploadEmployeeDoc(empleadoId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (p: { file: File; tipoDocumentoId: number }) =>
      uploadEmployeeDoc(empleadoId, p.file, p.tipoDocumentoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] }),
  })
}

export function useDeleteEmployeeDoc(empleadoId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (documentoId: number) => deleteEmployeeDoc(empleadoId, documentoId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] }),
  })
}

export function useEmployeeDocSignedUrl(
  empleadoId: number,
  documentoId: number,
  minutes?: number,
  download?: boolean
) {
  return useQuery({
    queryKey: ['employeeDocSas', empleadoId, documentoId, minutes, download] as const,
    queryFn: () => getEmployeeDocSignedUrl(empleadoId, documentoId, minutes, download),
    enabled:
      Number.isFinite(empleadoId) &&
      empleadoId > 0 &&
      Number.isFinite(documentoId) &&
      documentoId > 0,
    staleTime: 0,
    gcTime: 0,
  })
}

/* ======================= Vista normalizada (lista) ======================= */

export function useEmployeesView(filters: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees:view', filters] as const,
    queryFn: async () => {
      // Tratamos el resultado como dinámico porque la API puede variar su shape
      const raw: any = await listEmployees(filters)

      const items = extractItems(raw)
      const rows = items.map(normalizeEmployee)

      // Paginación “opcional”: tomamos lo que exista; si no, derivamos
      const total =
        (raw?.total ?? raw?.Total ?? raw?.data?.total ?? raw?.data?.Total) ?? rows.length
      const page =
        ((filters as any)?.page ?? raw?.page ?? raw?.Page ?? raw?.data?.page) ?? 1
      const pageSize =
        ((filters as any)?.pageSize ??
          raw?.pageSize ??
          raw?.PageSize ??
          raw?.data?.pageSize) ?? rows.length

      return { rows, total: Number(total) || rows.length, page: Number(page) || 1, pageSize: Number(pageSize) || rows.length }
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  })
}
