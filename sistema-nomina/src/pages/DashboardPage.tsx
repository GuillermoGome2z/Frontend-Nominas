import { StatCard } from '../components/ui/StatCard'
import { ActivityItem } from '../components/ui/ActivityItem'
import { useKpis } from '../features/dashboard/hooks'

// Formateadores
function Q(amount?: number) {
  if (typeof amount !== 'number') return '—'
  try {
    return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(amount)
  } catch {
    return `Q${amount.toFixed(2)}`
  }
}
function F(date?: string) {
  if (!date) return '—'
  const d = new Date(date)
  return isNaN(+d) ? '—' : d.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useKpis()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Panel principal</h1>
        <p className="text-gray-600">Bienvenido al Sistema de Nómina y Gestión de RRHH.</p>
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          No se pudieron cargar los indicadores del dashboard.
          <div className="text-sm text-rose-600 mt-1">
            {(error as any)?.message ?? 'Intenta nuevamente más tarde.'}
          </div>
        </div>
      )}

      {/* KPIs */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl border bg-white shadow-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Empleados" value={String(data?.totalEmpleados ?? '—')} />
          <StatCard title="Nómina Pendiente" value={Q(data?.nominaPendienteQ)} />
          <StatCard title="Próximo Pago" value={F(data?.proximoPago)} />
        </div>
      )}

      {/* Actividad Reciente */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
        </div>

        {isLoading ? (
          <div className="p-5">
            <div className="h-4 w-2/3 bg-gray-100 rounded mb-3 animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-100 rounded mb-3 animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <ActivityItem
              icon={<span className="text-lg">✅</span>}
              title={`Nóminas generadas este mes: ${data?.nominasGeneradasEnMes ?? '—'}`}
              timestamp="Mes en curso"
              type="success"
            />
            <ActivityItem
              icon={<span className="text-lg">📊</span>}
              title={`Mes anterior: ${data?.nominasGeneradasEnMesAnterior ?? '—'}`}
              timestamp="Comparativo"
              type="info"
            />
            <ActivityItem
              icon={<span className="text-lg">🏢</span>}
              title="Activos por departamento"
              timestamp={
                Array.isArray(data?.activosPorDepartamento) && data!.activosPorDepartamento!.length > 0
                  ? data!.activosPorDepartamento!.map(d => `${d.departamento} (${d.activos})`).join(' · ')
                  : 'Sin datos disponibles.'
              }
              type="warning"
            />
          </div>
        )}
      </div>
    </div>
  )
}
