import { useState, useRef } from 'react'
import type { PositionDTO } from './api'

type Props = {
  defaultValues?: Partial<PositionDTO>
  onSubmit: (data: Partial<PositionDTO>) => void
  submitting?: boolean
}

export default function PositionForm({ defaultValues, onSubmit, submitting }: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '')
  const [salarioBase, setSalarioBase] = useState<string>(
    defaultValues?.salarioBase != null ? String(defaultValues.salarioBase) : ''
  )
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true)
  const [error, setError] = useState<string>('')

  const salarioRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const n = Number(salarioBase)
    if (!salarioBase || !Number.isFinite(n) || n <= 0) {
      setError('El salario base es obligatorio y debe ser mayor a 0.')
      // pone el focus en el input con error
      salarioRef.current?.focus()
      return
    }

    setError('')
    onSubmit({ nombre, salarioBase: Number(n.toFixed(2)), activo })
  }

  return (
    <form
      className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm max-w-xl"
      onSubmit={handleSubmit}
      noValidate
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

      <div>
        <label className="block text-sm font-medium mb-1">Salario base (GTQ)</label>
        <input
          ref={salarioRef}
          type="number"
          inputMode="decimal"         // teclado numérico en móvil
          step="0.01"
          min="0.01"                  // evita 0 o negativos
          className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${
            error ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={salarioBase}
          onChange={(e) => {
            // permite vacío mientras escribe, para no pelear con el usuario
            const v = e.target.value
            setSalarioBase(v)
            if (error) setError('')
          }}
          // evita escribir e/E/+/-
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault()
          }}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()} // evita cambiar con la rueda del mouse
          required
          aria-invalid={!!error}
          aria-describedby="salario-help salario-error"
        />
        <div id="salario-help" className="mt-1 text-xs text-gray-500">
          Ingresa un valor mayor a 0. Se aceptan hasta dos decimales.
        </div>
        {error && (
          <div id="salario-error" className="mt-1 text-sm text-rose-600">
            {error}
          </div>
        )}
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e)=> setActivo(e.target.checked)}
        />
        <span>Activo</span>
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
