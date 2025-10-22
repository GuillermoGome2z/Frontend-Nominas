import { useEffect, useMemo, useState } from 'react'
import type { EmployeeDTO } from './api'
import { useQuery } from '@tanstack/react-query'

// Catálogos
import { listDepartments, type DepartmentDTO } from '../departments/api'
import { listPositions, type PositionDTO } from '../positions/api'

type Props = {
  defaultValues?: Partial<EmployeeDTO>
  onSubmit: (data: Partial<EmployeeDTO> & { salarioMensual: number }) => void
  submitting?: boolean
}

const ESTADOS = ['ACTIVO', 'SUSPENDIDO', 'RETIRADO'] as const

// ---------- Helpers de validación ----------
const digitsOnly = (s: string) => s.replace(/\D+/g, '')
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
const isDigits = (s: string, len: number) => new RegExp(`^\\d{${len}}$`).test(s)
const isDigitsRange = (s: string, min: number, max: number) => new RegExp(`^\\d{${min},${max}}$`).test(s)

const todayISO = () => new Date().toISOString().slice(0, 10)
const yearsBetween = (a: Date, b: Date) => {
  let age = b.getFullYear() - a.getFullYear()
  const m = b.getMonth() - a.getMonth()
  if (m < 0 || (m === 0 && b.getDate() < a.getDate())) age--
  return age
}

export default function EmployeeForm({ defaultValues, onSubmit, submitting }: Props) {
  // ----- Form state -----
  const [nombreCompleto, setNombreCompleto]         = useState(defaultValues?.nombreCompleto ?? '')
  const [correo, setCorreo]                         = useState(defaultValues?.correo ?? '')
  const [dpi, setDpi]                               = useState(defaultValues?.dpi ?? '')
  const [nit, setNit]                               = useState(defaultValues?.nit ?? '')
  const [telefono, setTelefono]                     = useState(defaultValues?.telefono ?? '')
  const [direccion, setDireccion]                   = useState(defaultValues?.direccion ?? '')
  const [fechaNacimiento, setFechaNacimiento]       = useState(defaultValues?.fechaNacimiento ? defaultValues.fechaNacimiento.substring(0,10) : '')
  const [fechaContratacion, setFechaContratacion]   = useState(defaultValues?.fechaContratacion ? defaultValues.fechaContratacion.substring(0,10) : '')
  const [estadoLaboral, setEstadoLaboral]           = useState<string>(defaultValues?.estadoLaboral ?? 'ACTIVO')
  const [departamentoId, setDepartamentoId]         = useState<number | undefined>(defaultValues?.departamentoId)
  const [puestoId, setPuestoId]                     = useState<number | undefined>(defaultValues?.puestoId)
  const [salarioMensual, setSalarioMensual]         = useState<number | ''>(defaultValues?.salarioMensual ?? '')

  // ----- Validaciones (mensajes) -----
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ----- Catálogos -----
  const { data: deptsData } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  })

  // Puestos dependientes del departamento
  const { data: possData, isFetching: isFetchingPositions } = useQuery({
    queryKey: ['positions', { page: 1, pageSize: 1000, activo: true, departamentoId }],
    queryFn: () => listPositions({ page: 1, pageSize: 1000, activo: true, departamentoId }),
    enabled: !!departamentoId, // solo si hay departamento seleccionado
    staleTime: 60_000,
  })

  const departamentos: DepartmentDTO[] = useMemo(() => deptsData?.data ?? [], [deptsData])
  const puestos: PositionDTO[] = useMemo(() => possData?.data ?? [], [possData])

  // Si cambia el departamento, resetea puesto y salario
  useEffect(() => {
    setPuestoId(undefined)
    setSalarioMensual('')
  }, [departamentoId])

  // Cuando cambia el puesto, setea automáticamente el salario base y bloquea el input
  useEffect(() => {
    if (!puestoId) return
    const p = puestos.find(x => x.id === puestoId)
    if (p) setSalarioMensual(Number(p.salarioBase ?? 0))
  }, [puestoId, puestos])

  // ---------- Submit con validación ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    // Reglas obligatorias
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

    // Normalizaciones para validar
    const dpiClean = digitsOnly(dpi)
    const nitClean = digitsOnly(nit)
    const telClean = digitsOnly(telefono)

    // Límites / formatos
    if (!isEmail(correo)) nextErrors.correo = 'Correo inválido.'
    if (!isDigits(dpiClean, 13)) nextErrors.dpi = 'DPI debe tener exactamente 13 dígitos.'
    if (!isDigits(nitClean, 13)) nextErrors.nit = 'NIT debe tener exactamente 13 dígitos.'
    if (!isDigitsRange(telClean, 7, 15)) nextErrors.telefono = 'Teléfono debe tener entre 7 y 15 dígitos.'

    // Duplicados entre sí
    if (dpiClean && nitClean && dpiClean === nitClean) nextErrors.nit = 'NIT no puede ser igual al DPI.'
    if (dpiClean && telClean && dpiClean === telClean) nextErrors.telefono = 'Teléfono no puede ser igual al DPI.'
    if (nitClean && telClean && nitClean === telClean) nextErrors.telefono = 'Teléfono no puede ser igual al NIT.'
    if ([dpiClean, nitClean, telClean].includes(correo)) nextErrors.correo = 'El correo no puede coincidir con DPI/NIT/Teléfono.'

    // Fechas: ≥18 años y orden lógico
    if (fechaNacimiento) {
      const fn = new Date(fechaNacimiento)
      const now = new Date()
      if (isNaN(fn.getTime()) || fn > now) nextErrors.fechaNacimiento = 'Fecha de nacimiento inválida.'
      else if (yearsBetween(fn, now) < 18) nextErrors.fechaNacimiento = 'Debe ser mayor de edad (≥ 18 años).'
    }
    if (fechaContratacion) {
      const fc = new Date(fechaContratacion)
      const now = new Date()
      if (isNaN(fc.getTime()) || fc > now) nextErrors.fechaContratacion = 'Fecha de contratación inválida.'
    }
    if (fechaNacimiento && fechaContratacion) {
      const fn = new Date(fechaNacimiento)
      const fc = new Date(fechaContratacion)
      if (fc < fn) nextErrors.fechaContratacion = 'La contratación no puede ser anterior al nacimiento.'
    }

    // Salario
    const salarioVal = typeof salarioMensual === 'number' ? salarioMensual : Number(salarioMensual)
    if (!salarioMensual || !Number.isFinite(salarioVal) || salarioVal <= 0) {
      nextErrors.salarioMensual = 'El salario es obligatorio y debe ser mayor a 0.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // Envío (normalizamos DPI/NIT/Tel a solo dígitos)
    onSubmit({
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.trim(),
      dpi: dpiClean,
      nit: nitClean,
      telefono: telClean,
      direccion: direccion.trim(),
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
      className="grid gap-5 rounded-2xl border bg-white/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur transition-all duration-200"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* fila 1 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            value={nombreCompleto}
            onChange={(e)=> { setNombreCompleto(e.target.value); if (errors.nombreCompleto) setErrors(p=>({ ...p, nombreCompleto: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.nombreCompleto ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.nombreCompleto && <p className="mt-1 text-sm text-rose-600">{errors.nombreCompleto}</p>}
        </div>

        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e)=> { setCorreo(e.target.value); if (errors.correo) setErrors(p=>({ ...p, correo: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.correo ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.correo && <p className="mt-1 text-sm text-rose-600">{errors.correo}</p>}
        </div>
      </div>

      {/* fila 2 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">DPI</label>
          <input
            value={dpi}
            inputMode="numeric"
            maxLength={13}
            onInput={(e) => { const el = e.currentTarget; el.value = digitsOnly(el.value).slice(0, 13) }}
            onChange={(e)=> { setDpi(e.target.value); if (errors.dpi) setErrors(p=>({ ...p, dpi: '' }))}}
            placeholder="13 dígitos"
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.dpi ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.dpi && <p className="mt-1 text-sm text-rose-600">{errors.dpi}</p>}
        </div>
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">NIT</label>
          <input
            value={nit}
            inputMode="numeric"
            maxLength={13}
            onInput={(e) => { const el = e.currentTarget; el.value = digitsOnly(el.value).slice(0, 13) }}
            onChange={(e)=> { setNit(e.target.value); if (errors.nit) setErrors(p=>({ ...p, nit: '' }))}}
            placeholder="13 dígitos"
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.nit ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.nit && <p className="mt-1 text-sm text-rose-600">{errors.nit}</p>}
        </div>
      </div>

      {/* fila 3 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            value={telefono}
            inputMode="tel"
            maxLength={15}
            onInput={(e) => { const el = e.currentTarget; el.value = digitsOnly(el.value).slice(0, 15) }}
            onChange={(e)=> { setTelefono(e.target.value); if (errors.telefono) setErrors(p=>({ ...p, telefono: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.telefono ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.telefono && <p className="mt-1 text-sm text-rose-600">{errors.telefono}</p>}
        </div>
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Dirección</label>
          <input
            value={direccion}
            onChange={(e)=> { setDireccion(e.target.value); if (errors.direccion) setErrors(p=>({ ...p, direccion: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.direccion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.direccion && <p className="mt-1 text-sm text-rose-600">{errors.direccion}</p>}
        </div>
      </div>

      {/* fila 4 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input
            type="date"
            max={todayISO()}
            value={fechaNacimiento}
            onChange={(e)=> { setFechaNacimiento(e.target.value); if (errors.fechaNacimiento) setErrors(p=>({ ...p, fechaNacimiento: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.fechaNacimiento ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.fechaNacimiento && <p className="mt-1 text-sm text-rose-600">{errors.fechaNacimiento}</p>}
        </div>
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de contratación</label>
          <input
            type="date"
            max={todayISO()}
            value={fechaContratacion}
            onChange={(e)=> { setFechaContratacion(e.target.value); if (errors.fechaContratacion) setErrors(p=>({ ...p, fechaContratacion: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.fechaContratacion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          />
          {errors.fechaContratacion && <p className="mt-1 text-sm text-rose-600">{errors.fechaContratacion}</p>}
        </div>
      </div>

      {/* fila 5 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Estado laboral</label>
          <select
            value={estadoLaboral}
            onChange={(e)=> { setEstadoLaboral(e.target.value); if (errors.estadoLaboral) setErrors(p=>({ ...p, estadoLaboral: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${errors.estadoLaboral ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          >
            {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.estadoLaboral && <p className="mt-1 text-sm text-rose-600">{errors.estadoLaboral}</p>}
        </div>

        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Salario mensual</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            value={salarioMensual}
            readOnly     // se rellena desde el puesto
            className={`w-full rounded-xl border bg-gray-50 px-3 py-2 text-gray-700 shadow-inner focus:outline-none ${errors.salarioMensual ? 'border-rose-400' : ''}`}
            onKeyDown={(e) => { if (['e','E','+','-'].includes(e.key)) e.preventDefault() }}
          />
          {errors.salarioMensual && <p className="mt-1 text-sm text-rose-600">{errors.salarioMensual}</p>}
          <p className="mt-1 text-xs text-gray-500">Se rellena automáticamente con el salario base del puesto.</p>
        </div>
      </div>

      {/* fila 6 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Departamento</label>
          <select
            value={departamentoId ?? ''}
            onChange={(e)=> { setDepartamentoId(e.target.value ? Number(e.target.value) : undefined); if (errors.departamentoId) setErrors(p=>({ ...p, departamentoId: '' }))}}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${errors.departamentoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
          >
            <option value="" disabled>Selecciona…</option>
            {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
          {!departamentos.length && <p className="mt-1 text-xs text-amber-600">No hay departamentos activos. Crea uno primero.</p>}
          {errors.departamentoId && <p className="mt-1 text-sm text-rose-600">{errors.departamentoId}</p>}
        </div>

        <div className="group">
          <label className="mb-1 block text-sm font-medium text-gray-700">Puesto</label>
          <select
            value={puestoId ?? ''}
            onChange={(e)=> { setPuestoId(e.target.value ? Number(e.target.value) : undefined); if (errors.puestoId) setErrors(p=>({ ...p, puestoId: '' }))}}
            disabled={!departamentoId || isFetchingPositions}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.puestoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            } ${!departamentoId ? 'bg-gray-50 text-gray-500' : ''}`}
          >
            <option value="" disabled>
              {!departamentoId ? 'Selecciona un departamento primero' : (isFetchingPositions ? 'Cargando…' : 'Selecciona…')}
            </option>
            {puestos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {!puestos.length && departamentoId && !isFetchingPositions && (
            <p className="mt-1 text-xs text-amber-600">Este departamento no tiene puestos activos.</p>
          )}
          {errors.puestoId && <p className="mt-1 text-sm text-rose-600">{errors.puestoId}</p>}
        </div>
      </div>

      {/* acciones */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow hover:bg-indigo-700 active:scale-[.98] disabled:opacity-50 transition"
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
          className="rounded-xl border px-5 py-2.5 text-gray-700 hover:bg-gray-50 active:scale-[.98] transition"
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}
