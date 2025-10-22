// src/features/departments/components/DepartmentsTable.tsx
import { Link } from 'react-router-dom';
import { useToggleDepartment } from '../hooks';
import type { DepartmentDTO } from '../api';
import StatusPill from '@/components/common/StatusPill';
import { useToast } from '@/components/ui/Toast';

type Props = { rows: DepartmentDTO[] };

export default function DepartmentsTable({ rows }: Props) {
  const toggle = useToggleDepartment();
  const { success, info, error } = useToast();

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay departamentos. Crea el primero con “Nuevo”.
      </div>
    );
  }

  const onToggle = (row: DepartmentDTO) => {
    const next = !row.activo; // si está activo, intentamos desactivar
    const verb = next ? 'activar' : 'desactivar';

    // Botón siempre activo: confirmamos, y si backend dice 409, mostramos el mensaje (regla C)
    if (!confirm(`¿Seguro que deseas ${verb} el departamento "${row.nombre}"?`))
      return;

    toggle.mutate(
      { id: row.id, activo: next },
      {
        onSuccess: () =>
          success(`Departamento ${next ? 'activado' : 'desactivado'}.`),
        onError: (e: any) => {
          const status = e?.response?.status;
          if (status === 409) {
            const d = e?.response?.data;
            const msg =
              d?.message ??
              'No se puede desactivar: hay puestos y/o empleados activos en este departamento.';
            info(msg);
            return;
          }
          error(
            e?.response?.data?.mensaje ?? 'No se pudo cambiar el estado.',
          );
        },
      },
    );
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-indigo-50 to-white text-left text-sm text-gray-600">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {rows.map((d, idx) => (
            <tr
              key={d.id}
              className={`transition ${idx % 2 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-indigo-50/40`}
            >
              <td className="px-4 py-3">{d.id}</td>
              <td className="px-4 py-3 font-medium">{d.nombre}</td>
              <td className="px-4 py-3">
                <StatusPill value={d.activo} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link
                    className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 transition hover:bg-amber-100"
                    to={`/departamentos/${d.id}/editar`}
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className={`rounded-lg px-3 py-1 text-white transition active:scale-[.98] ${
                      d.activo
                        ? 'bg-rose-600 hover:bg-rose-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                    disabled={toggle.isPending}
                    onClick={() => onToggle(d)}
                    title={
                      d.activo
                        ? 'Intentar desactivar'
                        : 'Activar departamento'
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
  );
}
