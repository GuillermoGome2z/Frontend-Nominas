import { Link } from 'react-router-dom'
import type { PositionDTO } from '../api'
import { useTogglePosition } from '../hooks'

function StatusPill({ value }: { value: boolean }) {
  const cls = value ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>{value ? 'Activo' : 'Inactivo'}</span>
}

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—'

type Props = { rows: PositionDTO[] }

export default function PositionsTable({ rows }: Props) {
  const toggle = useTogglePosition()

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay puestos. Crea el primero con “Nuevo”.
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
            <th className="px-4 py-3">Salario base</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((p, idx) => (
            <tr key={p.id} className={idx % 2 ? 'bg-white' : 'bg-gray-50/30'}>
              <td className="px-4 py-3">{p.id}</td>
              <td className="px-4 py-3">{p.nombre}</td>
              <td className="px-4 py-3">{fmtCurrency(p.salarioBase)}</td>
              <td className="px-4 py-3"><StatusPill value={p.activo} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link className="rounded-lg border px-3 py-1 hover:bg-gray-50" to={`/puestos/${p.id}/editar`}>
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate({ id: p.id, activo: !p.activo }, {
                        onError: (e:any)=> alert(e?.response?.data?.mensaje ?? 'No se pudo cambiar el estado.'),
                      })
                    }
                  >
                    {p.activo ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
