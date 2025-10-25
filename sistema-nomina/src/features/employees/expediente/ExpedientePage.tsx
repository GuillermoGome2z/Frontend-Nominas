import { useParams, useNavigate } from 'react-router-dom'
import { useEmployee } from '../hooks'
import FileList from './FileList'
import UploadDialog from './UploadDialog'

export default function ExpedientePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const empleadoId = Number(id)
  const { data: employee, isLoading, isError, error: queryError } = useEmployee(empleadoId)

  // Validación de ID
  if (!id || !Number.isFinite(empleadoId) || empleadoId <= 0) {
    return (
      <section className="mx-auto max-w-7xl p-3 sm:p-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          <h3 className="font-semibold mb-2">ID de empleado inválido</h3>
          <p className="text-sm mb-4">El ID proporcionado no es válido.</p>
          <button
            onClick={() => navigate('/empleados')}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Volver a Empleados
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-6">
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
        <h1 className="ml-1 text-2xl font-bold">Expediente del Empleado</h1>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="mt-6 animate-pulse rounded-2xl border bg-white p-6 text-gray-500 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Cargando información del empleado...
          </div>
        </div>
      )}

      {/* Error al cargar empleado */}
      {isError && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
          <h3 className="font-semibold mb-2">Error al cargar el empleado</h3>
          <p className="text-sm mb-3">
            {queryError instanceof Error 
              ? queryError.message 
              : 'No se pudo encontrar la información del empleado.'}
          </p>
          <button
            onClick={() => navigate('/empleados')}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Volver a Empleados
          </button>
        </div>
      )}

      {/* Contenido principal */}
      {!isLoading && !isError && employee && (
        <div className="space-y-6">
          {/* Información del empleado */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-semibold text-xl">
                  {employee.nombreCompleto?.charAt(0)?.toUpperCase() || 'E'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">{employee.nombreCompleto}</h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">DPI:</span> {employee.dpi || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Correo:</span> {employee.correo || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Departamento:</span> {employee.nombreDepartamento || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Puesto:</span> {employee.nombrePuesto || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Estado:</span> {employee.estadoLaboral || '—'}
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span> {employee.telefono || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subir documentos */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              📁 Gestión de Documentos
            </h3>
            <UploadDialog empleadoId={empleadoId} />
          </div>

          {/* Lista de documentos */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              📄 Documentos del Expediente
            </h3>
            <FileList empleadoId={empleadoId} />
          </div>
        </div>
      )}
    </section>
  )
}