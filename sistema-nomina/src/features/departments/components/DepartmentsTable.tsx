import { Link } from 'react-router-dom'
import { useToggleDepartment } from '../hooks'
import type { DepartmentDTO } from '../api'
import StatusPill from '@/components/common/StatusPill' // o ruta relativa ../../components/common/StatusPill

type Props = { rows: DepartmentDTO[] }

export default function DepartmentsTable({ rows }: Props) {
  const toggle = useToggleDepartment()

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay departamentos. Crea el primero con “Nuevo”.
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
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((d, idx) => (
            <tr key={d.id} className={idx % 2 ? 'bg-white' : 'bg-gray-50/30'}>
              <td className="px-4 py-3">{d.id}</td>
              <td className="px-4 py-3">{d.nombre}</td>
              <td className="px-4 py-3"><StatusPill value={d.activo} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link className="rounded-lg border px-3 py-1 hover:bg-gray-50" to={`/departamentos/${d.id}/editar`}>
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    disabled={toggle.isPending}
                    onClick={() =>
                      toggle.mutate({ id: d.id, activo: !d.activo }, {
                        onError: (e:any)=> alert(e?.response?.data?.mensaje ?? 'No se pudo cambiar el estado.'),
                      })
                    }
                  >
                    {d.activo ? 'Desactivar' : 'Activar'}
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
