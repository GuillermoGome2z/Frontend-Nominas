// ==================== Documento Types ====================

export interface DocumentoEmpleadoDto {
  id: number
  empleadoId: number
  nombreArchivo: string
  tipoDocumento: string
  tamanoBytes: number
  fechaSubida: string // ISO date string
  rutaArchivo: string
}

export interface DocumentoUploadResponse {
  id: number
  nombreArchivo: string
  mensaje?: string
}

export interface DocumentoDownloadResponse {
  url: string
}
