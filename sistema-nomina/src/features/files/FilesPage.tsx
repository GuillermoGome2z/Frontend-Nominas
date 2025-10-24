import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExpedientes, useExpedienteStats } from './hooks/useExpedientes'
import { Search, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import type { ExpedienteFilters, EstadoExpediente } from './types/Expediente'

export default function FilesPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ExpedienteFilters>({
    page: 1,
    pageSize: 20,
  })

  const { data, isLoading } = useExpedientes(filters)
  const { data: stats } = useExpedienteStats()

  const expedientes = data?.data ?? []

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, q, page: 1 }))
  }

  const handleEstadoFilter = (estado?: EstadoExpediente) => {
    setFilters((prev) => ({ ...prev, estado, page: 1 }))
  }

  const getEstadoBadge = (estado: EstadoExpediente) => {
    const badges = {
      Completo: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      Incompleto: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      Pendiente: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock },
    }
    return badges[estado] || badges.Pendiente
  }

  const getProgressColor = (porcentaje: number) => {
    if (porcentaje >= 90) return 'bg-green-500'
    if (porcentaje >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expedientes de Empleados</h1>
        <p className="text-gray-600">Gestión y seguimiento de documentación laboral</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.totalEmpleados}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-500" />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Completos</p>
                <p className="text-2xl font-bold text-green-800">{stats.expedientesCompletos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700">Incompletos</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.expedientesIncompletos}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Pendientes</p>
                <p className="text-2xl font-bold text-gray-800">{stats.expedientesPendientes}</p>
              </div>
              <Clock className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar empleado..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleEstadoFilter()}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                !filters.estado ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleEstadoFilter('Completo')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filters.estado === 'Completo' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completos
            </button>
            <button
              onClick={() => handleEstadoFilter('Incompleto')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filters.estado === 'Incompleto'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Incompletos
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Lista de Expedientes */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expedientes.map((expediente) => {
            const badge = getEstadoBadge(expediente.estado)
            const BadgeIcon = badge.icon

            return (
              <div
                key={expediente.empleadoId}
                onClick={() => navigate(`/expedientes/${expediente.empleadoId}`)}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {expediente.foto ? (
                      <img
                        src={expediente.foto}
                        alt={expediente.nombreCompleto}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-lg">
                          {expediente.nombreCompleto.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{expediente.nombreCompleto}</h3>
                      <p className="text-sm text-gray-600">{expediente.puesto}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completitud</span>
                    <span className="font-semibold">{expediente.porcentajeCompletitud}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(expediente.porcentajeCompletitud)}`}
                      style={{ width: `${expediente.porcentajeCompletitud}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                    <BadgeIcon className="w-3 h-3" />
                    {expediente.estado}
                  </span>

                  {expediente.documentosPendientes > 0 && (
                    <span className="text-xs text-gray-600">
                      {expediente.documentosPendientes} pendientes
                    </span>
                  )}
                </div>

                {expediente.documentosVencidos > 0 && (
                  <div className="mt-2 px-3 py-1 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    ⚠️ {expediente.documentosVencidos} documento(s) vencido(s)
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && expedientes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">No se encontraron expedientes</p>
          <p className="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}

