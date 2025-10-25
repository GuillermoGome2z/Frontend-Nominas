// Enums y tipos
export type PeriodType = 'Quincenal' | 'Mensual' | 'Semanal';
export type PeriodStatus = 'Borrador' | 'Calculado' | 'Publicado' | 'Cerrado';
export type ConceptType = 'Ingreso' | 'Deduccion';

// Interfaces principales
export interface PayrollPeriod {
  id: number;
  nombre: string;
  tipo: PeriodType;
  fechaInicio: string;
  fechaFin: string;
  fechaPago?: string;
  estado: PeriodStatus;
  totalEmpleados: number;
  totalIngresos: number;
  totalDeducciones: number;
  totalNeto: number;
  calculadoAt?: string;
  publicadoAt?: string;
  cerradoAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollLine {
  id: number;
  periodoId: number;
  empleadoId: number;
  empleadoNombre: string;
  empleadoCodigo: string;
  puesto: string;
  puestoNombre?: string;
  departamento: string;
  totalIngresos: number;
  totalDeducciones: number;
  salarioNeto: number;
  conceptos: PayrollConcept[];
  ajustes: PayrollAdjustment[];
}

export interface PayrollConcept {
  id: number;
  conceptoId: number;
  codigo?: string;
  nombre: string;
  tipo: ConceptType;
  monto: number;
  esCalculado: boolean;
  formula?: string;
}

export interface PayrollAdjustment {
  id: number;
  lineaId: number;
  conceptoId: number;
  conceptoNombre: string;
  tipo: ConceptType;
  monto: number;
  motivo: string;
  creadoPor: string;
  createdAt: string;
}

// Form data types
export interface PeriodFormData {
  nombre: string;
  tipo: PeriodType;
  fechaInicio: string;
  fechaFin: string;
  fechaPago?: string;
}

export interface AdjustmentFormData {
  lineaId: number;
  conceptoId: number;
  monto: number;
  motivo: string;
}

// Filter types
export interface PayrollPeriodFilters {
  tipo?: PeriodType;
  estado?: PeriodStatus;
  fechaDesde?: string;
  fechaHasta?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface PayrollLineFilters {
  periodoId?: number;
  empleadoId?: number;
  departamentoId?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}

// Response types
export interface PayrollPeriodListResponse {
  data: PayrollPeriod[];
  total: number;
  page: number;
  pageSize: number;
  meta?: any;
}

export interface PayrollLineListResponse {
  data: PayrollLine[];
  total: number;
  page: number;
  pageSize: number;
  meta?: any;
}

export interface CalculatePayrollResponse {
  periodoId: number;
  totalEmpleados: number;
  totalIngresos: number;
  totalDeducciones: number;
  totalNeto: number;
  mensaje: string;
}

export interface PublishPeriodResponse {
  periodoId: number;
  publicadoAt: string;
  mensaje: string;
}

export interface ClosePeriodResponse {
  periodoId: number;
  cerradoAt: string;
  mensaje: string;
}

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Legacy aliases para compatibilidad
export type Periodo = PayrollPeriod;
export type LineaNomina = PayrollLine;
export type ConceptoLinea = PayrollConcept;
export type Ajuste = PayrollAdjustment;
export type PeriodoFormData = PeriodFormData;
