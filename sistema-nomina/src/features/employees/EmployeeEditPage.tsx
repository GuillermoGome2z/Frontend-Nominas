import { useParams, useNavigate } from 'react-router-dom'
import { useEmployee, useUpdateEmployee } from './hooks'
import EmployeeForm from './EmployeeForm'
import type { EmployeeDTO } from './api'
import { useEmployeeErrorHandler } from './useEmployeeErrorHandler'

export default function EmployeeEditPage() {
  const { id } = useParams()
  const empId = Number(id)
  const nav = useNavigate()
  const { success, handleError } = useEmployeeErrorHandler()

  if (!id || !Number.isFinite(empId) || empId <= 0) {
    return <div className="p-8 text-center text-rose-600">ID de empleado inválido.</div>
  }

  const { data, isLoading, isError } = useEmployee(empId)
  const upd = useUpdateEmployee(empId)

  if (isLoading) return <div className="p-4">Cargando…</div>
  if (isError || !data) return <div className="p-4 text-rose-600">Error al cargar.</div>

  return (
    <section className="mx-auto max-w-6xl p-3 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          >
            ← Regresar
          </button>
          <h1 className="text-2xl font-bold">Editar empleado</h1>
        </div>
      </div>

      <div className="rounded-2xl border bg-white/90 p-4 shadow-lg ring-1 ring-black/5">
        <EmployeeForm
          defaultValues={data}
          submitting={upd.isPending}
          onSubmit={(form: Partial<EmployeeDTO>) =>
            upd.mutate(form, {
              onSuccess: () => {
                success('✅ Empleado actualizado con éxito')
                nav(`/empleados/${empId}`)
              },
              onError: (e: any) => handleError(e, 'PUT /Empleados'),
            })
          }
        />
      </div>
    </section>
  )
}
