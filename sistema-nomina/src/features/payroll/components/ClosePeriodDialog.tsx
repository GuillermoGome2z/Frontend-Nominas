import { Button } from '../../../components/ui/Button';

interface ClosePeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  periodNombre: string;
  isClosing?: boolean;
}

export function ClosePeriodDialog({
  isOpen,
  onClose,
  onConfirm,
  periodNombre,
  isClosing,
}: ClosePeriodDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center">Cerrar Periodo</h2>
            <p className="text-sm text-gray-500 mt-2 text-center">
              ¿Está seguro que desea cerrar el periodo "{periodNombre}"?
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Advertencia:</strong> Esta acción es irreversible. Una vez cerrado el periodo:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1">
              <li>No se podrán hacer más cambios</li>
              <li>No se podrán agregar ajustes</li>
              <li>El cálculo quedará finalizado</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isClosing}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirm}
              disabled={isClosing}
              className="flex-1"
            >
              {isClosing ? 'Cerrando...' : 'Confirmar Cierre'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
