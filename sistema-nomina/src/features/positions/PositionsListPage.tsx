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

  console.log('🔵 Puestos - Filters:', filters)
  console.log('🔵 Puestos - Data:', data)

  useEffect(() => {
    if (isError) {
      const errorMsg = error?.message || 'No se pudo conectar con el servidor.'
      showError(errorMsg)
    }
  }, [isError, error, showError])

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  console.log('🔵 Puestos - Total:', total, 'Rows:', rows.length)

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-3 sm:py-6" style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 16px)' }}>
      <div className="mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded-lg sm:rounded-xl border px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50 transition"
          >
            ← Regresar
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Puestos</h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={()=> nav('/puestos/nuevo')}
            className="rounded-lg sm:rounded-xl bg-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white shadow hover:bg-indigo-700 active:scale-[.98] transition w-full sm:w-auto"
          >
            + Nuevo Puesto
          </button>
        </div>
      </div>

      {isLoading && <div className="mt-4 sm:mt-6 animate-pulse rounded-xl sm:rounded-2xl border bg-white p-4 sm:p-6 text-gray-500 shadow-sm text-sm sm:text-base">Cargando…</div>}

      {!isLoading && !isError && (
        <>
          <PositionsTable rows={rows} />
          <div className="mt-3 sm:mt-4">
            <Pagination
              page={filters.page} 
              pageSize={filters.pageSize} 
              total={total}
              onPageChange={(p)=> {
                console.log('📄 Cambiando a página:', p)
                setFilters((prev:any)=> ({ ...prev, page: p }))
              }}
            />
          </div>
        </>
      )}
    </section>
  )
}
