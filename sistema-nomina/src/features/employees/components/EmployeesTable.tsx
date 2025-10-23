import { Link } from 'react-router-dom';
import Loader from '../../../components/ui/Loader';
import type { EmployeeDTO } from '../types';
import StatusPill from '../../../components/common/StatusPill';

interface EmployeesTableProps {
  employees: EmployeeDTO[];
  isLoading: boolean;
  onToggle: (id: number, shouldActivate: boolean) => void;
  isToggling: boolean;
  errorMessage?: string | null;
  onClearError?: () => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  onToggle,
  isToggling,
  errorMessage,
  onClearError,
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
      <div className="text-center py-16">
        <p className="text-lg text-slate-500">No se encontraron empleados</p>
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
    <div className="space-y-4">
      {errorMessage && (
        <div 
          className="animate-slide-down rounded-xl border-2 border-rose-300 bg-gradient-to-r from-rose-50 to-rose-100 shadow-md px-6 py-4"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center ring-2 ring-rose-300">
              <svg className="w-5 h-5 text-rose-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-rose-900 mb-1">
                Error de integridad
              </h3>
              <p className="text-sm text-rose-800 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={onClearError}
              className="flex-shrink-0 text-rose-500 hover:text-rose-700 hover:bg-rose-200 rounded-lg p-2 transition-all duration-200"
              aria-label="Cerrar mensaje"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Puesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Estado Laboral
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {employees.map((emp) => {
              const esActivo = (emp.estadoLaboral || '').toUpperCase() === 'ACTIVO';
              
              return (
                <tr 
                  key={emp.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900">
                      {emp.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-900">
                      {emp.nombreCompleto}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {emp.nombrePuesto || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600">
                      {emp.nombreDepartamento || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusPill value={emp.estadoLaboral} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/empleados/${emp.id}`}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Detalle
                      </Link>
                      <Link
                        to={`/empleados/${emp.id}/editar`}
                        className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggle(emp.id, emp.estadoLaboral)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                          esActivo
                            ? 'border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                            : 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {isToggling ? (
                          'Procesando...'
                        ) : esActivo ? (
                          'Suspender'
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

export default EmployeesTable;
