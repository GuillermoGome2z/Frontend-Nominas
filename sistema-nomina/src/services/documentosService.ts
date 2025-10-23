import { api } from '../lib/http'
import type {
  DocumentoEmpleadoDto,
  DocumentoUploadResponse,
  DocumentoDownloadResponse,
} from '../types/documento'

const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_UPLOAD_MAX_MB) || 100

export const documentosService = {
  /**
   * Validar tamaño de archivo antes de subir
   */
  validateFileSize(file: File): { valid: boolean; error?: string } {
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `El archivo excede el límite de ${MAX_FILE_SIZE_MB} MB`,
      }
    }
    return { valid: true }
  },

  /**
   * POST /api/DocumentosEmpleado/{empleadoId}
   * Content-Type: multipart/form-data
   * 201 | 413 | 422 | 404
   */
  async upload(
    empleadoId: number,
    file: File,
    tipoDocumento?: string
  ): Promise<DocumentoUploadResponse> {
    // Validar tamaño antes de enviar
    const validation = this.validateFileSize(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    const formData = new FormData()
    formData.append('archivo', file)
    if (tipoDocumento) {
      formData.append('tipoDocumento', tipoDocumento)
    }

    try {
      const response = await api.post<DocumentoUploadResponse>(
        `/DocumentosEmpleado/${empleadoId}`,
        formData,
        {
          headers: {
            // No establecer Content-Type manualmente, el browser lo hará con boundary
          },
        }
      )
      return response.data
    } catch (error: any) {
      // Re-throw con mensaje específico para 413
      if (error.status === 413) {
        throw new Error('El archivo es demasiado grande para el servidor')
      }
      throw error
    }
  },

  /**
   * GET /api/DocumentosEmpleado/{empleadoId}
   * 200
   */
  async getByEmpleado(empleadoId: number): Promise<DocumentoEmpleadoDto[]> {
    const response = await api.get<DocumentoEmpleadoDto[]>(`/DocumentosEmpleado/${empleadoId}`)
    return response.data
  },

  /**
   * GET /api/DocumentosEmpleado/{empleadoId}/{documentoId}/download
   * 200 -> devuelve { url }
   */
  async getDownloadUrl(empleadoId: number, documentoId: number): Promise<string> {
    const response = await api.get<DocumentoDownloadResponse>(
      `/DocumentosEmpleado/${empleadoId}/${documentoId}/download`
    )
    return response.data.url
  },

  /**
   * PUT /api/DocumentosEmpleado/{id}
   * 204 | 404 | 422
   */
  async update(
    id: number,
    data: { nombreArchivo?: string; tipoDocumento?: string }
  ): Promise<void> {
    await api.put(`/DocumentosEmpleado/${id}`, data)
  },

  /**
   * DELETE /api/DocumentosEmpleado/{id}
   * 204 (eliminación lógica)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/DocumentosEmpleado/${id}`)
  },
}
