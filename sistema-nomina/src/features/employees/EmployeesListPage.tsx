import { useState } from 'react'
import { useEmployees, useToggleEmployeeActive } from './hooks' // <-- nuevo hook
import Toolbar from './components/Toolbar'
import EmployeesTable from './components/EmployeesTable'
import Pagination from './components/Pagination'
import { useNavigate } from 'react-router-dom'
import type { EmployeeFilters } from './api'

export default function EmployeesListPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, pageSize: 10 })
  const { data, isLoading, isError } = useEmployees(filters)
  const toggle = useToggleEmployeeActive()
  const nav = useNavigate()

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  return (
    <section className="p-2 sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
      </div>

      <Toolbar
        onFilter={(f) => setFilters((prev) => ({ ...prev, page: 1, ...f }))}
        onCreate={() => nav('/empleados/nuevo')}
      />

      {isLoading && <div className="mt-6 animate-pulse rounded-2xl border p-6">Cargando…</div>}
      {isError && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          Error al cargar empleados.
        </div>
      )}
      {!isLoading && !isError && (
        <>
          <EmployeesTable
            rows={rows}
            onToggle={(id, nextActivo) => toggle.mutate({ id, activo: nextActivo })}
          />
          <Pagination
            page={filters.page ?? 1}
            pageSize={filters.pageSize ?? 10}
            total={total}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        </>
      )}
    </section>
  )
}
