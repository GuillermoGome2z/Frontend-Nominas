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
            const status = e?.response?.status;
            
            // Manejo de error 409 - Puesto duplicado o tiene empleados activos
            if (status === 409) {
              const detail = e?.response?.data?.detail ?? e?.response?.data?.Detail;
              const title = e?.response?.data?.title ?? e?.response?.data?.Title;
              
              // Verificar si es por nombre duplicado o por empleados activos
              if (detail?.toLowerCase().includes('nombre') || title?.toLowerCase().includes('duplicado')) {
                showError(`⚠️ Puesto duplicado: ${detail || title || 'Ya existe otro puesto con ese nombre.'}`);
              } else {
                showError(`⚠️ Conflicto: ${detail || title || 'No se pudo actualizar el puesto.'}`);
              }
              return;
            }
            
            // Manejo de error 422 - Validación
            if (status === 422) {
              const detail = e?.response?.data?.detail ?? e?.response?.data?.Detail;
              const errorMsg = detail || 'Verifica los datos ingresados.';
              showError(`❌ Error de validación: ${errorMsg}`);
              return;
            }
            
            // Error genérico
            const msg = e?.response?.data?.mensaje ?? 
                       e?.response?.data?.detail ?? 
                       e?.message ?? 
                       'Error al actualizar puesto';
            showError(msg);
          },
        })}
        submitting={upd.isPending}
        isEdit={true}
      />
    </section>
  )
}
