/**
 * utils/export.ts
 * Utilidades para exportar reportes de puestos a PDF y Excel
 */

import { api } from '../../../lib/api'
import type { PositionFilters } from '../types/Position'

/**
 * Descarga el reporte de puestos en formato PDF
 */
export async function exportPositionsPDF(filters?: PositionFilters): Promise<void> {
  try {
    const params = new URLSearchParams()
    
    if (filters?.q) params.set('q', filters.q)
    if (typeof filters?.departamentoId === 'number') params.set('departamentoId', String(filters.departamentoId))
    if (typeof filters?.activo === 'boolean') params.set('activo', String(filters.activo))
    if (typeof filters?.salarioMin === 'number') params.set('salarioMin', String(filters.salarioMin))
    if (typeof filters?.salarioMax === 'number') params.set('salarioMax', String(filters.salarioMax))

    const queryString = params.toString()
    const url = `/reportes/puestos.pdf${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url, {
      responseType: 'blob'
    })

    // Crear URL del blob y descargar
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Puestos_${new Date().toISOString().split('T')[0]}.pdf`
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
 * Descarga el reporte de puestos en formato Excel
 */
export async function exportPositionsExcel(filters?: PositionFilters): Promise<void> {
  try {
    const params = new URLSearchParams()
    
    if (filters?.q) params.set('q', filters.q)
    if (typeof filters?.departamentoId === 'number') params.set('departamentoId', String(filters.departamentoId))
    if (typeof filters?.activo === 'boolean') params.set('activo', String(filters.activo))
    if (typeof filters?.salarioMin === 'number') params.set('salarioMin', String(filters.salarioMin))
    if (typeof filters?.salarioMax === 'number') params.set('salarioMax', String(filters.salarioMax))

    const queryString = params.toString()
    const url = `/reportes/puestos.xlsx${queryString ? `?${queryString}` : ''}`
    
    const response = await api.get(url, {
      responseType: 'blob'
    })

    // Crear URL del blob y descargar
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Puestos_${new Date().toISOString().split('T')[0]}.xlsx`
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
 * Previsualiza el PDF de un puesto específico
 */
export async function previewPositionPDF(positionId: number): Promise<string> {
  try {
    const response = await api.get(`/reportes/puestos/${positionId}.pdf`, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    return window.URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error previewing PDF:', error)
    throw error
  }
}
