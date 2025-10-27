/**
 * Hook para verificar cálculos de nómina según tipo
 * Guatemala 2025 - Reglas laborales
 */

import { useMemo } from 'react'
import type { TipoNomina } from '../api'

// Constantes laborales Guatemala 2025
export const REGLAS_LABORALES_GT_2025 = {
  // Porcentajes IGSS
  IGSS_EMPLEADO: 0.0483, // 4.83%
  IGSS_PATRONAL: 0.1067, // 10.67%
  
  // Otros aportes patronales
  IRTRA: 0.01, // 1%
  INTECAP: 0.01, // 1%
  
  // Bonos y salarios
  BONO_DECRETO: 250.00, // Q250.00
  SALARIO_MINIMO: 2992.38, // Q2,992.38
  
  // Límites ISR
  ISR_EXENCION_AGUINALDO_BONO14: 60000, // Q60,000 anuales
  IGSS_SALARIO_MAXIMO: 5000, // Base máxima para IGSS
  
  // Escala ISR 2025 (mensual)
  ISR_ESCALA: [
    { desde: 0, hasta: 25000, tasa: 0.05 }, // 5%
    { desde: 25000, hasta: 41667, tasa: 0.07 }, // 7%
    { desde: 41667, hasta: undefined, tasa: 0.10 } // 10%
  ]
} as const

interface CalculoNominaParams {
  salarioBase: number
  tipoNomina: TipoNomina
  salarioPromedio12Meses?: number
  ingresoAnualAcumulado?: number
}

interface ResultadoCalculo {
  salarioBase: number
  bonoDecreto: number
  totalDevengado: number
  igssEmpleado: number
  isr: number
  totalDeducciones: number
  salarioNeto: number
  observaciones: string[]
}

export function useCalculoNominaVerificacion(params: CalculoNominaParams): ResultadoCalculo {
  return useMemo(() => {
    const { salarioBase, tipoNomina, salarioPromedio12Meses, ingresoAnualAcumulado = 0 } = params
    const observaciones: string[] = []
    
    // Determinar base de cálculo
    let baseCalculo = salarioBase
    if (tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') {
      baseCalculo = salarioPromedio12Meses || salarioBase
      if (!salarioPromedio12Meses) {
        observaciones.push('⚠️ Usando salario actual en lugar de promedio 12 meses')
      }
    }
    
    // Bono Decreto (solo nóminas ordinarias)
    let bonoDecreto = 0
    if (tipoNomina === 'ORDINARIA') {
      bonoDecreto = REGLAS_LABORALES_GT_2025.BONO_DECRETO
    }
    
    const totalDevengado = baseCalculo + bonoDecreto
    
    // Cálculo IGSS
    let igssEmpleado = 0
    if (tipoNomina === 'ORDINARIA' || tipoNomina === 'EXTRAORDINARIA') {
      const baseIgss = Math.min(baseCalculo, REGLAS_LABORALES_GT_2025.IGSS_SALARIO_MAXIMO)
      igssEmpleado = baseIgss * REGLAS_LABORALES_GT_2025.IGSS_EMPLEADO
      observaciones.push(`📊 IGSS calculado sobre Q${baseIgss.toFixed(2)}`)
    } else {
      observaciones.push('✅ IGSS exento por ley (Aguinaldo/Bono 14)')
    }
    
    // Cálculo ISR
    let isr = 0
    if (tipoNomina === 'ORDINARIA' || tipoNomina === 'EXTRAORDINARIA') {
      // ISR normal sobre renta imponible (excluye bono decreto)
      const rentaImponible = baseCalculo
      isr = calcularISR(rentaImponible)
      observaciones.push(`💰 ISR sobre renta imponible Q${rentaImponible.toFixed(2)}`)
    } else if (tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') {
      // ISR especial: solo si excede Q60,000 anuales
      const proyeccionAnual = ingresoAnualAcumulado + baseCalculo
      if (proyeccionAnual > REGLAS_LABORALES_GT_2025.ISR_EXENCION_AGUINALDO_BONO14) {
        const exceso = proyeccionAnual - REGLAS_LABORALES_GT_2025.ISR_EXENCION_AGUINALDO_BONO14
        isr = exceso * 0.05 // Tasa reducida para exceso
        observaciones.push(`⚠️ ISR sobre exceso Q${exceso.toFixed(2)} (> Q60,000 anuales)`)
      } else {
        observaciones.push('✅ ISR exento (< Q60,000 anuales)')
      }
    }
    
    const totalDeducciones = igssEmpleado + isr
    const salarioNeto = totalDevengado - totalDeducciones
    
    // Validaciones adicionales
    if (baseCalculo < REGLAS_LABORALES_GT_2025.SALARIO_MINIMO) {
      observaciones.push(`⚠️ Salario inferior al mínimo legal Q${REGLAS_LABORALES_GT_2025.SALARIO_MINIMO}`)
    }
    
    return {
      salarioBase: baseCalculo,
      bonoDecreto,
      totalDevengado,
      igssEmpleado,
      isr,
      totalDeducciones,
      salarioNeto,
      observaciones
    }
  }, [params])
}

// Helper para calcular ISR según escala progresiva
function calcularISR(rentaImponible: number): number {
  let isr = 0
  let montoAcumulado = 0
  
  for (const tramo of REGLAS_LABORALES_GT_2025.ISR_ESCALA) {
    if (rentaImponible <= montoAcumulado) break
    
    const baseTramo = Math.min(
      rentaImponible - montoAcumulado,
      (tramo.hasta ?? Infinity) - tramo.desde
    )
    
    isr += baseTramo * tramo.tasa
    montoAcumulado += baseTramo
  }
  
  return isr
}

// Hook para comparar cálculo esperado vs actual
export function useComparacionCalculos(
  calculoEsperado: ResultadoCalculo,
  calculoActual: {
    totalDevengado: number
    igss: number
    isr: number
    salarioNeto: number
  }
) {
  return useMemo(() => {
    const tolerancia = 0.01 // Q0.01 de tolerancia
    
    const diferencias = {
      totalDevengado: Math.abs(calculoEsperado.totalDevengado - calculoActual.totalDevengado),
      igss: Math.abs(calculoEsperado.igssEmpleado - calculoActual.igss),
      isr: Math.abs(calculoEsperado.isr - calculoActual.isr),
      salarioNeto: Math.abs(calculoEsperado.salarioNeto - calculoActual.salarioNeto)
    }
    
    const esCorrectoDevengado = diferencias.totalDevengado <= tolerancia
    const esCorrectoIgss = diferencias.igss <= tolerancia
    const esCorrectoIsr = diferencias.isr <= tolerancia
    const esCorrectoNeto = diferencias.salarioNeto <= tolerancia
    
    const esCorrectoTotal = esCorrectoDevengado && esCorrectoIgss && esCorrectoIsr && esCorrectoNeto
    
    return {
      esCorrectoTotal,
      diferencias,
      validaciones: {
        totalDevengado: esCorrectoDevengado,
        igss: esCorrectoIgss,
        isr: esCorrectoIsr,
        salarioNeto: esCorrectoNeto
      }
    }
  }, [calculoEsperado, calculoActual])
}

// Tipos para exportar
export type { CalculoNominaParams, ResultadoCalculo }