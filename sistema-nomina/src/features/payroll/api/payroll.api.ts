/**
 * api/payroll.api.ts
 * Funciones de API para el módulo de Nómina
 * IMPORTANTE: Todos los endpoints usan plural (/periodos, /lineas, etc.)
 */

import { api } from '@/lib/api'
import type {
  PayrollPeriod,
  PayrollPeriodFilters,
  PayrollPeriodListResponse,
  PayrollLine,
  PayrollLineFilters,
  PayrollLineListResponse,
  PeriodFormData,
  AdjustmentFormData,
  CalculatePayrollResponse,
  PublishPeriodResponse,
  ClosePeriodResponse,
  PayrollAdjustment,
  PayrollConcept
} from '../types/Payroll'

// ==================== MAPPERS ====================

function mapPeriod(raw: any): PayrollPeriod {
  return {
    id: raw.id ?? raw.Id,
    nombre: raw.nombre ?? raw.Nombre,
    tipo: raw.tipo ?? raw.Tipo,
    fechaInicio: raw.fechaInicio ?? raw.FechaInicio,
    fechaFin: raw.fechaFin ?? raw.FechaFin,
    fechaPago: raw.fechaPago ?? raw.FechaPago,
    estado: raw.estado ?? raw.Estado,
    totalEmpleados: raw.totalEmpleados ?? raw.TotalEmpleados ?? 0,
    totalIngresos: raw.totalIngresos ?? raw.TotalIngresos ?? 0,
    totalDeducciones: raw.totalDeducciones ?? raw.TotalDeducciones ?? 0,
    totalNeto: raw.totalNeto ?? raw.TotalNeto ?? 0,
    calculadoAt: raw.calculadoAt ?? raw.CalculadoAt,
    publicadoAt: raw.publicadoAt ?? raw.PublicadoAt,
    cerradoAt: raw.cerradoAt ?? raw.CerradoAt,
    createdAt: raw.createdAt ?? raw.CreatedAt,
    updatedAt: raw.updatedAt ?? raw.UpdatedAt
  }
}

function mapLine(raw: any): PayrollLine {
  return {
    id: raw.id ?? raw.Id,
    periodoId: raw.periodoId ?? raw.PeriodoId,
    empleadoId: raw.empleadoId ?? raw.EmpleadoId,
    empleadoNombre: raw.empleadoNombre ?? raw.EmpleadoNombre,
    empleadoCodigo: raw.empleadoCodigo ?? raw.EmpleadoCodigo,
    puestoNombre: raw.puestoNombre ?? raw.PuestoNombre,
    puesto: raw.puesto ?? raw.Puesto ?? raw.puestoNombre ?? raw.PuestoNombre ?? '',
    departamento: raw.departamento ?? raw.Departamento ?? raw.departamentoNombre ?? raw.DepartamentoNombre ?? '',
    totalIngresos: raw.totalIngresos ?? raw.TotalIngresos ?? 0,
    totalDeducciones: raw.totalDeducciones ?? raw.TotalDeducciones ?? 0,
    salarioNeto: raw.salarioNeto ?? raw.SalarioNeto ?? raw.totalNeto ?? raw.TotalNeto ?? 0,
    conceptos: Array.isArray(raw.conceptos ?? raw.Conceptos) 
      ? (raw.conceptos ?? raw.Conceptos).map(mapConcept)
      : [],
    ajustes: Array.isArray(raw.ajustes ?? raw.Ajustes)
      ? (raw.ajustes ?? raw.Ajustes).map(mapAdjustment)
      : []
  }
}

function mapConcept(raw: any): PayrollConcept {
  return {
    id: raw.id ?? raw.Id,
    conceptoId: raw.conceptoId ?? raw.ConceptoId ?? raw.id ?? raw.Id,
    codigo: raw.codigo ?? raw.Codigo,
    nombre: raw.nombre ?? raw.Nombre,
    tipo: raw.tipo ?? raw.Tipo,
    monto: raw.monto ?? raw.Monto ?? 0,
    esCalculado: raw.esCalculado ?? raw.EsCalculado ?? raw.esAutomatico ?? raw.EsAutomatico ?? false,
    formula: raw.formula ?? raw.Formula
  }
}

function mapAdjustment(raw: any): PayrollAdjustment {
  return {
    id: raw.id ?? raw.Id,
    lineaId: raw.lineaId ?? raw.LineaId,
    conceptoId: raw.conceptoId ?? raw.ConceptoId,
    conceptoNombre: raw.conceptoNombre ?? raw.ConceptoNombre,
    tipo: raw.tipo ?? raw.Tipo,
    monto: raw.monto ?? raw.Monto ?? 0,
    motivo: raw.motivo ?? raw.Motivo,
    creadoPor: raw.creadoPor ?? raw.CreadoPor,
    createdAt: raw.createdAt ?? raw.CreatedAt
  }
}

// ==================== PERIODOS ====================

/**
 * Lista todos los periodos de nómina con filtros
 */
export async function listPeriods(filters: PayrollPeriodFilters = {}): Promise<PayrollPeriodListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 10))
  
  if (filters.q) params.set('q', filters.q)
  if (filters.tipo) params.set('tipo', filters.tipo)
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde)
  if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta)

  const response = await api.get(`/nominas?${params.toString()}`)
  
  const rawTotal = response.headers?.['x-total-count'] ?? response.headers?.['X-Total-Count'] ?? 0
  const total = Number(rawTotal) || 0
  const data = Array.isArray(response.data) ? response.data.map(mapPeriod) : []
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10
  const totalPages = Math.ceil((total || data.length) / pageSize)

  return {
    data,
    total: total || data.length,
    page,
    pageSize,
    meta: {
      total: total || data.length,
      page,
      pageSize,
      totalPages
    }
  }
}

/**
 * Obtiene un periodo específico por ID
 */
export async function getPeriod(id: number): Promise<PayrollPeriod> {
  const response = await api.get(`/nominas/${id}`)
  return mapPeriod(response.data)
}

/**
 * Crea un nuevo periodo de nómina
 */
export async function createPeriod(data: PeriodFormData): Promise<PayrollPeriod> {
  const body = {
    Nombre: data.nombre,
    Tipo: data.tipo,
    FechaInicio: data.fechaInicio,
    FechaFin: data.fechaFin,
    FechaPago: data.fechaPago
  }
  
  const response = await api.post('/nominas', body)
  return mapPeriod(response.data)
}

/**
 * Actualiza un periodo existente
 */
export async function updatePeriod(id: number, data: Partial<PeriodFormData>): Promise<PayrollPeriod> {
  const body = {
    Id: id,
    Nombre: data.nombre,
    Tipo: data.tipo,
    FechaInicio: data.fechaInicio,
    FechaFin: data.fechaFin,
    FechaPago: data.fechaPago
  }
  
  const response = await api.put(`/nominas/${id}`, body)
  return mapPeriod(response.data)
}

/**
 * Elimina un periodo (solo si no está calculado)
 */
export async function deletePeriod(id: number): Promise<void> {
  await api.delete(`/nominas/${id}`)
}

// ==================== CÁLCULO ====================

/**
 * Calcula la nómina para un periodo específico
 */
export async function calculatePayroll(periodoId: number): Promise<CalculatePayrollResponse> {
  const response = await api.post(`/nominas/${periodoId}/calcular`)
  return response.data
}

/**
 * Publica el periodo (hace visibles los recibos a empleados)
 */
export async function publishPeriod(periodoId: number): Promise<PublishPeriodResponse> {
  const response = await api.post(`/nominas/${periodoId}/publicar`)
  return response.data
}

/**
 * Cierra el periodo (bloquea modificaciones)
 */
export async function closePeriod(periodoId: number): Promise<ClosePeriodResponse> {
  const response = await api.post(`/nominas/${periodoId}/cerrar`)
  return response.data
}

// ==================== LÍNEAS DE NÓMINA ====================

/**
 * Lista las líneas de nómina de un periodo
 */
export async function listPayrollLines(filters: PayrollLineFilters): Promise<PayrollLineListResponse> {
  const params = new URLSearchParams()
  params.set('nominaId', String(filters.periodoId))
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 10))
  
  if (filters.q) params.set('q', filters.q)
  if (filters.departamentoId) params.set('departamentoId', String(filters.departamentoId))

  const response = await api.get(`/nominas/${filters.periodoId}/detalle?${params.toString()}`)
  
  const rawTotal = response.headers?.['x-total-count'] ?? response.headers?.['X-Total-Count'] ?? 0
  const total = Number(rawTotal) || 0
  const data = Array.isArray(response.data) ? response.data.map(mapLine) : []
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 10

  return {
    data,
    total: total || data.length,
    page,
    pageSize,
    meta: {
      total: total || data.length,
      page,
      pageSize
    }
  }
}

/**
 * Obtiene una línea específica con detalles
 */
export async function getPayrollLine(id: number): Promise<PayrollLine> {
  const response = await api.get(`/nominas/detalle/${id}`)
  return mapLine(response.data)
}

// ==================== AJUSTES ====================

/**
 * Crea un ajuste manual en una línea de nómina
 */
export async function createAdjustment(data: AdjustmentFormData): Promise<PayrollAdjustment> {
  const body = {
    LineaId: data.lineaId,
    ConceptoId: data.conceptoId,
    Monto: data.monto,
    Motivo: data.motivo
  }
  
  const response = await api.post('/nomina/ajustes', body)
  return mapAdjustment(response.data)
}

/**
 * Elimina un ajuste
 */
export async function deleteAdjustment(id: number): Promise<void> {
  await api.delete(`/nomina/ajustes/${id}`)
}

/**
 * Lista los ajustes de un periodo
 */
export async function listAdjustments(periodoId: number): Promise<PayrollAdjustment[]> {
  const response = await api.get(`/nomina/ajustes?periodoId=${periodoId}`)
  const data = Array.isArray(response.data) ? response.data : []
  return data.map(mapAdjustment)
}

// ==================== CONCEPTOS ====================

/**
 * Lista todos los conceptos de nómina disponibles
 */
export async function listConcepts(): Promise<PayrollConcept[]> {
  const response = await api.get('/nomina/conceptos')
  const data = Array.isArray(response.data) ? response.data : []
  return data.map(mapConcept)
}
