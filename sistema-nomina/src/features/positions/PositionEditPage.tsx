import { useParams, useNavigate } from 'react-router-dom'
import { usePosition, useUpdatePosition } from './hooks'
import PositionForm from './PositionForm'
import { useAlert } from '@/components/ui/AlertContext'

export default function PositionEditPage() {
  const { id } = useParams(); const posId = Number(id)
  const { data, isLoading, isError } = usePosition(posId)
  const upd = useUpdatePosition(posId)
  const nav = useNavigate()
  const { showSuccess, showError } = useAlert()

  if (isLoading) return <div className="p-4">Cargando…</div>
  if (isError) return <div className="p-4 text-rose-600">Error al cargar.</div>

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
        <h1 className="text-2xl font-bold">Editar puesto</h1>
      </div>

      <PositionForm
        defaultValues={data}
        onSubmit={(form)=> upd.mutate(form, {
          onSuccess: ()=> {
            showSuccess('✅ Puesto actualizado exitosamente');
            nav('/puestos');
          },
          onError: (e:any)=> {
            const msg = e?.response?.data?.mensaje ?? e?.message ?? 'Error al actualizar puesto';
            showError(msg);
          },
        })}
        submitting={upd.isPending}
        isEdit={true}
      />
    </section>
  )
}
