import { useState } from 'react'
import { useEmployees, useToggleEmployeeActive } from './hooks'
import Toolbar from './components/Toolbar'
import EmployeesTable from './components/EmployeesTable'
import Pagination from './components/Pagination'
import { useNavigate } from 'react-router-dom'
import type { EmployeeFilters } from './api'

export default function EmployeesListPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, pageSize: 10 })
  const { data, isLoading, isError } = useEmployees(filters)
  const toggle = useToggleEmployeeActive()
  const navigate = useNavigate()

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          aria-label="Regresar"
        >
          ← Regresar
        </button>
        <h1 className="ml-1 text-2xl font-bold">Empleados</h1>
      </div>

      {/* Toolbar (filtros + crear) */}
      <div className="mb-4 rounded-2xl border bg-white p-3 shadow-sm">
        <Toolbar
          onFilter={(f) => setFilters((prev) => ({ ...prev, page: 1, ...f }))}
          onCreate={() => navigate('/empleados/nuevo')}
        />
      </div>

      {/* Estados */}
      {isLoading && (
        <div className="mt-6 animate-pulse rounded-2xl border bg-white p-6 text-gray-500 shadow-sm">
          Cargando…
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
          Error al cargar empleados.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <EmployeesTable
            rows={rows}
            onToggle={(id, nextActivo) => toggle.mutate({ id, activo: nextActivo })}
          />

          <div className="mt-4">
            <Pagination
              page={filters.page ?? 1}
              pageSize={filters.pageSize ?? 10}
              total={total}
              onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
            />
          </div>
        </>
      )}
    </section>
  )
}
