import PositionForm from './PositionForm'
import { useCreatePosition } from './hooks'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@/components/ui/AlertContext'

export default function PositionCreatePage() {
  const nav = useNavigate()
  const create = useCreatePosition()
  const { showSuccess, showError } = useAlert()

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
          onSuccess: ()=> {
            showSuccess('✅ Puesto creado exitosamente');
            nav('/puestos');
          },
          onError: (e:any)=> {
            const status = e?.response?.status;
            
            // Manejo de error 409 - Puesto duplicado
            if (status === 409) {
              const detail = e?.response?.data?.detail ?? e?.response?.data?.Detail;
              const title = e?.response?.data?.title ?? e?.response?.data?.Title;
              const errorMsg = detail || title || 'Ya existe un puesto con ese nombre.';
              showError(`⚠️ Puesto duplicado: ${errorMsg}`);
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
                       'Error al crear puesto';
            showError(msg);
          },
        })}
        submitting={create.isPending}
      />
    </section>
  )
}
