/**
 * ExpedienteChecklist - Muestra progreso de documentos requeridos vs subidos
 * Valida completitud del expediente de forma visual
 */

import { TipoDocumento, type DocumentoRequerido, type ExpedienteStatusType } from '../types'

interface ExpedienteChecklistProps {
  empleadoId: number
  estadoExpediente?: ExpedienteStatusType
  documentosRequeridos?: DocumentoRequerido[]
  porcentajeCompletitud?: number
  onUploadClick?: (tipoDocumentoId: number) => void
}

const DOCUMENTOS_REQUERIDOS_DEFAULT: DocumentoRequerido[] = [
  { 
    id: 1,
    tipoDocumentoId: TipoDocumento.DPI, 
    tipo: 'DPI',
    nombre: 'DPI (Documento Personal de Identificación)', 
    descripcion: 'Copia de ambos lados del DPI vigente',
    requerido: true, 
    subido: false 
  },
  { 
    id: 2,
    tipoDocumentoId: TipoDocumento.CV, 
    tipo: 'CV',
    nombre: 'Curriculum Vitae', 
    descripcion: 'CV actualizado con experiencia laboral',
    requerido: true, 
    subido: false 
  },
  { 
    id: 3,
    tipoDocumentoId: TipoDocumento.ANTECEDENTES_PENALES, 
    tipo: 'Antecedentes Penales',
    nombre: 'Antecedentes Penales', 
    descripcion: 'Constancia emitida por el Ministerio Público',
    requerido: true, 
    subido: false 
  },
  { 
    id: 4,
    tipoDocumentoId: TipoDocumento.ANTECEDENTES_POLICIACOS, 
    tipo: 'Antecedentes Policíacos',
    nombre: 'Antecedentes Policíacos', 
    descripcion: 'Constancia emitida por la PNC',
    requerido: true, 
    subido: false 
  },
  { 
    id: 5,
    tipoDocumentoId: TipoDocumento.CONSTANCIA_IGSS, 
    tipo: 'Constancia IGSS',
    nombre: 'Constancia IGSS', 
    descripcion: 'Afiliación al Instituto Guatemalteco de Seguridad Social',
    requerido: true, 
    subido: false 
  },
  { 
    id: 6,
    tipoDocumentoId: TipoDocumento.CERTIFICADO_NACIMIENTO, 
    tipo: 'Certificado Nacimiento',
    nombre: 'Certificado de Nacimiento', 
    descripcion: 'Certificado del RENAP',
    requerido: false, 
    subido: false 
  },
  { 
    id: 7,
    tipoDocumentoId: TipoDocumento.TITULO, 
    tipo: 'Título',
    nombre: 'Título Académico', 
    descripcion: 'Diploma o certificación de estudios',
    requerido: false, 
    subido: false 
  },
  { 
    id: 8,
    tipoDocumentoId: TipoDocumento.CONTRATO_LABORAL, 
    tipo: 'Contrato',
    nombre: 'Contrato Laboral Firmado', 
    descripcion: 'Contrato firmado por ambas partes',
    requerido: true, 
    subido: false 
  },
]

export default function ExpedienteChecklist({
  estadoExpediente = 'pendiente',
  documentosRequeridos = DOCUMENTOS_REQUERIDOS_DEFAULT,
  porcentajeCompletitud = 0,
  onUploadClick,
}: ExpedienteChecklistProps) {
  const requeridos = documentosRequeridos.filter(d => d.requerido)
  const subidos = requeridos.filter(d => d.subido).length
  const faltantes = requeridos.filter(d => !d.subido)
  
  const porcentaje = porcentajeCompletitud || (requeridos.length > 0 
    ? Math.round((subidos / requeridos.length) * 100) 
    : 0)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETO': return 'bg-green-100 text-green-800 border-green-300'
      case 'EN_REVISION': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'INCOMPLETO': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PENDIENTE': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'COMPLETO': return 'Expediente Completo'
      case 'EN_REVISION': return 'En Revisión'
      case 'INCOMPLETO': return 'Expediente Incompleto'
      case 'PENDIENTE': return 'Pendiente de Documentos'
      default: return estado
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estado */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            📋 Checklist de Expediente
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {subidos} de {requeridos.length} documentos requeridos subidos
          </p>
        </div>
        
        <div className={`px-4 py-2 rounded-xl border-2 font-medium ${getEstadoColor(estadoExpediente)}`}>
          {getEstadoTexto(estadoExpediente)}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Progreso de Completitud</span>
          <span className="font-bold text-indigo-600">{porcentaje}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              porcentaje === 100 
                ? 'bg-green-500' 
                : porcentaje >= 60 
                ? 'bg-blue-500' 
                : porcentaje >= 30 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {/* Lista de documentos */}
      <div className="space-y-3">
        {documentosRequeridos.map((doc) => (
          <div
            key={doc.tipoDocumentoId}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
              doc.subido
                ? 'bg-green-50 border-green-300'
                : doc.requerido
                ? 'bg-white border-gray-200 hover:border-indigo-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Icono de estado */}
            <div className="flex-shrink-0 mt-1">
              {doc.subido ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className={`w-6 h-6 rounded-full border-2 ${
                  doc.requerido 
                    ? 'border-red-400 bg-red-50' 
                    : 'border-gray-300 bg-gray-100'
                }`} />
              )}
            </div>

            {/* Información del documento */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {doc.nombre}
                </h4>
                {doc.requerido && !doc.subido && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Requerido
                  </span>
                )}
                {!doc.requerido && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    Opcional
                  </span>
                )}
              </div>
              {doc.descripcion && (
                <p className="text-xs text-gray-600 mt-1">{doc.descripcion}</p>
              )}
            </div>

            {/* Botón de acción */}
            {!doc.subido && onUploadClick && (
              <button
                onClick={() => onUploadClick(doc.tipoDocumentoId)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                📤 Subir
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de faltantes */}
      {faltantes.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                Documentos Faltantes ({faltantes.length})
              </h4>
              <ul className="space-y-1">
                {faltantes.map((doc) => (
                  <li key={doc.tipoDocumentoId} className="text-sm text-yellow-800">
                    • {doc.nombre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de completitud */}
      {porcentaje === 100 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-green-900">
                ¡Expediente Completo!
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Todos los documentos requeridos han sido subidos correctamente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
