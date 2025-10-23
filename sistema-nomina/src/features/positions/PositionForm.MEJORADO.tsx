// ✅ FORMULARIO DE PUESTO MEJORADO CON VALIDACIÓN
import { useRef, useState } from 'react';
import type { PositionDTO } from './api';
import { useQuery } from '@tanstack/react-query';
import { listDepartments, type DepartmentDTO } from '../departments/api';

type Props = {
  defaultValues?: Partial<PositionDTO>;
  onSubmit: (data: Partial<PositionDTO>) => void;
  submitting?: boolean;
  isEdit?: boolean;
};

export default function PositionForm({ defaultValues, onSubmit, submitting, isEdit = false }: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '');
  const [salarioBase, setSalarioBase] = useState<string>(
    defaultValues?.salarioBase != null ? String(defaultValues.salarioBase) : ''
  );
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true);
  const [departamentoId, setDepartamentoId] = useState<number | ''>(
    defaultValues?.departamentoId ?? ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const salarioRef = useRef<HTMLInputElement>(null);

  // Catálogo de departamentos (solo activos)
  const { data: deptsData, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  });
  const departamentos: DepartmentDTO[] = deptsData?.data ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    // Validar nombre
    if (!nombre.trim()) {
      nextErrors.nombre = 'El nombre del puesto es obligatorio.';
    } else if (nombre.trim().length < 3) {
      nextErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    // Validar salario
    const n = Number(salarioBase);
    if (!salarioBase || !Number.isFinite(n) || n <= 0) {
      nextErrors.salarioBase = 'El salario base es obligatorio y debe ser mayor a 0.';
    } else if (n < 2500) {
      nextErrors.salarioBase = 'El salario debe ser al menos Q2,500.00 (salario mínimo).';
    }

    // Validar departamento
    if (departamentoId === '' || !Number.isFinite(Number(departamentoId))) {
      nextErrors.departamentoId = 'Debes seleccionar un departamento.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      const element = document.querySelector(`[name="${firstField}"]`) as HTMLElement;
      element?.focus();
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      salarioBase: Number(n.toFixed(2)),
      activo,
      departamentoId: Number(departamentoId),
    });
  };

  return (
    <form
      className="grid gap-6 rounded-2xl border bg-white/90 p-6 shadow-lg ring-1 ring-black/5"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Editar Puesto' : 'Nuevo Puesto'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit 
            ? 'Modifica los datos del puesto de trabajo' 
            : 'Define un nuevo puesto con su salario base'}
        </p>
      </div>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
          Nombre del puesto <span className="text-rose-600">*</span>
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${
            errors.nombre ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            if (errors.nombre) setErrors((p) => ({ ...p, nombre: '' }));
          }}
          placeholder="Ej: Desarrollador Web, Contador, Gerente de Ventas"
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? 'error-nombre' : undefined}
        />
        {errors.nombre && (
          <p id="error-nombre" className="mt-1 text-sm text-rose-600" role="alert">
            {errors.nombre}
          </p>
        )}
      </div>

      {/* Departamento */}
      <div>
        <label htmlFor="departamentoId" className="mb-1 block text-sm font-medium text-gray-700">
          Departamento <span className="text-rose-600">*</span>
        </label>
        <select
          id="departamentoId"
          name="departamentoId"
          className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
            errors.departamentoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={departamentoId}
          onChange={(e) => {
            setDepartamentoId(e.target.value ? Number(e.target.value) : '');
            if (errors.departamentoId) setErrors((p) => ({ ...p, departamentoId: '' }));
          }}
          disabled={loadingDepts}
          aria-invalid={!!errors.departamentoId}
          aria-describedby={errors.departamentoId ? 'error-departamentoId' : 'help-departamentoId'}
        >
          <option value="">{loadingDepts ? 'Cargando…' : 'Selecciona un departamento...'}</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
        {errors.departamentoId && (
          <p id="error-departamentoId" className="mt-1 text-sm text-rose-600" role="alert">
            {errors.departamentoId}
          </p>
        )}
        {!errors.departamentoId && !departamentos.length && (
          <p id="help-departamentoId" className="mt-1 text-sm text-amber-600">
            ⚠️ No hay departamentos activos.{' '}
            <a href="/departamentos/nuevo" className="underline hover:text-amber-800">
              Crea uno primero
            </a>
            .
          </p>
        )}
      </div>

      {/* Salario Base */}
      <div>
        <label htmlFor="salarioBase" className="mb-1 block text-sm font-medium text-gray-700">
          Salario base (GTQ) <span className="text-rose-600">*</span>
        </label>
        <input
          ref={salarioRef}
          id="salarioBase"
          name="salarioBase"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="2500"
          className={`w-full rounded-xl border px-3 py-2 font-mono shadow-inner transition focus:outline-none focus:ring-2 ${
            errors.salarioBase ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={salarioBase}
          onChange={(e) => {
            setSalarioBase(e.target.value);
            if (errors.salarioBase) setErrors((p) => ({ ...p, salarioBase: '' }));
          }}
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
          }}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          placeholder="2500.00"
          aria-invalid={!!errors.salarioBase}
          aria-describedby={errors.salarioBase ? 'error-salarioBase' : 'help-salarioBase'}
        />
        {errors.salarioBase && (
          <p id="error-salarioBase" className="mt-1 text-sm text-rose-600" role="alert">
            {errors.salarioBase}
          </p>
        )}
        {!errors.salarioBase && (
          <p id="help-salarioBase" className="mt-1 text-xs text-gray-500">
            Mínimo Q2,500.00 (salario mínimo). Acepta hasta 2 decimales.
          </p>
        )}
      </div>

      {/* Estado Activo */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-indigo-600 transition focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
          <div className="flex-1">
            <span className="block text-sm font-medium text-gray-900">Puesto activo</span>
            <span className="mt-1 block text-xs text-gray-600">
              {activo
                ? '✓ Este puesto está activo y visible en los formularios de empleados'
                : '⚠️ Este puesto estará inactivo y NO aparecerá en los formularios'}
            </span>
            {isEdit && !activo && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>⚠️ Importante:</strong> Si intentas desactivar un puesto que tiene empleados activos asignados,
                el sistema mostrará un error. Primero reasigna o desactiva los empleados.
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={submitting || !departamentos.length}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-indigo-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={submitting}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          ) : (
            'Guardar Puesto'
          )}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={submitting}
          className="rounded-xl border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[.98] disabled:opacity-50"
        >
          Cancelar
        </button>

        {!isEdit && (
          <button
            type="reset"
            onClick={() => {
              setNombre('');
              setSalarioBase('');
              setDepartamentoId('');
              setActivo(true);
              setErrors({});
            }}
            disabled={submitting}
            className="ml-auto rounded-xl border border-rose-300 px-6 py-2.5 font-medium text-rose-600 transition hover:bg-rose-50 active:scale-[.98] disabled:opacity-50"
          >
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}
