/**
 * Página temporal para verificar cálculos de nómina
 * Se puede acceder desde /verificar-calculos
 */

import CalculadoraNomina from '../components/CalculadoraNomina'

export default function VerificarCalculosPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🔍 Verificación de Cálculos de Nómina
          </h1>
          <p className="mt-2 text-gray-600">
            Herramienta para verificar que los cálculos de nómina se estén aplicando correctamente 
            según las leyes laborales de Guatemala 2025.
          </p>
        </div>
        
        <CalculadoraNomina />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📚 Casos de Prueba Recomendados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Caso 1: Empleado Salario Medio - Nómina Ordinaria
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Salario Base: Q5,000.00</li>
                <li>• Tipo: ORDINARIA</li>
                <li>• Esperado: IGSS Q241.50, ISR ~Q95.00</li>
                <li>• Neto: ~Q4,913.50</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                ✅ Caso 2: Empleado Alto Salario - Nómina Ordinaria
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Salario Base: Q10,000.00</li>
                <li>• Tipo: ORDINARIA</li>
                <li>• Esperado: IGSS Q241.50 (máximo)</li>
                <li>• ISR según escala progresiva</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">
                🎄 Caso 3: Aguinaldo
              </h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Salario Promedio: Q5,000.00</li>
                <li>• Tipo: AGUINALDO</li>
                <li>• Esperado: IGSS Q0.00 (exento)</li>
                <li>• ISR Q0.00 (&lt; Q60K anuales)</li>
                <li>• Neto: Q5,000.00</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">
                🏖️ Caso 4: Bono 14
              </h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Salario Promedio: Q5,000.00</li>
                <li>• Tipo: BONO14</li>
                <li>• Esperado: IGSS Q0.00 (exento)</li>
                <li>• ISR Q0.00 (&lt; Q60K anuales)</li>
                <li>• Neto: Q5,000.00</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Puntos Críticos a Verificar
            </h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Aguinaldo y Bono 14:</strong> NO deben pagar IGSS (4.83%)</li>
              <li>• <strong>Base de cálculo:</strong> Aguinaldo/Bono14 usan promedio 12 meses</li>
              <li>• <strong>ISR Aguinaldo/Bono14:</strong> Solo aplica si ingreso anual &gt; Q60,000</li>
              <li>• <strong>Bono Decreto:</strong> Q250.00 solo en nóminas ordinarias</li>
              <li>• <strong>IGSS máximo:</strong> Se calcula sobre máximo Q5,000 de salario base</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}