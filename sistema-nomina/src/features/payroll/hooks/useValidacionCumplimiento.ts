/**
 * Hook para validar cumplimiento legal Guatemala 2025
 */

import { useMemo } from 'react'
import type { TipoNomina, NominaDetalleDTO } from '../api'

export interface ValidacionCumplimiento {
  cumpleIgssExento: boolean
  cumpleIsrMayoria: boolean
  cumpleBonoDecreto: boolean
  porcentajeCumplimiento: number
  observaciones: string[]
  esLegal: boolean
}

export function useValidacionCumplimiento(
  tipoNomina: TipoNomina,
  detalles: NominaDetalleDTO[]
): ValidacionCumplimiento {
  
  return useMemo(() => {
    if (!detalles || detalles.length === 0) {
      return {
        cumpleIgssExento: true,
        cumpleIsrMayoria: true,
        cumpleBonoDecreto: true,
        porcentajeCumplimiento: 100,
        observaciones: ['No hay datos para validar'],
        esLegal: true
      }
    }

    const totalEmpleados = detalles.length
    const observaciones: string[] = []
    
    const esAguinaldoOBono14 = tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14'
    const esOrdinaria = tipoNomina === 'ORDINARIA'
    
    // 1. Validar IGSS exento para Aguinaldo/Bono14
    const empleadosConIgssExento = detalles.filter(d => d.igss === 0).length
    const cumpleIgssExento = esAguinaldoOBono14 
      ? empleadosConIgssExento === totalEmpleados
      : true // No aplica para otros tipos
    
    if (esAguinaldoOBono14 && !cumpleIgssExento) {
      observaciones.push(
        `❌ ${totalEmpleados - empleadosConIgssExento} empleados pagando IGSS en ${tipoNomina} (debe ser 0)`
      )
    }
    
    // 2. Validar ISR exento para mayoría en Aguinaldo/Bono14
    const empleadosConIsrExento = detalles.filter(d => d.isr === 0).length
    const umbralIsrExento = Math.floor(totalEmpleados * 0.8) // 80% mínimo
    const cumpleIsrMayoria = esAguinaldoOBono14
      ? empleadosConIsrExento >= umbralIsrExento
      : true // No aplica para otros tipos
    
    if (esAguinaldoOBono14 && !cumpleIsrMayoria) {
      observaciones.push(
        `⚠️ Solo ${empleadosConIsrExento}/${totalEmpleados} empleados exentos de ISR en ${tipoNomina} (esperado ≥${umbralIsrExento})`
      )
    }
    
    // 3. Validar Bono Decreto
    const empleadosConBono = detalles.filter(d => (d.bonoDecreto || 0) > 0).length
    const cumpleBonoDecreto = esOrdinaria
      ? empleadosConBono === totalEmpleados // Todos deben tener bono en ordinaria
      : empleadosConBono === 0 // Ninguno debe tener bono en otros tipos
    
    if (esOrdinaria && !cumpleBonoDecreto) {
      observaciones.push(
        `❌ ${totalEmpleados - empleadosConBono} empleados sin Bono Decreto Q250 en nómina ORDINARIA`
      )
    } else if (!esOrdinaria && empleadosConBono > 0) {
      observaciones.push(
        `❌ ${empleadosConBono} empleados con Bono Decreto en ${tipoNomina} (no debe aplicar)`
      )
    }
    
    // 4. Validaciones adicionales específicas
    
    // IGSS máximo Q5,000 base (IGSS = Q241.50 máximo)
    const empleadosIgssExcesivo = detalles.filter(d => d.igss > 241.50).length
    if (empleadosIgssExcesivo > 0) {
      observaciones.push(
        `⚠️ ${empleadosIgssExcesivo} empleados con IGSS > Q241.50 (revisar límite base Q5,000)`
      )
    }
    
    // Salarios bajo mínimo
    const SALARIO_MINIMO_2025 = 2992.38
    const empleadosBajoMinimo = detalles.filter(d => d.salarioBase < SALARIO_MINIMO_2025).length
    if (empleadosBajoMinimo > 0) {
      observaciones.push(
        `⚠️ ${empleadosBajoMinimo} empleados con salario < Q${SALARIO_MINIMO_2025} (mínimo legal 2025)`
      )
    }
    
    // Calcular porcentaje de cumplimiento
    const validaciones = [cumpleIgssExento, cumpleIsrMayoria, cumpleBonoDecreto]
    const cumplidas = validaciones.filter(Boolean).length
    const porcentajeCumplimiento = Math.round((cumplidas / validaciones.length) * 100)
    
    const esLegal = porcentajeCumplimiento === 100
    
    if (esLegal && observaciones.length === 0) {
      observaciones.push('✅ Nómina cumple con todas las leyes laborales de Guatemala 2025')
    }
    
    return {
      cumpleIgssExento,
      cumpleIsrMayoria,
      cumpleBonoDecreto,
      porcentajeCumplimiento,
      observaciones,
      esLegal
    }
  }, [tipoNomina, detalles])
}

// Hook adicional para estadísticas de cumplimiento
export function useEstadisticasCumplimiento(detalles: NominaDetalleDTO[]) {
  return useMemo(() => {
    if (!detalles || detalles.length === 0) {
      return {
        promedioIgss: 0,
        promedioIsr: 0,
        totalExencionesIgss: 0,
        totalExencionesIsr: 0,
        empleadoMayorSalario: null,
        empleadoMenorSalario: null
      }
    }
    
    const totalEmpleados = detalles.length
    
    return {
      promedioIgss: detalles.reduce((sum, d) => sum + d.igss, 0) / totalEmpleados,
      promedioIsr: detalles.reduce((sum, d) => sum + d.isr, 0) / totalEmpleados,
      totalExencionesIgss: detalles.filter(d => d.igss === 0).length,
      totalExencionesIsr: detalles.filter(d => d.isr === 0).length,
      empleadoMayorSalario: detalles.reduce((max, d) => 
        d.salarioBase > (max?.salarioBase || 0) ? d : max, detalles[0]
      ),
      empleadoMenorSalario: detalles.reduce((min, d) => 
        d.salarioBase < (min?.salarioBase || Infinity) ? d : min, detalles[0]
      )
    }
  }, [detalles])
}