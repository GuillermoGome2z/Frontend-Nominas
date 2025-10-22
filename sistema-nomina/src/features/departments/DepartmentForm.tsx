import { useState } from 'react'
import type { DepartmentDTO } from './api'

type Props = {
  defaultValues?: Partial<DepartmentDTO>
  onSubmit: (data: Partial<DepartmentDTO>) => void
  submitting?: boolean
}

export default function DepartmentForm({ defaultValues, onSubmit, submitting }: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '')
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true)

  return (
    <form
      className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm max-w-xl"
      onSubmit={(e) => { e.preventDefault(); onSubmit({ nombre, activo }) }}
    >
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={nombre}
          onChange={(e)=> setNombre(e.target.value)}
          required
        />
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={activo} onChange={(e)=> setActivo(e.target.checked)} />
        <span>Activo</span>
      </label>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
