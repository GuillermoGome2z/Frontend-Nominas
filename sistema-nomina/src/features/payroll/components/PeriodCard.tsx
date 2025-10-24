import type { PayrollPeriod } from '../types/Payroll';

interface PeriodCardProps {
  period: PayrollPeriod;
  onCalculate?: () => void;
  onPublish?: () => void;
  onClose?: () => void;
  onView?: () => void;
  isCalculating?: boolean;
  isPublishing?: boolean;
  isClosing?: boolean;
}

export function PeriodCard({
  period,
  onCalculate,
  onPublish,
  onClose,
  onView,
  isCalculating,
  isPublishing,
  isClosing,
}: PeriodCardProps) {
  const statusColors: Record<string, string> = {
    'Borrador': 'bg-blue-100 text-blue-800',
    'Calculado': 'bg-yellow-100 text-yellow-800',
    'Publicado': 'bg-green-100 text-green-800',
    'Cerrado': 'bg-gray-100 text-gray-800',
  };

  const isClosed = period.estado === 'Cerrado';
  const isPublished = period.estado === 'Publicado' || isClosed;
  const isCalculated = period.estado !== 'Borrador';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{period.nombre}</h3>
          <p className="text-sm text-gray-500">{period.tipo}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[period.estado]}`}>
          {period.estado}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Inicio:</span>
          <span className="font-medium">{new Date(period.fechaInicio).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fin:</span>
          <span className="font-medium">{new Date(period.fechaFin).toLocaleDateString()}</span>
        </div>
        {period.fechaPago && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pago:</span>
            <span className="font-medium">{new Date(period.fechaPago).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500">Empleados</p>
          <p className="text-lg font-bold text-gray-900">{period.totalEmpleados}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Neto</p>
          <p className="text-lg font-bold text-green-600">Q {period.totalNeto.toFixed(2)}</p>
        </div>
      </div>

      {period.cerradoAt && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
          <p className="text-gray-600">
            Cerrado el: <span className="font-medium">{new Date(period.cerradoAt).toLocaleString()}</span>
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver detalle
        </button>

        {!isCalculated && (
          <button
            onClick={onCalculate}
            disabled={isCalculating}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCalculating ? 'Calculando...' : 'Calcular'}
          </button>
        )}

        {isCalculated && !isPublished && (
          <button
            onClick={onPublish}
            disabled={isPublishing}
            className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </button>
        )}

        {isPublished && !isClosed && (
          <button
            onClick={onClose}
            disabled={isClosing}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isClosing ? 'Cerrando...' : 'Cerrar'}
          </button>
        )}
      </div>
    </div>
  );
}
