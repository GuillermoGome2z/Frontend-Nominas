import { 
  useNominasWithFilters, 
  useNominaStats
} from './hooks'

export default function PayrollListPage() {
  // Datos principales
  const {
    data: nominasData,
    error: nominasError
  } = useNominasWithFilters({
    page: 1,
    pageSize: 10
  })

  const {
    error: statsError
  } = useNominaStats()

  // Detectar errores de conectividad
  const hasConnectionError = (nominasError as any)?.code === 'ERR_NETWORK' || 
                           (statsError as any)?.code === 'ERR_NETWORK'

  const is404Error = (nominasError as any)?.response?.status === 404 ||
                    (statsError as any)?.response?.status === 404

  if (hasConnectionError) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <h1 className="text-2xl font-bold mb-2">Error de Conexión</h1>
        <p>No se pudo conectar con el servidor.</p>
      </div>
    )
  }

  if (is404Error) {
    return (
      <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
        <h1 className="text-2xl font-bold mb-2">Recurso No Encontrado</h1>
        <p>El endpoint solicitado no existe.</p>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
      <h1 className="text-2xl font-bold mb-2">Nómina</h1>
      <p>Aquí se mostrará el listado de pagos y planillas.</p>
      {nominasData && <p className="text-sm text-gray-500 mt-2">Total de registros: {nominasData.meta?.total || 0}</p>}
    </div>
  )
}
