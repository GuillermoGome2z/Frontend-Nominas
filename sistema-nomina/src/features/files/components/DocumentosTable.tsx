/**
 * components/DocumentosTable.tsx
 * Tabla de documentos del expediente
 */

import { useState } from 'react'
import { useEliminarDocumento } from '../hooks/useExpedientes'
import { descargarDocumento } from '../api/expedientes.api'
import { useToast } from '@/components/ui/Toast'
import { Download, Trash2, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import type { DocumentoChecklist } from '../types/Expediente'

interface DocumentosTableProps {
  checklist: DocumentoChecklist[];
}

export function DocumentosTable({ checklist }: DocumentosTableProps) {
  const { success, error } = useToast()
  const eliminarMutation = useEliminarDocumento()
  const [downloading, setDownloading] = useState<number | null>(null)

  const handleDownload = async (documentoId: number, nombreArchivo: string) => {
    setDownloading(documentoId)
    try {
      await descargarDocumento(documentoId, nombreArchivo)
      success('Documento descargado')
    } catch (err) {
      error('Error al descargar el documento')
      console.error(err)
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (documentoId: number, tipoDocumento: string) => {
    if (!confirm(`¿Eliminar el documento "${tipoDocumento}"?`)) return

    try {
      await eliminarMutation.mutateAsync(documentoId)
      success('Documento eliminado')
    } catch (err) {
      error('Error al eliminar el documento')
      console.error(err)
    }
  }

  const getEstadoIcon = (documento: DocumentoChecklist) => {
    if (!documento.entregado) {
      return <Clock className="w-5 h-5 text-gray-400" />
    }

    switch (documento.estado) {
      case 'Vigente':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'Por Vencer':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'Vencido':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getEstadoBadge = (documento: DocumentoChecklist) => {
    if (!documento.entregado) {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">Pendiente</span>
    }

    const badges = {
      Vigente: 'bg-green-100 text-green-700',
      'Por Vencer': 'bg-yellow-100 text-yellow-700',
      Vencido: 'bg-red-100 text-red-700',
      Pendiente: 'bg-gray-100 text-gray-700',
    }

    const colorClass = badges[documento.estado || 'Pendiente']

    return <span className={`px-2 py-1 text-xs font-medium rounded ${colorClass}`}>{documento.estado}</span>
  }

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      Personal: 'bg-blue-50 text-blue-700 border-blue-200',
      Laboral: 'bg-purple-50 text-purple-700 border-purple-200',
      Académico: 'bg-green-50 text-green-700 border-green-200',
      Médico: 'bg-red-50 text-red-700 border-red-200',
      Legal: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Otro: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colors[categoria] || colors.Otro
  }

  // Agrupar por categoría
  const categorias = [...new Set(checklist.map((d) => d.categoria))]

  return (
    <div className="space-y-6">
      {categorias.map((categoria) => {
        const docs = checklist.filter((d) => d.categoria === categoria)

        return (
          <div key={categoria} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className={`px-6 py-3 border-b ${getCategoriaColor(categoria)}`}>
              <h3 className="font-semibold">{categoria}</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {docs.map((doc) => (
                <div key={doc.tipoDocumentoId} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {getEstadoIcon(doc)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{doc.tipoDocumento}</h4>
                          {doc.obligatorio && <span className="text-red-500 text-sm">*</span>}
                        </div>
                        {doc.fechaSubida && (
                          <p className="text-sm text-gray-600">
                            Subido el {new Date(doc.fechaSubida).toLocaleDateString()}
                          </p>
                        )}
                        {doc.fechaVencimiento && (
                          <p className="text-sm text-gray-600">
                            Vence el {new Date(doc.fechaVencimiento).toLocaleDateString()}
                          </p>
                        )}
                        {doc.observaciones && <p className="text-sm text-gray-500 italic">{doc.observaciones}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getEstadoBadge(doc)}

                      {doc.entregado && doc.documentoId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc.documentoId!, doc.tipoDocumento)}
                            disabled={downloading === doc.documentoId}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50"
                            title="Descargar"
                          >
                            {downloading === doc.documentoId ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></div>
                            ) : (
                              <Download className="w-5 h-5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDelete(doc.documentoId!, doc.tipoDocumento)}
                            disabled={eliminarMutation.isPending}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
