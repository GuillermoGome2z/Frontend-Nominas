import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../../lib/api'

type Props = {
  onFilter: (f: any) => void
  onCreate: () => void
}

function useDepartamentos() {
  return useQuery<{ id: number; nombre: string }[], Error>({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const r = await api.get('/Departamentos', { params: { page: 1, pageSize: 1000 } })
      return (r.data as any[]).map((d) => ({ id: d.Id ?? d.id, nombre: d.Nombre ?? d.nombre }))
    },
    staleTime: 5 * 60 * 1000,
  })
}

export default function Toolbar({ onFilter, onCreate }: Props) {
  const [q, setQ] = useState('')
  const [departamentoId, setDepartamentoId] = useState<number | undefined>(undefined)
  const { data: departamentos, isLoading } = useDepartamentos()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onFilter({ q, departamentoId })}
          placeholder="Buscar por nombre/DPI/NIT…"
          className="w-full sm:max-w-md rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Buscar empleados"
        />

        {/* Select por NOMBRE */}
        <select
          className="w-56 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={departamentoId ?? ''}
          onChange={(e) => setDepartamentoId(e.target.value ? Number(e.target.value) : undefined)}
          aria-label="Filtrar por departamento"
          disabled={isLoading}
        >
          <option value="">{isLoading ? 'Cargando departamentos…' : 'Todos los departamentos'}</option>
          {departamentos?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>

        <button
          onClick={() => onFilter({ q, departamentoId })}
          className="rounded-xl border px-4 py-2 hover:bg-gray-50"
        >
          Filtrar
        </button>
      </div>

      <button
        onClick={onCreate}
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        + Nuevo empleado
      </button>
    </div>
  )
}
