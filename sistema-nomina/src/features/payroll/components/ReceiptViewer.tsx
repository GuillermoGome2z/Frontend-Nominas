import { useState } from 'react';
import type { PayrollLine } from '../types/Payroll';

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  line: PayrollLine | null;
}

export function ReceiptViewer({ isOpen, onClose, line }: ReceiptViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !line) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implementar descarga real del recibo
      console.log('Descargando recibo para empleado:', line.empleadoId);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Vista Previa de Recibo</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">{line.empleadoNombre}</h3>
              <p className="text-sm text-gray-600">Código: {line.empleadoCodigo}</p>
              <p className="text-sm text-gray-600">Puesto: {line.puestoNombre}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Ingresos</h4>
                <div className="space-y-1">
                  {line.conceptos
                    .filter((c) => c.tipo === 'Ingreso')
                    .map((concepto) => (
                      <div key={concepto.id} className="flex justify-between text-sm">
                        <span>{concepto.nombre}:</span>
                        <span className="font-medium">Q {concepto.monto.toFixed(2)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm font-bold text-green-600 pt-2 border-t">
                    <span>Total Ingresos:</span>
                    <span>Q {line.totalIngresos.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Deducciones</h4>
                <div className="space-y-1">
                  {line.conceptos
                    .filter((c) => c.tipo === 'Deduccion')
                    .map((concepto) => (
                      <div key={concepto.id} className="flex justify-between text-sm">
                        <span>{concepto.nombre}:</span>
                        <span className="font-medium">Q {concepto.monto.toFixed(2)}</span>
                      </div>
                    ))}
                  <div className="flex justify-between text-sm font-bold text-red-600 pt-2 border-t">
                    <span>Total Deducciones:</span>
                    <span>Q {line.totalDeducciones.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {line.ajustes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ajustes</h4>
                  <div className="space-y-1">
                    {line.ajustes.map((ajuste) => (
                      <div key={ajuste.id} className="flex justify-between text-sm">
                        <span>{ajuste.conceptoNombre}:</span>
                        <span className="font-medium">Q {ajuste.monto.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Salario Neto:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Q {line.totalNeto.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDownloading ? 'Descargando...' : 'Descargar PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
