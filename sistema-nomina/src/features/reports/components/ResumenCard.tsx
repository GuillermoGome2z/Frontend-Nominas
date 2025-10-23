import type { ResumenGeneral } from '../api'

interface ResumenCardProps {
  resumen: ResumenGeneral
}

export default function ResumenCard({ resumen }: ResumenCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const stats = [
    {
      name: 'Total Empleados',
      value: resumen.totalEmpleados,
      icon: '👥',
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      name: 'Empleados Activos',
      value: resumen.empleadosActivos,
      icon: '✅',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    {
      name: 'Empleados Suspendidos',
      value: resumen.empleadosSuspendidos,
      icon: '⏸️',
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
      name: 'Empleados Retirados',
      value: resumen.empleadosRetirados,
      icon: '❌',
      color: 'bg-red-50 border-red-200 text-red-700'
    },
    {
      name: 'Departamentos',
      value: resumen.totalDepartamentos,
      icon: '🏢',
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      name: 'Puestos de Trabajo',
      value: resumen.totalPuestos,
      icon: '💼',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700'
    },
    {
      name: 'Masa Salarial Total',
      value: formatCurrency(resumen.masaSalarialTotal),
      icon: '💰',
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      name: 'Promedio Salarial',
      value: formatCurrency(resumen.promedioSalarial),
      icon: '📊',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-700'
    }
  ]

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumen General</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`rounded-lg border p-4 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}