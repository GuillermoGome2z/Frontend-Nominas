import { useEffect, useRef, useState } from 'react'
import type { PositionDTO } from './api'
import { useQuery } from '@tanstack/react-query'
import { listDepartments, type DepartmentDTO } from '../departments/api'

type Props = {
  defaultValues?: Partial<PositionDTO>
  onSubmit: (data: Partial<PositionDTO>) => void
  submitting?: boolean
}

export default function PositionForm({ defaultValues, onSubmit, submitting }: Props) {
  const [nombre, setNombre] = useState(defaultValues?.nombre ?? '')
  const [salarioBase, setSalarioBase] = useState<string>(
    defaultValues?.salarioBase != null ? String(defaultValues.salarioBase) : ''
  )
  const [activo, setActivo] = useState<boolean>(defaultValues?.activo ?? true)
  const [departamentoId, setDepartamentoId] = useState<number | ''>(
    defaultValues?.departamentoId ?? ''
  )

  const [errSalario, setErrSalario] = useState<string>('')
  const [errDept, setErrDept] = useState<string>('')

  const salarioRef = useRef<HTMLInputElement>(null)

  // Catálogo de departamentos (activos)
  const { data: deptsData, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments', { page: 1, pageSize: 1000, activo: true }],
    queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true }),
    staleTime: 60_000,
  })
  const departamentos: DepartmentDTO[] = deptsData?.data ?? []

  useEffect(() => {
    // Si en algún momento quieres permitir departamentos inactivos seleccionados por default,
    // podrías agregarlos aquí como opción deshabilitada. Por ahora no es necesario.
  }, [departamentos])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación salario
    const n = Number(salarioBase)
    if (!salarioBase || !Number.isFinite(n) || n <= 0) {
      setErrSalario('El salario base es obligatorio y debe ser mayor a 0.')
      salarioRef.current?.focus()
      return
    }
    setErrSalario('')

    // Validación departamento
    if (departamentoId === '' || !Number.isFinite(Number(departamentoId))) {
      setErrDept('Debes seleccionar un departamento.')
      return
    }
    setErrDept('')

    onSubmit({
      nombre: nombre.trim(),
      salarioBase: Number(n.toFixed(2)),
      activo,
      departamentoId: Number(departamentoId),
    })
  }

  return (
    // OJO: este form ya NO tiene borde propio (el card externo lo pone la página)
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="group">
        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
        <input
          className="w-full rounded-xl border px-3 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={nombre}
          onChange={(e)=> setNombre(e.target.value)}
          placeholder="Ej. Desarrollador Web"
          required
        />
      </div>

      <div className="group">
        <label className="mb-1 block text-sm font-medium text-gray-700">Departamento</label>
        <select
          className={`w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 ${
            errDept ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={departamentoId}
          onChange={(e)=> setDepartamentoId(e.target.value ? Number(e.target.value) : '')}
          disabled={loadingDepts}
        >
          <option value="">
            {loadingDepts ? 'Cargando…' : 'Selecciona…'}
          </option>
          {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
        </select>
        {errDept && <p className="mt-1 text-sm text-rose-600">{errDept}</p>}
      </div>

      <div className="group">
        <label className="mb-1 block text-sm font-medium text-gray-700">Salario base (GTQ)</label>
        <input
          ref={salarioRef}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0.01"
          className={`w-full rounded-xl border px-3 py-2 shadow-inner focus:outline-none focus:ring-2 ${
            errSalario ? 'border-rose-400 focus:ring-rose-400' : 'focus:ring-indigo-500'
          }`}
          value={salarioBase}
          onChange={(e) => {
            const v = e.target.value
            setSalarioBase(v)
            if (errSalario) setErrSalario('')
          }}
          onKeyDown={(e) => { if (['e','E','+','-'].includes(e.key)) e.preventDefault() }}
          onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
          aria-invalid={!!errSalario}
          aria-describedby="salario-help salario-error"
          required
        />
        <div id="salario-help" className="mt-1 text-xs text-gray-500">
          Ingresa un valor mayor a 0. Se aceptan hasta dos decimales.
        </div>
        {errSalario && <div id="salario-error" className="mt-1 text-sm text-rose-600">{errSalario}</div>}
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={activo} onChange={(e)=> setActivo(e.target.checked)} />
        <span>Activo</span>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-white shadow hover:bg-indigo-700 active:scale-[.98] disabled:opacity-50 transition"
        >
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
