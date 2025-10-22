import PositionForm from './PositionForm'
import { useCreatePosition } from './hooks'
import { useNavigate } from 'react-router-dom'

export default function PositionCreatePage() {
  const nav = useNavigate()
  const create = useCreatePosition()

  return (
    <section className="p-2 sm:p-4">
      <h1 className="mb-4 text-2xl font-bold">Nuevo puesto</h1>
      <PositionForm
        onSubmit={(data)=> create.mutate(data, {
          onSuccess: ()=> nav('/puestos'),
          onError: (e:any)=> alert(e?.response?.data?.mensaje ?? e?.message ?? 'Error al crear'),
        })}
        submitting={create.isPending}
      />
    </section>
  )
}
