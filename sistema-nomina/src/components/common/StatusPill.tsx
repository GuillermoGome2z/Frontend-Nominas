

type Props = {
  value: string | boolean | null | undefined
  labelMap?: Record<string, string>   // Ej: { ACTIVO: 'Activo', INACTIVO: 'Inactivo' }
}

/**
 * Muestra una pequeña etiqueta con color dependiendo del estado.
 * 
 * Uso:
 *  <StatusPill value={empleado.estadoLaboral} />
 *  <StatusPill value={departamento.activo} />
 */
export default function StatusPill({ value, labelMap }: Props) {
  if (value === null || value === undefined)
    return <span className="inline-flex rounded-full border px-2 py-0.5 text-xs text-gray-400">—</span>

  let text = ''
  let colorClass = ''

  // Normalizamos el valor
  const v = typeof value === 'string' ? value.trim().toUpperCase() : value

  if (typeof v === 'boolean') {
    text = v ? 'Activo' : 'Inactivo'
    colorClass = v
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-gray-50 text-gray-600 border-gray-200'
  } else if (typeof v === 'string') {
    const mapped = labelMap?.[v] ?? v
    text = mapped.charAt(0).toUpperCase() + mapped.slice(1).toLowerCase()
    switch (v) {
      case 'ACTIVO':
        colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'
        break
      case 'INACTIVO':
      case 'SUSPENDIDO':
        colorClass = 'bg-gray-50 text-gray-600 border-gray-200'
        break
      case 'VACACIONES':
        colorClass = 'bg-amber-50 text-amber-700 border-amber-200'
        break
      case 'LICENCIA':
        colorClass = 'bg-sky-50 text-sky-700 border-sky-200'
        break
      default:
        colorClass = 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {text}
    </span>
  )
}
