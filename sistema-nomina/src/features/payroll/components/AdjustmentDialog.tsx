import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AdjustmentFormData } from '../types/Payroll';
import { adjustmentFormSchema } from '../types/schemas';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

interface AdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustmentFormData) => Promise<void>;
  lineaId: number;
  empleadoNombre: string;
  conceptos: Array<{ id: number; nombre: string; tipo: string }>;
}

export function AdjustmentDialog({ isOpen, onClose, onSubmit, lineaId, empleadoNombre, conceptos }: AdjustmentDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors }, reset } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentFormSchema),
    defaultValues: { lineaId, conceptoId: 0, monto: 0, motivo: '' }
  });

  const handleFormSubmit = async (data: AdjustmentFormData) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => { reset(); onClose(); }}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar Ajuste</h2>
          <p className="text-sm text-gray-500 mb-4">Empleado: {empleadoNombre}</p>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Concepto *</label>
              <Controller name="conceptoId" control={control} render={({ field }) => (
                <select {...field} disabled={submitting} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => field.onChange(Number(e.target.value))}>
                  <option value={0}>Seleccione un concepto</option>
                  {conceptos.map((c) => <option key={c.id} value={c.id}>{c.nombre} ({c.tipo})</option>)}
                </select>
              )} />
              {errors.conceptoId && <p className="mt-1 text-sm text-red-600">{errors.conceptoId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto (GTQ) *</label>
              <Controller name="monto" control={control} render={({ field }) => (
                <Input {...field} type="number" step="0.01" disabled={submitting} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              )} />
              {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo *</label>
              <Controller name="motivo" control={control} render={({ field }) => (
                <textarea {...field} rows={3} disabled={submitting} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              )} />
              {errors.motivo && <p className="mt-1 text-sm text-red-600">{errors.motivo.message}</p>}
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="secondary" onClick={() => { reset(); onClose(); }} disabled={submitting} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={submitting} className="flex-1">{submitting ? 'Guardando...' : 'Agregar Ajuste'}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
