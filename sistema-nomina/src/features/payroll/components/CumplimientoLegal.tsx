/**
 * Componente para mostrar indicadores de cumplimiento legal Guatemala 2025
 */

import type { TipoNomina } from '../api'

interface CumplimientoLegalProps {
  tipoNomina: TipoNomina
  totalEmpleados: number
  empleadosConIgssExento: number
  empleadosConIsrExento: number
  bonoDecretoAplicado: number
  className?: string
}

export default function CumplimientoLegal({
  tipoNomina,
  totalEmpleados,
  empleadosConIgssExento,
  empleadosConIsrExento,
  bonoDecretoAplicado,
  className = ''
}: CumplimientoLegalProps) {
  
  const esAguinaldoOBono14 = tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14'
  const esOrdinaria = tipoNomina === 'ORDINARIA'
  
  // Verificaciones de cumplimiento
  const cumplimientos = []
  
  // 1. IGSS exento para Aguinaldo/Bono14
  if (esAguinaldoOBono14) {
    const igssCorecto = empleadosConIgssExento === totalEmpleados
    cumplimientos.push({
      regla: 'IGSS Exento',
      cumple: igssCorecto,
      descripcion: `${empleadosConIgssExento}/${totalEmpleados} empleados sin IGSS`,
      icono: igssCorecto ? '✅' : '❌',
      color: igssCorecto ? 'text-green-700' : 'text-red-700',
      bg: igssCorecto ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    })
  }
  
  // 2. ISR exento para mayoría en Aguinaldo/Bono14
  if (esAguinaldoOBono14) {
    const mayoriaExenta = empleadosConIsrExento >= Math.floor(totalEmpleados * 0.8) // 80% o más
    cumplimientos.push({
      regla: 'ISR Exento Mayoría',
      cumple: mayoriaExenta,
      descripcion: `${empleadosConIsrExento}/${totalEmpleados} empleados sin ISR`,
      icono: mayoriaExenta ? '✅' : '⚠️',
      color: mayoriaExenta ? 'text-green-700' : 'text-yellow-700',
      bg: mayoriaExenta ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
    })
  }
  
  // 3. Bono Decreto solo en ordinarias
  if (esOrdinaria) {
    const bonoCorecto = bonoDecretoAplicado > 0
    cumplimientos.push({
      regla: 'Bono Decreto Q250',
      cumple: bonoCorecto,
      descripcion: `Aplicado a ${totalEmpleados} empleados`,
      icono: bonoCorecto ? '✅' : '❌',
      color: bonoCorecto ? 'text-green-700' : 'text-red-700',
      bg: bonoCorecto ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    })
  } else {
    const sinBono = bonoDecretoAplicado === 0
    cumplimientos.push({
      regla: 'Sin Bono Decreto',
      cumple: sinBono,
      descripcion: `${tipoNomina} no debe incluir bono`,
      icono: sinBono ? '✅' : '❌',
      color: sinBono ? 'text-green-700' : 'text-red-700',
      bg: sinBono ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
    })
  }
  
  const cumplimientoTotal = cumplimientos.filter(c => c.cumple).length
  const totalReglas = cumplimientos.length
  const porcentajeCumplimiento = Math.round((cumplimientoTotal / totalReglas) * 100)
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          🏛️ Cumplimiento Legal Guatemala 2025
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          porcentajeCumplimiento === 100 
            ? 'bg-green-100 text-green-800' 
            : porcentajeCumplimiento >= 80
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {porcentajeCumplimiento}% Cumplimiento
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cumplimientos.map((cumplimiento, index) => (
          <div 
            key={index}
            className={`p-3 rounded-lg border ${cumplimiento.bg}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900">
                {cumplimiento.regla}
              </span>
              <span className="text-lg">{cumplimiento.icono}</span>
            </div>
            <div className={`text-xs ${cumplimiento.color}`}>
              {cumplimiento.descripcion}
            </div>
          </div>
        ))}
      </div>
      
      {porcentajeCumplimiento < 100 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>⚠️ Atención:</strong> Esta nómina no cumple completamente con las leyes laborales guatemaltecas. 
            Revisa los puntos marcados en rojo para corregir las inconsistencias.
          </div>
        </div>
      )}
    </div>
  )
}