import { useState } from 'react'
import { 
  useNominasWithFilters, 
  useNominaStats, 
  formatCurrency 
} from './hooks'
import PayrollTable from './components/PayrollTable'
import PayrollFilters from './components/PayrollFilters'
import PayrollGenerationModal from './components/PayrollGenerationModal'
import { StatCard } from '@/components/ui/StatCard'

export default function PayrollListPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  
  // Datos principales
  const {
    data: nominasData,
    isLoading: nominasLoading,
    error: nominasError,
    filters,
    updateFilters,
    resetFilters,
    activeFiltersCount
  } = useNominasWithFilters({
    page: 1,
    pageSize: 10
  })

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useNominaStats()

  const nominas = nominasData?.data ?? []
  const pagination = nominasData?.meta

  // Handlers
  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    updateFilters({ page: 1, pageSize })
  }

  // Detectar errores de conectividad
  const hasConnectionError = (nominasError as any)?.code === 'ERR_NETWORK' || 
                           (statsError as any)?.code === 'ERR_NETWORK'

  const is404Error = (nominasError as any)?.response?.status === 404 ||
                    (statsError as any)?.response?.status === 404

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Nóminas</h1>
          <p className="mt-2 text-gray-600">
            Administre la generación, aprobación y pago de nóminas
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Nómina
        </button>
      </div>

      {/* Diagnósticos de conectividad */}
      {hasConnectionError && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-rose-800">Error de Conectividad</h3>
              <div className="mt-2 text-sm text-rose-700">
                <p>No se puede conectar con el servidor backend.</p>
                <p className="mt-1">• Verifique que el backend esté corriendo en <code className="bg-rose-100 px-1 py-0.5 rounded">localhost:5009</code></p>
                <p>• Revise la configuración CORS del servidor</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {is404Error && !hasConnectionError && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Endpoints No Implementados</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>Los endpoints de nóminas aún no están implementados en el backend:</p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li><code className="bg-amber-100 px-1 py-0.5 rounded">GET /api/nominas</code> - Listar nóminas</li>
                  <li><code className="bg-amber-100 px-1 py-0.5 rounded">GET /api/nominas/stats</code> - Estadísticas</li>
                  <li><code className="bg-amber-100 px-1 py-0.5 rounded">POST /api/nominas</code> - Crear nómina</li>
                </ul>
                <p className="mt-2">El frontend está listo. Contacte al desarrollador backend para implementar estos endpoints.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Nóminas del Mes"
          value={statsLoading ? '...' : (stats?.nominasDelMes?.toString() ?? '0')}
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
          </svg>}
        />
        <StatCard
          title="Nóminas Pendientes"
          value={statsLoading ? '...' : (stats?.nominasPendientes?.toString() ?? '0')}
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
        />
        <StatCard
          title="Total Pagado (Mes Actual)"
          value={statsLoading ? '...' : formatCurrency(stats?.totalPagadoMesActual)}
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>}
          trend={
            stats?.porcentajeCambio !== undefined
              ? {
                  value: `${Math.abs(stats.porcentajeCambio).toFixed(1)}% vs mes anterior`,
                  isPositive: stats.porcentajeCambio >= 0
                }
              : undefined
          }
        />
        <StatCard
          title="Empleados en Nómina"
          value={statsLoading ? '...' : (stats?.empleadosEnNomina?.toString() ?? '0')}
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>}
        />
      </div>
      
      {/* Información de promedio sueldo */}
      {stats?.promedioSueldoNeto && !statsLoading && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-indigo-800">
                Sueldo neto promedio: {formatCurrency(stats.promedioSueldoNeto)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      {stats?.proximaFechaPago && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">
                Próxima fecha de pago: {new Date(stats.proximaFechaPago).toLocaleDateString('es-GT', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <PayrollFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        activeCount={activeFiltersCount}
      />

      {/* Tabla de nóminas */}
      <PayrollTable
        nominas={nominas}
        loading={nominasLoading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pagination={pagination}
      />

      {/* Modal de generación */}
      <PayrollGenerationModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onSuccess={() => {
          // Refresh the data after successful generation
          window.location.reload()
        }}
      />
    </div>
  )
}
