import { useEffect, useMemo, useState } from 'react'
import type { EmployeeDTO } from './api' // tu tipo ya definido
import { useQuery } from '@tanstack/react-query'

// Traemos catálogos desde los módulos que ya creaste
import { listDepartments, type DepartmentDTO } from '../departments/api'
import { listPositions, type PositionDTO } from '../positions/api'

type Props = {
  defaultValues?: Partial<EmployeeDTO>
  onSubmit: (data: Partial<EmployeeDTO> & { salarioMensual: number }) => void
  submitting?: boolean
}

const ESTADOS = ['ACTIVO', 'SUSPENDIDO', 'RETIRADO'] as const

export default function EmployeeForm({ defaultValues, onSubmit, submitting }: Props) {
  // ----- Form state -----
  const [nombreCompleto, setNombreCompleto] = useState(defaultValues?.nombreCompleto ?? '')
  const [correo, setCorreo]                   = useState(defaultValues?.correo ?? '')
  const [dpi, setDpi]                         = useState(defaultValues?.dpi ?? '')
  const [nit, setNit]                         = useState(defaultValues?.nit ?? '')
  const [telefono, setTelefono]               = useState(defaultValues?.telefono ?? '')
  const [direccion, setDireccion]             = useState(defaultValues?.direccion ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(
    defaultValues?.fechaNacimiento ? defaultValues.fechaNacimiento.substring(0,10) : ''
  )
  const [fechaContratacion, setFechaContratacion] = useState(
    defaultValues?.fechaContratacion ? defaultValues.fechaContratacion.substring(0,10) : ''
  )
  const [estadoLaboral, setEstadoLaboral]     = useState<string>(defaultValues?.estadoLaboral ?? 'ACTIVO')

  const [departamentoId, setDepartamentoId]   = useState<number | undefined>(defaultValues?.departamentoId)
  const [puestoId, setPuestoId]               = useState<number | undefined>(defaultValues?.puestoId)

  // salario se calcula por el puesto seleccionado
  const [salarioMensual, setSalarioMensual]   = useState<number | ''>(
    defaultValues?.salarioMensual ?? ''
  )

  // ----- Validaciones (mensajes) -----
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ----- Catálogos -----
  const { data: deptsData } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  })
  const { data: possData } = useQuery({
    queryKey: ['positions', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listPositions({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  })

  const departamentos: DepartmentDTO[] = useMemo(() => deptsData?.data ?? [], [deptsData])
  const puestos: PositionDTO[] = useMemo(() => possData?.data ?? [], [possData])

  // Cuando cambia el puesto, setea automáticamente el salario base y bloquea el input
  useEffect(() => {
    if (!puestoId) return
    const p = puestos.find(x => x.id === puestoId)
    if (p) setSalarioMensual(Number(p.salarioBase ?? 0))
  }, [puestoId, puestos])

  // ----- Submit con validación -----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    if (!nombreCompleto.trim()) nextErrors.nombreCompleto = 'El nombre es obligatorio.'
    if (!correo.trim()) nextErrors.correo = 'El correo es obligatorio.'
    if (!dpi.trim()) nextErrors.dpi = 'El DPI es obligatorio.'
    if (!nit.trim()) nextErrors.nit = 'El NIT es obligatorio.'
    if (!telefono.trim()) nextErrors.telefono = 'El teléfono es obligatorio.'
    if (!direccion.trim()) nextErrors.direccion = 'La dirección es obligatoria.'
    if (!fechaNacimiento) nextErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
    if (!fechaContratacion) nextErrors.fechaContratacion = 'La fecha de contratación es obligatoria.'
    if (!estadoLaboral) nextErrors.estadoLaboral = 'El estado laboral es obligatorio.'
    if (!departamentoId) nextErrors.departamentoId = 'Selecciona un departamento.'
    if (!puestoId) nextErrors.puestoId = 'Selecciona un puesto.'

    const salarioVal = typeof salarioMensual === 'number' ? salarioMensual : Number(salarioMensual)
    if (!salarioMensual || !Number.isFinite(salarioVal) || salarioVal <= 0) {
      nextErrors.salarioMensual = 'El salario es obligatorio y debe ser mayor a 0.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      nombreCompleto,
      correo,
      dpi,
      nit,
      telefono,
      direccion,
      fechaNacimiento: new Date(fechaNacimiento).toISOString(),
      fechaContratacion: new Date(fechaContratacion).toISOString(),
      estadoLaboral: estadoLaboral as 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO',
      departamentoId,
      puestoId,
      salarioMensual: salarioVal,
    })
  }

  return (
    <form
      className="grid gap-4 rounded-2xl border bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* fila 1 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre completo</label>
          <input
            value={nombreCompleto}
            onChange={(e)=> { setNombreCompleto(e.target.value); if (errors.nombreCompleto) setErrors(p=>({ ...p, nombreCompleto: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.nombreCompleto ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.nombreCompleto && <p className="mt-1 text-sm text-rose-600">{errors.nombreCompleto}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e)=> { setCorreo(e.target.value); if (errors.correo) setErrors(p=>({ ...p, correo: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.correo ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.correo && <p className="mt-1 text-sm text-rose-600">{errors.correo}</p>}
        </div>
      </div>

      {/* fila 2 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">DPI</label>
          <input
            value={dpi}
            onChange={(e)=> { setDpi(e.target.value); if (errors.dpi) setErrors(p=>({ ...p, dpi: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.dpi ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.dpi && <p className="mt-1 text-sm text-rose-600">{errors.dpi}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">NIT</label>
          <input
            value={nit}
            onChange={(e)=> { setNit(e.target.value); if (errors.nit) setErrors(p=>({ ...p, nit: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.nit ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.nit && <p className="mt-1 text-sm text-rose-600">{errors.nit}</p>}
        </div>
      </div>

      {/* fila 3 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            value={telefono}
            onChange={(e)=> { setTelefono(e.target.value); if (errors.telefono) setErrors(p=>({ ...p, telefono: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.telefono ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.telefono && <p className="mt-1 text-sm text-rose-600">{errors.telefono}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input
            value={direccion}
            onChange={(e)=> { setDireccion(e.target.value); if (errors.direccion) setErrors(p=>({ ...p, direccion: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.direccion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.direccion && <p className="mt-1 text-sm text-rose-600">{errors.direccion}</p>}
        </div>
      </div>

      {/* fila 4 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e)=> { setFechaNacimiento(e.target.value); if (errors.fechaNacimiento) setErrors(p=>({ ...p, fechaNacimiento: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.fechaNacimiento ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.fechaNacimiento && <p className="mt-1 text-sm text-rose-600">{errors.fechaNacimiento}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de contratación</label>
          <input
            type="date"
            value={fechaContratacion}
            onChange={(e)=> { setFechaContratacion(e.target.value); if (errors.fechaContratacion) setErrors(p=>({ ...p, fechaContratacion: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.fechaContratacion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.fechaContratacion && <p className="mt-1 text-sm text-rose-600">{errors.fechaContratacion}</p>}
        </div>
      </div>

      {/* fila 5 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Estado laboral</label>
          <select
            value={estadoLaboral}
            onChange={(e)=> { setEstadoLaboral(e.target.value); if (errors.estadoLaboral) setErrors(p=>({ ...p, estadoLaboral: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.estadoLaboral ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          >
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.estadoLaboral && <p className="mt-1 text-sm text-rose-600">{errors.estadoLaboral}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salario mensual</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            value={salarioMensual}
            readOnly     // <- se rellena desde el puesto
            className={`w-full rounded-xl border px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none ${errors.salarioMensual ? 'border-rose-400' : ''}`}
            onKeyDown={(e) => { if (['e','E','+','-'].includes(e.key)) e.preventDefault() }}
          />
          {errors.salarioMensual && <p className="mt-1 text-sm text-rose-600">{errors.salarioMensual}</p>}
          <p className="mt-1 text-xs text-gray-500">Se rellena automáticamente con el salario base del puesto.</p>
        </div>
      </div>

      {/* fila 6 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Departamento</label>
          <select
            value={departamentoId ?? ''}
            onChange={(e)=> { setDepartamentoId(e.target.value ? Number(e.target.value) : undefined); if (errors.departamentoId) setErrors(p=>({ ...p, departamentoId: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.departamentoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          >
            <option value="" disabled>Selecciona…</option>
            {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
          {errors.departamentoId && <p className="mt-1 text-sm text-rose-600">{errors.departamentoId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Puesto</label>
          <select
            value={puestoId ?? ''}
            onChange={(e)=> { setPuestoId(e.target.value ? Number(e.target.value) : undefined); if (errors.puestoId) setErrors(p=>({ ...p, puestoId: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${errors.puestoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          >
            <option value="" disabled>Selecciona…</option>
            {puestos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {errors.puestoId && <p className="mt-1 text-sm text-rose-600">{errors.puestoId}</p>}
        </div>
      </div>

      {/* acciones */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
        <button
          type="reset"
          onClick={()=>{
            setNombreCompleto(''); setCorreo(''); setDpi(''); setNit('');
            setTelefono(''); setDireccion(''); setFechaNacimiento(''); setFechaContratacion('');
            setEstadoLaboral('ACTIVO'); setDepartamentoId(undefined); setPuestoId(undefined);
            setSalarioMensual(''); setErrors({})
          }}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}
