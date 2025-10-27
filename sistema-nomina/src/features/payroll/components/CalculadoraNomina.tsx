/**
 * Componente para verificar y mostrar cálculos de nómina
 * Permite comparar cálculos esperados vs actuales del backend
 */

import { useState } from 'react'
import { useCalculoNominaVerificacion, REGLAS_LABORALES_GT_2025 } from '../hooks/useCalculoNominaVerificacion'
import type { TipoNomina } from '../api'

interface CalculadoraNominaProps {
  className?: string
}

export default function CalculadoraNomina({ className = '' }: CalculadoraNominaProps) {
  const [salarioBase, setSalarioBase] = useState<number>(5000)
  const [tipoNomina, setTipoNomina] = useState<TipoNomina>('ORDINARIA')
  const [salarioPromedio, setSalarioPromedio] = useState<number>(5000)
  const [ingresoAnual, setIngresoAnual] = useState<number>(0)
  
  // Cálculo esperado según reglas guatemaltecas
  const calculoEsperado = useCalculoNominaVerificacion({
    salarioBase,
    tipoNomina,
    salarioPromedio12Meses: salarioPromedio,
    ingresoAnualAcumulado: ingresoAnual
  })

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        🧮 Verificador de Cálculos de Nómina - Guatemala 2025
      </h3>
      
      {/* Inputs de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salario Base (Q)
          </label>
          <input
            type="number"
            value={salarioBase}
            onChange={(e) => setSalarioBase(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Nómina
          </label>
          <select
            value={tipoNomina}
            onChange={(e) => setTipoNomina(e.target.value as TipoNomina)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ORDINARIA">Nómina Ordinaria</option>
            <option value="EXTRAORDINARIA">Nómina Extraordinaria</option>
            <option value="AGUINALDO">Aguinaldo</option>
            <option value="BONO14">Bono 14</option>
          </select>
        </div>
        
        {(tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario Promedio 12 Meses (Q)
              </label>
              <input
                type="number"
                value={salarioPromedio}
                onChange={(e) => setSalarioPromedio(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingreso Anual Acumulado (Q)
              </label>
              <input
                type="number"
                value={ingresoAnual}
                onChange={(e) => setIngresoAnual(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                min="0"
                step="0.01"
              />
            </div>
          </>
        )}
      </div>
      
      {/* Resultado del cálculo */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">
          📊 Cálculo Esperado ({tipoNomina})
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              Q{calculoEsperado.salarioBase.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Base de Cálculo</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              Q{calculoEsperado.bonoDecreto.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Bono Decreto</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              Q{calculoEsperado.igssEmpleado.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">IGSS (4.83%)</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              Q{calculoEsperado.isr.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">ISR</div>
          </div>
        </div>
        
        <div className="border-t pt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-indigo-600">
              Q{calculoEsperado.totalDevengado.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Devengado</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">
              Q{calculoEsperado.totalDeducciones.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Deducciones</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              Q{calculoEsperado.salarioNeto.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Salario Neto</div>
          </div>
        </div>
        
        {/* Observaciones */}
        {calculoEsperado.observaciones.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h5 className="font-medium text-yellow-800 mb-2">📝 Observaciones</h5>
            <ul className="space-y-1">
              {calculoEsperado.observaciones.map((obs, index) => (
                <li key={index} className="text-sm text-yellow-700">
                  {obs}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Reglas laborales de referencia */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-3">
          📋 Reglas Laborales Guatemala 2025
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <span className="font-medium">IGSS Empleado:</span>
            <div className="text-blue-700">
              {(REGLAS_LABORALES_GT_2025.IGSS_EMPLEADO * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="font-medium">IGSS Patronal:</span>
            <div className="text-blue-700">
              {(REGLAS_LABORALES_GT_2025.IGSS_PATRONAL * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <span className="font-medium">Bono Decreto:</span>
            <div className="text-blue-700">
              Q{REGLAS_LABORALES_GT_2025.BONO_DECRETO.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="font-medium">Salario Mínimo:</span>
            <div className="text-blue-700">
              Q{REGLAS_LABORALES_GT_2025.SALARIO_MINIMO.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instrucciones */}
      <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>💡 Cómo usar:</strong> Configure los valores arriba y compare con los resultados 
          que muestra su sistema actual. Para Aguinaldo y Bono 14, el IGSS debe ser Q0.00 y el ISR 
          debe aplicar solo si el ingreso anual excede Q60,000.
        </p>
      </div>
    </div>
  )
}