import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPayroll } from './api'

export default function PayrollCreatePage() {
  const nav = useNavigate()
  const [periodo, setPeriodo] = useState('')
  const [total, setTotal] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await createPayroll({ periodo, total: typeof total === 'number' ? total : 0 })
      nav('/nomina')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl p-3 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          >
            ← Regresar
          </button>
          <h1 className="text-2xl font-bold">Nueva planilla</h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Periodo</label>
          <input
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="Ej. 2025-09"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Total estimado</label>
          <input
            value={total}
            onChange={(e) => setTotal(e.target.value === '' ? '' : Number(e.target.value))}
            type="number"
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="0.00"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => nav('/nomina')}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 active:scale-[.98] transition"
          >
            {saving ? 'Guardando...' : 'Crear'}
          </button>
        </div>
      </form>
    </section>
  )
}
