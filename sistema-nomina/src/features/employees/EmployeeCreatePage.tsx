import EmployeeForm from './EmployeeForm'
import { useCreateEmployee } from './hooks'
import { useNavigate } from 'react-router-dom'
import type { EmployeeDTO } from './api'

export default function EmployeeCreatePage() {
  const nav = useNavigate()
  const create = useCreateEmployee()

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Nuevo empleado</h1>
      <EmployeeForm
        onSubmit={(data: Partial<EmployeeDTO>) =>
          create.mutate(data, {
            onSuccess: () => nav('/empleados'),
            onError: (err: any) => alert(err?.message ?? 'Error al crear'),
          })
        }
        submitting={create.isPending}
      />
    </section>
  )
}
