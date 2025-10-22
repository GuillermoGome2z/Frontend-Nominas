import { Link } from 'react-router-dom'
import type { EmployeeDTO } from '../api'
import StatusPill from './StatusPill'

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—'

type Props = {
  rows: EmployeeDTO[]
  onToggle: (id: number, nextActivo: boolean) => void
}

export default function EmployeesTable({ rows, onToggle }: Props) {
  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay empleados. Crea el primero con “Nuevo empleado”.
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50 text-left text-sm text-gray-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Departamento</th>
            <th className="px-4 py-3">Puesto</th> {/* ⟵ nueva */}
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Salario</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((e, idx) => {
            const hasId = Number.isFinite(e?.id) && Number(e.id) > 0
            const activo = (e?.estadoLaboral ?? 'ACTIVO') === 'ACTIVO'
            const toggleLabel = activo ? 'Desactivar' : 'Activar'
            return (
              <tr key={hasId ? e.id : `row-${idx}`} className={idx % 2 ? 'bg-white' : 'bg-gray-50/30'}>
                <td className="px-4 py-3">{hasId ? e.id : '—'}</td>
                <td className="px-4 py-3">{e?.nombreCompleto || '—'}</td>
                <td className="px-4 py-3">{e?.nombreDepartamento ?? '—'}</td>
                <td className="px-4 py-3">{e?.nombrePuesto ?? '—'}</td> {/* ⟵ nueva */}
                <td className="px-4 py-3"><StatusPill value={e?.estadoLaboral} /></td>
                <td className="px-4 py-3">{fmtCurrency(e?.salarioMensual)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      className={`rounded-lg border px-3 py-1 hover:bg-gray-50 ${!hasId ? 'pointer-events-none opacity-50' : ''}`}
                      to={hasId ? `/empleados/${e.id}` : '#'}
                    >
                      Detalle
                    </Link>
                    <Link
                      className={`rounded-lg border px-3 py-1 hover:bg-gray-50 ${!hasId ? 'pointer-events-none opacity-50' : ''}`}
                      to={hasId ? `/empleados/${e.id}/editar` : '#'}
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => hasId && onToggle(e.id, !activo)}
                      disabled={!hasId}
                      className={`rounded-lg border px-3 py-1 ${
                        activo ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-700 hover:bg-emerald-50'
                      } ${!hasId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {toggleLabel}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
