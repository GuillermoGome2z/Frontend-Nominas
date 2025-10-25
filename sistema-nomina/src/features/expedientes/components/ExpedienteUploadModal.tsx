import { useState } from 'react'
import { useCreateExpediente, useTiposDocumento } from '../hooks'
import { useEmployees } from '../../employees/hooks'
import { useToast } from '@/components/ui/Toast'
import type { ExpedienteCreateDTO } from '../api'

interface ExpedienteUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preselectedEmpleadoId?: number
}

export default function ExpedienteUploadModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedEmpleadoId
}: ExpedienteUploadModalProps) {
  const { error } = useToast()
  const [formData, setFormData] = useState<Omit<ExpedienteCreateDTO, 'archivo'> & { archivo?: File }>({
    empleadoId: preselectedEmpleadoId || 0,
    tipoDocumentoId: 0,
    observaciones: ''
  })
  const [dragActive, setDragActive] = useState(false)

  const createExpediente = useCreateExpediente()
  const { data: employeesData } = useEmployees({ page: 1, pageSize: 1000 })
  const { data: tiposDocumento } = useTiposDocumento()
  
  const employees = employeesData?.data ?? []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.archivo) {
      error('Debe seleccionar un archivo')
      return
    }
    
    if (!formData.empleadoId) {
      error('Debe seleccionar un empleado')
      return
    }
    
    if (!formData.tipoDocumentoId) {
      error('Debe seleccionar el tipo de documento')
      return
    }

    try {
      await createExpediente.mutateAsync({
        empleadoId: formData.empleadoId,
        tipoDocumentoId: formData.tipoDocumentoId,
        archivo: formData.archivo,
        observaciones: formData.observaciones || undefined
      })
      
      onSuccess()
      handleReset()
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al subir el documento'
      error(msg)
    }
  }

  const handleReset = () => {
    setFormData({
      empleadoId: preselectedEmpleadoId || 0,
      tipoDocumentoId: 0,
      observaciones: ''
    })
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0]
      
      // Validar tamaño (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        error('El archivo no puede ser mayor a 10MB')
        return
      }
      
      // Validar tipo de archivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'text/plain'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        error('Tipo de archivo no permitido. Use: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT')
        return
      }
      
      setFormData(prev => ({ ...prev, archivo: file }))
    }
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
    handleFileSelect(e.dataTransfer.files)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subir Documento al Expediente
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Empleado */}
                <div>
                  <label htmlFor="empleado" className="block text-sm font-medium text-gray-700 mb-2">
                    Empleado *
                  </label>
                  <select
                    id="empleado"
                    required
                    value={formData.empleadoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, empleadoId: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Seleccione un empleado</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.nombreCompleto} - {employee.dpi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento *
                  </label>
                  <select
                    id="tipoDocumento"
                    required
                    value={formData.tipoDocumentoId}
                    onChange={(e) => setFormData(prev => ({ ...prev, tipoDocumentoId: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>Seleccione el tipo</option>
                    {tiposDocumento?.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre} {tipo.requerido ? '(Requerido)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upload de Archivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    />
                    <div className="space-y-2">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        {formData.archivo ? (
                          <div>
                            <p className="font-medium text-green-600">✓ {formData.archivo.name}</p>
                            <p className="text-xs text-gray-500">
                              {(formData.archivo.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p><strong>Haga clic para subir</strong> o arrastre aquí</p>
                            <p className="text-xs">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT hasta 10MB</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    id="observaciones"
                    rows={3}
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                    placeholder="Observaciones adicionales sobre el documento (opcional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={createExpediente.isPending || !formData.archivo}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto"
              >
                {createExpediente.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subiendo...
                  </>
                ) : (
                  'Subir Documento'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}