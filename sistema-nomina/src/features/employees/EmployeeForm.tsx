import React from 'react';
import {
  useForm,
  type SubmitHandler,
  type DefaultValues,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, type EmployeeFormData } from './validators';

type Props = {
  defaultValues?: DefaultValues<EmployeeFormData>;
  onSubmit: (data: EmployeeFormData) => void;
  submitting?: boolean;
};

export default function EmployeeForm({ defaultValues, onSubmit, submitting }: Props) {
  // NOTA: en algunos setups de tipos, zodResolver requiere "as Resolver<...>"
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema) as unknown as Resolver<EmployeeFormData>,
    defaultValues,
  });

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="mb-1 block text-sm font-medium text-gray-700">{children}</label>
  );
  const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...p}
      className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-1 text-sm text-rose-600">{msg}</p> : null;

  // Tipado explícito del submit handler
  const submit: SubmitHandler<EmployeeFormData> = (data) => onSubmit(data);

  return (
    <form onSubmit={handleSubmit(submit)} className="grid max-w-4xl gap-4">
      <div>
        <Label>Nombre completo</Label>
        <Input {...register('nombreCompleto')} aria-label="Nombre completo" />
        <FieldError msg={errors.nombreCompleto?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>DPI</Label>
          <Input {...register('dpi')} />
          <FieldError msg={errors.dpi?.message} />
        </div>
        <div>
          <Label>NIT</Label>
          <Input {...register('nit')} />
          <FieldError msg={errors.nit?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Correo</Label>
          <Input type="email" {...register('correo')} />
          <FieldError msg={errors.correo?.message} />
        </div>
        <div>
          <Label>Salario mensual</Label>
          {/* Con z.coerce.number() el valor se parsea; valueAsNumber ayuda para RHF */}
          <Input
            type="number"
            step="0.01"
            {...register('salarioMensual', { valueAsNumber: true })}
          />
          <FieldError msg={errors.salarioMensual?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Departamento ID</Label>
          <Input
            type="number"
            {...register('departamentoId', { valueAsNumber: true })}
          />
          <FieldError msg={errors.departamentoId?.message as string | undefined} />
        </div>
        <div>
          <Label>Puesto ID</Label>
          <Input type="number" {...register('puestoId', { valueAsNumber: true })} />
          <FieldError msg={errors.puestoId?.message as string | undefined} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Fecha de contratación (ISO)</Label>
          <Input placeholder="2025-10-20" {...register('fechaContratacion')} />
          <FieldError msg={errors.fechaContratacion?.message} />
        </div>
        <div>
          <Label>Fecha de nacimiento (ISO)</Label>
          <Input placeholder="1999-01-31" {...register('fechaNacimiento')} />
          <FieldError msg={errors.fechaNacimiento?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Estado laboral</Label>
          <select
            {...register('estadoLaboral')}
            className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">—</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
            <option value="RETIRADO">RETIRADO</option>
          </select>
          <FieldError msg={errors.estadoLaboral?.message} />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input {...register('telefono')} />
          <FieldError msg={errors.telefono?.message} />
        </div>
      </div>

      <div>
        <Label>Dirección</Label>
        <Input {...register('direccion')} />
        <FieldError msg={errors.direccion?.message} />
      </div>

      <div className="flex gap-2">
        <button
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          type="submit"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
        <a href="/empleados" className="rounded-xl border px-4 py-2 hover:bg-gray-50">
          Cancelar
        </a>
      </div>
    </form>
  );
}
