/**
 * utils/export.ts
 * Utilidades para exportar recibos y reportes de nómina
 */

import { api } from '@/lib/api'
import type { PayrollPeriodFilters } from '../types/Payroll'

/**
 * Descarga el recibo de nómina de un empleado en PDF
 */
export async function downloadReceipt(periodoId: number, empleadoId: number): Promise<void> {
  try {
    const response = await api.get(`/nomina/recibos/${periodoId}/${empleadoId}.pdf`, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Recibo_${periodoId}_${empleadoId}_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error descargando recibo:', error)
    throw error
  }
}

/**
 * Previsualiza el recibo de nómina en una nueva ventana
 */
export async function previewReceipt(periodoId: number, empleadoId: number): Promise<string> {
  try {
    const response = await api.get(`/nomina/recibos/${periodoId}/${empleadoId}.pdf`, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    return window.URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error previsualizando recibo:', error)
    throw error
  }
}

/**
 * Descarga el reporte completo de nómina en PDF
 */
export async function exportPayrollPDF(periodoId: number, filters?: PayrollPeriodFilters): Promise<void> {
  try {
    const params = new URLSearchParams()
    params.set('periodoId', String(periodoId))
    
    if (filters?.q) params.set('q', filters.q)
    if (filters?.tipo) params.set('tipo', filters.tipo)
    if (filters?.estado) params.set('estado', filters.estado)

    const queryString = params.toString()
    const url = `/nomina/reportes.pdf${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Nomina_Reporte_${periodoId}_${new Date().toISOString().split('T')[0]}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error exportando PDF:', error)
    throw error
  }
}

/**
 * Descarga el reporte completo de nómina en Excel
 */
export async function exportPayrollExcel(periodoId: number, filters?: PayrollPeriodFilters): Promise<void> {
  try {
    const params = new URLSearchParams()
    params.set('periodoId', String(periodoId))
    
    if (filters?.q) params.set('q', filters.q)
    if (filters?.tipo) params.set('tipo', filters.tipo)
    if (filters?.estado) params.set('estado', filters.estado)

    const queryString = params.toString()
    const url = `/nomina/reportes.xlsx${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Nomina_Reporte_${periodoId}_${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error exportando Excel:', error)
    throw error
  }
}

/**
 * Descarga todos los recibos de un periodo en un archivo ZIP
 */
export async function downloadAllReceipts(periodoId: number): Promise<void> {
  try {
    const response = await api.get(`/nomina/recibos/${periodoId}/todos.zip`, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Recibos_Periodo_${periodoId}_${new Date().toISOString().split('T')[0]}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error descargando recibos:', error)
    throw error
  }
}
