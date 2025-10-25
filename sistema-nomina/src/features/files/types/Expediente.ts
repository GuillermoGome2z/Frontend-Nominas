/**
 * types/Expediente.ts
 * Tipos TypeScript para el módulo de Expedientes
 */

// ==================== EXPEDIENTE ====================

export interface Expediente {
  id: number;
  empleadoId: number;
  empleadoNombre: string;
  puesto: string;
  departamento: string;
  documentosRequeridos: number;
  documentosEntregados: number;
  porcentajeCompletitud: number;
  estado: EstadoExpediente;
  ultimaActualizacion: string;
  createdAt: string;
  updatedAt: string;
}

export type EstadoExpediente = 'Completo' | 'Incompleto' | 'Pendiente';

// ==================== DOCUMENTO ====================

export interface Documento {
  id: number;
  expedienteId: number;
  empleadoId: number;
  tipoDocumentoId: number;
  tipoDocumento: string;
  nombreArchivo: string;
  rutaArchivo: string;
  tamanio: number; // en bytes
  fechaSubida: string;
  fechaVencimiento?: string;
  estado: EstadoDocumento;
  observaciones?: string;
  subidoPor: string;
  createdAt: string;
  updatedAt: string;
}

export type EstadoDocumento = 'Vigente' | 'Por Vencer' | 'Vencido' | 'Pendiente';

// ==================== TIPO DE DOCUMENTO ====================

export interface TipoDocumento {
  id: number;
  nombre: string;
  descripcion?: string;
  obligatorio: boolean;
  requiereVencimiento: boolean;
  categoria: CategoriaDocumento;
  orden: number;
  activo: boolean;
}

export type CategoriaDocumento = 'Personal' | 'Laboral' | 'Académico' | 'Médico' | 'Legal' | 'Otro';

// ==================== RESUMEN DE EXPEDIENTE ====================

export interface ExpedienteResumen {
  empleadoId: number;
  nombreCompleto: string;
  puesto: string;
  departamento: string;
  foto?: string;
  estado: EstadoExpediente;
  porcentajeCompletitud: number;
  documentosPendientes: number;
  documentosVencidos: number;
  ultimaActualizacion: string;
}

// ==================== CHECKLIST DE DOCUMENTOS ====================

export interface DocumentoChecklist {
  tipoDocumentoId: number;
  tipoDocumento: string;
  categoria: CategoriaDocumento;
  obligatorio: boolean;
  entregado: boolean;
  documentoId?: number;
  fechaSubida?: string;
  fechaVencimiento?: string;
  estado?: EstadoDocumento;
  observaciones?: string;
}

// ==================== DTOs ====================

export interface SubirDocumentoDto {
  empleadoId: number;
  tipoDocumentoId: number;
  archivo: File;
  fechaVencimiento?: string;
  observaciones?: string;
}

export interface ActualizarDocumentoDto {
  fechaVencimiento?: string;
  observaciones?: string;
}

// ==================== FILTROS ====================

export interface ExpedienteFilters {
  q?: string; // búsqueda por nombre
  departamentoId?: number;
  estado?: EstadoExpediente;
  porcentajeMin?: number;
  porcentajeMax?: number;
  page?: number;
  pageSize?: number;
}

export interface DocumentoFilters {
  empleadoId?: number;
  tipoDocumentoId?: number;
  categoria?: CategoriaDocumento;
  estado?: EstadoDocumento;
  fechaDesde?: string;
  fechaHasta?: string;
}

// ==================== RESPUESTAS PAGINADAS ====================

export interface ExpedientesListResponse {
  data: ExpedienteResumen[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DocumentosListResponse {
  data: Documento[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== ESTADÍSTICAS ====================

export interface ExpedienteStats {
  totalEmpleados: number;
  expedientesCompletos: number;
  expedientesIncompletos: number;
  expedientesPendientes: number;
  documentosVencidos: number;
  documentosPorVencer: number;
  porcentajeCompletoGeneral: number;
}
