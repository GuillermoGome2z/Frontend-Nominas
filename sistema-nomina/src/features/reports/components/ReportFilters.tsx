import { useState } from 'react'
import type { ReportFilter } from '../api'

interface ReportFiltersProps {
  onFilter: (filters: ReportFilter) => void
  onExportExcel: () => void
  onExportPDF: () => void
  isExporting?: boolean
}

export default function ReportFilters({ 
  onFilter, 
  onExportExcel, 
  onExportPDF, 
  isExporting = false 
}: ReportFiltersProps) {
  const [filters, setFilters] = useState<ReportFilter>({
    fechaInicio: undefined,
    fechaFin: undefined,
    departamentoId: undefined,
    puestoId: undefined,
    estadoLaboral: undefined
  })

  const handleFilterChange = (key: keyof ReportFilter, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(filters)
  }

  const handleReset = () => {
    const emptyFilters: ReportFilter = {
      fechaInicio: undefined,
      fechaFin: undefined,
      departamentoId: undefined,
      puestoId: undefined,
      estadoLaboral: undefined
    }
    setFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Filtros de Reportes</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportExcel}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {isExporting ? 'Exportando...' : 'Excel'}
          </button>
          <button
            type="button"
            onClick={onExportPDF}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {isExporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={filters.fechaInicio || ''}
            onChange={(e) => handleFilterChange('fechaInicio', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="fechaFin" className="block text-sm font-medium text-slate-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            id="fechaFin"
            value={filters.fechaFin || ''}
            onChange={(e) => handleFilterChange('fechaFin', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="estadoLaboral" className="block text-sm font-medium text-slate-700 mb-2">
            Estado Laboral
          </label>
          <select
            id="estadoLaboral"
            value={filters.estadoLaboral || ''}
            onChange={(e) => handleFilterChange('estadoLaboral', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="SUSPENDIDO">Suspendidos</option>
            <option value="RETIRADO">Retirados</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Filtrar
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  )
}