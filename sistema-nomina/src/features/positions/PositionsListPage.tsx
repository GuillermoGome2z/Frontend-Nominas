import { useState } from 'react'
import { usePositions } from './hooks'
import PositionsTable from './components/PositionsTable'
import Pagination from '../employees/components/Pagination'
import { useNavigate } from 'react-router-dom'

export default function PositionsListPage() {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 } as any)
  const { data, isLoading, isError } = usePositions(filters)
  const nav = useNavigate()

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  return (
    <section className="p-2 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Puestos</h1>
        <button onClick={()=> nav('/puestos/nuevo')}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          + Nuevo
        </button>
      </div>

      {isLoading && <div className="mt-6 animate-pulse rounded-2xl border p-6">Cargando…</div>}
      {isError && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">Error al cargar.</div>}
      {!isLoading && !isError && (
        <>
          <PositionsTable rows={rows} />
          <Pagination
            page={filters.page} pageSize={filters.pageSize} total={total}
            onPageChange={(p)=> setFilters((prev:any)=> ({ ...prev, page: p }))}
          />
        </>
      )}
    </section>
  )
}
