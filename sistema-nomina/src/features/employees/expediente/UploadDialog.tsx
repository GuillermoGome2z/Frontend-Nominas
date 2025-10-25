import { useRef, useState } from 'react'
import { useUploadEmployeeDoc } from '../hooks'
import { useAlert } from '@/components/ui/AlertContext'
import { useQueryClient } from '@tanstack/react-query'

type Props = { empleadoId: number }

// Tipos de documento predefinidos
const DOCUMENT_TYPES = [
  { id: 1, name: 'CV / Hoja de Vida' },
  { id: 2, name: 'Cédula de Identidad' },
  { id: 3, name: 'Diploma / Título' },
  { id: 4, name: 'Certificado Laboral' },
  { id: 5, name: 'Contrato' },
  { id: 6, name: 'Cartas de Recomendación' },
  { id: 7, name: 'Certificado Médico' },
  { id: 8, name: 'Otros Documentos' }
]

export default function UploadDialog({ empleadoId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [tipoDocumentoId, setTipoDocumentoId] = useState<number>(1)
  const [dragActive, setDragActive] = useState(false)
  
  const up = useUploadEmployeeDoc(empleadoId)
  const { showSuccess, showError } = useAlert()
  const queryClient = useQueryClient()

  const handleFile = (file: File) => {
    // Validaciones básicas del lado del cliente
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (file.size > maxSize) {
      showError('El archivo es demasiado grande. Máximo 10MB.')
      return
    }

    if (!allowedTypes.includes(file.type)) {
      showError('Tipo de archivo no permitido. Solo PDF, imágenes y documentos Word.')
      return
    }

    up.mutate(
      { file, tipoDocumentoId },
      {
        onSuccess: () => {
          // Limpiar input
          if (inputRef.current) inputRef.current.value = ''
          showSuccess('✅ Documento subido correctamente.')
          // Invalidar cache para refrescar lista
          queryClient.invalidateQueries({ queryKey: ['employeeDocs', empleadoId] })
        },
        onError: (e: any) => {
          const status = e?.response?.status ?? e?.status
          let message = 'Error al subir el archivo.'
          
          if (status === 413) {
            message = 'Archivo demasiado grande (máximo 10MB).'
          } else if (status === 422) {
            message = 'Tipo de archivo no válido o datos incorrectos.'
          } else if (status === 409) {
            message = 'Ya existe un documento con este nombre.'
          }
          
          showError(message)
        },
      }
    )
  }



  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const selectedTypeName = DOCUMENT_TYPES.find(t => t.id === tipoDocumentoId)?.name || 'Documento'

  return (
    <div className="space-y-4">
      {/* Selector de tipo de documento */}
      <div>
        <label htmlFor="tipoDocumento" className="block text-sm font-medium text-slate-700 mb-2">
          Tipo de Documento
        </label>
        <select
          id="tipoDocumento"
          value={tipoDocumentoId}
          onChange={(e) => setTipoDocumentoId(Number(e.target.value))}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {DOCUMENT_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Zona de subida de archivos */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          <div className="text-4xl">📄</div>
          <div>
            <p className="text-slate-600 mb-2">
              Arrastra y suelta tu archivo aquí, o 
            </p>
            <input
              type="file"
              ref={inputRef}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Seleccionar archivo
            </button>
          </div>
          <p className="text-xs text-slate-500">
            PDF, DOC, DOCX, JPG, PNG, GIF (máximo 10MB)
          </p>
        </div>
      </div>

      {/* Información del tipo seleccionado */}
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Tipo seleccionado:</span> {selectedTypeName}
        </p>
      </div>

      {/* Estado de carga */}
      {up.isPending && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-blue-700 font-medium">Subiendo documento...</span>
          </div>
        </div>
      )}
    </div>
  )
}
