import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExpedientesWithFilters, useExpedientesStats } from './hooks'
import { useToast } from '@/components/ui/Toast'
import ExpedientesTable from './components/ExpedientesTable'
import ExpedienteFilters from './components/ExpedienteFilters'
import ExpedienteUploadModal from './components/ExpedienteUploadModal'
import EmptyState from '@/components/ui/EmptyState'
import Loader from '@/components/ui/Loader'

export default function ExpedientesListPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [showUploadModal, setShowUploadModal] = useState(false)

  // Estados y filtros con debounce
  const {
    data,
    isLoading,
    isError,
    error: queryError,
    filters,
    page,
    pageSize,
    updateFilters,
    resetFilters,
    setPage,
    setPageSize
  } = useExpedientesWithFilters()

  // Estadísticas
  const { 
    data: stats, 
    isLoading: statsLoading 
  } = useExpedientesStats()

  const expedientes = data?.data ?? []
  const meta = data?.meta ?? { total: 0, page: 1, pageSize: 10, totalPages: 0 }

  const handleUploadSuccess = () => {
    setShowUploadModal(false)
    success('Documento subido al expediente correctamente')
  }

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            aria-label="Regresar"
          >
            ← Regresar
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Expedientes de Empleados
          </h1>
        </div>
        
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Subir Documento
        </button>
      </div>

      {/* Estadísticas */}
      {!statsLoading && stats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Total Expedientes</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalExpedientes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.expedientesActivos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6m0 0l6-6m-6 6V3" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Archivados</p>
                <p className="text-2xl font-bold text-amber-600">{stats.expedientesArchivados}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600">Tipos de Doc.</p>
                <p className="text-2xl font-bold text-purple-600">{stats.documentosPorTipo?.length ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6">
        <ExpedienteFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onResetFilters={resetFilters}
        />
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="mt-6">
          <div className="text-center py-8">
            <Loader />
            <p className="mt-4 text-gray-600">Cargando expedientes...</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
          <h3 className="font-semibold mb-2">Error al cargar expedientes</h3>
          <p className="text-sm mb-3">
            {queryError instanceof Error 
              ? queryError.message 
              : 'Hubo un problema al conectar con el servidor.'}
          </p>
          
          {/* Diagnóstico del error */}
          <div className="text-xs bg-rose-100 border border-rose-200 rounded p-3 mb-3">
            <strong>🔍 Diagnóstico:</strong>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Frontend: http://localhost:5175/ ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Backend: http://localhost:5009/ ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>
                  {queryError?.name === 'CORSError' 
                    ? 'CORS no configurado ❌' 
                    : 'Endpoints de expedientes no implementados ❌'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-blue-100 border border-blue-200 rounded p-3 mb-3">
            <strong>📝 Para el desarrollador del backend:</strong>
            <div className="mt-1">
              {queryError?.name === 'CORSError' ? (
                <div>
                  <p>Configurar CORS para permitir peticiones desde este origen.</p>
                </div>
              ) : (
                <div>
                  <p>Implementar endpoints de expedientes:</p>
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li><code>GET /api/expedientes</code></li>
                    <li><code>POST /api/expedientes</code></li>
                    <li><code>PUT /api/expedientes/&#123;id&#125;</code></li>
                    <li><code>DELETE /api/expedientes/&#123;id&#125;</code></li>
                    <li><code>GET /api/tipos-documento</code></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {!isLoading && !isError && (
        <>
          {expedientes.length === 0 ? (
            <EmptyState
              title="No hay expedientes"
              subtitle="No se encontraron expedientes con los filtros aplicados."
            />
          ) : (
            <>
              {/* Tabla de expedientes */}
              <ExpedientesTable
                expedientes={expedientes}
                page={page}
                pageSize={pageSize}
                total={meta.total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />

              {/* Información de paginación */}
              <div className="mt-4 bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Información de la consulta</span>
                </div>
                <p>
                  <strong>Total de expedientes:</strong> {meta.total}
                </p>
                <p className="mt-1">
                  <strong>Página actual:</strong> {meta.page} de {meta.totalPages}
                </p>
                <p className="mt-1">
                  <strong>Filtros aplicados:</strong> {' '}
                  {Object.entries(filters).filter(([_, value]) => value && value !== '').length > 0
                    ? Object.entries(filters)
                        .filter(([_, value]) => value && value !== '')
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')
                    : 'Ninguno (mostrando todos los expedientes)'}
                </p>
              </div>
            </>
          )}
        </>
      )}

      {/* Modal de upload */}
      <ExpedienteUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </section>
  )
}