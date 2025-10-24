import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePeriod, usePayrollLines, useCalculatePayroll, useConcepts, useCreateAdjustment } from '../hooks/usePayroll';
import { useAlert } from '@/components/ui/AlertContext';
import { formatCurrency } from '../types/Payroll';
import { PayrollTable } from '../components/PayrollTable';
import { AdjustmentDialog } from '../components/AdjustmentDialog';
import { ReceiptViewer } from '../components/ReceiptViewer';
import type { PayrollLine, AdjustmentFormData } from '../types/Payroll';

export default function PeriodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const periodoId = Number(id);
  const nav = useNavigate();
  const { showSuccess, showError } = useAlert();
  
  const { data: period } = usePeriod(periodoId);
  const { data: linesData, isLoading: linesLoading } = usePayrollLines({ periodoId, page: 1, pageSize: 100 });
  const { data: conceptsData } = useConcepts();
  const calculate = useCalculatePayroll();
  const createAdjustment = useCreateAdjustment();

  const [selectedLine, setSelectedLine] = useState<PayrollLine | null>(null);
  const [showAdjustmentDialog, setShowAdjustmentDialog] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleCalculate = () => {
    calculate.mutate(periodoId, {
      onSuccess: () => showSuccess('Nómina calculada correctamente'),
      onError: () => showError('Error al calcular nómina'),
    });
  };

  const handleOpenConcepts = (line: PayrollLine) => {
    setSelectedLine(line);
    setShowReceipt(true);
  };

  const handleOpenAdjustment = (line: PayrollLine) => {
    setSelectedLine(line);
    setShowAdjustmentDialog(true);
  };

  const handleCreateAdjustment = async (data: AdjustmentFormData) => {
    await createAdjustment.mutateAsync(data, {
      onSuccess: () => showSuccess('Ajuste agregado correctamente'),
      onError: () => showError('Error al crear ajuste'),
    });
  };

  if (!period) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const lines = linesData?.data ?? [];
  const conceptos = conceptsData ?? [];

  return (
    <section className="mx-auto max-w-7xl p-6" style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => nav('/nomina')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Volver a periodos
          </button>
          <h1 className="text-2xl font-bold">{period.nombre}</h1>
          <p className="text-gray-600">{period.estado}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            disabled={calculate.isPending}
            className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50 transition"
          >
            {calculate.isPending ? 'Calculando...' : 'Calcular Nómina'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-xl border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total Ingresos</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(period.totalIngresos)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total Deducciones</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(period.totalDeducciones)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total Neto</p>
          <p className="text-2xl font-bold text-indigo-600">{formatCurrency(period.totalNeto)}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Líneas de Nómina</h2>
          <span className="text-sm text-gray-600">{lines.length} empleados</span>
        </div>
        
        <PayrollTable
          lines={lines}
          onOpenConcepts={handleOpenConcepts}
          isLoading={linesLoading}
        />

        {lines.length > 0 && (
          <div className="p-4 bg-gray-50 border-t">
            <button
              onClick={() => selectedLine && handleOpenAdjustment(selectedLine)}
              disabled={!selectedLine}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Agregar Ajuste
            </button>
          </div>
        )}
      </div>

      {selectedLine && (
        <>
          <AdjustmentDialog
            isOpen={showAdjustmentDialog}
            onClose={() => setShowAdjustmentDialog(false)}
            onSubmit={handleCreateAdjustment}
            lineaId={selectedLine.id}
            empleadoNombre={selectedLine.empleadoNombre}
            conceptos={conceptos}
          />

          <ReceiptViewer
            isOpen={showReceipt}
            onClose={() => setShowReceipt(false)}
            line={selectedLine}
          />
        </>
      )}
    </section>
  );
}
