import { useEmployees } from '../../employees/hooks'
import { useDepartments } from '../../departments/hooks'  
import { usePositions } from '../../positions/hooks'
import { useTiposDocumento } from '../hooks'
import type { ExpedienteFilter } from '../api'

interface ExpedienteFiltersProps {
  filters: ExpedienteFilter
  onFiltersChange: (filters: Partial<ExpedienteFilter>) => void
  onResetFilters: () => void
}

export default function ExpedienteFilters({
  filters,
  onFiltersChange,
  onResetFilters
}: ExpedienteFiltersProps) {
  
  // Obtener datos para los selectores
  const { data: employeesData } = useEmployees({ page: 1, pageSize: 1000 })
  const { data: departmentsData } = useDepartments({ page: 1, pageSize: 100 })
  const { data: positionsData } = usePositions({ page: 1, pageSize: 100 })
  const { data: tiposDocumento } = useTiposDocumento()
  
  const employees = employeesData?.data ?? []
  const departments = departmentsData?.data ?? []
  const positions = positionsData?.data ?? []

  const handleInputChange = (key: keyof ExpedienteFilter, value: any) => {
    onFiltersChange({ [key]: value })
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  )

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filtros de Expedientes</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar Filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Búsqueda general */}
        <div className="lg:col-span-2">
          <label htmlFor="busqueda" className="block text-sm font-medium text-slate-700 mb-2">
            Búsqueda General
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="busqueda"
              placeholder="Buscar por empleado, documento, tipo..."
              value={filters.busqueda || ''}
              onChange={(e) => handleInputChange('busqueda', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Empleado */}
        <div>
          <label htmlFor="empleado" className="block text-sm font-medium text-slate-700 mb-2">
            Empleado
          </label>
          <select
            id="empleado"
            value={filters.empleadoId || ''}
            onChange={(e) => handleInputChange('empleadoId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los empleados</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.nombreCompleto}
              </option>
            ))}
          </select>
        </div>

        {/* Departamento */}
        <div>
          <label htmlFor="departamento" className="block text-sm font-medium text-slate-700 mb-2">
            Departamento
          </label>
          <select
            id="departamento"
            value={filters.departamentoId || ''}
            onChange={(e) => handleInputChange('departamentoId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los departamentos</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Puesto */}
        <div>
          <label htmlFor="puesto" className="block text-sm font-medium text-slate-700 mb-2">
            Puesto
          </label>
          <select
            id="puesto"
            value={filters.puestoId || ''}
            onChange={(e) => handleInputChange('puestoId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los puestos</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Documento */}
        <div>
          <label htmlFor="tipoDocumento" className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Documento
          </label>
          <select
            id="tipoDocumento"
            value={filters.tipoDocumentoId || ''}
            onChange={(e) => handleInputChange('tipoDocumentoId', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los tipos</option>
            {tiposDocumento?.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-slate-700 mb-2">
            Estado
          </label>
          <select
            id="estado"
            value={filters.estado || ''}
            onChange={(e) => handleInputChange('estado', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="ARCHIVADO">Archivados</option>
          </select>
        </div>

        {/* Fecha Inicio */}
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha Desde
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={filters.fechaInicio || ''}
            onChange={(e) => handleInputChange('fechaInicio', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Fecha Fin */}
        <div>
          <label htmlFor="fechaFin" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha Hasta
          </label>
          <input
            type="date"
            id="fechaFin"
            value={filters.fechaFin || ''}
            onChange={(e) => handleInputChange('fechaFin', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Información de filtros aplicados */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">Filtros activos:</span>
          </div>
          <div className="mt-1 text-sm text-blue-700">
            {Object.entries(filters)
              .filter(([_, value]) => value !== undefined && value !== '' && value !== null)
              .map(([key, value]) => {
                let displayValue = String(value)
                
                // Formatear valores especiales
                if (key === 'empleadoId') {
                  const employee = employees.find(e => e.id === Number(value))
                  displayValue = employee?.nombreCompleto || `ID: ${value}`
                } else if (key === 'departamentoId') {
                  const department = departments.find(d => d.id === Number(value))
                  displayValue = department?.nombre || `ID: ${value}`
                } else if (key === 'puestoId') {
                  const position = positions.find(p => p.id === Number(value))
                  displayValue = position?.nombre || `ID: ${value}`
                } else if (key === 'tipoDocumentoId') {
                  const tipo = tiposDocumento?.find(t => t.id === Number(value))
                  displayValue = tipo?.nombre || `ID: ${value}`
                } else if (key === 'fechaInicio') {
                  displayValue = `Desde: ${new Date(displayValue).toLocaleDateString('es-GT')}`
                } else if (key === 'fechaFin') {
                  displayValue = `Hasta: ${new Date(displayValue).toLocaleDateString('es-GT')}`
                }
                
                return (
                  <span key={key} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1">
                    {displayValue}
                    <button
                      onClick={() => handleInputChange(key as keyof ExpedienteFilter, undefined)}
                      className="hover:text-blue-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}