import { api } from '../../lib/api'

/* ======================= Tipos (Expedientes) ======================= */

export interface ExpedienteDTO {
  id: number
  empleadoId: number
  empleadoNombre: string
  empleadoDpi: string
  departamentoNombre: string
  puestoNombre: string
  tipoDocumentoId: number
  tipoDocumentoNombre: string
  nombreArchivo: string
  rutaArchivo: string
  fechaSubida: string
  tamaño?: number
  estado: 'ACTIVO' | 'ARCHIVADO'
  observaciones?: string
}

export interface ExpedienteCreateDTO {
  empleadoId: number
  tipoDocumentoId: number
  archivo: File
  observaciones?: string
}

export interface ExpedienteUpdateDTO {
  tipoDocumentoId?: number
  observaciones?: string
  estado?: 'ACTIVO' | 'ARCHIVADO'
}

export interface ExpedienteFilter {
  empleadoId?: number
  departamentoId?: number
  puestoId?: number
  tipoDocumentoId?: number
  estado?: 'ACTIVO' | 'ARCHIVADO' | '' | undefined
  fechaInicio?: string
  fechaFin?: string
  busqueda?: string
}

export interface TipoDocumentoDTO {
  id: number
  nombre: string
  descripcion?: string
  requerido: boolean
  activo: boolean
}

export interface ExpedientesResponse {
  data: ExpedienteDTO[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/* ======================= Mappers ======================= */

function mapExpediente(x: any): ExpedienteDTO {
  // Debug: log para ver qué viene del backend
  if (!x.tipoDocumentoNombre && !x.TipoDocumentoNombre && !x.nombreTipoDocumento && !x.NombreTipoDocumento) {
    console.warn('⚠️ Expediente sin tipo de documento:', {
      id: x.id,
      tipoDocumentoId: x.tipoDocumentoId,
      availableFields: Object.keys(x)
    })
  }

  const mapped = {
    id: x.id ?? x.Id ?? 0,
    empleadoId: x.empleadoId ?? x.EmpleadoId ?? 0,
    empleadoNombre: x.empleadoNombre ?? x.EmpleadoNombre ?? x.nombreEmpleado ?? x.NombreEmpleado ?? '',
    empleadoDpi: x.empleadoDpi ?? x.EmpleadoDpi ?? x.dpiEmpleado ?? x.DPIEmpleado ?? '',
    departamentoNombre: x.departamentoNombre ?? x.DepartamentoNombre ?? x.nombreDepartamento ?? x.NombreDepartamento ?? '',
    puestoNombre: x.puestoNombre ?? x.PuestoNombre ?? x.nombrePuesto ?? x.NombrePuesto ?? '',
    tipoDocumentoId: x.tipoDocumentoId ?? x.TipoDocumentoId ?? 0,
    tipoDocumentoNombre: x.tipoDocumentoNombre ?? x.TipoDocumentoNombre ?? x.nombreTipoDocumento ?? x.NombreTipoDocumento ?? '',
    nombreArchivo: x.nombreArchivo ?? x.NombreArchivo ?? x.nombreOriginal ?? x.NombreOriginal ?? '',
    rutaArchivo: x.rutaArchivo ?? x.RutaArchivo ?? '',
    fechaSubida: x.fechaSubida ?? x.FechaSubida ?? new Date().toISOString(),
    tamaño: Number(x.tamaño ?? x.Tamaño ?? x.tamano ?? x.Tamano ?? 0) || undefined,
    estado: (x.estado ?? x.Estado ?? 'ACTIVO') as 'ACTIVO' | 'ARCHIVADO',
    observaciones: x.observaciones ?? x.Observaciones ?? undefined
  }
  
  return mapped
}

function mapTipoDocumento(x: any): TipoDocumentoDTO {
  return {
    id: x.id ?? x.Id ?? 0,
    nombre: x.nombre ?? x.Nombre ?? '',
    descripcion: x.descripcion ?? x.Descripcion ?? undefined,
    requerido: Boolean(x.requerido ?? x.Requerido ?? false),
    activo: Boolean(x.activo ?? x.Activo ?? true)
  }
}

/* ======================= API Functions ======================= */

// Obtener expedientes con filtros y paginación
export async function getExpedientes(
  filters: ExpedienteFilter = {}, 
  page: number = 1, 
  pageSize: number = 10
): Promise<ExpedientesResponse> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize)
    })

    // Solo agregar parámetros con valores válidos
    if (filters.empleadoId && filters.empleadoId > 0) {
      params.set('empleadoId', String(filters.empleadoId))
    }
    if (filters.departamentoId && filters.departamentoId > 0) {
      params.set('departamentoId', String(filters.departamentoId))
    }
    if (filters.puestoId && filters.puestoId > 0) {
      params.set('puestoId', String(filters.puestoId))
    }
    if (filters.tipoDocumentoId && filters.tipoDocumentoId > 0) {
      params.set('tipoDocumentoId', String(filters.tipoDocumentoId))
    }
    if (filters.estado && filters.estado.trim() !== '') {
      params.set('estado', filters.estado)
    }
    if (filters.fechaInicio) {
      params.set('fechaInicio', filters.fechaInicio)
    }
    if (filters.fechaFin) {
      params.set('fechaFin', filters.fechaFin)
    }
    if (filters.busqueda && filters.busqueda.trim()) {
      params.set('busqueda', filters.busqueda.trim())
    }

    console.log('🗂️ API Request URL:', `/expedientes?${params.toString()}`)
    
    const res = await api.get(`/expedientes?${params.toString()}`)
    const data = res.data

    return {
      data: Array.isArray(data.data) ? data.data.map(mapExpediente) : [],
      meta: {
        total: Number(data.meta?.total ?? data.total ?? 0),
        page: Number(data.meta?.page ?? data.page ?? page),
        pageSize: Number(data.meta?.pageSize ?? data.pageSize ?? pageSize),
        totalPages: Math.ceil((data.meta?.total ?? data.total ?? 0) / pageSize)
      }
    }
  } catch (error: any) {
    console.error('❌ Error en getExpedientes:', error)
    
    // Manejo específico de errores
    if (error?.code === 'ERR_NETWORK' || error?.message?.includes('CORS')) {
      const corsError = new Error('Error de CORS: El backend no permite peticiones desde este origen.')
      corsError.name = 'CORSError'
      throw corsError
    }
    
    // Si es 404, devolver datos mock para testing
    if (error?.response?.status === 404) {
      console.warn('⚠️ Endpoint de expedientes no implementado en el backend. Usando datos mock.')
      const mockData: ExpedienteDTO[] = [
        {
          id: 1,
          empleadoId: 1,
          empleadoNombre: 'Juan Pérez',
          empleadoDpi: '1234567890123',
          departamentoNombre: 'Recursos Humanos',
          puestoNombre: 'Gerente',
          tipoDocumentoId: 1,
          tipoDocumentoNombre: 'DPI',
          nombreArchivo: 'DPI_Juan_Perez.pdf',
          rutaArchivo: '/files/dpi_juan_perez.pdf',
          fechaSubida: new Date().toISOString(),
          tamaño: 1024567,
          estado: 'ACTIVO',
          observaciones: 'Documento principal de identificación'
        },
        {
          id: 2,
          empleadoId: 1,
          empleadoNombre: 'Juan Pérez',
          empleadoDpi: '1234567890123',
          departamentoNombre: 'Recursos Humanos',
          puestoNombre: 'Gerente',
          tipoDocumentoId: 2,
          tipoDocumentoNombre: 'Hoja de Vida',
          nombreArchivo: 'CV_Juan_Perez.docx',
          rutaArchivo: '/files/cv_juan_perez.docx',
          fechaSubida: new Date(Date.now() - 86400000).toISOString(), // Ayer
          tamaño: 567890,
          estado: 'ACTIVO',
          observaciones: 'Curriculum vitae actualizado'
        },
        {
          id: 3,
          empleadoId: 1,
          empleadoNombre: 'Juan Pérez',
          empleadoDpi: '1234567890123',
          departamentoNombre: 'Recursos Humanos',
          puestoNombre: 'Gerente',
          tipoDocumentoId: 3,
          tipoDocumentoNombre: 'Contrato de Trabajo',
          nombreArchivo: 'Contrato_Juan_Perez.pdf',
          rutaArchivo: '/files/contrato_juan_perez.pdf',
          fechaSubida: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
          tamaño: 234567,
          estado: 'ARCHIVADO',
          observaciones: 'Contrato inicial - archivado por renovación'
        }
      ]
      
      return {
        data: mockData,
        meta: { total: mockData.length, page: 1, pageSize: 10, totalPages: 1 }
      }
    }

    throw error
  }
}

// Obtener expediente por ID
export async function getExpediente(id: number): Promise<ExpedienteDTO> {
  const res = await api.get(`/expedientes/${id}`)
  return mapExpediente(res.data)
}

// Crear nuevo expediente (upload)
export async function createExpediente(data: ExpedienteCreateDTO): Promise<ExpedienteDTO> {
  const formData = new FormData()
  formData.append('empleadoId', String(data.empleadoId))
  formData.append('tipoDocumentoId', String(data.tipoDocumentoId))
  formData.append('archivo', data.archivo)
  if (data.observaciones) {
    formData.append('observaciones', data.observaciones)
  }

  const res = await api.post('/expedientes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return mapExpediente(res.data)
}

// Actualizar expediente
export async function updateExpediente(id: number, data: ExpedienteUpdateDTO): Promise<ExpedienteDTO> {
  const res = await api.put(`/expedientes/${id}`, data)
  return mapExpediente(res.data)
}

// Eliminar expediente
export async function deleteExpediente(id: number): Promise<void> {
  await api.delete(`/expedientes/${id}`)
}

// Obtener URL firmada para descargar documento
export async function getExpedienteDownloadUrl(id: number): Promise<{ url: string }> {
  const res = await api.get(`/expedientes/${id}/download`)
  return res.data
}

// Archivar/Desarchivar expediente
export async function toggleExpedienteEstado(id: number): Promise<ExpedienteDTO> {
  const res = await api.patch(`/expedientes/${id}/toggle-estado`)
  return mapExpediente(res.data)
}

// Obtener tipos de documento
export async function getTiposDocumento(): Promise<TipoDocumentoDTO[]> {
  try {
    const res = await api.get('/tipos-documento')
    return Array.isArray(res.data) ? res.data.map(mapTipoDocumento) : []
  } catch (error: any) {
    console.warn('⚠️ Tipos de documento no disponibles, usando datos por defecto')
    // Tipos por defecto si el endpoint no existe
    return [
      { id: 1, nombre: 'DPI', descripcion: 'Documento Personal de Identificación', requerido: true, activo: true },
      { id: 2, nombre: 'Hoja de Vida', descripcion: 'Curriculum Vitae actualizado', requerido: false, activo: true },
      { id: 3, nombre: 'Contrato de Trabajo', descripcion: 'Contrato laboral firmado', requerido: true, activo: true },
      { id: 4, nombre: 'Certificados Académicos', descripcion: 'Títulos y diplomas', requerido: false, activo: true },
      { id: 5, nombre: 'Referencias Laborales', descripcion: 'Cartas de recomendación', requerido: false, activo: true },
      { id: 6, nombre: 'Exámenes Médicos', descripcion: 'Certificados de salud', requerido: true, activo: true },
      { id: 7, nombre: 'Antecedentes Penales', descripcion: 'Certificado de antecedentes', requerido: true, activo: true },
      { id: 8, nombre: 'Fotografía', descripcion: 'Foto para expediente', requerido: false, activo: true },
    ]
  }
}

// Obtener estadísticas de expedientes
export async function getExpedientesStats(): Promise<{
  totalExpedientes: number
  expedientesActivos: number
  expedientesArchivados: number
  documentosPorTipo: Array<{ tipo: string; cantidad: number }>
}> {
  try {
    const res = await api.get('/expedientes/estadisticas')
    return {
      totalExpedientes: Number(res.data.totalExpedientes || res.data.TotalExpedientes || 0),
      expedientesActivos: Number(res.data.expedientesActivos || res.data.ExpedientesActivos || 0),
      expedientesArchivados: Number(res.data.expedientesArchivados || res.data.ExpedientesArchivados || 0),
      documentosPorTipo: Array.isArray(res.data.documentosPorTipo || res.data.DocumentosPorTipo) 
        ? (res.data.documentosPorTipo || res.data.DocumentosPorTipo).map((d: any) => ({
            tipo: d.tipo || d.Tipo || '',
            cantidad: Number(d.cantidad || d.Cantidad || 0)
          }))
        : []
    }
  } catch (error: any) {
    // Manejo silencioso de errores - no mostrar warning en consola para errores 500/404
    if (error?.response?.status === 500 || error?.response?.status === 404) {
      // Solo log si hay debugging habilitado (en modo desarrollo Vite tiene import.meta.env)
      if (import.meta.env?.DEV) {
        console.debug('Estadísticas de expedientes no disponibles:', error?.response?.status)
      }
    } else {
      console.warn('⚠️ Error obteniendo estadísticas de expedientes:', error?.message)
    }
    
    return {
      totalExpedientes: 0,
      expedientesActivos: 0,
      expedientesArchivados: 0,
      documentosPorTipo: []
    }
  }
}