import { useParams, useNavigate } from 'react-router-dom'
import { usePosition, useUpdatePosition } from './hooks'
import PositionForm from './PositionForm'

export default function PositionEditPage() {
  const { id } = useParams(); const posId = Number(id)
  const { data, isLoading, isError } = usePosition(posId)
  const upd = useUpdatePosition(posId)
  const nav = useNavigate()

  if (isLoading) return <div className="p-4">Cargando…</div>
  if (isError) return <div className="p-4 text-rose-600">Error al cargar.</div>

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Editar puesto</h1>
      <PositionForm
        defaultValues={data}
        onSubmit={(form)=> upd.mutate(form, {
          onSuccess: ()=> nav('/puestos'),
          onError: (e:any)=> alert(e?.response?.data?.mensaje ?? e?.message ?? 'Error al actualizar'),
        })}
        submitting={upd.isPending}
      />
    </section>
  )
}
