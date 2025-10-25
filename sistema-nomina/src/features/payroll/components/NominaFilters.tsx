import { useState } from 'react'

interface NominaFiltersProps {
  onFilterChange: (filters: {
    mes?: number
    año?: number
    tipo?: string
    estado?: string
  }) => void
}

export default function NominaFilters({ onFilterChange }: NominaFiltersProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [mes, setMes] = useState<number>(currentMonth)
  const [año, setAño] = useState<number>(currentYear)
  const [tipo, setTipo] = useState<string>('')
  const [estado, setEstado] = useState<string>('')

  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
  ]

  const años = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const handleApplyFilters = () => {
    onFilterChange({
      mes: mes || undefined,
      año: año || undefined,
      tipo: tipo || undefined,
      estado: estado || undefined,
    })
  }

  const handleReset = () => {
    setMes(currentMonth)
    setAño(currentYear)
    setTipo('')
    setEstado('')
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Mes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes
          </label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            {meses.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <select
            value={año}
            onChange={(e) => setAño(Number(e.target.value))}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            {años.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="Personal">Personal</option>
            <option value="Individual">Individual</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="Completo">Completo</option>
            <option value="Borrador">Borrador</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={handleApplyFilters}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  )
}
