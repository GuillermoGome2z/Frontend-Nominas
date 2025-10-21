import { useQuery } from '@tanstack/react-query'
import { getKpis, type Kpis } from './api'

export function useKpis() {
  return useQuery<Kpis>({
    queryKey: ['dashboard', 'kpis'],
    queryFn: getKpis,
    staleTime: 60_000, // 1 min: evita refetch excesivo
    refetchOnWindowFocus: false,
  })
}
