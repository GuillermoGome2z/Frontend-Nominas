import { useState } from 'react'
import { useNominasWithFilters, useNominaStats, useNominasWithDetalles, useAprobarNomina, useMarcarNominaPagada, useDeleteNomina } from '../hooks'
import { useToast } from '@/components/ui/Toast'
import NominasTable from '../components/NominasTable'
import PayrollFilters from '../components/PayrollFilters'
import PayrollGenerationModal from '../components/PayrollGenerationModal'
import { StatCard } from '@/components/ui/StatCard'
import { ExportPanel } from '../components/ExportButtons'
import { formatCurrency } from '@/shared/format'
import type { NominaFilters } from '../api'

export default function PayrollMainPage() {
  const { success, error } = useToast()
  
  // Estados del componente
  const [filters, setFilters] = useState<NominaFilters>({
    page: 1,
    pageSize: 10
  })
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false)
  
  // Queries
  const {
    data: nominasData,
    isLoading: isLoadingNominas,
    error: nominasError,
    refetch
  } = useNominasWithFilters(filters)
  
  const {
    data: statsData,
    isLoading: isLoadingStats
  } = useNominaStats()
  
  // Hook para obtener nóminas con detalles completos (para exportación)
  const {
    data: nominasWithDetalles,
    isLoading: isLoadingDetalles
  } = useNominasWithDetalles(nominasData?.data || [])
  
  // Mutations
  const aprobarMutation = useAprobarNomina()
  const marcarPagadaMutation = useMarcarNominaPagada()
  const deleteMutation = useDeleteNomina()
  
  // Detectar errores de conectividad
  const hasConnectionError = (nominasError as any)?.code === 'ERR_NETWORK'
  const is404Error = (nominasError as any)?.response?.status === 404
  
  // Handlers
  const handleFiltersChange = (newFilters: Partial<NominaFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset a primera página al cambiar filtros
    }))
  }
  
  const handleResetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10
    })
  }
  
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }
  
  const handleApprove = async (id: number) => {
    try {
      await aprobarMutation.mutateAsync({
        id,
        payload: { aprobada: true }
      })
      success('Nómina aprobada correctamente')
      refetch()
    } catch {
      error('Error al aprobar la nómina')
    }
  }
  
  const handleMarkPaid = async (id: number) => {
    try {
      await marcarPagadaMutation.mutateAsync({ id })
      success('Nómina marcada como pagada')
      refetch()
    } catch {
      error('Error al marcar como pagada')
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta nómina?')) return
    
    try {
      await deleteMutation.mutateAsync(id)
      success('Nómina eliminada correctamente')
      refetch()
    } catch {
      error('Error al eliminar la nómina')
    }
  }
  
  const handleGenerationSuccess = () => {
    setIsGenerationModalOpen(false)
    success('Nómina generada correctamente')
    refetch()
  }
  
  // Contar filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'page' && key !== 'pageSize' && value !== undefined && value !== ''
  ).length
  
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
  
  if (is404Error) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                🚧 Endpoints de Nóminas No Encontrados
              </h3>
              <p className="text-sm text-yellow-700">
                El backend no responde en los endpoints de nóminas. Verifica que el servidor esté funcionando y que los endpoints estén implementados.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Nóminas</h1>
          <p className="text-gray-600">Administra las nóminas de tu empresa</p>
        </div>
        <button
          onClick={() => setIsGenerationModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Nómina
        </button>
      </div>
      
      {/* Estadísticas */}
      {statsData && !isLoadingStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Nóminas del Mes"
            value={statsData.nominasDelMes.toString()}
            trend={statsData.porcentajeCambio ? {
              value: `${Math.abs(statsData.porcentajeCambio).toFixed(1)}%`,
              isPositive: statsData.porcentajeCambio > 0
            } : undefined}
            icon="📊"
          />
          <StatCard
            title="Pendientes"
            value={statsData.nominasPendientes.toString()}
            icon="⏳"
          />
          <StatCard
            title="Total Pagado (Mes)"
            value={formatCurrency(statsData.totalPagadoMesActual)}
            trend={statsData.totalPagadoMesAnterior > 0 ? {
              value: `${Math.abs(((statsData.totalPagadoMesActual - statsData.totalPagadoMesAnterior) / statsData.totalPagadoMesAnterior * 100)).toFixed(1)}%`,
              isPositive: statsData.totalPagadoMesActual > statsData.totalPagadoMesAnterior
            } : undefined}
            icon="💰"
          />
          <StatCard
            title="Empleados en Nómina"
            value={statsData.empleadosEnNomina.toString()}
            icon="👥"
          />
        </div>
      )}
      
      {/* Indicador de Cumplimiento Legal Guatemala 2025 */}
      <div className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏛️</div>
            <div>
              <h3 className="font-semibold text-green-800">Sistema Actualizado - Guatemala 2025</h3>
              <p className="text-sm text-green-600">
                Cumplimiento legal: IGSS 4.83%, Bono Decreto Q250, Exenciones Aguinaldo/Bono14
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-green-700">✅ Conforme</div>
            <div className="text-xs text-green-600">Leyes laborales GT</div>
          </div>
        </div>
      </div>

      {/* Panel de Exportación */}  
      {nominasWithDetalles && nominasWithDetalles.length > 0 && (
        <div className="mb-6">
          <ExportPanel
            nominasData={nominasWithDetalles}
            totalEmpleados={statsData?.empleadosEnNomina || 0}
            isLoadingDetalles={isLoadingDetalles}
          />
        </div>
      )}      {/* Filtros */}
      <div className="mb-6">
        <PayrollFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
          activeCount={activeFiltersCount}
        />
      </div>
      
      {/* Tabla de Nóminas */}
      <div className="bg-white rounded-lg shadow">
        {isLoadingNominas ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <NominasTable
              rows={nominasData?.data || []}
              onApprove={handleApprove}
              onMarkPaid={handleMarkPaid}
              onDelete={handleDelete}
            />
            
            {/* Paginación */}
            {nominasData && nominasData.meta.total > nominasData.meta.pageSize && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((nominasData.meta.page - 1) * nominasData.meta.pageSize) + 1} a{' '}
                  {Math.min(nominasData.meta.page * nominasData.meta.pageSize, nominasData.meta.total)} de{' '}
                  {nominasData.meta.total} nóminas
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(nominasData.meta.page - 1)}
                    disabled={nominasData.meta.page <= 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(nominasData.meta.page + 1)}
                    disabled={nominasData.meta.page * nominasData.meta.pageSize >= nominasData.meta.total}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modal de Generación */}
      <PayrollGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onSuccess={handleGenerationSuccess}
      />
    </div>
  )
}