
import { Link } from 'react-router-dom';
import type { EmployeeDTO } from '../types';
import StatusPill from './StatusPill';

type Props = {
  rows: EmployeeDTO[];
  onDelete: (id: number) => void;
};

export default function EmployeesTable({ rows, onDelete }: Props) {
  if (!rows?.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-gray-500">
        No hay empleados. Crea el primero con “Nuevo empleado”.
      </div>
    );
  }

  const fmtCurrency = (n?: number) =>
    typeof n === 'number'
      ? n.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })
      : '—';

  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Departamento</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Salario</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e, idx) => (
            <tr key={e.id} className={idx % 2 ? 'bg-white' : 'bg-gray-50/30'}>
              <td className="px-4 py-3">{e.id}</td>
              <td className="px-4 py-3">{e.nombreCompleto}</td>
              <td className="px-4 py-3">{e.nombreDepartamento ?? '—'}</td>
              <td className="px-4 py-3">
                <StatusPill value={e.estadoLaboral} />
              </td>
              <td className="px-4 py-3">{fmtCurrency(e.salarioMensual)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* ⚠️ IMPORTANTE: usar SIEMPRE comillas/backticks en "to" */}
                  <Link
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    to={`/empleados/${e.id}`}
                    aria-label={`Ver detalle de ${e.nombreCompleto}`}
                  >
                    Detalle
                  </Link>
                  <Link
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    to={`/empleados/${e.id}/editar`}
                    aria-label={`Editar ${e.nombreCompleto}`}
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(e.id)}
                    className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50"
                    aria-label={`Eliminar ${e.nombreCompleto}`}
                  >
                    Eliminar
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
