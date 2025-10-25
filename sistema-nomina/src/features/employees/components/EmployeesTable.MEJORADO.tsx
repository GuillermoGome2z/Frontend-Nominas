// ✅ TABLA DE EMPLEADOS CON VALIDACIÓN Y ESTILOS MEJORADOS (igual que Departamentos/Puestos)
import { Link } from 'react-router-dom';
import type { EmployeeDTO } from '../api';
import StatusPill from './StatusPill';
import { useState } from 'react';

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—';

type Props = {
  rows: EmployeeDTO[];
  onToggle: (id: number, nextActivo: boolean) => void;
  isToggling?: boolean;
};

export default function EmployeesTable({ rows, onToggle, isToggling }: Props) {
  const [errorId, setErrorId] = useState<number | null>(null);

  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay empleados. Crea el primero con "Nuevo empleado".
      </div>
    );
  }

  const handleToggle = (e: EmployeeDTO) => {
    const activo = (e?.estadoLaboral ?? 'ACTIVO') === 'ACTIVO';
    const nextActivo = !activo;
    const verb = nextActivo ? 'activar' : 'desactivar';

    setErrorId(null);

    if (!confirm(`¿Seguro que deseas ${verb} al empleado "${e.nombreCompleto}"?`)) {
      return;
    }

    onToggle(e.id, nextActivo);
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Tabla con estilos mejorados (igual que DepartmentsTable/PositionsTable) */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg ring-1 ring-black/5">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-white text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Departamento</th>
              <th className="px-4 py-3">Puesto</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Salario</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((e, idx) => {
              const hasId = Number.isFinite(e?.id) && Number(e.id) > 0;
              const activo = (e?.estadoLaboral ?? 'ACTIVO') === 'ACTIVO';
              const hasError = errorId === e.id;

              return (
                <tr
                  key={hasId ? e.id : `row-${idx}`}
                  className={`transition ${
                    hasError
                      ? 'bg-rose-50 ring-2 ring-rose-300'
                      : idx % 2
                        ? 'bg-white'
                        : 'bg-gray-50/40'
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-4 py-3">{hasId ? e.id : '—'}</td>
                  <td className="px-4 py-3 font-medium">
                    {e?.nombreCompleto || '—'}
                    {hasError && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Error
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{e?.nombreDepartamento ?? '—'}</td>
                  <td className="px-4 py-3">{e?.nombrePuesto ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusPill value={e?.estadoLaboral} />
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700">
                    {fmtCurrency(e?.salarioMensual)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        className={`rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1 text-indigo-800 transition hover:bg-indigo-100 ${
                          !hasId ? 'pointer-events-none opacity-50' : ''
                        }`}
                        to={hasId ? `/empleados/${e.id}` : '#'}
                      >
                        Detalle
                      </Link>
                      <Link
                        className={`rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-amber-800 transition hover:bg-amber-100 ${
                          !hasId ? 'pointer-events-none opacity-50' : ''
                        }`}
                        to={hasId ? `/empleados/${e.id}/editar` : '#'}
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => hasId && handleToggle(e)}
                        disabled={!hasId || isToggling}
                        className={`rounded-lg px-3 py-1 text-white transition active:scale-[.98] ${
                          activo
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        } ${!hasId || isToggling ? 'cursor-wait opacity-50' : ''}`}
                        title={
                          activo
                            ? 'Cambiar estado a SUSPENDIDO'
                            : 'Cambiar estado a ACTIVO'
                        }
                      >
                        {isToggling ? (
                          <span className="flex items-center gap-1">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                        ) : activo ? (
                          'Desactivar'
                        ) : (
                          'Activar'
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
