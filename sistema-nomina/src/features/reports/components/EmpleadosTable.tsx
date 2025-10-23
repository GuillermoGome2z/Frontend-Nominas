import type { EmpleadoReporte } from '../api'
import StatusPill from '../../../components/common/StatusPill'

interface EmpleadosTableProps {
  empleados: EmpleadoReporte[]
  isLoading?: boolean
}

export default function EmpleadosTable({ empleados, isLoading = false }: EmpleadosTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('es-GT')
    } catch {
      return '—'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalle de Empleados</h3>
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse text-slate-500">Cargando empleados...</div>
        </div>
      </div>
    )
  }

  if (empleados.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Detalle de Empleados</h3>
        <div className="text-center py-16">
          <div className="text-slate-500 mb-2">📋</div>
          <p className="text-slate-500">No se encontraron empleados con los filtros aplicados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-slate-900">
          Detalle de Empleados ({empleados.length})
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Empleado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                DPI
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Puesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Salario
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Contratación
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Antigüedad
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {empleados.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{emp.nombreCompleto}</div>
                    <div className="text-sm text-slate-500">{emp.correo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-900">{emp.dpi}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{emp.departamento}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{emp.puesto}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill value={emp.estadoLaboral} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-slate-900">
                    {formatCurrency(emp.salarioMensual)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">{formatDate(emp.fechaContratacion)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {emp.antiguedadAnios} {emp.antiguedadAnios === 1 ? 'año' : 'años'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}