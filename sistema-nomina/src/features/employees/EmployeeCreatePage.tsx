import EmployeeForm from './EmployeeForm'
import { useCreateEmployee } from './hooks'
import { useNavigate } from 'react-router-dom'
import { useEmployeeErrorHandler } from './useEmployeeErrorHandler'

export default function EmployeeCreatePage() {
  const navigate = useNavigate()
  const create = useCreateEmployee()
  const { success, handleError } = useEmployeeErrorHandler()

  return (
    <section className="mx-auto max-w-5xl p-3 sm:p-6">
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
        <h1 className="ml-1 text-2xl font-bold">Nuevo empleado</h1>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <EmployeeForm
          submitting={create.isPending}
          onSubmit={(data) =>
            create.mutate(data, {
              onSuccess: () => {
                success('✅ Empleado creado con éxito')
                navigate('/empleados')
              },
              onError: (e: any) => handleError(e, 'POST /Empleados'),
            })
          }
        />
      </div>
    </section>
  )
}
