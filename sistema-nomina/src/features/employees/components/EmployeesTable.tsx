import { Link } from 'react-router-dom';
import Loader from '../../../components/ui/Loader';
import type { EmployeeDTO } from '../types';
import StatusPill from '../../../components/common/StatusPill';
import { formatCurrency } from '../../../shared/format';

interface EmployeesTableProps {
  employees: EmployeeDTO[];
  isLoading: boolean;
  onToggle: (id: number, shouldActivate: boolean) => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  onToggle,
}: EmployeesTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border-2 border-dashed border-slate-300/60 bg-gradient-to-br from-slate-50 to-slate-100/30 p-12 text-center shadow-inner">
        <div className="mx-auto max-w-md">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay empleados registrados</h3>
          <p className="text-slate-500 text-sm">
            Comienza agregando empleados a tu sistema de nóminas. 
            <br />
            Usa el botón <span className="font-medium text-blue-600">"✨ Nuevo empleado"</span> para empezar.
          </p>
        </div>
      </div>
    );
  }

  const handleToggle = (id: number, estadoActual: string | undefined) => {
    const esActivo = (estadoActual || '').toUpperCase() === 'ACTIVO';
    const accion = esActivo ? 'suspender' : 'activar';
    
    if (window.confirm(`¿Está seguro que desea ${accion} este empleado?`)) {
      onToggle(id, !esActivo);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200/50 bg-white shadow-lg ring-1 ring-slate-900/5">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 text-left text-sm font-semibold text-slate-700">
          <tr>
            <th className="px-6 py-4 first:rounded-tl-2xl">ID</th>
            <th className="px-6 py-4">👤 Nombre</th>
            <th className="px-6 py-4">🏢 Departamento</th>
            <th className="px-6 py-4">💼 Puesto</th>
            <th className="px-6 py-4">📊 Estado</th>
            <th className="px-6 py-4">💰 Salario</th>
            <th className="px-6 py-4 text-right last:rounded-tr-2xl">⚡ Acciones</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {employees.map((e, idx) => {
            const hasId = Number.isFinite(e?.id) && Number(e.id) > 0
            const activo = (e?.estadoLaboral ?? 'ACTIVO') === 'ACTIVO'
            const toggleLabel = activo ? 'Desactivar' : 'Activar'
            return (
              <tr 
                key={hasId ? e.id : `row-${idx}`} 
                className={`transition-all hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 ${
                  idx % 2 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600">
                  {hasId ? `#${e.id}` : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{e?.nombreCompleto || '—'}</div>
                  <div className="text-xs text-slate-500">{e?.correo || ''}</div>
                </td>
                <td className="px-6 py-4 text-slate-700">{e?.nombreDepartamento ?? '—'}</td>
                <td className="px-6 py-4 text-slate-700">{e?.nombrePuesto ?? '—'}</td>
                <td className="px-6 py-4"><StatusPill value={e?.estadoLaboral} /></td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-emerald-700">{formatCurrency(e?.salarioMensual ?? 0)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      className={`inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md ${
                        !hasId ? 'pointer-events-none opacity-50' : ''
                      }`}
                      to={hasId ? `/empleados/${e.id}` : '#'}
                    >
                      👁️ Detalle
                    </Link>
                    <Link
                      className={`inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-100 hover:shadow-md ${
                        !hasId ? 'pointer-events-none opacity-50' : ''
                      }`}
                      to={hasId ? `/empleados/${e.id}/editar` : '#'}
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => hasId && onToggle(e.id, !activo)}
                      disabled={!hasId}
                      className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
                        activo 
                          ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:shadow-md' 
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-md'
                      } ${!hasId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {activo ? '🚫' : '✅'} {toggleLabel}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeesTable;
