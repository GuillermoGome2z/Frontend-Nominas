import { useState } from 'react'
import { useEmployees, useToggleEmployeeActive } from './hooks'
import Toolbar from './components/Toolbar'
import EmployeesTable from './components/EmployeesTable'
import Pagination from './components/Pagination'
import { useNavigate } from 'react-router-dom'
import type { EmployeeFilters } from './api'
import { useToast } from '@/components/ui/Toast'
import { useQueryClient } from '@tanstack/react-query'

export default function EmployeesListPage() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, pageSize: 10 })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { data, isLoading, isError, error: queryError } = useEmployees(filters)
  const toggle = useToggleEmployeeActive()
  const navigate = useNavigate()
  const { success, error } = useToast()
  const queryClient = useQueryClient()

  const total = data?.meta.total ?? 0
  const rows = data?.data ?? []

  // Mostrar error detallado si hay problemas
  if (isError) {
    console.error('Error al cargar empleados:', queryError)
  }

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
          <h3 className="font-semibold mb-2">Error al cargar empleados</h3>
          <p className="text-sm">
            {queryError instanceof Error 
              ? queryError.message 
              : 'Hubo un problema al conectar con el servidor. Verifica que el backend esté funcionando.'}
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
            className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <EmployeesTable
            employees={rows}
            isLoading={false}
            onToggle={(id: number, nextActivo: boolean) => {
              toggle.mutate(
                { id, activo: nextActivo },
                {
                  onSuccess: async () => {
                    // Invalidar y refetch inmediato
                    await queryClient.invalidateQueries({ queryKey: ['employees'] });
                    await queryClient.refetchQueries({ queryKey: ['employees', filters] });
                    
                    const estadoNuevo = nextActivo ? 'activado' : 'suspendido';
                    success(`Empleado ${estadoNuevo} correctamente.`);
                    setErrorMessage(null);
                  },
                  onError: (e: any) => {
                    const msg =
                      e?.response?.data?.mensaje ??
                      e?.response?.data?.Message ??
                      e?.message ??
                      'No se pudo cambiar el estado del empleado.';
                    
                    // Si es un error 409, mostrar banner
                    if (e?.response?.status === 409) {
                      setErrorMessage(msg);
                    } else {
                      error(msg);
                    }
                  },
                }
              );
            }}
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
