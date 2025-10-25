import { Link } from 'react-router-dom'
import type { NominaDTO } from '../api'

interface NominasTableProps {
  rows: NominaDTO[]
  onDelete?: (id: number) => void
  onApprove?: (id: number) => void
  onMarkPaid?: (id: number) => void
}

function StatusPill({ estado }: { estado: string }) {
  const colors: Record<string, string> = {
    BORRADOR: 'bg-gray-100 text-gray-700 border-gray-300',
    APROBADA: 'bg-blue-100 text-blue-700 border-blue-300',
    PAGADA: 'bg-green-100 text-green-700 border-green-300',
    ANULADA: 'bg-red-100 text-red-700 border-red-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colors[estado] || colors.BORRADOR
      }`}
    >
      {estado}
    </span>
  )
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(value)

const formatPeriodo = (periodo: string) => {
  // "2025-01" => "Enero 2025"
  const [año, mes] = periodo.split('-')
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  const mesNombre = meses[parseInt(mes) - 1] || mes
  return `${mesNombre} ${año}`
}

export default function NominasTable({
  rows,
  onDelete,
  onApprove,
  onMarkPaid,
}: NominasTableProps) {
  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay nóminas registradas. Crea una nueva con el botón "Nueva Nómina".
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Periodo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Empleados
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Total Neto
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((nomina) => (
            <tr key={nomina.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatPeriodo(nomina.periodo)}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {nomina.id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">
                  {nomina.tipoNomina}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusPill estado={nomina.estado} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm text-gray-900">
                  {nomina.cantidadEmpleados}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(nomina.totalNeto)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/nomina/${nomina.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                  >
                    Ver
                  </Link>

                  {nomina.estado === 'BORRADOR' && onApprove && (
                    <button
                      onClick={() => onApprove(nomina.id)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-50 px-3 py-1.5 rounded-lg transition"
                    >
                      Aprobar
                    </button>
                  )}

                  {nomina.estado === 'APROBADA' && onMarkPaid && (
                    <button
                      onClick={() => onMarkPaid(nomina.id)}
                      className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                    >
                      Marcar Pagada
                    </button>
                  )}

                  {nomina.estado === 'BORRADOR' && onDelete && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `¿Estás seguro de eliminar la nómina de ${formatPeriodo(
                              nomina.periodo
                            )}?`
                          )
                        ) {
                          onDelete(nomina.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
