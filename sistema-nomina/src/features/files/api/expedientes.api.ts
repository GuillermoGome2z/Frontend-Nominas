/**
 * api/expedientes.api.ts
 * Cliente API para el módulo de Expedientes
 */

import { api } from '@/lib/api'
import type {
  Expediente,
  ExpedienteResumen,
  Documento,
  TipoDocumento,
  DocumentoChecklist,
  SubirDocumentoDto,
  ActualizarDocumentoDto,
  ExpedienteFilters,
  DocumentoFilters,
  ExpedientesListResponse,
  DocumentosListResponse,
  ExpedienteStats,
} from '../types/Expediente'

// ==================== MAPPERS ====================

function mapExpediente(raw: any): ExpedienteResumen {
  return {
    empleadoId: raw.EmpleadoId ?? raw.empleadoId,
    nombreCompleto: raw.NombreCompleto ?? raw.nombreCompleto,
    puesto: raw.Puesto ?? raw.puesto,
    departamento: raw.Departamento ?? raw.departamento,
    foto: raw.Foto ?? raw.foto,
    estado: raw.Estado ?? raw.estado,
    porcentajeCompletitud: raw.PorcentajeCompletitud ?? raw.porcentajeCompletitud ?? 0,
    documentosPendientes: raw.DocumentosPendientes ?? raw.documentosPendientes ?? 0,
    documentosVencidos: raw.DocumentosVencidos ?? raw.documentosVencidos ?? 0,
    ultimaActualizacion: raw.UltimaActualizacion ?? raw.ultimaActualizacion,
  }
}

function mapDocumento(raw: any): Documento {
  return {
    id: raw.Id ?? raw.id,
    expedienteId: raw.ExpedienteId ?? raw.expedienteId,
    empleadoId: raw.EmpleadoId ?? raw.empleadoId,
    tipoDocumentoId: raw.TipoDocumentoId ?? raw.tipoDocumentoId,
    tipoDocumento: raw.TipoDocumento ?? raw.tipoDocumento,
    nombreArchivo: raw.NombreArchivo ?? raw.nombreArchivo,
    rutaArchivo: raw.RutaArchivo ?? raw.rutaArchivo,
    tamanio: raw.Tamanio ?? raw.tamanio ?? 0,
    fechaSubida: raw.FechaSubida ?? raw.fechaSubida,
    fechaVencimiento: raw.FechaVencimiento ?? raw.fechaVencimiento,
    estado: raw.Estado ?? raw.estado ?? 'Pendiente',
    observaciones: raw.Observaciones ?? raw.observaciones,
    subidoPor: raw.SubidoPor ?? raw.subidoPor,
    createdAt: raw.CreatedAt ?? raw.createdAt,
    updatedAt: raw.UpdatedAt ?? raw.updatedAt,
  }
}

function mapTipoDocumento(raw: any): TipoDocumento {
  return {
    id: raw.Id ?? raw.id,
    nombre: raw.Nombre ?? raw.nombre,
    descripcion: raw.Descripcion ?? raw.descripcion,
    obligatorio: raw.Obligatorio ?? raw.obligatorio ?? false,
    requiereVencimiento: raw.RequiereVencimiento ?? raw.requiereVencimiento ?? false,
    categoria: raw.Categoria ?? raw.categoria ?? 'Otro',
    orden: raw.Orden ?? raw.orden ?? 0,
    activo: raw.Activo ?? raw.activo ?? true,
  }
}

// ==================== EXPEDIENTES ====================

/**
 * Lista todos los expedientes con filtros
 */
export async function listExpedientes(filters: ExpedienteFilters = {}): Promise<ExpedientesListResponse> {
  const params = new URLSearchParams()
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 10))
  
  if (filters.q) params.set('q', filters.q)
  if (filters.departamentoId) params.set('departamentoId', filters.departamentoId.toString())
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.porcentajeMin !== undefined) params.set('porcentajeMin', filters.porcentajeMin.toString())
  if (filters.porcentajeMax !== undefined) params.set('porcentajeMax', filters.porcentajeMax.toString())

  const response = await api.get(`/expedientes?${params.toString()}`)
  
  return {
    data: Array.isArray(response.data) ? response.data.map(mapExpediente) : [],
    total: response.data.total ?? 0,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 10,
    totalPages: response.data.totalPages ?? 0,
  }
}

/**
 * Obtiene el expediente completo de un empleado
 */
export async function getExpediente(empleadoId: number): Promise<Expediente> {
  const response = await api.get(`/expedientes/${empleadoId}`)
  return response.data
}

/**
 * Obtiene el checklist de documentos de un empleado
 */
export async function getDocumentosChecklist(empleadoId: number): Promise<DocumentoChecklist[]> {
  const response = await api.get(`/expedientes/${empleadoId}/checklist`)
  return Array.isArray(response.data) ? response.data : []
}

/**
 * Obtiene estadísticas generales de expedientes
 */
export async function getExpedienteStats(): Promise<ExpedienteStats> {
  const response = await api.get('/expedientes/estadisticas')
  return response.data
}

// ==================== DOCUMENTOS ====================

/**
 * Lista documentos con filtros
 */
export async function listDocumentos(filters: DocumentoFilters = {}): Promise<DocumentosListResponse> {
  const params = new URLSearchParams()
  
  if (filters.empleadoId) params.set('empleadoId', filters.empleadoId.toString())
  if (filters.tipoDocumentoId) params.set('tipoDocumentoId', filters.tipoDocumentoId.toString())
  if (filters.categoria) params.set('categoria', filters.categoria)
  if (filters.estado) params.set('estado', filters.estado)
  if (filters.fechaDesde) params.set('fechaDesde', filters.fechaDesde)
  if (filters.fechaHasta) params.set('fechaHasta', filters.fechaHasta)

  const response = await api.get(`/expedientes/documentos?${params.toString()}`)
  
  return {
    data: Array.isArray(response.data) ? response.data.map(mapDocumento) : [],
    total: response.data.total ?? 0,
    page: 1,
    pageSize: 999,
    totalPages: 1,
  }
}

/**
 * Obtiene un documento específico
 */
export async function getDocumento(documentoId: number): Promise<Documento> {
  const response = await api.get(`/expedientes/documentos/${documentoId}`)
  return mapDocumento(response.data)
}

/**
 * Sube un nuevo documento
 */
export async function subirDocumento(data: SubirDocumentoDto): Promise<Documento> {
  const formData = new FormData()
  formData.append('EmpleadoId', data.empleadoId.toString())
  formData.append('TipoDocumentoId', data.tipoDocumentoId.toString())
  formData.append('Archivo', data.archivo)
  
  if (data.fechaVencimiento) {
    formData.append('FechaVencimiento', data.fechaVencimiento)
  }
  if (data.observaciones) {
    formData.append('Observaciones', data.observaciones)
  }

  const response = await api.post('/expedientes/documentos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return mapDocumento(response.data)
}

/**
 * Actualiza un documento existente
 */
export async function actualizarDocumento(
  documentoId: number,
  data: ActualizarDocumentoDto
): Promise<Documento> {
  const body = {
    FechaVencimiento: data.fechaVencimiento,
    Observaciones: data.observaciones,
  }

  const response = await api.put(`/expedientes/documentos/${documentoId}`, body)
  return mapDocumento(response.data)
}

/**
 * Elimina un documento
 */
export async function eliminarDocumento(documentoId: number): Promise<void> {
  await api.delete(`/expedientes/documentos/${documentoId}`)
}

/**
 * Descarga un documento
 */
export async function descargarDocumento(documentoId: number, nombreArchivo: string): Promise<void> {
  const response = await api.get(`/expedientes/documentos/${documentoId}/descargar`, {
    responseType: 'blob',
  })

  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', nombreArchivo)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// ==================== TIPOS DE DOCUMENTO ====================

/**
 * Lista todos los tipos de documento
 */
export async function listTiposDocumento(): Promise<TipoDocumento[]> {
  const response = await api.get('/expedientes/tipos-documento')
  return Array.isArray(response.data) ? response.data.map(mapTipoDocumento) : []
}

/**
 * Obtiene un tipo de documento específico
 */
export async function getTipoDocumento(id: number): Promise<TipoDocumento> {
  const response = await api.get(`/expedientes/tipos-documento/${id}`)
  return mapTipoDocumento(response.data)
}
