import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AlertProvider } from '../components/ui/AlertContext'

const queryClient = new QueryClient()

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        {children}
      </AlertProvider>
    </QueryClientProvider>
  )
}
