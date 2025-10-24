import { useState } from 'react';
import { usePeriods, useCalculatePayroll, usePublishPeriod, useClosePeriod } from '../hooks/usePayroll';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/components/ui/AlertContext';
import { PeriodCard } from '../components/PeriodCard';
import { ClosePeriodDialog } from '../components/ClosePeriodDialog';

export default function PeriodsListPage() {
  const [filters] = useState({ page: 1, pageSize: 10 });
  const { data, isLoading, isError, error } = usePeriods(filters);
  const nav = useNavigate();
  const { showError, showSuccess } = useAlert();
  
  const calculateMutation = useCalculatePayroll();
  const publishMutation = usePublishPeriod();
  const closeMutation = useClosePeriod();
  
  const [closingPeriod, setClosingPeriod] = useState<{ id: number; nombre: string } | null>(null);

  // Verificar si es error 404 (backend no implementado)
  const is404Error = isError && (error as any)?.response?.status === 404;

  const periods = data?.data ?? [];

  const handleCalculate = (id: number) => {
    calculateMutation.mutate(id, {
      onSuccess: () => showSuccess('Nómina calculada correctamente'),
      onError: () => showError('Error al calcular nómina'),
    });
  };

  const handlePublish = (id: number) => {
    publishMutation.mutate(id, {
      onSuccess: () => showSuccess('Periodo publicado correctamente'),
      onError: () => showError('Error al publicar periodo'),
    });
  };

  const handleCloseRequest = (id: number, nombre: string) => {
    setClosingPeriod({ id, nombre });
  };

  const handleCloseConfirm = async () => {
    if (!closingPeriod) return;
    closeMutation.mutate(closingPeriod.id, {
      onSuccess: () => {
        showSuccess('Periodo cerrado correctamente');
        setClosingPeriod(null);
      },
      onError: () => showError('Error al cerrar periodo'),
    });
  };

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-6" style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }}>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Periodos de Nómina</h1>
        <button 
          onClick={() => nav('/nomina/nuevo')} 
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
        >
          + Nuevo Periodo
        </button>
      </div>

      {/* Mensaje cuando el backend no está implementado */}
      {is404Error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                🚧 Módulo Frontend Listo - Backend Pendiente
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>El módulo de nómina del frontend está <strong>completamente implementado</strong>, pero falta implementar los endpoints del backend.</p>
                <div className="mt-4 bg-white rounded p-4 font-mono text-xs">
                  <p className="font-semibold text-gray-700 mb-2">Endpoints requeridos en el backend:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>✅ GET /api/nomina/periodos</li>
                    <li>✅ POST /api/nomina/periodos</li>
                    <li>✅ GET /api/nomina/periodos/:id</li>
                    <li>✅ PUT /api/nomina/periodos/:id</li>
                    <li>✅ DELETE /api/nomina/periodos/:id</li>
                    <li>✅ POST /api/nomina/periodos/:id/calcular</li>
                    <li>✅ POST /api/nomina/periodos/:id/publicar</li>
                    <li>✅ POST /api/nomina/periodos/:id/cerrar</li>
                    <li>✅ GET /api/nomina/lineas</li>
                    <li>✅ POST /api/nomina/ajustes</li>
                    <li>✅ GET /api/nomina/conceptos</li>
                  </ul>
                </div>
                <p className="mt-3">Una vez implementes estos endpoints en tu backend, el módulo funcionará automáticamente.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!is404Error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {periods.map((period) => (
              <PeriodCard
                key={period.id}
                period={period}
                onCalculate={() => handleCalculate(period.id)}
                onPublish={() => handlePublish(period.id)}
                onClose={() => handleCloseRequest(period.id, period.nombre)}
                onView={() => nav(`/nomina/periodos/${period.id}`)}
                isCalculating={calculateMutation.isPending}
                isPublishing={publishMutation.isPending}
                isClosing={closeMutation.isPending}
              />
            ))}
          </div>

          {periods.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500">
              No hay periodos de nómina. Crea uno para comenzar.
            </div>
          )}
        </>
      )}

      <ClosePeriodDialog
        isOpen={closingPeriod !== null}
        onClose={() => setClosingPeriod(null)}
        onConfirm={handleCloseConfirm}
        periodNombre={closingPeriod?.nombre || ''}
        isClosing={closeMutation.isPending}
      />
    </section>
  );
}
