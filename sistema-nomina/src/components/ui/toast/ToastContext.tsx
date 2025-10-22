import { createContext, useContext, useMemo, useState, useCallback} from 'react'
import type { ReactNode } from 'react'
type ToastKind = 'success' | 'info' | 'warning' | 'error'

export interface ToastItem {
  id: string
  title?: string
  message: string
  kind: ToastKind
  durationMs?: number
}

interface ToastContextValue {
  toasts: ToastItem[]
  show: (t: Omit<ToastItem, 'id'>) => void
  remove: (id: string) => void
  success: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const remove = useCallback((id: string) => {
    setToasts((curr) => curr.filter(t => t.id !== id))
  }, [])

  const show = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    const duration = t.durationMs ?? 4000
    const item: ToastItem = { id, ...t }
    setToasts(curr => [...curr, item])
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
  }, [remove])

  const api = useMemo<ToastContextValue>(() => ({
    toasts,
    show,
    remove,
    success: (message, title) => show({ message, title, kind: 'success' }),
    info: (message, title) => show({ message, title, kind: 'info' }),
    warning: (message, title) => show({ message, title, kind: 'warning' }),
    error: (message, title) => show({ message, title, kind: 'error' }),
  }), [toasts, show, remove])

  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
