// ✅ TABLA DE PUESTOS CON VALIDACIÓN DE INTEGRIDAD REFERENCIAL
import { Link } from 'react-router-dom';
import type { PositionDTO } from '../api';
import { useTogglePosition } from '../hooks';
import { useAlert } from '@/components/ui/AlertContext';
import { useQuery } from '@tanstack/react-query';
import { listDepartments, type DepartmentDTO } from '@/features/departments/api';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

function StatusPill({ value }: { value: boolean }) {
  const cls = value
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${cls}`}>
      {value ? 'Activo' : 'Inactivo'}
    </span>
  );
}

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—';

type Props = { rows: PositionDTO[] };

export default function PositionsTable({ rows }: Props) {
  const toggle = useTogglePosition();
  const { showSuccess, showError } = useAlert();
  const [conflictError, setConflictError] = useState<{ message: string; solution: string } | null>(null);

  const { data: depts } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  });
  const deptMap = new Map<number, string>(
    (depts?.data ?? []).map((d: DepartmentDTO) => [d.id, d.nombre])
  );

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay puestos. Crea el primero con "Nuevo".
      </div>
    );
  }

  const onToggle = (row: PositionDTO) => {
    const next = !row.activo;
    const verb = next ? 'activar' : 'desactivar';

    setConflictError(null);

    if (!confirm(`¿Seguro que deseas ${verb} el puesto "${row.nombre}"?`)) return;

    toggle.mutate(
      { id: row.id, activo: next },
      {
        onSuccess: () => {
          showSuccess(`Puesto ${next ? 'activado' : 'desactivado'}.`);
          setConflictError(null);
        },
        onError: (e: any) => {
          const status = e?.response?.status;
          if (status === 409) {
            const d = e?.response?.data;
            const msg =
              d?.message ??
              d?.Message ??
              'No se puede desactivar este puesto porque tiene empleados activos asignados.';
            
            setConflictError({ 
              message: msg,
              solution: 'Reasigna o desactiva los empleados primero.'
            });
            return;
          }
          showError(
            e?.response?.data?.mensaje ??
            e?.response?.data?.Message ??
            'No se pudo cambiar el estado.'
          );
        },
      }
    );
  };

  return (
    <>
      {/* Modal flotante centrado con backdrop borroso */}
      <Modal
        isOpen={!!conflictError}
        onClose={() => setConflictError(null)}
        type="warning"
        title="Error de Integridad Referencial"
        message={conflictError?.message ?? ''}
        solution={conflictError?.solution}
      />

      <div className="space-y-3 sm:space-y-4">
        {/* Tabla con scroll horizontal en mobile */}
        <div className="overflow-x-auto rounded-xl sm:rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
          <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-white text-left text-xs sm:text-sm text-gray-600">
            <tr>
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">ID</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Nombre</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Departamento</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Salario base</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Estado</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {rows.map((p, idx) => {
              return (
                <tr
                  key={p.id}
                  className={`transition ${
                    idx % 2
                      ? 'bg-white'
                      : 'bg-gray-50/40'
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{p.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium whitespace-nowrap">
                    <span className="max-w-[120px] sm:max-w-none inline-block truncate">{p.nombre}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span className="max-w-[100px] sm:max-w-none inline-block truncate">{deptMap.get(p.departamentoId ?? -1) ?? '—'}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-emerald-700 whitespace-nowrap">{fmtCurrency(p.salarioBase)}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <StatusPill value={p.activo} />
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Link
                        className="rounded-lg border border-amber-300 bg-amber-50 px-2 sm:px-3 py-1 text-amber-800 transition hover:bg-amber-100 text-xs sm:text-sm"
                        to={`/puestos/${p.id}/editar`}
                      >
                        <span className="hidden sm:inline">Editar</span>
                        <span className="sm:hidden">✏️</span>
                      </Link>
                      <button
                        type="button"
                        className={`rounded-lg px-2 sm:px-3 py-1 text-white transition active:scale-[.98] text-xs sm:text-sm ${
                          p.activo
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        } ${toggle.isPending ? 'cursor-wait opacity-50' : ''}`}
                        disabled={toggle.isPending}
                        onClick={() => onToggle(p)}
                        title={
                          p.activo
                            ? 'Intentar desactivar (validará empleados activos)'
                            : 'Activar puesto'
                        }
                      >
                        {toggle.isPending ? (
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </span>
                        ) : (
                          <>
                            <span className="hidden sm:inline">{p.activo ? 'Desactivar' : 'Activar'}</span>
                            <span className="sm:hidden">{p.activo ? '❌' : '✅'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}
