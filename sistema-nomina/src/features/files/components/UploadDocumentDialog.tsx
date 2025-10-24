/**
 * components/UploadDocumentDialog.tsx
 * Diálogo para subir documentos al expediente
 */

import { useState } from 'react'
import { useSubirDocumento, useTiposDocumento } from '../hooks/useExpedientes'
import { useToast } from '@/components/ui/Toast'
import { X, Upload, FileText } from 'lucide-react'

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  empleadoId: number;
  empleadoNombre: string;
}

export function UploadDocumentDialog({
  isOpen,
  onClose,
  empleadoId,
  empleadoNombre,
}: UploadDocumentDialogProps) {
  const { success, error } = useToast()
  const { data: tiposDocumento } = useTiposDocumento()
  const subirMutation = useSubirDocumento()

  const [tipoDocumentoId, setTipoDocumentoId] = useState<number | null>(null)
  const [archivo, setArchivo] = useState<File | null>(null)
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const tipoSeleccionado = tiposDocumento?.find((t) => t.id === tipoDocumentoId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tipoDocumentoId || !archivo) {
      error('Selecciona un tipo de documento y un archivo')
      return
    }

    try {
      await subirMutation.mutateAsync({
        empleadoId,
        tipoDocumentoId,
        archivo,
        fechaVencimiento: fechaVencimiento || undefined,
        observaciones: observaciones || undefined,
      })

      success('Documento subido correctamente')
      handleClose()
    } catch (err) {
      error('Error al subir el documento')
      console.error(err)
    }
  }

  const handleClose = () => {
    setTipoDocumentoId(null)
    setArchivo(null)
    setFechaVencimiento('')
    setObservaciones('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Subir Documento</h2>
            <p className="text-sm text-gray-600">{empleadoNombre}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento *
            </label>
            <select
              value={tipoDocumentoId ?? ''}
              onChange={(e) => setTipoDocumentoId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona un tipo</option>
              {tiposDocumento?.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre} {tipo.obligatorio && '*'}
                </option>
              ))}
            </select>
          </div>

          {/* Archivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {archivo ? (
                  <div className="flex items-center justify-center gap-2 text-indigo-600">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{archivo.name}</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                      <span className="text-indigo-600 font-medium">Click para seleccionar</span> o arrastra el archivo
                    </p>
                    <p className="text-xs mt-1">PDF, Word, JPG, PNG (máx. 10MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Fecha de Vencimiento */}
          {tipoSeleccionado?.requiereVencimiento && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={fechaVencimiento}
                onChange={(e) => setFechaVencimiento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={subirMutation.isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {subirMutation.isPending ? 'Subiendo...' : 'Subir Documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
