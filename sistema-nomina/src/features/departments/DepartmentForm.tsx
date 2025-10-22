// src/features/departments/DepartmentForm.tsx
import { useState } from 'react';
import type { DepartmentDTO } from './api';

type Props = {
  defaultValues?: Partial<DepartmentDTO>;
  onSubmit: (data: Partial<DepartmentDTO>) => void;
  submitting?: boolean;
};

export default function DepartmentForm({
  defaultValues,
  onSubmit,
  submitting,
}: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '');
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setError('');
    onSubmit({ nombre: nombre.trim(), activo });
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 max-w-xl"
      noValidate
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          className={`w-full rounded-xl border px-3 py-2 shadow-inner focus:outline-none focus:ring-2 ${
            error ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            if (error) setError('');
          }}
          placeholder="Ej. Desarrollo"
        />
        {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
        <span>Activo</span>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow hover:bg-indigo-700 active:scale-[.98] disabled:opacity-50 transition"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
