import { useState } from 'react'
import { useDeleteExpediente, useToggleExpedienteEstado, useDownloadExpediente } from '../hooks'
import { useToast } from '@/components/ui/Toast'
import StatusPill from '@/components/common/StatusPill'
import type { ExpedienteDTO } from '../api'

interface ExpedientesTableProps {
  expedientes: ExpedienteDTO[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function ExpedientesTable({
  expedientes,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange
}: ExpedientesTableProps) {
  const { success, error } = useToast()
  
  const [loadingStates, setLoadingStates] = useState<{
    delete: number | null
    toggle: number | null
    download: number | null
  }>({
    delete: null,
    toggle: null,
    download: null
  })

  const deleteExpediente = useDeleteExpediente()
  const toggleEstado = useToggleExpedienteEstado()
  const downloadExpediente = useDownloadExpediente()

  const totalPages = Math.ceil(total / pageSize)

  const handleDelete = async (expediente: ExpedienteDTO) => {
    if (!window.confirm(`¿Está seguro que desea eliminar el documento "${expediente.nombreArchivo}" del expediente?`)) {
      return
    }

    setLoadingStates(prev => ({ ...prev, delete: expediente.id }))
    
    try {
      await deleteExpediente.mutateAsync(expediente.id)
      success(`Documento "${expediente.nombreArchivo}" eliminado correctamente`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al eliminar el documento'
      error(msg)
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: null }))
    }
  }

  const handleToggleEstado = async (expediente: ExpedienteDTO) => {
    const accion = expediente.estado === 'ACTIVO' ? 'archivar' : 'reactivar'
    
    if (!window.confirm(`¿Está seguro que desea ${accion} este documento?`)) {
      return
    }

    setLoadingStates(prev => ({ ...prev, toggle: expediente.id }))
    
    try {
      await toggleEstado.mutateAsync(expediente.id)
      success(`Documento ${expediente.estado === 'ACTIVO' ? 'archivado' : 'reactivado'} correctamente`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? `Error al ${accion} el documento`
      error(msg)
    } finally {
      setLoadingStates(prev => ({ ...prev, toggle: null }))
    }
  }

  const handleDownload = async (expediente: ExpedienteDTO) => {
    setLoadingStates(prev => ({ ...prev, download: expediente.id }))
    
    try {
      await downloadExpediente.mutateAsync(expediente.id)
      success(`Documento "${expediente.nombreArchivo}" abierto correctamente`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al abrir el documento'
      error(msg)
    } finally {
      setLoadingStates(prev => ({ ...prev, download: null }))
    }
  }

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return '📄'
      case 'doc':
      case 'docx': return '📝'
      case 'xls':
      case 'xlsx': return '📊'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️'
      case 'txt': return '📝'
      default: return '📋'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return '—'
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {expedientes.map((expediente) => (
              <tr key={expediente.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-600">
                          {expediente.empleadoNombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-slate-900">
                        {expediente.empleadoNombre}
                      </div>
                      <div className="text-sm text-slate-500">
                        DPI: {expediente.empleadoDpi}
                      </div>
                      <div className="text-xs text-slate-400">
                        {expediente.departamentoNombre} - {expediente.puestoNombre}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">
                      {getFileIcon(expediente.nombreArchivo)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 max-w-xs truncate" title={expediente.nombreArchivo}>
                        {expediente.nombreArchivo}
                      </div>
                      <div className="text-sm text-slate-500">
                        ID: {expediente.id}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expediente.tipoDocumentoNombre || 'Sin tipo'}
                  </span>
                  {/* Debug info - remover en producción */}
                  {!expediente.tipoDocumentoNombre && (
                    <div className="text-xs text-red-500 mt-1">
                      Debug: ID={expediente.tipoDocumentoId}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {formatDate(expediente.fechaSubida)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600">
                    {formatFileSize(expediente.tamaño)}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill value={expediente.estado} />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {/* Botón Ver/Descargar */}
                    <button
                      type="button"
                      onClick={() => handleDownload(expediente)}
                      disabled={loadingStates.download === expediente.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        loadingStates.download === expediente.id
                          ? 'text-slate-500 bg-slate-100'
                          : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                      }`}
                    >
                      {loadingStates.download === expediente.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Abriendo...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </>
                      )}
                    </button>

                    {/* Botón Archivar/Reactivar */}
                    <button
                      type="button"
                      onClick={() => handleToggleEstado(expediente)}
                      disabled={loadingStates.toggle === expediente.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        loadingStates.toggle === expediente.id
                          ? 'text-slate-500 bg-slate-100'
                          : expediente.estado === 'ACTIVO'
                          ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                      }`}
                    >
                      {loadingStates.toggle === expediente.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Procesando...
                        </>
                      ) : expediente.estado === 'ACTIVO' ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                          </svg>
                          Archivar
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Reactivar
                        </>
                      )}
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => handleDelete(expediente)}
                      disabled={loadingStates.delete === expediente.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        loadingStates.delete === expediente.id
                          ? 'text-slate-500 bg-slate-100'
                          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                      }`}
                    >
                      {loadingStates.delete === expediente.id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{((page - 1) * pageSize) + 1}</span> a{' '}
                <span className="font-medium">{Math.min(page * pageSize, total)}</span> de{' '}
                <span className="font-medium">{total}</span> resultados
              </p>
              
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="ml-2 rounded border-gray-300 text-sm"
              >
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
            
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNum === page
                          ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}