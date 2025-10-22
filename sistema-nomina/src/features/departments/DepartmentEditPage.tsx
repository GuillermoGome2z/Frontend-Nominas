import { useParams, useNavigate } from 'react-router-dom'
import { useDepartment, useUpdateDepartment } from './hooks'
import DepartmentForm from './DepartmentForm'

export default function DepartmentEditPage() {
  const { id } = useParams(); const deptId = Number(id)
  const { data, isLoading, isError } = useDepartment(deptId)
  const upd = useUpdateDepartment(deptId)
  const nav = useNavigate()

  if (isLoading) return <div className="p-4">Cargando…</div>
  if (isError) return <div className="p-4 text-rose-600">Error al cargar.</div>

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Editar departamento</h1>
      <DepartmentForm
        defaultValues={data}
        onSubmit={(form)=> upd.mutate(form, {
          onSuccess: ()=> nav('/departamentos'),
          onError: (e:any)=> alert(e?.response?.data?.mensaje ?? e?.message ?? 'Error al actualizar'),
        })}
        submitting={upd.isPending}
      />
    </section>
  )
}
