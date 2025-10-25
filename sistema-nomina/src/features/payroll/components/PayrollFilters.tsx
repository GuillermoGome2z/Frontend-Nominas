import { useState } from 'react'
import type { NominaFilters, TipoNomina, EstadoNomina } from '../api'

interface PayrollFiltersProps {
  filters: NominaFilters
  onFiltersChange: (filters: Partial<NominaFilters>) => void
  onReset: () => void
  activeCount?: number
}

const TIPOS_NOMINA: TipoNomina[] = ['ORDINARIA', 'EXTRAORDINARIA', 'AGUINALDO', 'BONO14']
const ESTADOS_NOMINA: EstadoNomina[] = ['BORRADOR', 'APROBADA', 'PAGADA', 'ANULADA']

export default function PayrollFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  activeCount = 0 
}: PayrollFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Obtener departamentos para futuras expansiones del filtro
  // const { data: departmentsData } = useDepartments({ page: 1, pageSize: 1000, activo: true })
  // const departments = departmentsData?.data ?? []

  // Generar opciones de período (últimos 24 meses)
  const generatePeriodos = () => {
    const periodos = []
    const now = new Date()
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const periodo = `${year}-${month}`
      
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ]
      
      periodos.push({
        value: periodo,
        label: `${monthNames[date.getMonth()]} ${year}`
      })
    }
    
    return periodos
  }

  const periodos = generatePeriodos()

  const activeFilters = [
    { key: 'q', label: 'Búsqueda', value: filters.q },
    { key: 'periodo', label: 'Período', value: filters.periodo },
    { key: 'tipoNomina', label: 'Tipo', value: filters.tipoNomina },
    { key: 'estado', label: 'Estado', value: filters.estado },
    { key: 'fechaInicio', label: 'Fecha inicio', value: filters.fechaInicio },
    { key: 'fechaFin', label: 'Fecha fin', value: filters.fechaFin },
  ].filter(filter => filter.value)

  const removeFilter = (key: string) => {
    onFiltersChange({ [key]: undefined })
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm">
      {/* Header con botón expandir/colapsar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            {activeCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {activeCount} activo{activeCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Limpiar todos
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'} filtros
              <svg 
                className={`ml-1 h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros activos (chips) */}
      {activeFilters.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200"
              >
                <span className="font-medium">{filter.label}:</span>
                <span className="ml-1">
                  {filter.key === 'periodo' && filter.value ? 
                    periodos.find(p => p.value === filter.value)?.label || filter.value :
                    String(filter.value)
                  }
                </span>
                <button
                  onClick={() => removeFilter(filter.key)}
                  className="ml-2 hover:text-indigo-600"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Panel de filtros expandible */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Búsqueda general */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={filters.q || ''}
                  onChange={(e) => onFiltersChange({ q: e.target.value || undefined })}
                  placeholder="Buscar por observaciones, creado por..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Período */}
            <div>
              <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                id="periodo"
                value={filters.periodo || ''}
                onChange={(e) => onFiltersChange({ periodo: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los períodos</option>
                {periodos.map((periodo) => (
                  <option key={periodo.value} value={periodo.value}>
                    {periodo.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de Nómina */}
            <div>
              <label htmlFor="tipoNomina" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Nómina
              </label>
              <select
                id="tipoNomina"
                value={filters.tipoNomina || ''}
                onChange={(e) => onFiltersChange({ tipoNomina: (e.target.value as TipoNomina) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los tipos</option>
                {TIPOS_NOMINA.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                id="estado"
                value={filters.estado || ''}
                onChange={(e) => onFiltersChange({ estado: (e.target.value as EstadoNomina) || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_NOMINA.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha inicio */}
            <div>
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                value={filters.fechaInicio || ''}
                onChange={(e) => onFiltersChange({ fechaInicio: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Fecha fin */}
            <div>
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha fin
              </label>
              <input
                type="date"
                id="fechaFin"
                value={filters.fechaFin || ''}
                onChange={(e) => onFiltersChange({ fechaFin: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Acciones del panel */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Filtros aplicados: {activeCount}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Limpiar filtros
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}