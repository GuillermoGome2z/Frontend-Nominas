import { useState } from 'react'
import { 
  useAprobarNomina, 
  useMarcarNominaPagada, 
  useAnularNomina, 
  useDeleteNomina,
  useDownloadNominaReport,
  formatCurrency,
  formatPeriodo,
  getEstadoNominaColor,
  getTipoNominaColor
} from '../hooks'
import type { NominaDTO } from '../api'
import { useToast } from '@/components/ui/Toast'

interface PayrollTableProps {
  nominas: NominaDTO[]
  loading?: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
}

export default function PayrollTable({ 
  nominas, 
  loading, 
  onPageChange, 
  onPageSizeChange,
  pagination 
}: PayrollTableProps) {
  const { success, error } = useToast()
  const [loadingStates, setLoadingStates] = useState<Record<number, string>>({})
  
  const aprobarNomina = useAprobarNomina()
  const marcarPagada = useMarcarNominaPagada()
  const anularNomina = useAnularNomina()
  const deleteNomina = useDeleteNomina()
  const downloadReport = useDownloadNominaReport()

  const setLoading = (id: number, action: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [id]: isLoading ? action : ''
    }))
  }

  const handleAprobar = async (nomina: NominaDTO) => {
    if (nomina.estado !== 'BORRADOR') {
      error('Solo se pueden aprobar nóminas en borrador')
      return
    }

    try {
      setLoading(nomina.id, 'aprobar', true)
      await aprobarNomina.mutateAsync({
        id: nomina.id,
        payload: { aprobada: true }
      })
      success('Nómina aprobada correctamente')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al aprobar la nómina'
      error(msg)
    } finally {
      setLoading(nomina.id, 'aprobar', false)
    }
  }

  const handleMarcarPagada = async (nomina: NominaDTO) => {
    if (nomina.estado !== 'APROBADA') {
      error('Solo se pueden marcar como pagadas las nóminas aprobadas')
      return
    }

    try {
      setLoading(nomina.id, 'pagar', true)
      await marcarPagada.mutateAsync({
        id: nomina.id,
        fechaPago: new Date().toISOString()
      })
      success('Nómina marcada como pagada')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al marcar como pagada'
      error(msg)
    } finally {
      setLoading(nomina.id, 'pagar', false)
    }
  }

  const handleAnular = async (nomina: NominaDTO) => {
    if (nomina.estado === 'ANULADA') {
      error('La nómina ya está anulada')
      return
    }

    if (!confirm('¿Está seguro de anular esta nómina? Esta acción no se puede deshacer.')) {
      return
    }

    const motivo = prompt('Ingrese el motivo de anulación:')
    if (!motivo?.trim()) {
      error('Debe ingresar un motivo para anular la nómina')
      return
    }

    try {
      setLoading(nomina.id, 'anular', true)
      await anularNomina.mutateAsync({
        id: nomina.id,
        motivo: motivo.trim()
      })
      success('Nómina anulada correctamente')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al anular la nómina'
      error(msg)
    } finally {
      setLoading(nomina.id, 'anular', false)
    }
  }

  const handleEliminar = async (nomina: NominaDTO) => {
    if (nomina.estado !== 'BORRADOR') {
      error('Solo se pueden eliminar nóminas en borrador')
      return
    }

    if (!confirm('¿Está seguro de eliminar esta nómina? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setLoading(nomina.id, 'eliminar', true)
      await deleteNomina.mutateAsync(nomina.id)
      success('Nómina eliminada correctamente')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al eliminar la nómina'
      error(msg)
    } finally {
      setLoading(nomina.id, 'eliminar', false)
    }
  }

  const handleDownload = async (nomina: NominaDTO, formato: 'excel' | 'pdf') => {
    try {
      setLoading(nomina.id, `download-${formato}`, true)
      await downloadReport.mutateAsync({
        id: nomina.id,
        formato
      })
      success(`Descargando reporte en ${formato.toUpperCase()}`)
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? `Error al descargar ${formato.toUpperCase()}`
      error(msg)
    } finally {
      setLoading(nomina.id, `download-${formato}`, false)
    }
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando nóminas...</p>
        </div>
      </div>
    )
  }

  if (nominas.length === 0) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay nóminas</h3>
          <p className="mt-1 text-sm text-gray-500">Comience creando una nueva nómina.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Período</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Empleados</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Total Bruto</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Total Neto</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Fecha Creación</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nominas.map((nomina, index) => (
                <tr 
                  key={nomina.id} 
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{formatPeriodo(nomina.periodo)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getTipoNominaColor(nomina.tipoNomina)}`}>
                      {nomina.tipoNomina}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoNominaColor(nomina.estado)}`}>
                      {nomina.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {nomina.cantidadEmpleados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(nomina.totalBruto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(nomina.totalNeto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(nomina.fechaCreacion).toLocaleDateString('es-GT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    
                    {/* Botón Aprobar */}
                    {nomina.estado === 'BORRADOR' && (
                      <button
                        onClick={() => handleAprobar(nomina)}
                        disabled={loadingStates[nomina.id] === 'aprobar'}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Aprobar nómina"
                      >
                        {loadingStates[nomina.id] === 'aprobar' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Botón Marcar como Pagada */}
                    {nomina.estado === 'APROBADA' && (
                      <button
                        onClick={() => handleMarcarPagada(nomina)}
                        disabled={loadingStates[nomina.id] === 'pagar'}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Marcar como pagada"
                      >
                        {loadingStates[nomina.id] === 'pagar' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Botón Descargar Excel */}
                    {(nomina.estado === 'APROBADA' || nomina.estado === 'PAGADA') && (
                      <button
                        onClick={() => handleDownload(nomina, 'excel')}
                        disabled={loadingStates[nomina.id] === 'download-excel'}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar Excel"
                      >
                        {loadingStates[nomina.id] === 'download-excel' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Botón Descargar PDF */}
                    {(nomina.estado === 'APROBADA' || nomina.estado === 'PAGADA') && (
                      <button
                        onClick={() => handleDownload(nomina, 'pdf')}
                        disabled={loadingStates[nomina.id] === 'download-pdf'}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Descargar PDF"
                      >
                        {loadingStates[nomina.id] === 'download-pdf' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Botón Anular */}
                    {(nomina.estado === 'BORRADOR' || nomina.estado === 'APROBADA') && (
                      <button
                        onClick={() => handleAnular(nomina)}
                        disabled={loadingStates[nomina.id] === 'anular'}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Anular nómina"
                      >
                        {loadingStates[nomina.id] === 'anular' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Botón Eliminar */}
                    {nomina.estado === 'BORRADOR' && (
                      <button
                        onClick={() => handleEliminar(nomina)}
                        disabled={loadingStates[nomina.id] === 'eliminar'}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar nómina"
                      >
                        {loadingStates[nomina.id] === 'eliminar' ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} de{' '}
              {pagination.total} resultados
            </span>
            
            <select
              value={pagination.pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="ml-2 rounded border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number
              if (totalPages <= 5) {
                page = i + 1
              } else {
                if (pagination.page <= 3) {
                  page = i + 1
                } else if (pagination.page >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = pagination.page - 2 + i
                }
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`px-3 py-2 text-sm font-medium border ${
                    page === pagination.page
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}