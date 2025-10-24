/**
 * ExpedienteDetailPage.tsx
 * Página de detalle del expediente de un empleado
 */

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocumentosChecklist, useExpediente } from './hooks/useExpedientes'
import { UploadDocumentDialog } from './components/UploadDocumentDialog'
import { DocumentosTable } from './components/DocumentosTable'
import { ArrowLeft, Upload, User, Briefcase, Building2, Calendar } from 'lucide-react'

export default function ExpedienteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const empleadoId = id ? parseInt(id) : null

  const { data: expediente, isLoading: loadingExpediente } = useExpediente(empleadoId)
  const { data: checklist, isLoading: loadingChecklist } = useDocumentosChecklist(empleadoId)

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  if (!empleadoId) {
    return <div>Empleado no encontrado</div>
  }

  const isLoading = loadingExpediente || loadingChecklist

  const getProgressColor = (porcentaje: number) => {
    if (porcentaje >= 90) return 'bg-green-500'
    if (porcentaje >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-7xl p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/expedientes')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a expedientes
        </button>

        {expediente && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">{expediente.empleadoNombre}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {expediente.puesto}
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {expediente.departamento}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Actualizado: {new Date(expediente.ultimaActualizacion).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setUploadDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                <Upload className="w-5 h-5" />
                Subir Documento
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Completitud del expediente</span>
                <span className="font-bold text-gray-900">{expediente.porcentajeCompletitud}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getProgressColor(expediente.porcentajeCompletitud)}`}
                  style={{ width: `${expediente.porcentajeCompletitud}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{expediente.documentosEntregados} de {expediente.documentosRequeridos} documentos</span>
                <span className={`font-medium ${
                  expediente.estado === 'Completo' ? 'text-green-600' :
                  expediente.estado === 'Incompleto' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {expediente.estado}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Documentos */}
      {!isLoading && checklist && (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold">Documentos del Expediente</h2>
            <p className="text-gray-600">Gestiona los documentos requeridos para el expediente del empleado</p>
          </div>

          <DocumentosTable checklist={checklist} />
        </>
      )}

      {/* Upload Dialog */}
      <UploadDocumentDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        empleadoId={empleadoId}
        empleadoNombre={expediente?.empleadoNombre || ''}
      />
    </div>
  )
}
