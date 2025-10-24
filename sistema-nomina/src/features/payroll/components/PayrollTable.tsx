import type { PayrollLine } from '../types/Payroll';

interface PayrollTableProps {
  lines: PayrollLine[];
  onOpenConcepts?: (line: PayrollLine) => void;
  isLoading?: boolean;
}

export function PayrollTable({ lines, onOpenConcepts, isLoading }: PayrollTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lines || lines.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay líneas de nómina calculadas
      </div>
    );
  }

  const totales = lines.reduce(
    (acc, line) => ({
      ingresos: acc.ingresos + line.totalIngresos,
      deducciones: acc.deducciones + line.totalDeducciones,
      neto: acc.neto + line.salarioNeto,
    }),
    { ingresos: 0, deducciones: 0, neto: 0 }
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empleado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Puesto
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ingresos
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deducciones
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Neto
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lines.map((line) => (
            <tr key={line.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {line.empleadoNombre}
                </div>
                <div className="text-sm text-gray-500">{line.empleadoCodigo}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {line.puestoNombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-medium">
                Q {line.totalIngresos.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-medium">
                Q {line.totalDeducciones.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                Q {line.salarioNeto.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                <button
                  onClick={() => onOpenConcepts?.(line)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Ver conceptos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">
              TOTALES
            </td>
            <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
              Q {totales.ingresos.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-right text-sm font-bold text-red-600">
              Q {totales.deducciones.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
              Q {totales.neto.toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
