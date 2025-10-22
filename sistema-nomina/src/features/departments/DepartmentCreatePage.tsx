import DepartmentForm from './DepartmentForm'
import { useCreateDepartment } from './hooks'
import { useNavigate } from 'react-router-dom'

export default function DepartmentCreatePage() {
  const nav = useNavigate()
  const create = useCreateDepartment()

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Nuevo departamento</h1>
      <DepartmentForm
        onSubmit={(data)=> create.mutate(data, {
          onSuccess: ()=> nav('/departamentos'),
          onError: (e:any)=> alert(e?.response?.data?.mensaje ?? e?.message ?? 'Error al crear'),
        })}
        submitting={create.isPending}
      />
    </section>
  )
}
