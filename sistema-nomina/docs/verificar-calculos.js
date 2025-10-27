/**
 * Script de verificación de cálculos de nómina
 * Verifica que los cálculos estén correctos según las leyes guatemaltecas
 */

// Reglas laborales Guatemala 2025
const REGLAS_GT_2025 = {
  IGSS_EMPLEADO: 0.0483, // 4.83%
  IGSS_PATRONAL: 0.1067, // 10.67%
  BONO_DECRETO: 250.00,
  SALARIO_MINIMO: 2992.38,
  ISR_EXENCION_AGUINALDO_BONO14: 60000,
  IGSS_SALARIO_MAXIMO: 5000,
  
  // Escala ISR mensual 2025
  ISR_ESCALA: [
    { desde: 0, hasta: 25000, tasa: 0.05 }, // 5%
    { desde: 25000, hasta: 41667, tasa: 0.07 }, // 7%
    { desde: 41667, hasta: undefined, tasa: 0.10 } // 10%
  ]
}

function calcularISR(rentaImponible) {
  let isr = 0
  let montoAcumulado = 0
  
  for (const tramo of REGLAS_GT_2025.ISR_ESCALA) {
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

function calcularNomina(salarioBase, tipoNomina, salarioPromedio = null, ingresoAnual = 0) {
  const resultado = {
    tipo: tipoNomina,
    salarioBase: salarioBase,
    baseCalculo: salarioBase,
    bonoDecreto: 0,
    totalDevengado: 0,
    igssEmpleado: 0,
    isr: 0,
    totalDeducciones: 0,
    salarioNeto: 0,
    observaciones: []
  }
  
  // Determinar base de cálculo
  if (tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') {
    resultado.baseCalculo = salarioPromedio || salarioBase
    if (!salarioPromedio) {
      resultado.observaciones.push('⚠️ Usando salario actual en lugar de promedio 12 meses')
    }
  }
  
  // Bono Decreto (solo nóminas ordinarias)
  if (tipoNomina === 'ORDINARIA') {
    resultado.bonoDecreto = REGLAS_GT_2025.BONO_DECRETO
  }
  
  resultado.totalDevengado = resultado.baseCalculo + resultado.bonoDecreto
  
  // Cálculo IGSS
  if (tipoNomina === 'ORDINARIA' || tipoNomina === 'EXTRAORDINARIA') {
    const baseIgss = Math.min(resultado.baseCalculo, REGLAS_GT_2025.IGSS_SALARIO_MAXIMO)
    resultado.igssEmpleado = baseIgss * REGLAS_GT_2025.IGSS_EMPLEADO
    resultado.observaciones.push(`📊 IGSS calculado sobre Q${baseIgss.toFixed(2)}`)
  } else {
    resultado.observaciones.push('✅ IGSS exento por ley (Aguinaldo/Bono 14)')
  }
  
  // Cálculo ISR
  if (tipoNomina === 'ORDINARIA' || tipoNomina === 'EXTRAORDINARIA') {
    resultado.isr = calcularISR(resultado.baseCalculo)
    resultado.observaciones.push(`💰 ISR sobre renta imponible Q${resultado.baseCalculo.toFixed(2)}`)
  } else if (tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') {
    const proyeccionAnual = ingresoAnual + resultado.baseCalculo
    if (proyeccionAnual > REGLAS_GT_2025.ISR_EXENCION_AGUINALDO_BONO14) {
      const exceso = proyeccionAnual - REGLAS_GT_2025.ISR_EXENCION_AGUINALDO_BONO14
      resultado.isr = exceso * 0.05
      resultado.observaciones.push(`⚠️ ISR sobre exceso Q${exceso.toFixed(2)} (> Q60,000 anuales)`)
    } else {
      resultado.observaciones.push('✅ ISR exento (< Q60,000 anuales)')
    }
  }
  
  resultado.totalDeducciones = resultado.igssEmpleado + resultado.isr
  resultado.salarioNeto = resultado.totalDevengado - resultado.totalDeducciones
  
  return resultado
}

// Casos de prueba para verificar backend
const CASOS_PRUEBA = [
  {
    nombre: "Empleado Q5,000 - Nómina Ordinaria",
    salario: 5000,
    tipo: "ORDINARIA",
    esperado: {
      totalDevengado: 5250.00, // 5000 + 250 bono
      igss: 241.50, // 5000 * 0.0483
      isr: 95.00, // aprox según escala
      neto: 4913.50
    }
  },
  {
    nombre: "Empleado Q5,000 - Aguinaldo",
    salario: 5000,
    tipo: "AGUINALDO",
    esperado: {
      totalDevengado: 5000.00,
      igss: 0.00, // EXENTO
      isr: 0.00, // EXENTO < 60K anuales
      neto: 5000.00
    }
  },
  {
    nombre: "Empleado Q5,000 - Bono 14",
    salario: 5000,
    tipo: "BONO14",
    esperado: {
      totalDevengado: 5000.00,
      igss: 0.00, // EXENTO
      isr: 0.00, // EXENTO < 60K anuales
      neto: 5000.00
    }
  },
  {
    nombre: "Empleado Q3,000 - Nómina Ordinaria",
    salario: 3000,
    tipo: "ORDINARIA",
    esperado: {
      totalDevengado: 3250.00, // 3000 + 250 bono
      igss: 144.90, // 3000 * 0.0483
      isr: 0.00, // Bajo umbral ISR
      neto: 3105.10
    }
  },
  {
    nombre: "Empleado Q10,000 - Nómina Ordinaria",
    salario: 10000,
    tipo: "ORDINARIA",
    esperado: {
      totalDevengado: 10250.00, // 10000 + 250 bono
      igss: 241.50, // máximo sobre 5000
      isr: 725.00, // aprox según escala progresiva
      neto: 9283.50
    }
  }
]

console.log("🧮 VERIFICACIÓN DE CÁLCULOS DE NÓMINA - GUATEMALA 2025")
console.log("=" .repeat(60))

CASOS_PRUEBA.forEach((caso, index) => {
  console.log(`\n${index + 1}. ${caso.nombre}`)
  console.log("-" .repeat(40))
  
  const calculado = calcularNomina(caso.salario, caso.tipo)
  
  console.log(`Salario Base: Q${calculado.baseCalculo.toFixed(2)}`)
  console.log(`Bono Decreto: Q${calculado.bonoDecreto.toFixed(2)}`)
  console.log(`Total Devengado: Q${calculado.totalDevengado.toFixed(2)}`)
  console.log(`IGSS: Q${calculado.igssEmpleado.toFixed(2)}`)
  console.log(`ISR: Q${calculado.isr.toFixed(2)}`)
  console.log(`Total Deducciones: Q${calculado.totalDeducciones.toFixed(2)}`)
  console.log(`Salario Neto: Q${calculado.salarioNeto.toFixed(2)}`)
  
  // Comparar con esperado
  const tolerancia = 5.00 // Q5.00 de tolerancia
  const devengadoOK = Math.abs(calculado.totalDevengado - caso.esperado.totalDevengado) <= tolerancia
  const igssOK = Math.abs(calculado.igssEmpleado - caso.esperado.igss) <= tolerancia
  const isrOK = Math.abs(calculado.isr - caso.esperado.isr) <= tolerancia
  const netoOK = Math.abs(calculado.salarioNeto - caso.esperado.neto) <= tolerancia
  
  console.log("\n📊 VERIFICACIÓN:")
  console.log(`✅ Devengado: ${devengadoOK ? 'OK' : 'ERROR'} (Esperado: Q${caso.esperado.totalDevengado})`)
  console.log(`✅ IGSS: ${igssOK ? 'OK' : 'ERROR'} (Esperado: Q${caso.esperado.igss})`)
  console.log(`✅ ISR: ${isrOK ? 'OK' : 'ERROR'} (Esperado: Q${caso.esperado.isr})`)
  console.log(`✅ Neto: ${netoOK ? 'OK' : 'ERROR'} (Esperado: Q${caso.esperado.neto})`)
  
  if (calculado.observaciones.length > 0) {
    console.log("\n📝 Observaciones:")
    calculado.observaciones.forEach(obs => console.log(`   ${obs}`))
  }
})

console.log("\n🚨 PUNTOS CRÍTICOS A VERIFICAR EN TU BACKEND:")
console.log("1. ¿Aguinaldo y Bono 14 NO pagan IGSS?")
console.log("2. ¿Se usa promedio 12 meses para Aguinaldo/Bono14?")
console.log("3. ¿ISR de Aguinaldo/Bono14 solo aplica si > Q60,000 anuales?")
console.log("4. ¿Bono Decreto Q250 solo en nóminas ordinarias?")
console.log("5. ¿IGSS se calcula sobre máximo Q5,000?")

console.log("\n✨ Para probar tu backend:")
console.log("1. Crea una nómina de cada tipo en tu sistema")
console.log("2. Compara los resultados con los cálculos de arriba")
console.log("3. Los números deben coincidir exactamente (±Q5 tolerancia)")

// Exportar funciones para usar en otros archivos
if (typeof module !== 'undefined') {
  module.exports = { calcularNomina, REGLAS_GT_2025, CASOS_PRUEBA }
}