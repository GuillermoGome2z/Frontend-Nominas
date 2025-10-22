import EmployeeForm from './EmployeeForm'
import { useCreateEmployee } from './hooks'
import { useNavigate } from 'react-router-dom'
import { parseValidationError } from './api'
import { useToast } from '../../components/ui/Toast'

export default function EmployeeCreatePage() {
  const navigate = useNavigate()
  const create = useCreateEmployee()
  const { success, warning, info, error: toastError } = useToast()

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
                success('Empleado creado con éxito')
                navigate('/empleados')
              },
              onError: (e: any) => {
                const status = e?.response?.status as number | undefined

                if (status === 400 || status === 422) {
                  const msg = parseValidationError(e)
                  warning(msg ?? 'Hay errores de validación. Revisa los campos.')
                  console.warn('Validación (400/422):', e?.response?.data ?? e)
                  return
                }

                if (status === 404) {
                  info('Recurso no encontrado.')
                  console.warn('404:', e?.response?.data ?? e)
                  return
                }

                if (status === 413) {
                  toastError('Archivo excede el tamaño permitido.')
                  console.warn('413:', e?.response?.data ?? e)
                  return
                }

                const requestId =
                  e?.response?.headers?.['x-request-id'] ??
                  e?.response?.data?.requestId
                const generic =
                  e?.response?.data?.message ??
                  e?.message ??
                  'Ocurrió un error inesperado.'
                toastError(requestId ? `${generic} (ID: ${String(requestId)})` : generic)
                console.error('POST /Empleados error:', e?.response?.data ?? e)
              },
            })
          }
        />
      </div>
    </section>
  )
}
