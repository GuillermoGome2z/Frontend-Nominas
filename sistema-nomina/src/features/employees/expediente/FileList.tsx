import { useState } from 'react'
import { useEmployeeDocs, useDeleteEmployeeDoc } from '../hooks'
import type { EmployeeDocDTO } from '../api'
import { getEmployeeDocSignedUrl } from '../api'
import { useToast } from '@/components/ui/Toast'
import { useQueryClient } from '@tanstack/react-query'

interface FileListProps {
  empleadoId: number
}

export default function FileList({ empleadoId }: FileListProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  
  const { data, isLoading, isError, error: queryError } = useEmployeeDocs(empleadoId)
  const del = useDeleteEmployeeDoc(empleadoId)
  const { success, error } = useToast()
  const queryClient = useQueryClient()

  const rows: EmployeeDocDTO[] = data?.data ?? []

  const getFileIcon = (filename: string) => {
    const ext = filename.toLowerCase().split('.').pop()
    switch (ext) {
      case 'pdf': return '📄'
      case 'doc':
      case 'docx': return '📝'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️'
      default: return '📋'
    }
  }



  const abrirDocumento = async (docId: number, nombre: string) => {
    try {
      setErrorMessage(null)
      const sas = await getEmployeeDocSignedUrl(empleadoId, docId, 10, false)
      if (sas?.url) {
        window.open(sas.url, '_blank', 'noopener,noreferrer')
        success(`Documento "${nombre}" abierto correctamente.`)
      } else {
        throw new Error('URL no disponible')
      }
    } catch (e: any) {
      const msg = e?.response?.data?.mensaje ?? e?.message ?? 'No se pudo abrir el documento.'
      error(msg)
      setErrorMessage(msg)
    }
  }

  const confirmarEliminacion = (doc: EmployeeDocDTO) => {
    if (window.confirm(`¿Está seguro que desea eliminar "${doc.nombreOriginal}"?`)) {
      eliminarDocumento(doc)
    }
  }

  const eliminarDocumento = (doc: EmployeeDocDTO) => {
    setDeletingId(doc.id)
    setErrorMessage(null)
    
    del.mutate(doc.id, {
      onSuccess: () => {
        success(`Documento "${doc.nombreOriginal}" eliminado correctamente.`)
        queryClient.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] })
        setDeletingId(null)
      },
      onError: (e: any) => {
        const msg = e?.response?.data?.mensaje ?? e?.message ?? 'No se pudo eliminar el documento.'
        error(msg)
        setErrorMessage(msg)
        setDeletingId(null)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-500">Cargando documentos...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        <h4 className="font-semibold mb-2">Error al cargar documentos</h4>
        <p className="text-sm">
          {queryError instanceof Error 
            ? queryError.message 
            : 'Hubo un problema al cargar los documentos del expediente.'}
        </p>
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📁</div>
        <h4 className="text-lg font-medium text-slate-900 mb-2">No hay documentos</h4>
        <p className="text-slate-500">
          Aún no se han subido documentos al expediente de este empleado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Banner de error */}
      {errorMessage && (
        <div className="animate-slide-down rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100 shadow-md px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center ring-2 ring-rose-300">
              <svg className="w-5 h-5 text-rose-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-rose-900 mb-1">
                Error de operación
              </h3>
              <p className="text-sm text-rose-800 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="flex-shrink-0 text-rose-500 hover:text-rose-700 hover:bg-rose-200 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar mensaje"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tabla de documentos */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Fecha de Subida
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {rows.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getFileIcon(doc.nombreOriginal || '')}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {doc.nombreOriginal || 'Documento sin nombre'}
                      </div>
                      <div className="text-sm text-slate-500">ID: {doc.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {doc.nombreTipo || `Tipo ${doc.tipoDocumentoId}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">
                    {doc.fechaSubida 
                      ? new Date(doc.fechaSubida).toLocaleString('es-GT') 
                      : '—'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">
                    —
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => abrirDocumento(doc.id, doc.nombreOriginal || 'documento')}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Abrir
                    </button>
                    <button
                      type="button"
                      onClick={() => confirmarEliminacion(doc)}
                      disabled={deletingId === doc.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        deletingId === doc.id
                          ? 'text-slate-500 bg-slate-100'
                          : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                      }`}
                    >
                      {deletingId === doc.id ? (
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

      {/* Información adicional */}
      <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Información del expediente</span>
        </div>
        <p>
          <strong>Total de documentos:</strong> {data?.meta.total ?? 0}
        </p>
        <p className="mt-1">
          <strong>Página actual:</strong> {data?.meta.page ?? 1} de {Math.ceil((data?.meta.total ?? 0) / (data?.meta.pageSize ?? 10))}
        </p>
      </div>
    </div>
  )
}
