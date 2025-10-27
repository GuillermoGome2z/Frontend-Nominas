import { api } from '../../lib/api'

/* ======================= REGLAS LABORALES GUATEMALA 2025 ======================= */

// DTO para Reglas Laborales
export interface ReglasLaboralesDTO {
  id: number
  pais: string
  vigenciaDesde: string
  vigenciaHasta?: string
  igssEmpleadoPorcentaje: number
  igssPatronalPorcentaje: number
  irtraPorcentaje: number
  intecapPorcentaje: number
  horasExtrasPorcentaje: number
  horasNocturnasPorcentaje: number
  bonoDecretoMonto: number
  salarioMinimo: number
  isrEscalaJson: string
  isrExencionBase: number
  activo: boolean
  createdAt: string
  updatedAt: string
}

// Escala ISR deserializada
export interface IsrTramo {
  desde: number
  hasta?: number // undefined = infinito
  tasa: number
}

// Mapper para Reglas Laborales
function mapReglasLaborales(x: any): ReglasLaboralesDTO {
  return {
    id: x.id ?? x.Id ?? 0,
    pais: x.pais ?? x.Pais ?? '',
    vigenciaDesde: x.vigenciaDesde ?? x.VigenciaDesde ?? '',
    vigenciaHasta: x.vigenciaHasta ?? x.VigenciaHasta,
    igssEmpleadoPorcentaje: Number(x.igssEmpleadoPorcentaje ?? x.IgssEmpleadoPorcentaje ?? 0),
    igssPatronalPorcentaje: Number(x.igssPatronalPorcentaje ?? x.IgssPatronalPorcentaje ?? 0),
    irtraPorcentaje: Number(x.irtraPorcentaje ?? x.IrtraPorcentaje ?? 0),
    intecapPorcentaje: Number(x.intecapPorcentaje ?? x.IntecapPorcentaje ?? 0),
    horasExtrasPorcentaje: Number(x.horasExtrasPorcentaje ?? x.HorasExtrasPorcentaje ?? 0),
    horasNocturnasPorcentaje: Number(x.horasNocturnasPorcentaje ?? x.HorasNocturnasPorcentaje ?? 0),
    bonoDecretoMonto: Number(x.bonoDecretoMonto ?? x.BonoDecretoMonto ?? 0),
    salarioMinimo: Number(x.salarioMinimo ?? x.SalarioMinimo ?? 0),
    isrEscalaJson: x.isrEscalaJson ?? x.IsrEscalaJson ?? '[]',
    isrExencionBase: Number(x.isrExencionBase ?? x.IsrExencionBase ?? 0),
    activo: x.activo ?? x.Activo ?? false,
    createdAt: x.createdAt ?? x.CreatedAt ?? '',
    updatedAt: x.updatedAt ?? x.UpdatedAt ?? ''
  }
}

// Obtener las reglas laborales activas
export async function getReglasLaborales(): Promise<ReglasLaboralesDTO> {
  const res = await api.get('/reglas-laborales/activa')
  return mapReglasLaborales(res.data)
}

// Obtener todas las reglas laborales (historial)
export async function getAllReglasLaborales(): Promise<ReglasLaboralesDTO[]> {
  const res = await api.get('/reglas-laborales')
  return (res.data ?? []).map(mapReglasLaborales)
}

// Helper para parsear la escala ISR
export function parseIsrEscala(json: string): IsrTramo[] {
  try {
    const data = JSON.parse(json)
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// Helper para formatear porcentajes
export function formatPorcentaje(valor: number): string {
  return `${valor.toFixed(2)}%`
}

// Helper para formatear moneda (Quetzales)
export function formatQuetzales(monto: number): string {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(monto)
}
