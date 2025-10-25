// ✅ FORMULARIO DE EMPLEADO MEJORADO
// Campos requeridos según el backend ASP.NET Core

import { useEffect, useMemo, useState } from 'react'
import type { EmployeeDTO } from './api'
import { useQuery } from '@tanstack/react-query'
import { listDepartments, type DepartmentDTO } from '../departments/api'
import { listPositions, type PositionDTO } from '../positions/api'

type Props = {
  defaultValues?: Partial<EmployeeDTO>
  onSubmit: (data: Partial<EmployeeDTO> & { salarioMensual: number }) => void
  submitting?: boolean
}

const ESTADOS: Array<'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO'> = ['ACTIVO', 'SUSPENDIDO', 'RETIRADO']

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
  const [nombreCompleto, setNombreCompleto] = useState(defaultValues?.nombreCompleto ?? '')
  const [correo, setCorreo] = useState(defaultValues?.correo ?? '')
  const [dpi, setDpi] = useState(defaultValues?.dpi ?? '')
  const [nit, setNit] = useState(defaultValues?.nit ?? '')
  const [telefono, setTelefono] = useState(defaultValues?.telefono ?? '')
  const [direccion, setDireccion] = useState(defaultValues?.direccion ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(
    defaultValues?.fechaNacimiento ? defaultValues.fechaNacimiento.substring(0, 10) : ''
  )
  const [fechaContratacion, setFechaContratacion] = useState(
    defaultValues?.fechaContratacion ? defaultValues.fechaContratacion.substring(0, 10) : ''
  )
  const [estadoLaboral, setEstadoLaboral] = useState<'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO'>(
    (defaultValues?.estadoLaboral as 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO') ?? 'ACTIVO'
  )
  const [departamentoId, setDepartamentoId] = useState<number | undefined>(defaultValues?.departamentoId)
  const [puestoId, setPuestoId] = useState<number | undefined>(defaultValues?.puestoId)
  const [salarioMensual, setSalarioMensual] = useState<number | ''>(defaultValues?.salarioMensual ?? '')

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
    enabled: !!departamentoId,
    staleTime: 60_000,
  })

  const departamentos: DepartmentDTO[] = useMemo(() => deptsData?.data ?? [], [deptsData])
  const puestos: PositionDTO[] = useMemo(() => possData?.data ?? [], [possData])

  // Si cambia el departamento, resetea puesto y salario
  useEffect(() => {
    setPuestoId(undefined)
    setSalarioMensual('')
  }, [departamentoId])

  // Cuando cambia el puesto, setea automáticamente el salario base
  useEffect(() => {
    if (!puestoId) return
    const p = puestos.find((x) => x.id === puestoId)
    if (p && p.salarioBase) {
      setSalarioMensual(Number(p.salarioBase))
    }
  }, [puestoId, puestos])

  // ---------- Submit con validación ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    // ========== VALIDACIONES OBLIGATORIAS ==========
    if (!nombreCompleto.trim()) {
      nextErrors.nombreCompleto = 'El nombre completo es obligatorio.'
    } else if (nombreCompleto.trim().length < 3) {
      nextErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres.'
    }

    if (!correo.trim()) {
      nextErrors.correo = 'El correo es obligatorio.'
    } else if (!isEmail(correo)) {
      nextErrors.correo = 'Ingresa un correo válido (ejemplo@dominio.com).'
    }

    if (!dpi.trim()) {
      nextErrors.dpi = 'El DPI es obligatorio.'
    }

    if (!nit.trim()) {
      nextErrors.nit = 'El NIT es obligatorio.'
    }

    if (!telefono.trim()) {
      nextErrors.telefono = 'El teléfono es obligatorio.'
    }

    if (!direccion.trim()) {
      nextErrors.direccion = 'La dirección es obligatoria.'
    }

    if (!fechaNacimiento) {
      nextErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
    }

    if (!fechaContratacion) {
      nextErrors.fechaContratacion = 'La fecha de contratación es obligatoria.'
    }

    if (!departamentoId) {
      nextErrors.departamentoId = 'Debes seleccionar un departamento.'
    }

    if (!puestoId) {
      nextErrors.puestoId = 'Debes seleccionar un puesto.'
    }

    // ========== VALIDACIONES DE FORMATO ==========
    const dpiClean = digitsOnly(dpi)
    const nitClean = digitsOnly(nit)
    const telClean = digitsOnly(telefono)

    if (dpi && !isDigits(dpiClean, 13)) {
      nextErrors.dpi = 'El DPI debe tener exactamente 13 dígitos.'
    }

    if (nit && !isDigits(nitClean, 13)) {
      nextErrors.nit = 'El NIT debe tener exactamente 13 dígitos (sin guiones).'
    }

    if (telefono && !isDigitsRange(telClean, 8, 15)) {
      nextErrors.telefono = 'El teléfono debe tener entre 8 y 15 dígitos.'
    }

    // ========== VALIDACIONES DE UNICIDAD (no duplicados) ==========
    if (dpiClean && nitClean && dpiClean === nitClean) {
      nextErrors.nit = 'El NIT no puede ser igual al DPI.'
    }

    if (dpiClean && telClean && dpiClean === telClean) {
      nextErrors.telefono = 'El teléfono no puede ser igual al DPI.'
    }

    if (nitClean && telClean && nitClean === telClean) {
      nextErrors.telefono = 'El teléfono no puede ser igual al NIT.'
    }

    // ========== VALIDACIONES DE FECHAS ==========
    if (fechaNacimiento) {
      const fn = new Date(fechaNacimiento)
      const now = new Date()
      
      if (isNaN(fn.getTime())) {
        nextErrors.fechaNacimiento = 'Fecha inválida.'
      } else if (fn > now) {
        nextErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
      } else if (yearsBetween(fn, now) < 18) {
        nextErrors.fechaNacimiento = 'El empleado debe ser mayor de 18 años.'
      }
    }

    if (fechaContratacion) {
      const fc = new Date(fechaContratacion)
      const now = new Date()
      
      if (isNaN(fc.getTime())) {
        nextErrors.fechaContratacion = 'Fecha inválida.'
      } else if (fc > now) {
        nextErrors.fechaContratacion = 'La fecha de contratación no puede ser futura.'
      }
    }

    if (fechaNacimiento && fechaContratacion) {
      const fn = new Date(fechaNacimiento)
      const fc = new Date(fechaContratacion)
      
      if (fc < fn) {
        nextErrors.fechaContratacion = 'La fecha de contratación no puede ser anterior al nacimiento.'
      }
      
      if (yearsBetween(fn, fc) < 18) {
        nextErrors.fechaContratacion = 'El empleado debe haber tenido al menos 18 años al ser contratado.'
      }
    }

    // ========== VALIDACIÓN DE SALARIO ==========
    const salarioVal = typeof salarioMensual === 'number' ? salarioMensual : Number(salarioMensual)
    
    if (!salarioMensual || !Number.isFinite(salarioVal) || salarioVal <= 0) {
      nextErrors.salarioMensual = 'El salario es obligatorio y debe ser mayor a 0.'
    } else if (salarioVal < 2500) {
      nextErrors.salarioMensual = 'El salario debe ser al menos Q2,500.00 (salario mínimo).'
    }

    // Si hay errores, no enviar
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      // Scroll al primer error
      const firstErrorField = Object.keys(nextErrors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    // ========== ENVÍO ==========
    onSubmit({
      nombreCompleto: nombreCompleto.trim(),
      correo: correo.trim().toLowerCase(),
      dpi: dpiClean,
      nit: nitClean,
      telefono: telClean,
      direccion: direccion.trim(),
      fechaNacimiento: new Date(fechaNacimiento).toISOString(),
      fechaContratacion: new Date(fechaContratacion).toISOString(),
      estadoLaboral,
      departamentoId,
      puestoId,
      salarioMensual: salarioVal,
    })
  }

  return (
    <form
      className="grid gap-5 rounded-2xl border bg-white/90 p-5 shadow-lg ring-1 ring-black/5"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* ENCABEZADO */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
        <p className="text-sm text-gray-500">Campos marcados con * son obligatorios</p>
      </div>

      {/* FILA 1: Nombre y Correo */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombreCompleto" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre completo <span className="text-rose-600">*</span>
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            value={nombreCompleto}
            onChange={(e) => {
              setNombreCompleto(e.target.value)
              if (errors.nombreCompleto) setErrors((p) => ({ ...p, nombreCompleto: '' }))
            }}
            placeholder="Ej: Juan Carlos Pérez López"
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.nombreCompleto ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.nombreCompleto ? 'error-nombreCompleto' : undefined}
            aria-invalid={!!errors.nombreCompleto}
          />
          {errors.nombreCompleto && (
            <p id="error-nombreCompleto" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.nombreCompleto}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="correo" className="mb-1 block text-sm font-medium text-gray-700">
            Correo electrónico <span className="text-rose-600">*</span>
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value)
              if (errors.correo) setErrors((p) => ({ ...p, correo: '' }))
            }}
            placeholder="ejemplo@correo.com"
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.correo ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.correo ? 'error-correo' : undefined}
            aria-invalid={!!errors.correo}
          />
          {errors.correo && (
            <p id="error-correo" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.correo}
            </p>
          )}
        </div>
      </div>

      {/* FILA 2: DPI y NIT */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dpi" className="mb-1 block text-sm font-medium text-gray-700">
            DPI <span className="text-rose-600">*</span>
          </label>
          <input
            id="dpi"
            name="dpi"
            type="text"
            inputMode="numeric"
            maxLength={13}
            value={dpi}
            onInput={(e) => {
              const el = e.currentTarget
              el.value = digitsOnly(el.value).slice(0, 13)
            }}
            onChange={(e) => {
              setDpi(e.target.value)
              if (errors.dpi) setErrors((p) => ({ ...p, dpi: '' }))
            }}
            placeholder="1234567890123 (13 dígitos)"
            className={`w-full rounded-xl border px-3 py-2 font-mono transition focus:outline-none focus:ring-2 ${
              errors.dpi ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.dpi ? 'error-dpi' : undefined}
            aria-invalid={!!errors.dpi}
          />
          {errors.dpi && (
            <p id="error-dpi" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.dpi}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Solo números, 13 dígitos</p>
        </div>

        <div>
          <label htmlFor="nit" className="mb-1 block text-sm font-medium text-gray-700">
            NIT <span className="text-rose-600">*</span>
          </label>
          <input
            id="nit"
            name="nit"
            type="text"
            inputMode="numeric"
            maxLength={13}
            value={nit}
            onInput={(e) => {
              const el = e.currentTarget
              el.value = digitsOnly(el.value).slice(0, 13)
            }}
            onChange={(e) => {
              setNit(e.target.value)
              if (errors.nit) setErrors((p) => ({ ...p, nit: '' }))
            }}
            placeholder="1234567890123 (13 dígitos)"
            className={`w-full rounded-xl border px-3 py-2 font-mono transition focus:outline-none focus:ring-2 ${
              errors.nit ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.nit ? 'error-nit' : undefined}
            aria-invalid={!!errors.nit}
          />
          {errors.nit && (
            <p id="error-nit" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.nit}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Sin guiones, 13 dígitos</p>
        </div>
      </div>

      {/* FILA 3: Teléfono y Dirección */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-gray-700">
            Teléfono <span className="text-rose-600">*</span>
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            maxLength={15}
            value={telefono}
            onInput={(e) => {
              const el = e.currentTarget
              el.value = digitsOnly(el.value).slice(0, 15)
            }}
            onChange={(e) => {
              setTelefono(e.target.value)
              if (errors.telefono) setErrors((p) => ({ ...p, telefono: '' }))
            }}
            placeholder="12345678"
            className={`w-full rounded-xl border px-3 py-2 font-mono transition focus:outline-none focus:ring-2 ${
              errors.telefono ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.telefono ? 'error-telefono' : undefined}
            aria-invalid={!!errors.telefono}
          />
          {errors.telefono && (
            <p id="error-telefono" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.telefono}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">8-15 dígitos</p>
        </div>

        <div>
          <label htmlFor="direccion" className="mb-1 block text-sm font-medium text-gray-700">
            Dirección <span className="text-rose-600">*</span>
          </label>
          <input
            id="direccion"
            name="direccion"
            type="text"
            value={direccion}
            onChange={(e) => {
              setDireccion(e.target.value)
              if (errors.direccion) setErrors((p) => ({ ...p, direccion: '' }))
            }}
            placeholder="Zona, calle, número, ciudad"
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.direccion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.direccion ? 'error-direccion' : undefined}
            aria-invalid={!!errors.direccion}
          />
          {errors.direccion && (
            <p id="error-direccion" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.direccion}
            </p>
          )}
        </div>
      </div>

      {/* FILA 4: Fechas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaNacimiento" className="mb-1 block text-sm font-medium text-gray-700">
            Fecha de nacimiento <span className="text-rose-600">*</span>
          </label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            max={todayISO()}
            value={fechaNacimiento}
            onChange={(e) => {
              setFechaNacimiento(e.target.value)
              if (errors.fechaNacimiento) setErrors((p) => ({ ...p, fechaNacimiento: '' }))
            }}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.fechaNacimiento ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.fechaNacimiento ? 'error-fechaNacimiento' : undefined}
            aria-invalid={!!errors.fechaNacimiento}
          />
          {errors.fechaNacimiento && (
            <p id="error-fechaNacimiento" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.fechaNacimiento}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Debe ser mayor de 18 años</p>
        </div>

        <div>
          <label htmlFor="fechaContratacion" className="mb-1 block text-sm font-medium text-gray-700">
            Fecha de contratación <span className="text-rose-600">*</span>
          </label>
          <input
            id="fechaContratacion"
            name="fechaContratacion"
            type="date"
            max={todayISO()}
            value={fechaContratacion}
            onChange={(e) => {
              setFechaContratacion(e.target.value)
              if (errors.fechaContratacion) setErrors((p) => ({ ...p, fechaContratacion: '' }))
            }}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.fechaContratacion ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.fechaContratacion ? 'error-fechaContratacion' : undefined}
            aria-invalid={!!errors.fechaContratacion}
          />
          {errors.fechaContratacion && (
            <p id="error-fechaContratacion" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.fechaContratacion}
            </p>
          )}
        </div>
      </div>

      {/* SEPARADOR */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900">Información Laboral</h3>
      </div>

      {/* FILA 5: Estado y Salario */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="estadoLaboral" className="mb-1 block text-sm font-medium text-gray-700">
            Estado laboral <span className="text-rose-600">*</span>
          </label>
          <select
            id="estadoLaboral"
            name="estadoLaboral"
            value={estadoLaboral}
            onChange={(e) => setEstadoLaboral(e.target.value as 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO')}
            className="w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ESTADOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="salarioMensual" className="mb-1 block text-sm font-medium text-gray-700">
            Salario mensual (GTQ) <span className="text-rose-600">*</span>
          </label>
          <input
            id="salarioMensual"
            name="salarioMensual"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="2500"
            value={salarioMensual}
            readOnly
            className={`w-full rounded-xl border bg-gray-50 px-3 py-2 font-semibold text-gray-700 transition focus:outline-none ${
              errors.salarioMensual ? 'border-rose-400' : ''
            }`}
            aria-describedby={errors.salarioMensual ? 'error-salarioMensual' : 'help-salarioMensual'}
            aria-invalid={!!errors.salarioMensual}
          />
          {errors.salarioMensual && (
            <p id="error-salarioMensual" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.salarioMensual}
            </p>
          )}
          {!errors.salarioMensual && (
            <p id="help-salarioMensual" className="mt-1 text-xs text-indigo-600">
              ✓ Se asigna automáticamente según el puesto
            </p>
          )}
        </div>
      </div>

      {/* FILA 6: Departamento y Puesto */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="departamentoId" className="mb-1 block text-sm font-medium text-gray-700">
            Departamento <span className="text-rose-600">*</span>
          </label>
          <select
            id="departamentoId"
            name="departamentoId"
            value={departamentoId ?? ''}
            onChange={(e) => {
              setDepartamentoId(e.target.value ? Number(e.target.value) : undefined)
              if (errors.departamentoId) setErrors((p) => ({ ...p, departamentoId: '' }))
            }}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.departamentoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            }`}
            aria-describedby={errors.departamentoId ? 'error-departamentoId' : undefined}
            aria-invalid={!!errors.departamentoId}
          >
            <option value="">Selecciona un departamento...</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
          {errors.departamentoId && (
            <p id="error-departamentoId" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.departamentoId}
            </p>
          )}
          {!departamentos.length && (
            <p className="mt-1 text-sm text-amber-600">
              ⚠️ No hay departamentos activos. <a href="/departamentos/nuevo" className="underline">Crea uno primero</a>.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="puestoId" className="mb-1 block text-sm font-medium text-gray-700">
            Puesto <span className="text-rose-600">*</span>
          </label>
          <select
            id="puestoId"
            name="puestoId"
            value={puestoId ?? ''}
            onChange={(e) => {
              setPuestoId(e.target.value ? Number(e.target.value) : undefined)
              if (errors.puestoId) setErrors((p) => ({ ...p, puestoId: '' }))
            }}
            disabled={!departamentoId || isFetchingPositions}
            className={`w-full rounded-xl border px-3 py-2 transition focus:outline-none focus:ring-2 ${
              errors.puestoId ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
            } ${!departamentoId || isFetchingPositions ? 'cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
            aria-describedby={errors.puestoId ? 'error-puestoId' : 'help-puestoId'}
            aria-invalid={!!errors.puestoId}
          >
            <option value="">
              {!departamentoId
                ? 'Selecciona un departamento primero'
                : isFetchingPositions
                  ? 'Cargando puestos...'
                  : 'Selecciona un puesto...'}
            </option>
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Q{p.salarioBase?.toLocaleString('es-GT') ?? '0.00'})
              </option>
            ))}
          </select>
          {errors.puestoId && (
            <p id="error-puestoId" className="mt-1 text-sm text-rose-600" role="alert">
              {errors.puestoId}
            </p>
          )}
          {!puestos.length && departamentoId && !isFetchingPositions && (
            <p id="help-puestoId" className="mt-1 text-sm text-amber-600">
              ⚠️ Este departamento no tiene puestos activos.
            </p>
          )}
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-wrap gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-lg transition hover:bg-indigo-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"
          aria-busy={submitting}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Guardando...
            </span>
          ) : (
            'Guardar Empleado'
          )}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={submitting}
          className="rounded-xl border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[.98] disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="reset"
          onClick={() => {
            setNombreCompleto('')
            setCorreo('')
            setDpi('')
            setNit('')
            setTelefono('')
            setDireccion('')
            setFechaNacimiento('')
            setFechaContratacion('')
            setEstadoLaboral('ACTIVO')
            setDepartamentoId(undefined)
            setPuestoId(undefined)
            setSalarioMensual('')
            setErrors({})
          }}
          disabled={submitting}
          className="ml-auto rounded-xl border border-rose-300 px-6 py-2.5 font-medium text-rose-600 transition hover:bg-rose-50 active:scale-[.98] disabled:opacity-50"
        >
          Limpiar Formulario
        </button>
      </div>
    </form>
  )
}
