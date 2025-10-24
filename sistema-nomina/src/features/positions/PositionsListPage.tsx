import { useState, useEffect } from 'react'
import { usePositions } from './hooks'
import PositionsTable from './components/PositionsTable'
import Pagination from '../employees/components/Pagination'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '../../components/ui/AlertContext'

export default function PositionsListPage() {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 } as any)
  const { data, isLoading, isError, error } = usePositions(filters)
  const nav = useNavigate()
  const { showError } = useAlert()

  useEffect(() => {
    if (isError) {
      showError(
        'Error al cargar puestos',
        error?.message || 'No se pudo conectar con el servidor.'
      )
    }
  }, [isError, error, showError])

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  return (
    <section className="mx-auto max-w-6xl p-3 sm:p-6" style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          >
            ← Regresar
          </button>
          <h1 className="text-2xl font-bold">Puestos</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={()=> nav('/puestos/nuevo')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 active:scale-[.98] transition"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {isLoading && <div className="mt-6 animate-pulse rounded-2xl border bg-white p-6 text-gray-500 shadow-sm">Cargando…</div>}

      {!isLoading && !isError && (
        <>
          <PositionsTable rows={rows} />
          <div className="mt-4">
            <Pagination
              page={filters.page} pageSize={filters.pageSize} total={total}
              onPageChange={(p)=> setFilters((prev:any)=> ({ ...prev, page: p }))}
            />
          </div>
        </>
      )}
    </section>
  )
}
