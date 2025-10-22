import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEmployee } from './hooks'
import { UploadDialog, FileList } from './expediente'

const fmtCurrency = (n?: number) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(n)
    : '—'

export default function EmployeeDetailPage() {
  const { id } = useParams()
  const empId = Number(id)
  const navigate = useNavigate()

  if (!id || !Number.isFinite(empId) || empId <= 0) {
    return <div className="p-8 text-center text-rose-600">ID de empleado inválido.</div>
  }

  const { data, isLoading, isError } = useEmployee(empId)

  if (isLoading) return <div className="p-4">Cargando…</div>
  if (isError || !data) return <div className="p-4 text-rose-600">Error al cargar.</div>

  const e = data

  return (
    <section className="mx-auto max-w-6xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
            aria-label="Regresar"
          >
            ← Regresar
          </button>
          <h1 className="text-2xl font-bold">Empleado #{e.id}</h1>
        </div>

        <Link
          to={`/empleados/${empId}/editar`}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Editar
        </Link>
      </div>

      {/* Card de datos */}
      <div className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm sm:grid-cols-2">
        <div><span className="font-semibold">Nombre:</span> {e.nombreCompleto || '—'}</div>
        <div><span className="font-semibold">Departamento:</span> {e.nombreDepartamento ?? '—'}</div>
        <div><span className="font-semibold">DPI/NIT:</span> {e.dpi ?? '—'} / {e.nit ?? '—'}</div>
        <div><span className="font-semibold">Correo:</span> {e.correo ?? '—'}</div>
        <div><span className="font-semibold">Estado:</span> {e.estadoLaboral ?? '—'}</div>
        <div><span className="font-semibold">Salario:</span> {fmtCurrency(e.salarioMensual)}</div>
        <div><span className="font-semibold">Teléfono:</span> {e.telefono ?? '—'}</div>
        <div><span className="font-semibold">Dirección:</span> {e.direccion ?? '—'}</div>
      </div>

      {/* Expediente */}
      <h2 className="mt-6 text-xl font-semibold">Expediente</h2>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-3">
          <UploadDialog empleadoId={empId} />
        </div>
        <FileList empleadoId={empId} />
      </div>
    </section>
  )
}
