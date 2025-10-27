import { Button } from '../../../components/ui/Button'
import { Download, FileSpreadsheet, FileText, Users } from 'lucide-react'
import { useExportNomina, useExportNominaMultiple } from '../hooks/useExportNomina'
import type { NominaDTO, NominaDetalleDTO } from '../api'

interface ExportButtonsProps {
  variant?: 'individual' | 'general' | 'multiple'
  nomina?: NominaDTO
  detalle?: NominaDetalleDTO
  detalles?: NominaDetalleDTO[]
  nominasData?: Array<{
    nomina: NominaDTO
    detalles: NominaDetalleDTO[]
  }>
  showLabels?: boolean
  className?: string
}

export function ExportButtons({
  variant = 'individual',
  nomina,
  detalle,
  detalles = [],
  nominasData = [],
  showLabels = true,
  className = ''
}: ExportButtonsProps) {
  const {
    exportarIndividual,
    exportarGeneral,
    exportarGeneralCompleto,
    isExporting
  } = useExportNomina()

  const {
    exportarMultiplesEmpleados,
    isExporting: isExportingMultiple
  } = useExportNominaMultiple()

  const isLoading = isExporting || isExportingMultiple

  // Botones para exportación individual (por empleado)
  if (variant === 'individual' && nomina && detalle) {
    return (
      <div className={`flex gap-1 ${className}`}>
        {/* Excel Individual */}
        <button
          onClick={() => exportarIndividual({
            nomina,
            detalle,
            format: 'excel'
          })}
          disabled={isLoading}
          className="flex items-center gap-1 px-2 py-1 text-xs text-green-600 bg-white border border-green-200 rounded hover:bg-green-50 disabled:opacity-50"
          title="Exportar a Excel"
        >
          <FileSpreadsheet className="w-3 h-3" />
          {showLabels && 'XLS'}
        </button>

        {/* PDF Individual */}
        <button
          onClick={() => exportarIndividual({
            nomina,
            detalle,
            format: 'pdf'
          })}
          disabled={isLoading}
          className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
          title="Exportar a PDF"
        >
          <FileText className="w-3 h-3" />
          {showLabels && 'PDF'}
        </button>
      </div>
    )
  }

  // Botones para exportación múltiple (varios empleados de una nómina)
  if (variant === 'multiple' && nomina && detalles.length > 0) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {/* Múltiples Excel */}
        <Button
          onClick={() => exportarMultiplesEmpleados(nomina, detalles, 'excel')}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2 text-green-600 border border-green-200 hover:bg-green-50 bg-white"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <Users className="w-3 h-3" />
          {showLabels && `Excel (${detalles.length})`}
        </Button>

        {/* Múltiples PDF */}
        <Button
          onClick={() => exportarMultiplesEmpleados(nomina, detalles, 'pdf')}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 bg-white"
        >
          <FileText className="w-4 h-4" />
          <Users className="w-3 h-3" />
          {showLabels && `PDF (${detalles.length})`}
        </Button>
      </div>
    )
  }

  // Botones para exportación general (múltiples nóminas)
  if (variant === 'general' && nominasData.length > 0) {
    return (
      <div className={`flex gap-2 ${className}`}>
        {/* Reporte General Excel */}
        <Button
          onClick={() => exportarGeneral({
            data: nominasData,
            format: 'excel'
          })}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2 text-green-600 border border-green-200 hover:bg-green-50 bg-white"
        >
          <FileSpreadsheet className="w-4 h-4" />
          {showLabels && 'Excel'}
        </Button>

        {/* Reporte General PDF */}
        <Button
          onClick={() => exportarGeneral({
            data: nominasData,
            format: 'pdf'
          })}
          disabled={isLoading}
          variant="secondary"
          className="flex items-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 bg-white"
        >
          <FileText className="w-4 h-4" />
          {showLabels && 'PDF'}
        </Button>

        {/* Reporte Completo (ambos formatos) */}
        <Button
          onClick={() => exportarGeneralCompleto(nominasData)}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {showLabels && 'Completo'}
        </Button>
      </div>
    )
  }

  // Fallback si no hay datos
  return (
    <div className={`text-gray-500 text-sm ${className}`}>
      No disponible
    </div>
  )
}

// Componente específico para exportación individual con más opciones
export function ExportIndividualCard({
  nomina,
  detalle,
  className = ''
}: {
  nomina: NominaDTO
  detalle: NominaDetalleDTO
  className?: string
}) {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            {detalle.nombreEmpleado || 'Empleado'}
          </h3>
          <p className="text-sm text-gray-500">
            {detalle.nombreDepartamento} • {detalle.nombrePuesto}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">
            Q{detalle.salarioNeto.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Salario Neto</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="block">Devengado: Q{detalle.totalDevengado.toFixed(2)}</span>
          <span className="block">Deducciones: Q{detalle.totalDeducciones.toFixed(2)}</span>
        </div>
        
        <ExportButtons
          variant="individual"
          nomina={nomina}
          detalle={detalle}
          showLabels={false}
        />
      </div>
    </div>
  )
}

// Componente de panel de exportación general
export function ExportPanel({
  nominasData,
  totalEmpleados,
  isLoadingDetalles = false,
  className = ''
}: {
  nominasData: Array<{
    nomina: NominaDTO
    detalles: NominaDetalleDTO[]
  }>
  totalEmpleados: number
  isLoadingDetalles?: boolean
  className?: string
}) {
  const totalNominas = nominasData.length
  const totalDevengado = nominasData.reduce((sum, item) => 
    sum + item.detalles.reduce((subSum, detalle) => subSum + detalle.totalDevengado, 0), 0
  )
  const totalNeto = nominasData.reduce((sum, item) => 
    sum + item.detalles.reduce((subSum, detalle) => subSum + detalle.salarioNeto, 0), 0
  )

  // Si está cargando detalles, mostrar estado de carga
  if (isLoadingDetalles) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-blue-600 font-medium">Cargando detalles de nóminas para exportación...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📊 Centro de Exportaciones
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="font-bold text-blue-600">{totalNominas}</p>
            <p className="text-gray-600">Nóminas</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-green-600">{totalEmpleados}</p>
            <p className="text-gray-600">Empleados</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-purple-600">Q{totalDevengado.toFixed(2)}</p>
            <p className="text-gray-600">Total Devengado</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-indigo-600">Q{totalNeto.toFixed(2)}</p>
            <p className="text-gray-600">Total Neto</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          <p>Exporta reportes completos con cumplimiento legal Guatemala 2025</p>
        </div>
        
        <ExportButtons
          variant="general"
          nominasData={nominasData}
          showLabels={true}
        />
      </div>
    </div>
  )
}