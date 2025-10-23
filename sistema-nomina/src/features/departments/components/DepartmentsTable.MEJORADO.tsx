// ✅ TABLA DE DEPARTAMENTOS CON VALIDACIÓN DE INTEGRIDAD REFERENCIAL
import { Link } from 'react-router-dom';
import { useToggleDepartment } from '../hooks';
import type { DepartmentDTO } from '../api';
import StatusPill from '@/components/common/StatusPill';
import { useToast } from '@/components/ui/Toast';
import { useState } from 'react';

type Props = { rows: DepartmentDTO[] };

export default function DepartmentsTable({ rows }: Props) {
  const toggle = useToggleDepartment();
  const { success, error } = useToast();
  const [conflictError, setConflictError] = useState<{ id: number; message: string } | null>(null);

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
          success(`Departamento ${next ? 'activado' : 'desactivado'}.`);
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
            
            setConflictError({ id: row.id, message: msg });
            return;
          }
          error(
            e?.response?.data?.mensaje ?? 
            e?.response?.data?.Message ??
            'No se pudo cambiar el estado.',
          );
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* Banner de error global si hay conflicto */}
      {conflictError && (
        <div className="animate-slide-down rounded-2xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100 p-5 shadow-xl ring-4 ring-rose-200/50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="h-7 w-7 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-rose-900">⚠️ Error de Integridad Referencial</h3>
              <p className="mt-2 text-sm leading-relaxed text-rose-800">
                {conflictError.message}
              </p>
              <p className="mt-3 text-xs font-medium text-rose-700">
                💡 <strong>Solución:</strong> Primero desactiva todos los puestos y empleados asociados a este departamento, luego podrás desactivarlo.
              </p>
            </div>
            <button
              onClick={() => setConflictError(null)}
              className="flex-shrink-0 rounded-lg p-1 text-rose-400 transition hover:bg-rose-200 hover:text-rose-600"
              aria-label="Cerrar alerta"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
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
            {rows.map((d, idx) => {
              const hasError = conflictError?.id === d.id;
              return (
                <tr
                  key={d.id}
                  className={`transition ${
                    hasError 
                      ? 'bg-rose-50 ring-2 ring-rose-300' 
                      : idx % 2 
                        ? 'bg-white' 
                        : 'bg-gray-50/40'
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-4 py-3">{d.id}</td>
                  <td className="px-4 py-3 font-medium">
                    {d.nombre}
                    {hasError && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Error
                      </span>
                    )}
                  </td>
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
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </span>
                        ) : (
                          d.activo ? 'Desactivar' : 'Activar'
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
  );
}
