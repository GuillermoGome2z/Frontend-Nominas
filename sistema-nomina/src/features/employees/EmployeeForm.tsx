import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { EmployeeDTO, EstadoLaboral } from './api'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'

type FormValues = {
  nombreCompleto: string
  dpi: string
  nit: string
  correo: string
  telefono?: string
  direccion?: string
  fechaNacimiento?: string
  fechaContratacion?: string
  estadoLaboral?: EstadoLaboral
  salarioMensual?: number
  departamentoId?: number
  puestoId?: number
}

type Props = {
  /** Valores iniciales cuando editas; para crear puedes omitirlo */
  defaultValues?: Partial<EmployeeDTO>
  /** Handler que recibe el payload ya listo (números castea-dos) */
  onSubmit: (values: Partial<EmployeeDTO>) => void
  /** Deshabilita el botón durante la mutación */
  submitting?: boolean
}

/** Catálogos por nombre (para selects) */
function useDepartamentos() {
  return useQuery<{ id: number; nombre: string }[], Error>({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const r = await api.get('/Departamentos', { params: { page: 1, pageSize: 1000 } })
      return (r.data as any[]).map(d => ({ id: d.Id ?? d.id, nombre: d.Nombre ?? d.nombre }))
    },
    staleTime: 5 * 60 * 1000,
  })
}
function usePuestos() {
  return useQuery<{ id: number; nombre: string }[], Error>({
    queryKey: ['puestos'],
    queryFn: async () => {
      const r = await api.get('/Puestos', { params: { page: 1, pageSize: 1000 } })
      return (r.data as any[]).map(p => ({ id: p.Id ?? p.id, nombre: p.Nombre ?? p.nombre }))
    },
    staleTime: 5 * 60 * 1000,
  })
}

export default function EmployeeForm({ defaultValues, onSubmit, submitting }: Props) {
  const { id } = useParams()
  const empleadoId = Number(id)
  const { data: departamentos } = useDepartamentos()
  const { data: puestos } = usePuestos()

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      estadoLaboral: 'ACTIVO',
    },
  })

  /** Cargar en el formulario los valores de edición */
  useEffect(() => {
    if (defaultValues) {
      const v: FormValues = {
        nombreCompleto: defaultValues.nombreCompleto ?? '',
        dpi: defaultValues.dpi ?? '',
        nit: defaultValues.nit ?? '',
        correo: defaultValues.correo ?? '',
        telefono: defaultValues.telefono ?? '',
        direccion: defaultValues.direccion ?? '',
        fechaNacimiento: defaultValues.fechaNacimiento?.slice(0, 10),
        fechaContratacion: defaultValues.fechaContratacion?.slice(0, 10),
        estadoLaboral: (defaultValues.estadoLaboral as EstadoLaboral) ?? 'ACTIVO',
        salarioMensual: defaultValues.salarioMensual,
        departamentoId: defaultValues.departamentoId,
        puestoId: defaultValues.puestoId,
      }
      reset(v)
    }
  }, [defaultValues, reset, empleadoId])

  const submit = (values: FormValues) => {
    const payload: Partial<EmployeeDTO> = {
      ...values,
      salarioMensual: values.salarioMensual ? Number(values.salarioMensual) : undefined,
      departamentoId: values.departamentoId ? Number(values.departamentoId) : undefined,
      puestoId: values.puestoId ? Number(values.puestoId) : undefined,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-4xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Nombre completo</label>
          <input {...register('nombreCompleto', { required: true })} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input type="email" {...register('correo', { required: true })} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">DPI</label>
          <input {...register('dpi', { required: true })} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">NIT</label>
          <input {...register('nit', { required: true })} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input {...register('telefono')} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Dirección</label>
          <input {...register('direccion')} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de nacimiento</label>
          <input type="date" {...register('fechaNacimiento')} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de contratación</label>
          <input type="date" {...register('fechaContratacion')} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado laboral</label>
          <select {...register('estadoLaboral')} className="w-full rounded-xl border px-3 py-2">
            <option value="ACTIVO">ACTIVO</option>
            <option value="SUSPENDIDO">SUSPENDIDO</option>
            <option value="RETIRADO">RETIRADO</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Salario mensual</label>
          <input type="number" step="0.01" {...register('salarioMensual')} className="w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Departamento</label>
          <select {...register('departamentoId', { valueAsNumber: true })} className="w-full rounded-xl border px-3 py-2">
            <option value="">—</option>
            {departamentos?.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Puesto</label>
          <select {...register('puestoId', { valueAsNumber: true })} className="w-full rounded-xl border px-3 py-2">
            <option value="">—</option>
            {puestos?.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-60">
          {submitting ? 'Guardando…' : 'Guardar'}
        </button>
        <button type="reset" className="rounded-xl border px-4 py-2">Limpiar</button>
      </div>
    </form>
  )
}
