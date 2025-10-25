// ✅ FORMULARIO DE EMPLEADO MEJORADO
// Campos requeridos según el backend ASP.NET Core

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { EmployeeDTO } from './api'
import { checkEmailExists, checkDpiExists, checkNitExists } from './api'
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

  // ----- Validaciones en tiempo real -----
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [checkingDpi, setCheckingDpi] = useState(false)
  const [checkingNit, setCheckingNit] = useState(false)
  
  const emailTimerRef = useRef<number | undefined>(undefined)
  const dpiTimerRef = useRef<number | undefined>(undefined)
  const nitTimerRef = useRef<number | undefined>(undefined)

  // ----- Validaciones (mensajes) -----
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ----- Validación de correo con debounce -----
  const validateEmail = useCallback(async (value: string) => {
    if (!value || !isEmail(value)) return
    
    setCheckingEmail(true)
    try {
      const exists = await checkEmailExists(value, defaultValues?.id)
      if (exists) {
        setErrors(prev => ({
          ...prev,
          correo: '⚠️ Este correo ya está registrado en el sistema.'
        }))
      } else {
        setErrors(prev => {
          const { correo, ...rest } = prev
          return rest
        })
      }
    } catch (error) {
      console.error('Error validando correo:', error)
    } finally {
      setCheckingEmail(false)
    }
  }, [defaultValues?.id])

  // ----- Validación de DPI con debounce -----
  const validateDpi = useCallback(async (value: string) => {
    const clean = digitsOnly(value)
    if (!clean || clean.length !== 13) return
    
    setCheckingDpi(true)
    try {
      const exists = await checkDpiExists(clean, defaultValues?.id)
      if (exists) {
        setErrors(prev => ({
          ...prev,
          dpi: '⚠️ Este DPI ya está registrado en el sistema.'
        }))
      } else {
        setErrors(prev => {
          const { dpi, ...rest } = prev
          return rest
        })
      }
    } catch (error) {
      console.error('Error validando DPI:', error)
    } finally {
      setCheckingDpi(false)
    }
  }, [defaultValues?.id])

  // ----- Validación de NIT con debounce -----
  const validateNit = useCallback(async (value: string) => {
    const clean = digitsOnly(value)
    if (!clean || clean.length !== 13) return
    
    setCheckingNit(true)
    try {
      const exists = await checkNitExists(clean, defaultValues?.id)
      if (exists) {
        setErrors(prev => ({
          ...prev,
          nit: '⚠️ Este NIT ya está registrado en el sistema.'
        }))
      } else {
        setErrors(prev => {
          const { nit, ...rest } = prev
          return rest
        })
      }
    } catch (error) {
      console.error('Error validando NIT:', error)
    } finally {
      setCheckingNit(false)
    }
  }, [defaultValues?.id])

  // ----- Effect para validar correo con debounce -----
  useEffect(() => {
    if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
    
    if (correo && isEmail(correo)) {
      emailTimerRef.current = window.setTimeout(() => {
        validateEmail(correo)
      }, 800) // Espera 800ms después de que el usuario termina de escribir
    }
    
    return () => {
      if (emailTimerRef.current) clearTimeout(emailTimerRef.current)
    }
  }, [correo, validateEmail])

  // ----- Effect para validar DPI con debounce -----
  useEffect(() => {
    if (dpiTimerRef.current) clearTimeout(dpiTimerRef.current)
    
    const clean = digitsOnly(dpi)
    if (clean.length === 13) {
      dpiTimerRef.current = window.setTimeout(() => {
        validateDpi(dpi)
      }, 800)
    }
    
    return () => {
      if (dpiTimerRef.current) clearTimeout(dpiTimerRef.current)
    }
  }, [dpi, validateDpi])

  // ----- Effect para validar NIT con debounce -----
  useEffect(() => {
    if (nitTimerRef.current) clearTimeout(nitTimerRef.current)
    
    const clean = digitsOnly(nit)
    if (clean.length === 13) {
      nitTimerRef.current = window.setTimeout(() => {
        validateNit(nit)
      }, 800)
    }
    
    return () => {
      if (nitTimerRef.current) clearTimeout(nitTimerRef.current)
    }
  }, [nit, validateNit])

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

    // ========== VALIDACIÓN DE DUPLICADOS (prevenir envío si hay errores de duplicados) ==========
    if (errors.correo && errors.correo.includes('ya está registrado')) {
      nextErrors.correo = errors.correo
    }
    if (errors.dpi && errors.dpi.includes('ya está registrado')) {
      nextErrors.dpi = errors.dpi
    }
    if (errors.nit && errors.nit.includes('ya está registrado')) {
      nextErrors.nit = errors.nit
    }

    // Si hay errores de duplicados, no continuar
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      const firstErrorField = Object.keys(nextErrors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

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

    // Límites / formatos
    if (!isEmail(correo)) nextErrors.correo = 'Correo inválido.'
    if (!isDigits(dpiClean, 13)) nextErrors.dpi = 'DPI debe tener exactamente 13 dígitos.'
    if (!isDigits(nitClean, 13)) nextErrors.nit = 'NIT debe tener exactamente 13 dígitos.'
    if (!isDigits(telClean, 8)) nextErrors.telefono = 'Teléfono debe tener exactamente 8 dígitos (formato Guatemala).'

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
      className="grid gap-6 rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/30 p-8 shadow-xl ring-1 ring-slate-900/5 backdrop-blur transition-all duration-300"
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
        <div className="group">
          <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
            👤 Nombre completo
          </label>
          <input
            id="nombreCompleto"
            name="nombreCompleto"
            type="text"
            value={nombreCompleto}
            onChange={(e)=> { setNombreCompleto(e.target.value); if (errors.nombreCompleto) setErrors(p=>({ ...p, nombreCompleto: '' }))}}
            className={`w-full rounded-2xl border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.nombreCompleto 
                ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-400/60' 
                : 'border-slate-200 bg-white focus:border-blue-300 focus:ring-blue-400/60'
            }`}
            placeholder="Ingresa el nombre completo del empleado"
          />
          {errors.nombreCompleto && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-700">
              ❌ {errors.nombreCompleto}
            </p>
          )}
        </div>

        <div className="group">
          <label className="mb-2 block text-sm font-semibold text-slate-700 flex items-center gap-2">
            📧 Correo electrónico
            {checkingEmail && <span className="text-xs text-blue-600 animate-pulse">Verificando...</span>}
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            value={correo}
            onChange={(e)=> { setCorreo(e.target.value); if (errors.correo) setErrors(p=>({ ...p, correo: '' }))}}
            className={`w-full rounded-2xl border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.correo 
                ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-400/60' 
                : 'border-slate-200 bg-white focus:border-blue-300 focus:ring-blue-400/60'
            }`}
            placeholder="ejemplo@empresa.com"
          />
          {errors.correo && (
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-700">
              ❌ {errors.correo}
            </p>
          )}
        </div>
      </div>

      {/* FILA 2: DPI y NIT */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dpi" className="mb-1 block text-sm font-medium text-gray-700 flex items-center gap-2">
            DPI <span className="text-rose-600">*</span>
            {checkingDpi && <span className="text-xs text-blue-600 animate-pulse">Verificando...</span>}
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
          <label htmlFor="nit" className="mb-1 block text-sm font-medium text-gray-700 flex items-center gap-2">
            NIT <span className="text-rose-600">*</span>
            {checkingNit && <span className="text-xs text-blue-600 animate-pulse">Verificando...</span>}
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
            maxLength={8}
            onInput={(e) => { const el = e.currentTarget; el.value = digitsOnly(el.value).slice(0, 8) }}
            onChange={(e)=> { setTelefono(e.target.value); if (errors.telefono) setErrors(p=>({ ...p, telefono: '' }))}}
            placeholder="8 dígitos (Guatemala)"
            className={`w-full rounded-xl border px-3 py-2 shadow-inner transition focus:outline-none focus:ring-2 ${errors.telefono ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'}`}
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

      {/* acciones */}
      <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200/50">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              Guardando...
            </>
          ) : (
            <>
              💾 Guardar empleado
            </>
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
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-[.98]"
        >
          🗑️ Limpiar formulario
        </button>
      </div>
    </form>
  )
}
