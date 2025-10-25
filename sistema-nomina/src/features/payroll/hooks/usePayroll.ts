/**
 * hooks/usePayroll.ts
 * Hooks de React Query para el módulo de Nómina
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  listPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
  calculatePayroll,
  publishPeriod,
  closePeriod,
  listPayrollLines,
  getPayrollLine,
  createAdjustment,
  deleteAdjustment,
  listAdjustments,
  listConcepts
} from '../api/payroll.api'
import type {
  PayrollPeriodFilters,
  PayrollLineFilters,
  PeriodFormData,
  AdjustmentFormData
} from '../types/Payroll'

// ==================== PERIODOS ====================

export function usePeriods(filters: PayrollPeriodFilters = {}) {
  return useQuery({
    queryKey: ['payroll-periods', filters],
    queryFn: () => listPeriods(filters),
    staleTime: 30_000
  })
}

export function usePeriod(id: number) {
  return useQuery({
    queryKey: ['payroll-period', id],
    queryFn: () => getPeriod(id),
    enabled: !!id,
    staleTime: 30_000
  })
}

export function useCreatePeriod() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: PeriodFormData) => createPeriod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
    }
  })
}

export function useUpdatePeriod() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PeriodFormData> }) =>
      updatePeriod(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-period', variables.id] })
    }
  })
}

export function useDeletePeriod() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deletePeriod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
    }
  })
}

// ==================== CÁLCULO Y CIERRE ====================

export function useCalculatePayroll() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (periodoId: number) => calculatePayroll(periodoId),
    onSuccess: (_, periodoId) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodoId] })
      queryClient.invalidateQueries({ queryKey: ['payroll-lines', periodoId] })
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
    }
  })
}

export function usePublishPeriod() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (periodoId: number) => publishPeriod(periodoId),
    onSuccess: (_, periodoId) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodoId] })
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
    }
  })
}

export function useClosePeriod() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (periodoId: number) => closePeriod(periodoId),
    onSuccess: (_, periodoId) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-period', periodoId] })
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] })
    }
  })
}

// ==================== LÍNEAS ====================

export function usePayrollLines(filters: PayrollLineFilters) {
  return useQuery({
    queryKey: ['payroll-lines', filters],
    queryFn: () => listPayrollLines(filters),
    enabled: !!filters.periodoId,
    staleTime: 30_000
  })
}

export function usePayrollLine(id: number) {
  return useQuery({
    queryKey: ['payroll-line', id],
    queryFn: () => getPayrollLine(id),
    enabled: !!id,
    staleTime: 30_000
  })
}

// ==================== AJUSTES ====================

export function useAdjustments(periodoId: number) {
  return useQuery({
    queryKey: ['payroll-adjustments', periodoId],
    queryFn: () => listAdjustments(periodoId),
    enabled: !!periodoId,
    staleTime: 30_000
  })
}

export function useCreateAdjustment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: AdjustmentFormData) => createAdjustment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payroll-lines'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-line', variables.lineaId] })
      queryClient.invalidateQueries({ queryKey: ['payroll-adjustments'] })
    }
  })
}

export function useDeleteAdjustment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deleteAdjustment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-lines'] })
      queryClient.invalidateQueries({ queryKey: ['payroll-adjustments'] })
    }
  })
}

// ==================== CONCEPTOS ====================

export function useConcepts() {
  return useQuery({
    queryKey: ['payroll-concepts'],
    queryFn: listConcepts,
    staleTime: 300_000 // 5 minutos - los conceptos cambian poco
  })
}
