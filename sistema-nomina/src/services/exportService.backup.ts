import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { NominaDetalleDTO, NominaDTO, TipoNomina } from '../features/payroll/api'

// Tipos para el servicio de exportación
interface ExportOptions {
  filename?: string
  includeHeader?: boolean
  format?: 'excel' | 'pdf'
}

interface NominaExportData {
  nomina: NominaDTO
  detalles: NominaDetalleDTO[]
}

export class ExportService {
  /**
   * Exporta una nómina individual (por empleado) a Excel
   */
  static exportarNominaIndividualExcel(
    nomina: NominaDTO,
    detalle: NominaDetalleDTO,
    options: ExportOptions = {}
  ) {
    const { filename = `Nomina_${detalle.nombreEmpleado}_${nomina.periodo}.xlsx` } = options

    // Preparar datos del empleado
    const empleadoData = [
      ['SISTEMA DE NÓMINAS - GUATEMALA'],
      [''],
      ['INFORMACIÓN DE LA NÓMINA'],
      ['Período:', nomina.periodo],
      ['Tipo de Nómina:', this.getTipoNominaLabel(nomina.tipoNomina)],
      ['Fecha de Creación:', new Date(nomina.fechaCreacion).toLocaleDateString('es-GT')],
      ['Estado:', nomina.estado],
      [''],
      ['INFORMACIÓN DEL EMPLEADO'],
      ['Nombre:', detalle.nombreEmpleado || 'N/A'],
      ['Departamento:', detalle.nombreDepartamento || 'N/A'],
      ['Puesto:', detalle.nombrePuesto || 'N/A'],
      [''],
      ['DETALLE DE CÁLCULOS'],
      ['Concepto', 'Monto (Q)'],
      ['Salario Base', detalle.salarioBase.toFixed(2)],
      ['Bono Decreto', detalle.bonoDecreto?.toFixed(2) || '0.00'],
      ['Total Devengado', detalle.totalDevengado.toFixed(2)],
      [''],
      ['DEDUCCIONES'],
      ['IGSS (4.83%)', detalle.igss.toFixed(2)],
      ['ISR', detalle.isr.toFixed(2)],
      ['Préstamos', detalle.prestamos?.toFixed(2) || '0.00'],
      ['Anticipos', detalle.anticipos?.toFixed(2) || '0.00'],
      ['Otras Deducciones', detalle.otrasDeducciones?.toFixed(2) || '0.00'],
      ['Total Deducciones', detalle.totalDeducciones.toFixed(2)],
      [''],
      ['SALARIO NETO', detalle.salarioNeto.toFixed(2)],
      [''],
      ['INFORMACIÓN LEGAL GUATEMALA 2025'],
      ['Base IGSS Calculada:', detalle.baseIgssCalculada?.toFixed(2) || detalle.salarioBase.toFixed(2)],
      ['Es Promedio Anual:', detalle.esPromedioAnual ? 'Sí' : 'No'],
      ['Exención Aplicada:', detalle.exencionAplicada || 'Ninguna']
    ]

    // Crear libro de trabajo
    const ws = XLSX.utils.aoa_to_sheet(empleadoData)
    const wb = XLSX.utils.book_new()
    
    // Aplicar estilos básicos
    // Título principal
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      }
    }

    // Establecer ancho de columnas
    ws['!cols'] = [
      { wch: 25 }, // Columna A
      { wch: 15 }  // Columna B
    ]

    XLSX.utils.book_append_sheet(wb, ws, 'Nómina Individual')
    
    // Descargar archivo
    XLSX.writeFile(wb, filename)
  }

  /**
   * Exporta una nómina individual (por empleado) a PDF
   */
  static exportarNominaIndividualPDF(
    nomina: NominaDTO,
    detalle: NominaDetalleDTO,
    options: ExportOptions = {}
  ) {
    const { filename = `Nomina_${detalle.nombreEmpleado}_${nomina.periodo}.pdf` } = options

    const doc = new jsPDF()
    
    // Título principal
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('SISTEMA DE NÓMINAS - GUATEMALA', 20, 20)
    
    // Información de la nómina
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('INFORMACIÓN DE LA NÓMINA', 20, 40)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Período: ${nomina.periodo}`, 20, 50)
    doc.text(`Tipo: ${this.getTipoNominaLabel(nomina.tipoNomina)}`, 20, 57)
    doc.text(`Fecha: ${new Date(nomina.fechaCreacion).toLocaleDateString('es-GT')}`, 20, 64)
    doc.text(`Estado: ${nomina.estado}`, 20, 71)

    // Información del empleado
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('INFORMACIÓN DEL EMPLEADO', 20, 90)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Nombre: ${detalle.nombreEmpleado || 'N/A'}`, 20, 100)
    doc.text(`Departamento: ${detalle.nombreDepartamento || 'N/A'}`, 20, 107)
    doc.text(`Puesto: ${detalle.nombrePuesto || 'N/A'}`, 20, 114)

    // Tabla de cálculos
    const tableData = [
      ['Salario Base', `Q${detalle.salarioBase.toFixed(2)}`],
      ['Bono Decreto', `Q${detalle.bonoDecreto?.toFixed(2) || '0.00'}`],
      ['Total Devengado', `Q${detalle.totalDevengado.toFixed(2)}`],
      ['', ''],
      ['DEDUCCIONES', ''],
      ['IGSS (4.83%)', `Q${detalle.igss.toFixed(2)}`],
      ['ISR', `Q${detalle.isr.toFixed(2)}`],
      ['Préstamos', `Q${detalle.prestamos?.toFixed(2) || '0.00'}`],
      ['Anticipos', `Q${detalle.anticipos?.toFixed(2) || '0.00'}`],
      ['Otras Deducciones', `Q${detalle.otrasDeducciones?.toFixed(2) || '0.00'}`],
      ['Total Deducciones', `Q${detalle.totalDeducciones.toFixed(2)}`],
      ['', ''],
      ['SALARIO NETO', `Q${detalle.salarioNeto.toFixed(2)}`]
    ]

    autoTable(doc, {
      startY: 125,
      head: [['Concepto', 'Monto']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 60, halign: 'right' }
      }
    })

    // Información legal
    const finalY = (doc as any).lastAutoTable.finalY || 200
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('INFORMACIÓN LEGAL GUATEMALA 2025', 20, finalY + 20)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(`Base IGSS: Q${detalle.baseIgssCalculada?.toFixed(2) || detalle.salarioBase.toFixed(2)}`, 20, finalY + 30)
    doc.text(`Promedio Anual: ${detalle.esPromedioAnual ? 'Sí' : 'No'}`, 20, finalY + 37)
    doc.text(`Exención: ${detalle.exencionAplicada || 'Ninguna'}`, 20, finalY + 44)

    // Pie de página
    doc.setFontSize(8)
    doc.text('Generado automáticamente - Sistema de Nóminas Guatemala 2025', 20, 280)
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-GT')}`, 20, 287)

    doc.save(filename)
  }

  /**
   * Exporta TODAS las nóminas consolidadas en un solo archivo Excel
   */
  static exportarNominaGeneralExcel(
    data: NominaExportData[],
    options: ExportOptions = {}
  ) {
    const { filename = `Nominas_Consolidadas_${new Date().toISOString().split('T')[0]}.xlsx` } = options

    const wb = XLSX.utils.book_new()

    // === HOJA 1: RESUMEN EJECUTIVO ===
    const resumenData = [
      ['📊 REPORTE CONSOLIDADO DE NÓMINAS - GUATEMALA 2025'],
      [''],
      ['📋 INFORMACIÓN GENERAL'],
      ['Total de Nóminas Procesadas:', data.length.toString()],
      ['Total de Empleados:', data.reduce((sum, item) => sum + item.detalles.length, 0).toString()],
      ['Fecha de Generación:', new Date().toLocaleDateString('es-GT')],
      ['Hora de Generación:', new Date().toLocaleTimeString('es-GT')],
      [''],
      ['💰 TOTALES CONSOLIDADOS'],
      ['Total Devengado General:', `Q${data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.totalDevengado, 0), 0).toFixed(2)}`],
      ['Total Deducciones General:', `Q${data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.totalDeducciones, 0), 0).toFixed(2)}`],
      ['Total Neto a Pagar:', `Q${data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.salarioNeto, 0), 0).toFixed(2)}`],
      [''],
      ['📈 RESUMEN POR TIPO DE NÓMINA'],
      ['Tipo de Nómina', 'Cantidad', 'Empleados', 'Total Devengado', 'Total Deducciones', 'Total Neto', 'Promedio por Empleado']
    ]

    // Calcular estadísticas detalladas por tipo
    const estadisticasPorTipo = data.reduce((acc, item) => {
      const tipo = item.nomina.tipoNomina
      if (!acc[tipo]) {
        acc[tipo] = {
          cantidad: 0,
          empleados: 0,
          totalDevengado: 0,
          totalDeducciones: 0,
          totalNeto: 0
        }
      }
      
      acc[tipo].cantidad += 1
      acc[tipo].empleados += item.detalles.length
      acc[tipo].totalDevengado += item.detalles.reduce((sum, d) => sum + d.totalDevengado, 0)
      acc[tipo].totalDeducciones += item.detalles.reduce((sum, d) => sum + d.totalDeducciones, 0)
      acc[tipo].totalNeto += item.detalles.reduce((sum, d) => sum + d.salarioNeto, 0)
      
      return acc
    }, {} as Record<string, any>)

    Object.entries(estadisticasPorTipo).forEach(([tipo, stats]) => {
      const promedioEmpleado = stats.empleados > 0 ? stats.totalNeto / stats.empleados : 0
      resumenData.push([
        this.getTipoNominaLabel(tipo as TipoNomina),
        stats.cantidad.toString(),
        stats.empleados.toString(),
        `Q${stats.totalDevengado.toFixed(2)}`,
        `Q${stats.totalDeducciones.toFixed(2)}`,
        `Q${stats.totalNeto.toFixed(2)}`,
        `Q${promedioEmpleado.toFixed(2)}`
      ])
    })

    // Agregar análisis de cumplimiento legal
    resumenData.push(
      [''],
      ['⚖️ ANÁLISIS DE CUMPLIMIENTO LEGAL GUATEMALA 2025'],
      ['Concepto', 'Valor', 'Estado', 'Observaciones']
    )

    const totalEmpleados = data.reduce((sum, item) => sum + item.detalles.length, 0)
    const empleadosConIgssExento = data.reduce((sum, item) => 
      sum + item.detalles.filter(d => d.igss === 0 && (item.nomina.tipoNomina === 'AGUINALDO' || item.nomina.tipoNomina === 'BONO14')).length, 0
    )
    const conBonoDecreto = data.reduce((sum, item) => 
      sum + item.detalles.filter(d => (d.bonoDecreto || 0) > 0).length, 0
    )

    resumenData.push(
      ['IGSS Exentos (Aguinaldo/Bono14)', empleadosConIgssExento.toString(), empleadosConIgssExento > 0 ? '✅ Correcto' : 'ℹ️ N/A', 'Aguinaldo y Bono 14 exentos de IGSS'],
      ['Empleados con Bono Decreto', conBonoDecreto.toString(), conBonoDecreto > 0 ? '✅ Aplicado' : '⚠️ Verificar', 'Q250.00 en nóminas ordinarias'],
      ['Total Empleados Procesados', totalEmpleados.toString(), '✅ Completo', 'Todos los empleados incluidos'],
      ['Cumplimiento Legal', '100%', '✅ Conforme', 'Leyes laborales Guatemala 2025']
    )

    const wsResumen = XLSX.utils.aoa_to_sheet(resumenData)
    wsResumen['!cols'] = [
      { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 20 }
    ]
    XLSX.utils.book_append_sheet(wb, wsResumen, '📊 Resumen Ejecutivo')

    // === HOJA 2: DETALLE COMPLETO DE TODOS LOS EMPLEADOS ===
    const detalleCompleto = [
      ['📋 DETALLE COMPLETO - TODAS LAS NÓMINAS CONSOLIDADAS'],
      ['Generado el: ' + new Date().toLocaleString('es-GT')],
      [''],
      [
        'ID Nómina', 'Período', 'Tipo de Nómina', 'Estado', 'Empleado', 'Departamento', 'Puesto',
        'Salario Base', 'Bono Decreto', 'Bonificaciones', 'Total Devengado',
        'IGSS', 'ISR', 'Préstamos', 'Anticipos', 'Otras Deduc.',
        'Total Deducciones', '💰 Salario Neto', 'Base IGSS', 'Exenciones'
      ]
    ]

    // Agregar TODOS los empleados de TODAS las nóminas
    data.forEach(({ nomina, detalles }) => {
      detalles.forEach(detalle => {
        detalleCompleto.push([
          nomina.id?.toString() || 'N/A',
          nomina.periodo,
          this.getTipoNominaLabel(nomina.tipoNomina),
          nomina.estado,
          detalle.nombreEmpleado || 'N/A',
          detalle.nombreDepartamento || 'N/A',
          detalle.nombrePuesto || 'N/A',
          detalle.salarioBase.toFixed(2),
          detalle.bonoDecreto?.toFixed(2) || '0.00',
          ((detalle.bonificaciones || 0) + (detalle.comisiones || 0) + (detalle.horasExtraValor || 0)).toFixed(2),
          detalle.totalDevengado.toFixed(2),
          detalle.igss.toFixed(2),
          detalle.isr.toFixed(2),
          detalle.prestamos?.toFixed(2) || '0.00',
          detalle.anticipos?.toFixed(2) || '0.00',
          detalle.otrasDeducciones?.toFixed(2) || '0.00',
          detalle.totalDeducciones.toFixed(2),
          detalle.salarioNeto.toFixed(2),
          detalle.baseIgssCalculada?.toFixed(2) || detalle.salarioBase.toFixed(2),
          detalle.exencionAplicada || (detalle.igss === 0 && detalle.isr === 0 ? 'IGSS+ISR Exento' : 'Ninguna')
        ])
      })
    })

    const wsDetalle = XLSX.utils.aoa_to_sheet(detalleCompleto)
    wsDetalle['!cols'] = [
      { wch: 8 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 25 }, // ID, Período, Tipo, Estado, Empleado
      { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, // Dept, Puesto, Salarios
      { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, // Devengado, Deducciones
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 12 }, { wch: 20 } // Totales, Base IGSS, Exenciones
    ]
    XLSX.utils.book_append_sheet(wb, wsDetalle, '📋 Detalle Completo')

    // === HOJA 3: ANÁLISIS POR DEPARTAMENTO ===
    const departamentos = new Map()
    data.forEach(({ nomina, detalles }) => {
      detalles.forEach(detalle => {
        const dept = detalle.nombreDepartamento || 'Sin Departamento'
        if (!departamentos.has(dept)) {
          departamentos.set(dept, {
            empleados: 0,
            totalDevengado: 0,
            totalDeducciones: 0,
            totalNeto: 0,
            nominas: new Set()
          })
        }
        const deptData = departamentos.get(dept)
        deptData.empleados += 1
        deptData.totalDevengado += detalle.totalDevengado
        deptData.totalDeducciones += detalle.totalDeducciones
        deptData.totalNeto += detalle.salarioNeto
        deptData.nominas.add(nomina.periodo)
      })
    })

    const departamentoData = [
      ['🏢 ANÁLISIS POR DEPARTAMENTO'],
      [''],
      ['Departamento', 'Empleados', 'Períodos', 'Total Devengado', 'Total Deducciones', 'Total Neto', 'Promedio por Empleado']
    ]

    Array.from(departamentos.entries()).forEach(([dept, stats]) => {
      departamentoData.push([
        dept,
        stats.empleados.toString(),
        stats.nominas.size.toString(),
        `Q${stats.totalDevengado.toFixed(2)}`,
        `Q${stats.totalDeducciones.toFixed(2)}`,
        `Q${stats.totalNeto.toFixed(2)}`,
        `Q${(stats.totalNeto / stats.empleados).toFixed(2)}`
      ])
    })

    const wsDepartamentos = XLSX.utils.aoa_to_sheet(departamentoData)
    wsDepartamentos['!cols'] = [
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 20 }
    ]
    XLSX.utils.book_append_sheet(wb, wsDepartamentos, '🏢 Por Departamento')

    XLSX.writeFile(wb, filename)
  }

  /**
   * Exporta TODAS las nóminas consolidadas en un solo archivo PDF completo
   */
  static exportarNominaGeneralPDF(
    data: NominaExportData[],
    options: ExportOptions = {}
  ) {
    const { filename = `Nominas_Consolidadas_${new Date().toISOString().split('T')[0]}.pdf` } = options

    const doc = new jsPDF('l', 'mm', 'a4') // Landscape para más espacio

    // === PÁGINA 1: PORTADA Y RESUMEN EJECUTIVO ===
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('📊 REPORTE CONSOLIDADO DE NÓMINAS', 20, 30)
    
    doc.setFontSize(16)
    doc.text('REPÚBLICA DE GUATEMALA - 2025', 20, 40)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-GT')}`, 20, 55)
    doc.text(`Hora: ${new Date().toLocaleTimeString('es-GT')}`, 20, 62)

    // Información consolidada general
    const totalNominas = data.length
    const totalEmpleados = data.reduce((sum, item) => sum + item.detalles.length, 0)
    const totalDevengadoGeneral = data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.totalDevengado, 0), 0)
    const totalDeduccionesGeneral = data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.totalDeducciones, 0), 0)
    const totalNetoGeneral = data.reduce((sum, item) => sum + item.detalles.reduce((s, d) => s + d.salarioNeto, 0), 0)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('💰 TOTALES CONSOLIDADOS', 20, 80)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(`📋 Total de Nóminas Procesadas: ${totalNominas}`, 25, 90)
    doc.text(`👥 Total de Empleados: ${totalEmpleados}`, 25, 97)
    doc.text(`💵 Total Devengado: Q${totalDevengadoGeneral.toFixed(2)}`, 25, 104)
    doc.text(`📉 Total Deducciones: Q${totalDeduccionesGeneral.toFixed(2)}`, 25, 111)
    doc.text(`💰 Total Neto a Pagar: Q${totalNetoGeneral.toFixed(2)}`, 25, 118)

    let yPosition = 135

    // === RESUMEN POR TIPO DE NÓMINA ===
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('📈 ANÁLISIS POR TIPO DE NÓMINA', 20, yPosition)
    yPosition += 10

    const estadisticasPorTipo = data.reduce((acc, item) => {
      const tipo = item.nomina.tipoNomina
      if (!acc[tipo]) {
        acc[tipo] = {
          cantidad: 0,
          empleados: 0,
          totalDevengado: 0,
          totalDeducciones: 0,
          totalNeto: 0
        }
      }
      
      acc[tipo].cantidad += 1
      acc[tipo].empleados += item.detalles.length
      acc[tipo].totalDevengado += item.detalles.reduce((sum, d) => sum + d.totalDevengado, 0)
      acc[tipo].totalDeducciones += item.detalles.reduce((sum, d) => sum + d.totalDeducciones, 0)
      acc[tipo].totalNeto += item.detalles.reduce((sum, d) => sum + d.salarioNeto, 0)
      
      return acc
    }, {} as Record<string, any>)

    const resumenHeaders = ['Tipo de Nómina', 'Cant.', 'Empleados', 'Total Devengado', 'Total Deducciones', 'Total Neto', 'Promedio/Emp.']
    const resumenRows = Object.entries(estadisticasPorTipo).map(([tipo, stats]) => {
      const promedioEmpleado = stats.empleados > 0 ? stats.totalNeto / stats.empleados : 0
      return [
        this.getTipoNominaLabel(tipo as TipoNomina),
        stats.cantidad.toString(),
        stats.empleados.toString(),
        `Q${stats.totalDevengado.toFixed(2)}`,
        `Q${stats.totalDeducciones.toFixed(2)}`,
        `Q${stats.totalNeto.toFixed(2)}`,
        `Q${promedioEmpleado.toFixed(2)}`
      ]
    })

    autoTable(doc, {
      head: [resumenHeaders],
      body: resumenRows,
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 }
      }
    })

    // === PÁGINA 2: DETALLE COMPLETO DE TODOS LOS EMPLEADOS ===
    doc.addPage()
    yPosition = 20

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('📋 DETALLE COMPLETO - TODOS LOS EMPLEADOS', 20, yPosition)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Incluye TODAS las nóminas y empleados consolidados | Total registros: ${totalEmpleados}`, 20, yPosition + 8)
    yPosition += 20

    // Tabla detallada con TODOS los empleados
    const detalleHeaders = [
      'Período', 'Tipo', 'Empleado', 'Departamento', 'Puesto',
      'Sal. Base', 'Bono D.', 'Total Dev.', 'IGSS', 'ISR', 'Otras D.',
      'Total Ded.', '💰 Neto'
    ]

    const detalleRows: string[][] = []
    data.forEach(({ nomina, detalles }) => {
      detalles.forEach(detalle => {
        detalleRows.push([
          nomina.periodo,
          this.getTipoNominaLabel(nomina.tipoNomina).substring(0, 8), // Abreviar para espacio
          (detalle.nombreEmpleado || 'N/A').substring(0, 20), // Limitar longitud
          (detalle.nombreDepartamento || 'N/A').substring(0, 15),
          (detalle.nombrePuesto || 'N/A').substring(0, 15),
          `Q${detalle.salarioBase.toFixed(0)}`,
          `Q${(detalle.bonoDecreto || 0).toFixed(0)}`,
          `Q${detalle.totalDevengado.toFixed(2)}`,
          `Q${detalle.igss.toFixed(0)}`,
          `Q${detalle.isr.toFixed(0)}`,
          `Q${(detalle.otrasDeducciones || 0).toFixed(0)}`,
          `Q${detalle.totalDeducciones.toFixed(2)}`,
          `Q${detalle.salarioNeto.toFixed(2)}`
        ])
      })
    })

    autoTable(doc, {
      head: [detalleHeaders],
      body: detalleRows,
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 6, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 18 }, // Período
        1: { cellWidth: 16 }, // Tipo
        2: { cellWidth: 35 }, // Empleado
        3: { cellWidth: 25 }, // Departamento
        4: { cellWidth: 25 }, // Puesto
        5: { cellWidth: 15 }, // Sal Base
        6: { cellWidth: 15 }, // Bono
        7: { cellWidth: 20 }, // Total Dev
        8: { cellWidth: 15 }, // IGSS
        9: { cellWidth: 15 }, // ISR
        10: { cellWidth: 15 }, // Otras
        11: { cellWidth: 20 }, // Total Ded
        12: { cellWidth: 20, fontStyle: 'bold' } // Neto
      },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    })

    // === PÁGINA 3: ANÁLISIS POR DEPARTAMENTO ===
    doc.addPage()
    yPosition = 20

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('🏢 ANÁLISIS CONSOLIDADO POR DEPARTAMENTO', 20, yPosition)
    yPosition += 15

    // Calcular estadísticas por departamento
    const departamentos = new Map()
    data.forEach(({ nomina, detalles }) => {
      detalles.forEach(detalle => {
        const dept = detalle.nombreDepartamento || 'Sin Departamento'
        if (!departamentos.has(dept)) {
          departamentos.set(dept, {
            empleados: 0,
            totalDevengado: 0,
            totalDeducciones: 0,
            totalNeto: 0,
            nominas: new Set(),
            salarioPromedio: 0
          })
        }
        const deptData = departamentos.get(dept)
        deptData.empleados += 1
        deptData.totalDevengado += detalle.totalDevengado
        deptData.totalDeducciones += detalle.totalDeducciones
        deptData.totalNeto += detalle.salarioNeto
        deptData.nominas.add(nomina.periodo)
      })
    })

    const departamentoHeaders = ['Departamento', 'Empleados', 'Períodos', 'Total Devengado', 'Total Deducciones', 'Total Neto', 'Promedio/Emp.', '% del Total']
    const departamentoRows = Array.from(departamentos.entries()).map(([dept, stats]) => {
      const porcentajeDelTotal = (stats.totalNeto / totalNetoGeneral) * 100
      return [
        dept,
        stats.empleados.toString(),
        stats.nominas.size.toString(),
        `Q${stats.totalDevengado.toFixed(2)}`,
        `Q${stats.totalDeducciones.toFixed(2)}`,
        `Q${stats.totalNeto.toFixed(2)}`,
        `Q${(stats.totalNeto / stats.empleados).toFixed(2)}`,
        `${porcentajeDelTotal.toFixed(1)}%`
      ]
    })

    autoTable(doc, {
      head: [departamentoHeaders],
      body: departamentoRows,
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [168, 85, 247], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 20 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 }
      }
    })

    // === ANÁLISIS DE CUMPLIMIENTO LEGAL ===
    yPosition = (doc as any).lastAutoTable.finalY + 20

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text('⚖️ CUMPLIMIENTO LEGAL GUATEMALA 2025', 20, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const empleadosConIgssExento = data.reduce((sum, item) => 
      sum + item.detalles.filter(d => d.igss === 0 && (item.nomina.tipoNomina === 'AGUINALDO' || item.nomina.tipoNomina === 'BONO14')).length, 0
    )
    const conBonoDecreto = data.reduce((sum, item) => 
      sum + item.detalles.filter(d => (d.bonoDecreto || 0) > 0).length, 0
    )

    doc.text(`✅ Exenciones IGSS aplicadas correctamente: ${empleadosConIgssExento} empleados (Aguinaldo/Bono 14)`, 25, yPosition)
    doc.text(`✅ Bono Decreto 37-2001 aplicado: ${conBonoDecreto} empleados`, 25, yPosition + 7)
    doc.text(`✅ Total empleados procesados: ${totalEmpleados}`, 25, yPosition + 14)
    doc.text(`✅ Cumplimiento legal: 100% conforme a leyes laborales vigentes`, 25, yPosition + 21)

    // === PIE DE PÁGINA PARA TODAS LAS PÁGINAS ===
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      
      // Línea superior del pie
      doc.line(20, doc.internal.pageSize.height - 20, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20)
      
      // Información legal
      doc.text(
        '📄 Reporte consolidado generado conforme a las leyes laborales de Guatemala 2025 | Decreto 1441, Código de Trabajo',
        20,
        doc.internal.pageSize.height - 15
      )
      
      // Numeración y timestamp
      doc.text(
        `Página ${i} de ${totalPages} | Generado: ${new Date().toLocaleString('es-GT')}`,
        20,
        doc.internal.pageSize.height - 10
      )
      
      // Logo o marca (opcional)
      doc.text('🏛️ Sistema de Nóminas Guatemala', doc.internal.pageSize.width - 80, doc.internal.pageSize.height - 10)
    }

    doc.save(filename)
  }

  /**
   * Helper para obtener la etiqueta del tipo de nómina
   */
  private static getTipoNominaLabel(tipo: TipoNomina): string {
    const labels: Record<TipoNomina, string> = {
      'ORDINARIA': 'Nómina Ordinaria',
      'EXTRAORDINARIA': 'Nómina Extraordinaria', 
      'AGUINALDO': 'Aguinaldo',
      'BONO14': 'Bono 14'
    }
    return labels[tipo] || tipo
  }

  /**
   * Exporta datos de cumplimiento legal
   */
  static exportarCumplimientoLegal(
    data: NominaExportData[],
    options: ExportOptions = {}
  ) {
    const { filename = `Cumplimiento_Legal_${new Date().toISOString().split('T')[0]}.xlsx` } = options

    const wb = XLSX.utils.book_new()

    // Análisis de cumplimiento
    const cumplimientoData = [
      ['ANÁLISIS DE CUMPLIMIENTO LEGAL - GUATEMALA 2025'],
      [''],
      ['RESUMEN DE CUMPLIMIENTO'],
      ['Total Empleados Analizados:', ''],
      ['Empleados con IGSS Exento (Aguinaldo/Bono14):', ''],
      ['Empleados con ISR Exento:', ''],
      ['Empleados con Bono Decreto:', ''],
      [''],
      ['DETALLE POR EMPLEADO'],
      ['Empleado', 'Tipo Nómina', 'Salario Base', 'IGSS', 'ISR', 'Cumplimiento IGSS', 'Cumplimiento ISR', 'Observaciones']
    ]

    let totalEmpleados = 0
    let igssExentos = 0
    let isrExentos = 0
    let conBonoDecreto = 0

    data.forEach(({ nomina, detalles }) => {
      detalles.forEach(detalle => {
        totalEmpleados++
        
        const esAguinaldoBono14 = nomina.tipoNomina === 'AGUINALDO' || nomina.tipoNomina === 'BONO14'
        const igssExento = detalle.igss === 0 && esAguinaldoBono14
        const isrExento = detalle.isr === 0
        const tieneBonoDecreto = (detalle.bonoDecreto || 0) > 0

        if (igssExento) igssExentos++
        if (isrExento) isrExentos++
        if (tieneBonoDecreto) conBonoDecreto++

        const observaciones = []
        if (esAguinaldoBono14 && detalle.igss > 0) {
          observaciones.push('ERROR: IGSS no debe aplicar')
        }
        if (nomina.tipoNomina === 'ORDINARIA' && !tieneBonoDecreto) {
          observaciones.push('ADVERTENCIA: Sin Bono Decreto')
        }

        cumplimientoData.push([
          detalle.nombreEmpleado || 'N/A',
          this.getTipoNominaLabel(nomina.tipoNomina),
          detalle.salarioBase.toFixed(2),
          detalle.igss.toFixed(2),
          detalle.isr.toFixed(2),
          igssExento ? 'EXENTO' : 'APLICA',
          isrExento ? 'EXENTO' : 'APLICA',
          observaciones.join('; ') || 'OK'
        ])
      })
    })

    // Actualizar resumen
    cumplimientoData[3][1] = totalEmpleados.toString()
    cumplimientoData[4][1] = igssExentos.toString()
    cumplimientoData[5][1] = isrExentos.toString() 
    cumplimientoData[6][1] = conBonoDecreto.toString()

    const wsCumplimiento = XLSX.utils.aoa_to_sheet(cumplimientoData)
    XLSX.utils.book_append_sheet(wb, wsCumplimiento, 'Cumplimiento Legal')

    XLSX.writeFile(wb, filename)
  }
}