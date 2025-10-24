import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPayroll, generatePayroll, type PayrollDTO } from './api'

export default function PayrollDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [data, setData] = useState<PayrollDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getPayroll(Number(id))
      .then((r) => setData(r))
      .finally(() => setLoading(false))
  }, [id])

  async function onGenerate() {
    if (!id) return
    setGenerating(true)
    try {
      await generatePayroll(Number(id))
      // refrescar
      const refreshed = await getPayroll(Number(id))
      setData(refreshed)
    } finally {
      setGenerating(false)
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
          <h1 className="text-2xl font-bold">Detalle planilla</h1>
        </div>
      </div>

      {loading && <div className="rounded-2xl border bg-white p-6 text-gray-500">Cargando…</div>}

      {!loading && data && (
        <div className="rounded-2xl border bg-white p-6 text-gray-700 shadow-sm">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Periodo</div>
            <div className="text-lg font-medium">{data.periodo}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-lg font-medium">{data.total}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-500">Estado</div>
            <div className="text-lg font-medium">{data.estado}</div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onGenerate}
              disabled={generating}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 active:scale-[.98] transition"
            >
              {generating ? 'Generando...' : 'Generar nómina'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
