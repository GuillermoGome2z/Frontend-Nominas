import { useKpis } from '../features/dashboard/hooks'

export default function DashboardPage() {
  const { data, isLoading } = useKpis()

  const formatCurrency = (amount?: number) => {
    if (typeof amount !== 'number') return 'Q 0.00'
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
  }

  const formatDate = (date?: string) => {
    if (!date) return '—'
    const d = new Date(date)
    return isNaN(+d) ? '—' : d.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        
        {/* Header Premium */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Dashboard Ejecutivo
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm">Resumen general del sistema de nóminas</p>
            </div>
          </div>
        </div>

        {/* KPI Cards Premium */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/50 backdrop-blur-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Card 1 - Total Empleados */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-white text-xs font-semibold">+5%</span>
                  </div>
                </div>
                <div className="text-white/80 text-xs sm:text-sm font-medium mb-1">Total Empleados</div>
                <div className="text-white text-2xl sm:text-3xl font-bold">{data?.totalEmpleados ?? 0}</div>
              </div>
            </div>

            {/* Card 2 - Nómina Pendiente */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-white text-xs font-semibold">Pendiente</span>
                  </div>
                </div>
                <div className="text-white/80 text-xs sm:text-sm font-medium mb-1">Nómina Mensual</div>
                <div className="text-white text-xl sm:text-2xl md:text-3xl font-bold break-words">{formatCurrency(data?.nominaPendienteQ)}</div>
              </div>
            </div>

            {/* Card 3 - Próximo Pago */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="px-2 sm:px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                    <span className="text-white text-xs font-semibold">Próximo</span>
                  </div>
                </div>
                <div className="text-white/80 text-xs sm:text-sm font-medium mb-1">Fecha de Pago</div>
                <div className="text-white text-2xl sm:text-3xl font-bold">{formatDate(data?.proximoPago)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
          {/* Nóminas del Mes */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Nóminas Generadas</h3>
                <p className="text-xs sm:text-sm text-slate-600">Comparativa mensual</p>
              </div>
            </div>
            <div className="flex items-end gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-600 mb-2">Mes actual</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{data?.nominasGeneradasEnMes ?? 0}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-600 mb-2">Mes anterior</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-500">{data?.nominasGeneradasEnMesAnterior ?? 0}</div>
              </div>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Actividad Reciente</h3>
                <p className="text-xs sm:text-sm text-slate-600">Últimas acciones del sistema</p>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">✓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">Nóminas generadas este mes</p>
                  <p className="text-[10px] sm:text-xs text-slate-600">Mes en curso</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">📊</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">Mes anterior: Comparativo</p>
                  <p className="text-[10px] sm:text-xs text-slate-600">Mes anterior</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departamentos Activos */}
        {data?.activosPorDepartamento && data.activosPorDepartamento.length > 0 && (
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-4 sm:p-6 shadow-lg border border-white/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Empleados por Departamento</h3>
                <p className="text-xs sm:text-sm text-slate-600">Distribución actual de personal</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {data.activosPorDepartamento.map((dept, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-slate-900 mb-1 truncate">{dept.departamento}</div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-700">{dept.activos}</div>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl sm:text-2xl">👥</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
