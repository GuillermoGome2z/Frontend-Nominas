// ✅ FORMULARIO DE DEPARTAMENTO MEJORADO CON VALIDACIÓN
import { useState } from 'react';
import type { DepartmentDTO } from './api';

type Props = {
  defaultValues?: Partial<DepartmentDTO>;
  onSubmit: (data: Partial<DepartmentDTO>) => void;
  submitting?: boolean;
  isEdit?: boolean;
};

export default function DepartmentForm({
  defaultValues,
  onSubmit,
  submitting,
  isEdit = false,
}: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '');
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      nextErrors.nombre = 'El nombre del departamento es obligatorio.';
    } else if (nombre.trim().length < 3) {
      nextErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (nombre.trim().length > 100) {
      nextErrors.nombre = 'El nombre no puede exceder 100 caracteres.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({ nombre: nombre.trim(), activo });
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 rounded-2xl border bg-white/90 p-6 shadow-lg ring-1 ring-black/5"
      noValidate
    >
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEdit ? 'Editar Departamento' : 'Nuevo Departamento'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit 
            ? 'Modifica los datos del departamento' 
            : 'Completa la información del departamento'}
        </p>
      </div>

      {/* Campo Nombre */}
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
          Nombre del departamento <span className="text-rose-600">*</span>
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
          placeholder="Ej: Recursos Humanos, Desarrollo, Marketing"
          maxLength={100}
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? 'error-nombre' : 'help-nombre'}
        />
        {errors.nombre && (
          <p id="error-nombre" className="mt-1 text-sm text-rose-600" role="alert">
            {errors.nombre}
          </p>
        )}
        {!errors.nombre && (
          <p id="help-nombre" className="mt-1 text-xs text-gray-500">
            Mínimo 3 caracteres, máximo 100
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
            <span className="block text-sm font-medium text-gray-900">Departamento activo</span>
            <span className="mt-1 block text-xs text-gray-600">
              {activo 
                ? '✓ Este departamento está activo y visible en los formularios' 
                : '⚠️ Este departamento estará inactivo y NO aparecerá en los formularios'}
            </span>
            {isEdit && !activo && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>⚠️ Importante:</strong> Si intentas desactivar un departamento que tiene puestos o empleados activos, 
                el sistema mostrará un error. Primero desactiva todos los puestos y empleados asociados.
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Botones */}
      <div className="flex flex-wrap gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={submitting}
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
            'Guardar Departamento'
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
