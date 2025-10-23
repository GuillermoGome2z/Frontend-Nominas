import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReportes, useExportExcel, useExportPDF } from './hooks'
import type { ReportFilter } from './api'
import ReportFilters from './components/ReportFilters'
import ResumenCard from './components/ResumenCard'
import EmpleadosTable from './components/EmpleadosTable'
import DepartamentosTable from './components/DepartamentosTable'
import { useToast } from '@/components/ui/Toast'

export default function ReportsPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [filters, setFilters] = useState<ReportFilter>({})
  
  const { data: reportData, isLoading, isError, error: queryError } = useReportes(filters)
  const exportExcel = useExportExcel()
  const exportPDF = useExportPDF()

  const handleFilter = (newFilters: ReportFilter) => {
    console.log('📊 Filtros aplicados:', newFilters)
    setFilters(newFilters)
  }

  const handleExportExcel = async () => {
    try {
      const blob = await exportExcel.mutateAsync(filters)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte-empleados-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      success('Reporte exportado a Excel correctamente')
    } catch (err: any) {
      console.error('Error al exportar Excel:', err)
      error(err?.response?.data?.mensaje ?? 'Error al generar el archivo Excel')
    }
  }

  const handleExportPDF = async () => {
    try {
      const blob = await exportPDF.mutateAsync(filters)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reporte-empleados-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      success('Reporte exportado a PDF correctamente')
    } catch (err: any) {
      console.error('Error al exportar PDF:', err)
      error(err?.response?.data?.mensaje ?? 'Error al generar el archivo PDF')
    }
  }

  return (
    <section className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
          aria-label="Regresar"
        >
          ← Regresar
        </button>
        <h1 className="ml-1 text-2xl font-bold">Reportes de Recursos Humanos</h1>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <ReportFilters
          onFilter={handleFilter}
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
          isExporting={exportExcel.isPending || exportPDF.isPending}
        />
      </div>

      {/* Estados de carga y error */}
      {isLoading && (
        <div className="mt-6 animate-pulse rounded-2xl border bg-white p-6 text-gray-500 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generando reporte...
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
          <h3 className="font-semibold mb-2">Error al generar el reporte</h3>
          <p className="text-sm mb-3">
            {queryError instanceof Error 
              ? queryError.message 
              : 'Hubo un problema al conectar con el servidor.'}
          </p>
          
          {/* Diagnóstico del error */}
          <div className="text-xs bg-rose-100 border border-rose-200 rounded p-3 mb-3">
            <strong>🔍 Diagnóstico:</strong>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Frontend: http://localhost:5175/ ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Backend: http://localhost:5009/ ✅</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>
                  {queryError?.name === 'CORSError' 
                    ? 'CORS no configurado ❌' 
                    : 'Endpoint de reportes no implementado ❌'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-blue-100 border border-blue-200 rounded p-3 mb-3">
            <strong>📝 Para el desarrollador del backend:</strong>
            <div className="mt-1">
              {queryError?.name === 'CORSError' ? (
                <div>
                  <p>1. Agregar configuración CORS en Program.cs:</p>
                  <code className="block bg-blue-50 p-2 mt-1 rounded text-xs">
                    builder.Services.AddCors();<br/>
                    app.UseCors(policy =&gt; policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                  </code>
                </div>
              ) : (
                <div>
                  <p>Implementar endpoints de reportes:</p>
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li><code>GET /api/reportes/general</code></li>
                    <li><code>GET /api/reportes/excel</code></li>
                    <li><code>GET /api/reportes/pdf</code></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Contenido del reporte */}
      {!isLoading && !isError && reportData && (
        <div className="space-y-6">
          {/* Resumen general */}
          <ResumenCard resumen={reportData.resumen} />

          {/* Tabla de empleados */}
          <EmpleadosTable empleados={reportData.empleados} />

          {/* Tabla de departamentos */}
          <DepartamentosTable departamentos={reportData.departamentos} />

          {/* Información adicional */}
          <div className="bg-slate-50 rounded-xl border p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Información del reporte</span>
            </div>
            <p>
              <strong>Fecha de generación:</strong> {' '}
              {new Date(reportData.fechaGeneracion).toLocaleString('es-GT')}
            </p>
            <p className="mt-1">
              <strong>Filtros aplicados:</strong> {' '}
              {Object.entries(filters).filter(([_, value]) => value).length > 0
                ? Object.entries(filters)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')
                : 'Ninguno (mostrando todos los datos)'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
