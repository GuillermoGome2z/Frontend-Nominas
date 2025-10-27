/**
 * Página simple para crear nóminas de prueba y verificar cálculos
 * Comparar resultados reales del backend vs cálculos esperados
 */

import { useState } from 'react'
import { useCalcularNomina } from '../hooks'
import type { TipoNomina, NominaCreateDTO } from '../api'

// Función helper para obtener período actual
function getCurrentPeriod() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export default function PruebaCalculosPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [results, setResults] = useState<any[]>([])
  
  const calcularNomina = useCalcularNomina()

  // Casos de prueba predefinidos
  const CASOS_PRUEBA = [
    {
      nombre: "Empleado Q5,000 - Nómina Ordinaria",
      tipo: "ORDINARIA" as TipoNomina,
      esperado: {
        devengado: 5250.00,
        igss: 241.50,
        isr: 95.00,
        neto: 4913.50
      }
    },
    {
      nombre: "Empleado Q5,000 - Aguinaldo",
      tipo: "AGUINALDO" as TipoNomina,
      esperado: {
        devengado: 5000.00,
        igss: 0.00,
        isr: 0.00,
        neto: 5000.00
      }
    },
    {
      nombre: "Empleado Q5,000 - Bono 14",
      tipo: "BONO14" as TipoNomina,
      esperado: {
        devengado: 5000.00,
        igss: 0.00,
        isr: 0.00,
        neto: 5000.00
      }
    }
  ]

  const probarCalculo = async (caso: any) => {
    try {
      setIsCreating(true)
      
      // Configurar nómina de prueba
      const nominaData: NominaCreateDTO = {
        periodo: getCurrentPeriod(),
        tipoNomina: caso.tipo,
        departamentoIds: [], // Todos los departamentos
        empleadoIds: [], // Todos los empleados
        observaciones: `Prueba: ${caso.nombre}`
      }

      // Primero calcular (preview)
      const calculoResult = await calcularNomina.mutateAsync(nominaData)
      
      const resultado = {
        caso: caso.nombre,
        tipo: caso.tipo,
        backend: {
          empleados: calculoResult.totalEmpleados,
          devengado: calculoResult.totalBruto,
          deducciones: calculoResult.totalDeducciones,
          neto: calculoResult.totalNeto
        },
        esperadoPorEmpleado: caso.esperado,
        observaciones: [] as string[]
      }

      // Verificar si los cálculos son correctos (asumiendo 1 empleado de Q5,000)
      const empleadosEstimados = calculoResult.totalEmpleados || 1
      const devengadoPorEmpleado = calculoResult.totalBruto / empleadosEstimados
      const deduccionesPorEmpleado = calculoResult.totalDeducciones / empleadosEstimados
      const netoPorEmpleado = calculoResult.totalNeto / empleadosEstimados

      const tolerancia = 10.00
      const devengadoOK = Math.abs(devengadoPorEmpleado - caso.esperado.devengado) <= tolerancia
      const netoOK = Math.abs(netoPorEmpleado - caso.esperado.neto) <= tolerancia

      resultado.observaciones.push(
        `📊 Por empleado: Devengado Q${devengadoPorEmpleado.toFixed(2)}, Neto Q${netoPorEmpleado.toFixed(2)}`
      )
      
      if (caso.tipo === 'AGUINALDO' || caso.tipo === 'BONO14') {
        if (deduccionesPorEmpleado <= 5.00) {
          resultado.observaciones.push('✅ CORRECTO: Sin deducciones (Aguinaldo/Bono14)')
        } else {
          resultado.observaciones.push('❌ ERROR: Tiene deducciones cuando no debería (Aguinaldo/Bono14)')
        }
      }

      resultado.observaciones.push(
        devengadoOK ? '✅ Devengado correcto' : '❌ Error en devengado',
        netoOK ? '✅ Neto correcto' : '❌ Error en neto'
      )

      setResults(prev => [...prev, resultado])
      
    } catch (error: any) {
      const errorResult = {
        caso: caso.nombre,
        tipo: caso.tipo,
        error: error?.response?.data?.message || error.message || 'Error desconocido',
        observaciones: ['❌ Error al calcular nómina']
      }
      setResults(prev => [...prev, errorResult])
    } finally {
      setIsCreating(false)
    }
  }

  const limpiarResultados = () => {
    setResults([])
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧪 Prueba de Cálculos Reales - Backend
          </h1>
          <p className="mt-2 text-gray-600">
            Esta herramienta prueba los cálculos reales de tu backend y los compara con los valores esperados 
            según las leyes laborales de Guatemala 2025.
          </p>
        </div>

        {/* Controles */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎯 Casos de Prueba
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {CASOS_PRUEBA.map((caso, index) => (
              <button
                key={index}
                onClick={() => probarCalculo(caso)}
                disabled={isCreating}
                className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-left"
              >
                <div className="font-semibold text-gray-900">{caso.nombre}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Tipo: {caso.tipo}
                </div>
                <div className="text-sm text-gray-600">
                  Esperado: Q{caso.esperado.neto.toFixed(2)} neto
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={limpiarResultados}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              🧹 Limpiar Resultados
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              {isCreating && "⏳ Calculando..."}
            </div>
          </div>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📊 Resultados de Prueba
            </h2>
            
            <div className="space-y-4">
              {results.map((resultado, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {resultado.caso}
                    </h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      resultado.error 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {resultado.tipo}
                    </span>
                  </div>

                  {resultado.error ? (
                    <div className="text-red-600 mb-2">
                      ❌ Error: {resultado.error}
                    </div>
                  ) : (
                    resultado.backend && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 text-sm">
                        <div>
                          <span className="font-medium">Empleados:</span>
                          <div>{resultado.backend.empleados}</div>
                        </div>
                        <div>
                          <span className="font-medium">Total Bruto:</span>
                          <div>Q{resultado.backend.devengado.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Deducciones:</span>
                          <div>Q{resultado.backend.deducciones.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="font-medium">Total Neto:</span>
                          <div>Q{resultado.backend.neto.toFixed(2)}</div>
                        </div>
                      </div>
                    )
                  )}

                  <div className="text-sm space-y-1">
                    {resultado.observaciones.map((obs: string, obsIndex: number) => (
                      <div key={obsIndex} className={
                        obs.startsWith('✅') ? 'text-green-700' :
                        obs.startsWith('❌') ? 'text-red-700' :
                        obs.startsWith('⚠️') ? 'text-yellow-700' :
                        'text-gray-700'
                      }>
                        {obs}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">
            📋 Cómo Interpretar los Resultados
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Aguinaldo y Bono 14:</strong> NO deben tener deducciones (IGSS = 0, ISR = 0)</li>
            <li>• <strong>Nómina Ordinaria:</strong> Debe incluir Bono Decreto Q250.00</li>
            <li>• <strong>IGSS:</strong> 4.83% sobre salario base (máximo Q5,000)</li>
            <li>• <strong>ISR:</strong> Según escala progresiva guatemalteca</li>
            <li>• Si ves errores, tu backend necesita ajustes en los cálculos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}