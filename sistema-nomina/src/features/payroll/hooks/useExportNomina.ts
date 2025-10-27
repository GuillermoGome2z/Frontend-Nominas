import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { ExportService } from '../../../services/exportService'
import { useToast } from '../../../components/ui/Toast'
import type { NominaDTO, NominaDetalleDTO } from '../api'

// Tipos para el hook
interface ExportOptions {
  filename?: string
  format?: 'excel' | 'pdf'
}

interface NominaExportData {
  nomina: NominaDTO
  detalles: NominaDetalleDTO[]
}

export function useExportNomina() {
  const [isExporting, setIsExporting] = useState(false)
  const { success, error } = useToast()

  /**
   * Exporta una nómina individual (por empleado)
   */
  const exportarIndividual = useMutation({
    mutationFn: async ({
      nomina,
      detalle,
      format = 'excel',
      options = {}
    }: {
      nomina: NominaDTO
      detalle: NominaDetalleDTO
      format?: 'excel' | 'pdf'
      options?: ExportOptions
    }) => {
      setIsExporting(true)
      
      try {
        if (format === 'excel') {
          ExportService.exportarNominaIndividualExcel(nomina, detalle, options)
        } else {
          ExportService.exportarNominaIndividualPDF(nomina, detalle, options)
        }
        
        return { success: true, format }
      } catch (error) {
        throw error
      } finally {
        setIsExporting(false)
      }
    },
    onSuccess: (data) => {
      const formatLabel = data.format === 'excel' ? 'Excel' : 'PDF'
      success(`Nomina individual exportada en ${formatLabel}`)
    },
    onError: (errorMsg: Error) => {
      error(`Error al exportar nómina individual: ${errorMsg.message}`)
    }
  })

  /**
   * Exporta múltiples nóminas (reporte general)
   */
  const exportarGeneral = useMutation({
    mutationFn: async ({
      data,
      format = 'excel',
      options = {}
    }: {
      data: NominaExportData[]
      format?: 'excel' | 'pdf'
      options?: ExportOptions
    }) => {
      setIsExporting(true)
      
      try {
        if (data.length === 0) {
          throw new Error('No hay datos para exportar')
        }

        if (format === 'excel') {
          ExportService.exportarNominaGeneralExcel(data, options)
        } else {
          ExportService.exportarNominaGeneralPDF(data, options)
        }
        
        return { success: true, format, count: data.length }
      } catch (error) {
        throw error
      } finally {
        setIsExporting(false)
      }
    },
    onSuccess: (data) => {
      const formatLabel = data.format === 'excel' ? 'Excel' : 'PDF'
      success(`Reporte consolidado exportado en ${formatLabel} - ${data.count} nominas - Guatemala 2025`)
    },
    onError: (errorMsg: Error) => {
      error(`Error al exportar nóminas: ${errorMsg.message}`)
    }
  })

  /**
   * Exporta reporte de cumplimiento legal
   */
  const exportarCumplimiento = useMutation({
    mutationFn: async ({
      data,
      options = {}
    }: {
      data: NominaExportData[]
      options?: ExportOptions
    }) => {
      setIsExporting(true)
      
      try {
        if (data.length === 0) {
          throw new Error('No hay datos para analizar cumplimiento')
        }

        ExportService.exportarCumplimientoLegal(data, options)
        
        return { success: true, count: data.length }
      } catch (error) {
        throw error
      } finally {
        setIsExporting(false)
      }
    },
    onSuccess: (data) => {
      success(`Reporte de cumplimiento legal generado - ${data.count} nominas analizadas - Guatemala 2025`)
    },
    onError: (errorMsg: Error) => {
      error(`Error al generar reporte de cumplimiento: ${errorMsg.message}`)
    }
  })

  /**
   * Función helper para exportar una nómina individual en ambos formatos
   */
  const exportarIndividualCompleto = async (
    nomina: NominaDTO,
    detalle: NominaDetalleDTO,
    options: ExportOptions = {}
  ) => {
    try {
      setIsExporting(true)
      
      // Exportar en Excel
      await exportarIndividual.mutateAsync({
        nomina,
        detalle,
        format: 'excel',
        options: {
          ...options,
          filename: options.filename ? 
            options.filename.replace(/\.(xlsx|pdf)$/, '.xlsx') : 
            undefined
        }
      })
      
      // Esperar un momento entre exportaciones
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Exportar en PDF
      await exportarIndividual.mutateAsync({
        nomina,
        detalle,
        format: 'pdf',
        options: {
          ...options,
          filename: options.filename ? 
            options.filename.replace(/\.(xlsx|pdf)$/, '.pdf') : 
            undefined
        }
      })

      success('Nomina individual exportada en Excel y PDF')
      
    } catch (err) {
      error('Error al exportar nomina individual completa')
    } finally {
      setIsExporting(false)
    }
  }

  /**
   * Función helper para exportar reporte general en ambos formatos
   */
  const exportarGeneralCompleto = async (
    data: NominaExportData[],
    options: ExportOptions = {}
  ) => {
    try {
      setIsExporting(true)
      
      // Exportar en Excel
      await exportarGeneral.mutateAsync({
        data,
        format: 'excel',
        options: {
          ...options,
          filename: options.filename ? 
            options.filename.replace(/\.(xlsx|pdf)$/, '.xlsx') : 
            undefined
        }
      })
      
      // Esperar un momento entre exportaciones
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Exportar en PDF
      await exportarGeneral.mutateAsync({
        data,
        format: 'pdf',
        options: {
          ...options,
          filename: options.filename ? 
            options.filename.replace(/\.(xlsx|pdf)$/, '.pdf') : 
            undefined
        }
      })

      success(`Reporte consolidado exportado en Excel y PDF - ${data.length} nominas - Listo para produccion`)
      
    } catch (err) {
      error('Error al exportar reporte consolidado completo')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    // Estados
    isExporting: isExporting || exportarIndividual.isPending || exportarGeneral.isPending || exportarCumplimiento.isPending,
    
    // Mutaciones individuales
    exportarIndividual: exportarIndividual.mutateAsync,
    exportarGeneral: exportarGeneral.mutateAsync,
    exportarCumplimiento: exportarCumplimiento.mutateAsync,
    
    // Funciones helper completas
    exportarIndividualCompleto,
    exportarGeneralCompleto,
    
    // Estados de las mutaciones
    isExportingIndividual: exportarIndividual.isPending,
    isExportingGeneral: exportarGeneral.isPending,
    isExportingCumplimiento: exportarCumplimiento.isPending,
    
    // Errores
    errorIndividual: exportarIndividual.error,
    errorGeneral: exportarGeneral.error,
    errorCumplimiento: exportarCumplimiento.error
  }
}

/**
 * Hook específico para exportar múltiples empleados de una nómina
 */
export function useExportNominaMultiple() {
  const { success, error } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const exportarMultiplesEmpleados = async (
    nomina: NominaDTO,
    detalles: NominaDetalleDTO[],
    format: 'excel' | 'pdf' = 'excel'
  ) => {
    if (detalles.length === 0) {
      error('No hay empleados para exportar')
      return
    }

    setIsExporting(true)

    try {
      let successCount = 0
      let errorCount = 0

      for (const detalle of detalles) {
        try {
          if (format === 'excel') {
            ExportService.exportarNominaIndividualExcel(nomina, detalle)
          } else {
            ExportService.exportarNominaIndividualPDF(nomina, detalle)
          }
          successCount++
          
          // Pequeña pausa entre exportaciones para evitar bloqueo del UI
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          errorCount++
          console.error(`Error exportando empleado ${detalle.nombreEmpleado}:`, error)
        }
      }

      if (successCount > 0) {
        success(`${successCount} nóminas individuales exportadas exitosamente${errorCount > 0 ? ` (${errorCount} errores)` : ''}`)
      }

      if (errorCount === detalles.length) {
        throw new Error('No se pudo exportar ninguna nómina')
      }

    } catch (err) {
      error(`Error al exportar nóminas múltiples: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportarMultiplesEmpleados,
    isExporting
  }
}