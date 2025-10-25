import { useState, useEffect } from 'react'
import { useEmployees } from '../../employees/hooks'
import { useDepartments } from '../../departments/hooks'
import { useCreateNomina, useCalcularNomina, formatCurrency } from '../hooks'
import type { NominaCreateDTO, TipoNomina, NominaCalculoDTO } from '../api'
import { useToast } from '@/components/ui/Toast'

interface PayrollGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const TIPOS_NOMINA: { value: TipoNomina; label: string }[] = [
  { value: 'ORDINARIA', label: 'Nómina Ordinaria' },
  { value: 'EXTRAORDINARIA', label: 'Nómina Extraordinaria' },
  { value: 'AGUINALDO', label: 'Aguinaldo' },
  { value: 'BONO14', label: 'Bono 14' }
]

export default function PayrollGenerationModal({
  isOpen,
  onClose,
  onSuccess
}: PayrollGenerationModalProps) {
  const { success, error } = useToast()
  const [step, setStep] = useState<'config' | 'preview' | 'generating'>('config')
  
  // Form data
  const [formData, setFormData] = useState<NominaCreateDTO>({
    periodo: getCurrentPeriod(),
    tipoNomina: 'ORDINARIA',
    departamentoIds: [],
    empleadoIds: [],
    observaciones: ''
  })

  // Calculation preview
  const [calculoPreview, setCalculoPreview] = useState<NominaCalculoDTO | null>(null)

  // Mutations
  const createNomina = useCreateNomina()
  const calcularNomina = useCalcularNomina()

  // Queries
  const { data: employeesData } = useEmployees({ page: 1, pageSize: 1000 })
  const { data: departmentsData } = useDepartments({ page: 1, pageSize: 1000, activo: true })
  
  const employees = employeesData?.data ?? []
  const departments = departmentsData?.data ?? []

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('config')
      setFormData({
        periodo: getCurrentPeriod(),
        tipoNomina: 'ORDINARIA',
        departamentoIds: [],
        empleadoIds: [],
        observaciones: ''
      })
      setCalculoPreview(null)
    }
  }, [isOpen])

  const handleCalculatePreview = async () => {
    try {
      const resultado = await calcularNomina.mutateAsync(formData)
      setCalculoPreview(resultado)
      setStep('preview')
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al calcular la nómina'
      error(msg)
    }
  }

  const handleGenerateNomina = async () => {
    try {
      setStep('generating')
      await createNomina.mutateAsync(formData)
      success('Nómina generada correctamente')
      onSuccess()
      onClose()
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Error al generar la nómina'
      error(msg)
      setStep('preview')
    }
  }

  const handleDepartmentChange = (deptId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      departamentoIds: checked
        ? [...prev.departamentoIds!, deptId]
        : prev.departamentoIds!.filter(id => id !== deptId)
    }))
  }

  const handleEmployeeChange = (empId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      empleadoIds: checked
        ? [...prev.empleadoIds!, empId]
        : prev.empleadoIds!.filter(id => id !== empId)
    }))
  }

  const filteredEmployees = formData.departamentoIds && formData.departamentoIds.length > 0
    ? employees.filter(emp => emp.departamentoId && formData.departamentoIds!.includes(emp.departamentoId))
    : employees

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {step === 'config' && 'Configurar Nueva Nómina'}
                {step === 'preview' && 'Vista Previa de Cálculos'}
                {step === 'generating' && 'Generando Nómina...'}
              </h3>
              <button
                onClick={onClose}
                disabled={step === 'generating'}
                className="text-white hover:text-gray-200 disabled:opacity-50"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'config' ? 'bg-white text-indigo-600' : 'bg-indigo-300 text-white'
                }`}>
                  1
                </div>
                <span className="ml-2 text-sm text-white">Configuración</span>
              </div>
              <div className="flex-1 h-1 bg-indigo-300 rounded">
                <div className={`h-1 bg-white rounded transition-all duration-300 ${
                  step === 'preview' || step === 'generating' ? 'w-full' : 'w-0'
                }`} />
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === 'preview' || step === 'generating' ? 'bg-white text-indigo-600' : 'bg-indigo-300 text-white'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm text-white">Vista Previa</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {step === 'config' && (
              <div className="p-6 space-y-6">
                {/* Configuración básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="periodo" className="block text-sm font-medium text-gray-700 mb-2">
                      Período *
                    </label>
                    <input
                      type="month"
                      id="periodo"
                      value={formData.periodo}
                      onChange={(e) => setFormData(prev => ({ ...prev, periodo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="tipoNomina" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Nómina *
                    </label>
                    <select
                      id="tipoNomina"
                      value={formData.tipoNomina}
                      onChange={(e) => setFormData(prev => ({ ...prev, tipoNomina: e.target.value as TipoNomina }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {TIPOS_NOMINA.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtros de empleados */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Seleccionar Empleados (opcional)
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Si no selecciona ningún filtro, se incluirán todos los empleados activos
                  </p>

                  {/* Departamentos */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Departamentos
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {departments.map((dept) => (
                        <label key={dept.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.departamentoIds?.includes(dept.id) ?? false}
                            onChange={(e) => handleDepartmentChange(dept.id, e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{dept.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Empleados */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O seleccionar empleados específicos
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                      {filteredEmployees.map((emp) => (
                        <label key={emp.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.empleadoIds?.includes(emp.id) ?? false}
                            onChange={(e) => handleEmployeeChange(emp.id, e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">
                            {emp.nombreCompleto} - {emp.nombreDepartamento}
                          </span>
                        </label>
                      ))}
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
                    placeholder="Observaciones adicionales sobre esta nómina..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {step === 'preview' && calculoPreview && (
              <div className="p-6 space-y-6">
                {/* Resumen general */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-3">Resumen de Cálculos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{calculoPreview.totalEmpleados}</p>
                      <p className="text-sm text-gray-600">Empleados</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(calculoPreview.totalBruto)}</p>
                      <p className="text-sm text-gray-600">Total Bruto</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(calculoPreview.totalDeducciones)}</p>
                      <p className="text-sm text-gray-600">Deducciones</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculoPreview.totalNeto)}</p>
                      <p className="text-sm text-gray-600">Total Neto</p>
                    </div>
                  </div>
                </div>

                {/* Desglose por departamento */}
                {calculoPreview.detallesPorDepartamento.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Desglose por Departamento</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Empleados</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Bruto</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Neto</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {calculoPreview.detallesPorDepartamento.map((detalle, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{detalle.departamento}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{detalle.empleados}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(detalle.totalBruto)}</td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(detalle.totalNeto)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'generating' && (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Generando Nómina...</h4>
                <p className="text-gray-600">Por favor espere mientras procesamos los cálculos</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            {step === 'config' && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCalculatePreview}
                  disabled={calcularNomina.isPending || !formData.periodo}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {calcularNomina.isPending ? 'Calculando...' : 'Calcular Preview'}
                </button>
              </>
            )}
            
            {step === 'preview' && (
              <>
                <button
                  onClick={() => setStep('config')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleGenerateNomina}
                  disabled={createNomina.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createNomina.isPending ? 'Generando...' : 'Generar Nómina'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get current period
function getCurrentPeriod(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  return `${year}-${month}`
}