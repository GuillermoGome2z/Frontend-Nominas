import { Link } from 'react-router-dom'
import type { PositionDTO } from '../api'
import { useTogglePosition } from '../hooks'
import { useToast } from '@/components/ui/Toast'
import { useQuery } from '@tanstack/react-query'
import { listDepartments, type DepartmentDTO } from '@/features/departments/api'

function StatusPill({ value }: { value: boolean }) {
  const cls = value
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-50 text-gray-600 border-gray-200'
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {value ? 'Activo' : 'Inactivo'}
    </span>
  )
}

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—'

type Props = { rows: PositionDTO[] }

export default function PositionsTable({ rows }: Props) {
  const toggle = useTogglePosition()
  const { success, info, error } = useToast()

  const { data: depts } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  })
  const deptMap = new Map<number, string>(
    (depts?.data ?? []).map((d: DepartmentDTO) => [d.id, d.nombre])
  )

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay puestos. Crea el primero con “Nuevo”.
      </div>
    )
  }

  const onToggle = (row: PositionDTO) => {
    const next = !row.activo
    const verb = next ? 'activar' : 'desactivar'
    if (!confirm(`¿Seguro que deseas ${verb} el puesto "${row.nombre}"?`)) return
    toggle.mutate({ id: row.id, activo: next }, {
      onSuccess: () => success(`Puesto ${next ? 'activado' : 'desactivado'}.`),
      onError: (e:any) => {
        const status = e?.response?.status
        if (status === 409) {
          const d = e?.response?.data
          const msg = d?.message ?? 'No se puede desactivar: hay empleados activos en este puesto.'
          info(msg); return
        }
        error(e?.response?.data?.mensaje ?? 'No se pudo cambiar el estado.')
      },
    })
  }

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-indigo-50 to-white text-left text-sm text-gray-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Departamento</th>
            <th className="px-4 py-3">Salario base</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((p, idx) => (
            <tr key={p.id} className={`transition ${idx % 2 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-indigo-50/40`}>
              <td className="px-4 py-3">{p.id}</td>
              <td className="px-4 py-3 font-medium">{p.nombre}</td>
              <td className="px-4 py-3">{deptMap.get(p.departamentoId ?? -1) ?? '—'}</td>
              <td className="px-4 py-3">{fmtCurrency(p.salarioBase)}</td>
              <td className="px-4 py-3"><StatusPill value={p.activo} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 hover:bg-amber-100 transition"
                    to={`/puestos/${p.id}/editar`}
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className={`rounded-lg px-3 py-1 text-white transition active:scale-[.98] ${p.activo ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    disabled={toggle.isPending}
                    onClick={() => onToggle(p)}
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
