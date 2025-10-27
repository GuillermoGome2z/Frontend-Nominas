import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useNomina, useNominaDetalle, useAprobarNomina, useMarcarNominaPagada, useAnularNomina } from '../hooks'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency, formatDateTime } from '@/shared/format'

const formatDate = (dateString: string) => {
  return formatDateTime(dateString)
}
import Loader from '@/components/ui/Loader'
import type { NominaDetalleDTO, EstadoNomina } from '../api'

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { success, error } = useToast()
  const [selectedTab, setSelectedTab] = useState<'general' | 'empleados' | 'conceptos'>('general')
  
  const nominaId = id ? parseInt(id, 10) : undefined
  
  // Queries
  const {
    data: nomina,
    isLoading: isLoadingNomina,
    error: nominaError,
    refetch
  } = useNomina(nominaId)
  
  const {
    data: detalleData,
    isLoading: isLoadingDetalle
  } = useNominaDetalle(nominaId)
  
  // Mutations
  const aprobarMutation = useAprobarNomina()
  const marcarPagadaMutation = useMarcarNominaPagada()
  const anularMutation = useAnularNomina()
  
  // Handlers
  const handleApprove = async () => {
    if (!nominaId) return
    try {
      await aprobarMutation.mutateAsync({
        id: nominaId,
        payload: { aprobada: true }
      })
      success('Nómina aprobada correctamente')
      refetch()
    } catch {
      error('Error al aprobar la nómina')
    }
  }
  
  const handleMarkPaid = async () => {
    if (!nominaId) return
    try {
      await marcarPagadaMutation.mutateAsync({ id: nominaId })
      success('Nómina marcada como pagada')
      refetch()
    } catch {
      error('Error al marcar como pagada')
    }
  }
  
  const handleCancel = async () => {
    if (!nominaId || !confirm('¿Estás seguro de que deseas anular esta nómina?')) return
    
    const motivo = prompt('Motivo de anulación:')
    if (!motivo) return
    
    try {
      await anularMutation.mutateAsync({ id: nominaId, motivo })
      success('Nómina anulada correctamente')
      refetch()
    } catch {
      error('Error al anular la nómina')
    }
  }
  
  // Estados
  const hasConnectionError = (nominaError as any)?.code === 'ERR_NETWORK'
  const is404Error = (nominaError as any)?.response?.status === 404
  
  if (hasConnectionError) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de Conexión</h1>
          <p className="text-gray-600">No se pudo conectar con el servidor</p>
        </div>
      </div>
    )
  }
  
  if (is404Error || (!isLoadingNomina && !nomina)) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nómina No Encontrada</h1>
          <p className="text-gray-600 mb-4">La nómina solicitada no existe o no tienes permisos para verla</p>
          <Link
            to="/nominas"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ← Volver a Nóminas
          </Link>
        </div>
      </div>
    )
  }
  
  if (isLoadingNomina) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <Loader />
      </div>
    )
  }
  
  if (!nomina) return null
  
  const getStatusColor = (estado: EstadoNomina) => {
    switch (estado) {
      case 'BORRADOR': return 'bg-gray-100 text-gray-800'
      case 'APROBADA': return 'bg-green-100 text-green-800'
      case 'PAGADA': return 'bg-blue-100 text-blue-800'
      case 'ANULADA': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
  
  const canApprove = nomina.estado === 'BORRADOR'
  const canMarkPaid = nomina.estado === 'APROBADA'
  const canCancel = nomina.estado === 'BORRADOR' || nomina.estado === 'APROBADA'
  
  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/nominas"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            ← Volver a Nóminas
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Nómina {nomina.periodo} - ID #{nomina.id}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nomina.estado)}`}>
                {nomina.estado}
              </span>
              <span className="text-sm text-gray-500">{nomina.tipoNomina}</span>
              {nomina.fechaCreacion && (
                <span className="text-sm text-gray-500">
                  Creada: {formatDate(nomina.fechaCreacion)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Acciones */}
        <div className="flex gap-2">
          {canApprove && (
            <button
              onClick={handleApprove}
              disabled={aprobarMutation.isPending}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {aprobarMutation.isPending ? 'Aprobando...' : 'Aprobar'}
            </button>
          )}
          {canMarkPaid && (
            <button
              onClick={handleMarkPaid}
              disabled={marcarPagadaMutation.isPending}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {marcarPagadaMutation.isPending ? 'Marcando...' : 'Marcar Pagada'}
            </button>
          )}
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={anularMutation.isPending}
              className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {anularMutation.isPending ? 'Anulando...' : 'Anular'}
            </button>
          )}
        </div>
      </div>
      
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Empleados</div>
          <div className="text-2xl font-bold text-gray-900">{nomina.cantidadEmpleados}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Total Bruto</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(nomina.totalBruto)}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Deducciones</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(nomina.totalDeducciones)}</div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="text-sm text-gray-500">Total Neto</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(nomina.totalNeto)}</div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'general', label: 'Información General' },
              { key: 'empleados', label: 'Empleados' },
              { key: 'conceptos', label: 'Conceptos' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {selectedTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detalles</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Periodo:</dt>
                      <dd className="text-sm font-medium text-gray-900">{nomina.periodo}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Tipo:</dt>
                      <dd className="text-sm font-medium text-gray-900">{nomina.tipoNomina}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Estado:</dt>
                      <dd>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(nomina.estado)}`}>
                          {nomina.estado}
                        </span>
                      </dd>
                    </div>
                    {nomina.creadoPor && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Creado por:</dt>
                        <dd className="text-sm font-medium text-gray-900">{nomina.creadoPor}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fechas</h3>
                  <dl className="space-y-2">
                    {nomina.fechaCreacion && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Creación:</dt>
                        <dd className="text-sm font-medium text-gray-900">{formatDate(nomina.fechaCreacion)}</dd>
                      </div>
                    )}
                    {nomina.fechaAprobacion && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Aprobación:</dt>
                        <dd className="text-sm font-medium text-gray-900">{formatDate(nomina.fechaAprobacion)}</dd>
                      </div>
                    )}
                    {nomina.fechaPago && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-500">Pago:</dt>
                        <dd className="text-sm font-medium text-gray-900">{formatDate(nomina.fechaPago)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              {nomina.observaciones && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Observaciones</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {nomina.observaciones}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'empleados' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lista de Empleados</h3>
              {isLoadingDetalle ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : detalleData && detalleData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empleado
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Salario Base
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bonificaciones
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                          IGSS
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                          ISR
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                          Otras Deduc.
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">
                          Total Neto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {detalleData.map((detalle: NominaDetalleDTO) => (
                        <tr key={detalle.empleadoId} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {detalle.nombreCompleto}
                            </div>
                            <div className="text-sm text-gray-500">
                              {detalle.departamento}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {formatCurrency(detalle.salarioBase)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-green-600">
                            {formatCurrency(detalle.bonificaciones + detalle.comisiones + detalle.horasExtraValor)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-red-600">
                            Q {detalle.igss.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-red-600">
                            Q {detalle.isr.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-red-600">
                            Q {(detalle.prestamos + detalle.anticipos + detalle.otrosDeducciones).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                            {formatCurrency(detalle.sueldoNeto)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay empleados en esta nómina
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'conceptos' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conceptos de Nómina</h3>
              <div className="text-center py-8 text-gray-500">
                Esta funcionalidad está en desarrollo
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}