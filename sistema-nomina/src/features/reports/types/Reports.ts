/**
 * types/Reports.ts
 * Tipos TypeScript para el módulo de Reportes
 */

// ==================== REPORTES DE NÓMINA ====================

export interface ReporteNomina {
  id: number;
  nombre: string;
  periodo: string;
  fechaGeneracion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  totalEmpleados: number;
  totalBruto: number;
  totalDeducciones: number;
  totalNeto: number;
}

export interface ReporteNominaDetalle {
  empleadoId: number;
  nombreCompleto: string;
  puesto: string;
  departamento: string;
  salarioBruto: number;
  bonificacion: number;
  igss: number;
  isr: number;
  otrosDeducciones: number;
  salarioNeto: number;
}

// ==================== REPORTES DE EXPEDIENTES ====================

export interface ReporteExpediente {
  empleadoId: number;
  nombreCompleto: string;
  puesto: string;
  departamento: string;
  documentosRequeridos: number;
  documentosEntregados: number;
  porcentajeCompletitud: number;
  estado: 'Completo' | 'Incompleto' | 'Pendiente';
  ultimaActualizacion: string;
}

export interface ReporteDocumentosEmpleado {
  empleadoId: number;
  nombreCompleto: string;
  documentos: ItemDocumentoResumen[];
  totalDocumentos: number;
  documentosCompletos: number;
}

export interface ItemDocumentoResumen {
  tipoDocumento: string;
  entregado: boolean;
  fechaEntrega?: string;
  observaciones?: string;
}

// ==================== REPORTES DE DOCUMENTOS ====================

export interface ReportePorTipoDocumento {
  tipoDocumento: string;
  totalRequerido: number;
  totalEntregado: number;
  porcentajeEntrega: number;
  empleadosPendientes: number;
}

// ==================== REPORTES GENERALES ====================

export interface ReporteGeneral {
  totalEmpleados: number;
  empleadosActivos: number;
  empleadosInactivos: number;
  porDepartamento: DepartamentoSummary[];
  porPuesto: PuestoSummary[];
  estadoExpedientes: ExpedientesSummary;
}

export interface DepartamentoSummary {
  departamento: string;
  totalEmpleados: number;
  activos: number;
  inactivos: number;
}

export interface PuestoSummary {
  puesto: string;
  totalEmpleados: number;
  salarioPromedio: number;
}

export interface ExpedientesSummary {
  completos: number;
  incompletos: number;
  pendientes: number;
  porcentajeCompletitud: number;
}

// ==================== REPORTES DE AJUSTES ====================

export interface ReporteAjuste {
  id: number;
  nominaId: number;
  empleadoId: number;
  nombreEmpleado: string;
  concepto: string;
  tipo: 'Ingreso' | 'Deduccion';
  monto: number;
  motivo: string;
  creadoPor: string;
  fechaCreacion: string;
}

// ==================== REPORTES DE AUDITORÍA ====================

export interface ReporteAuditoria {
  id: number;
  usuario: string;
  accion: string;
  modulo: string;
  descripcion: string;
  fecha: string;
  ip?: string;
}

// ==================== FILTROS ====================

export interface ReporteNominaFilters {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  periodo?: string;
}

export interface ReporteExpedienteFilters {
  departamentoId?: number;
  estado?: 'Completo' | 'Incompleto' | 'Pendiente';
}

export interface ReporteGeneralFilters {
  estadoLaboral?: 'Activo' | 'Inactivo' | 'Todos';
}

export interface ReporteAuditoriaFilters {
  fechaInicio?: string;
  fechaFin?: string;
  usuario?: string;
  modulo?: string;
}

// ==================== TIPOS DE EXPORTACIÓN ====================

export type ExportFormat = 'pdf' | 'csv' | 'xlsx';

export interface ExportOptions {
  format: ExportFormat;
  filters?: any;
}
