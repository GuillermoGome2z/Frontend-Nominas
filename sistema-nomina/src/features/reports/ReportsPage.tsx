import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import {
  downloadExpedientesPDF,
  downloadInformacionAcademicaPDF,
  downloadAjustesPDF,
  downloadAuditoriaPDF,
  downloadEmpleadosCSV,
  downloadEmpleadosExcel,
} from './api/reports.api'
import { FileText, Download, Users, FileSpreadsheet, ClipboardList, Shield } from 'lucide-react'

export default function ReportsPage() {
  const { success, error } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDownload = async (type: string, downloadFn: () => Promise<void>) => {
    setLoading(type)
    try {
      await downloadFn()
      success('Reporte descargado correctamente')
    } catch (err) {
      error('Error al descargar el reporte')
      console.error('Error descargando reporte:', err)
    } finally {
      setLoading(null)
    }
  }

  const reportCards = [
    {
      id: 'expedientes',
      title: 'Expedientes de Empleados',
      description: 'Estado de completitud de expedientes por empleado',
      icon: ClipboardList,
      color: 'indigo',
      actions: [
        { label: 'Descargar PDF', format: 'pdf', fn: downloadExpedientesPDF },
      ],
    },
    {
      id: 'empleados',
      title: 'Listado de Empleados',
      description: 'Exportar listado completo de empleados',
      icon: Users,
      color: 'blue',
      actions: [
        { label: 'Descargar CSV', format: 'csv', fn: downloadEmpleadosCSV },
        { label: 'Descargar Excel', format: 'xlsx', fn: downloadEmpleadosExcel },
      ],
    },
    {
      id: 'academica',
      title: 'Información Académica',
      description: 'Reporte de formación académica de empleados',
      icon: FileText,
      color: 'green',
      actions: [
        { label: 'Descargar PDF', format: 'pdf', fn: downloadInformacionAcademicaPDF },
      ],
    },
    {
      id: 'ajustes',
      title: 'Ajustes Manuales',
      description: 'Historial de ajustes realizados en nóminas',
      icon: FileSpreadsheet,
      color: 'yellow',
      actions: [
        { label: 'Descargar PDF', format: 'pdf', fn: () => downloadAjustesPDF() },
      ],
    },
    {
      id: 'auditoria',
      title: 'Logs de Auditoría',
      description: 'Registro de actividad del sistema',
      icon: Shield,
      color: 'red',
      actions: [
        { label: 'Descargar PDF', format: 'pdf', fn: () => downloadAuditoriaPDF() },
      ],
    },
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string; button: string }> = {
      indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', button: 'bg-indigo-600 hover:bg-indigo-700' },
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', button: 'bg-green-600 hover:bg-green-700' },
      yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', button: 'bg-yellow-600 hover:bg-yellow-700' },
      red: { bg: 'bg-red-50', icon: 'text-red-600', button: 'bg-red-600 hover:bg-red-700' },
    }
    return colors[color] || colors.indigo
  }

  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-7xl p-3 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reportes</h1>
        <p className="text-gray-600">Genera y descarga reportes de RRHH, Nómina y Auditoría</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((card) => {
          const colors = getColorClasses(card.color)
          const Icon = card.icon

          return (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {card.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDownload(`${card.id}-${action.format}`, action.fn)}
                    disabled={loading === `${card.id}-${action.format}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors.button}`}
                  >
                    {loading === `${card.id}-${action.format}` ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Descargando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        {action.label}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sección de Nóminas - Requiere seleccionar nómina específica */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reportes de Nómina</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-blue-900">Reportes de Nómina Específica</h3>
              <p className="text-sm text-blue-700 mb-3">
                Para descargar reportes de una nómina específica (PDF, Excel, recibos individuales),
                ve al módulo de <strong>Nómina</strong> y selecciona el periodo deseado.
              </p>
              <a
                href="/nomina"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Ir a Nóminas →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

