import { useState } from 'react'
import { 
  useNominasWithFilters, 
  useNominaStats, 
  formatCurrency 
} from './hooks'
import PayrollTable from './components/PayrollTable'
import PayrollFilters from './components/PayrollFilters'
import PayrollGenerationModal from './components/PayrollGenerationModal'
import { StatCard } from '@/components/ui/StatCard'

export default function PayrollListPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  
  // Datos principales
  const {
    data: nominasData,
    isLoading: nominasLoading,
    error: nominasError,
    filters,
    updateFilters,
    resetFilters,
    activeFiltersCount
  } = useNominasWithFilters({
    page: 1,
    pageSize: 10
  })

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useNominaStats()

  const nominas = nominasData?.data ?? []
  const pagination = nominasData?.meta

  // Handlers
  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  const handlePageSizeChange = (pageSize: number) => {
    updateFilters({ page: 1, pageSize })
  }

  // Detectar errores de conectividad
  const hasConnectionError = (nominasError as any)?.code === 'ERR_NETWORK' || 
                           (statsError as any)?.code === 'ERR_NETWORK'

  const is404Error = (nominasError as any)?.response?.status === 404 ||
                    (statsError as any)?.response?.status === 404

  return (
    <div style={{ paddingTop: 'calc(var(--topbar-height, 64px) + 32px)' }} className="mx-auto max-w-6xl p-3 sm:p-6">
      <h1 className="text-2xl font-bold mb-2">Nómina</h1>
      <p>Aquí se mostrará el listado de pagos y planillas.</p>
    </div>
  )
}
