import PositionForm from './PositionForm'
import { useCreatePosition } from './hooks'
import { useNavigate } from 'react-router-dom'

export default function PositionCreatePage() {
  const nav = useNavigate()
  const create = useCreatePosition()

  return (
    <section className="mx-auto max-w-4xl p-3 sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Regresar
        </button>
        <h1 className="text-2xl font-bold">Nuevo puesto</h1>
      </div>

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
