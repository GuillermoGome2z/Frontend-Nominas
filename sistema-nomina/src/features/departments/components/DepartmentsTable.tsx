// ✅ TABLA DE DEPARTAMENTOS CON VALIDACIÓN DE INTEGRIDAD REFERENCIAL
import { Link } from 'react-router-dom';
import { useToggleDepartment } from '../hooks';
import type { DepartmentDTO } from '../api';
import StatusPill from '@/components/common/StatusPill';
import { useAlert } from '@/components/ui/AlertContext';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';

type Props = { rows: DepartmentDTO[] };

export default function DepartmentsTable({ rows }: Props) {
  const toggle = useToggleDepartment();
  const { showSuccess, showError } = useAlert();
  const [conflictError, setConflictError] = useState<{ message: string; solution: string } | null>(null);

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay departamentos. Crea el primero con "Nuevo".
      </div>
    );
  }

  const onToggle = (row: DepartmentDTO) => {
    const next = !row.activo;
    const verb = next ? 'activar' : 'desactivar';

    setConflictError(null);

    if (!confirm(`¿Seguro que deseas ${verb} el departamento "${row.nombre}"?`))
      return;

    toggle.mutate(
      { id: row.id, activo: next },
      {
        onSuccess: () => {
          showSuccess(`Departamento ${next ? 'activado' : 'desactivado'}.`);
          setConflictError(null);
        },
        onError: (e: any) => {
          const status = e?.response?.status;
          if (status === 409) {
            const d = e?.response?.data;
            const msg =
              d?.message ??
              d?.Message ??
              'No se puede desactivar este departamento porque tiene puestos y/o empleados activos asociados.';
            
            setConflictError({ 
              message: msg,
              solution: 'Desactiva primero los puestos y empleados asociados.'
            });
            return;
          }
          showError(
            e?.response?.data?.mensaje ?? 
            e?.response?.data?.Message ??
            'No se pudo cambiar el estado.',
          );
        },
      },
    );
  };

  return (
    <>
      {/* Modal flotante centrado con backdrop borroso */}
      <Modal
        isOpen={!!conflictError}
        onClose={() => setConflictError(null)}
        type="error"
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
              <th className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">Estado</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-right whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            {rows.map((d, idx) => {
              return (
                <tr
                  key={d.id}
                  className={`transition ${
                    idx % 2 
                      ? 'bg-white' 
                      : 'bg-gray-50/40'
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{d.id}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium whitespace-nowrap">
                    <span className="max-w-[150px] sm:max-w-none inline-block truncate">{d.nombre}</span>
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <StatusPill value={d.activo} />
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Link
                        className="rounded-lg border border-amber-300 bg-amber-50 px-2 sm:px-3 py-1 text-amber-800 transition hover:bg-amber-100 text-xs sm:text-sm"
                        to={`/departamentos/${d.id}/editar`}
                      >
                        <span className="hidden sm:inline">Editar</span>
                        <span className="sm:hidden">✏️</span>
                      </Link>
                      <button
                        type="button"
                        className={`rounded-lg px-2 sm:px-3 py-1 text-white transition active:scale-[.98] text-xs sm:text-sm ${
                          d.activo
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        } ${toggle.isPending ? 'cursor-wait opacity-50' : ''}`}
                        disabled={toggle.isPending}
                        onClick={() => onToggle(d)}
                        title={
                          d.activo
                            ? 'Intentar desactivar (validará empleados/puestos)'
                            : 'Activar departamento'
                        }
                      >
                        {toggle.isPending ? (
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </span>
                        ) : (
                          <>
                            <span className="hidden sm:inline">{d.activo ? 'Desactivar' : 'Activar'}</span>
                            <span className="sm:hidden">{d.activo ? '❌' : '✅'}</span>
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
