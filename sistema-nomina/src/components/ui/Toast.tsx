import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

// ===== Tipos =====
type ToastTone = 'info' | 'success' | 'error' | 'warning'
interface Toast {
  id: number
  message: string
  tone: ToastTone
}

// Lo que expondrá el contexto
interface ToastContextValue {
  push: (message: string, tone?: ToastTone) => void
  success: (message: string) => void
  info: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
}

// ===== Contexto =====
const ToastCtx = createContext<ToastContextValue | null>(null)

// ===== Provider =====
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setItems(prev => prev.filter(t => t.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = Date.now() + Math.random()
      setItems(prev => [...prev, { id, message, tone }])
      setTimeout(() => remove(id), 3500)
    },
    [remove]
  )

  // Helpers para atajos
  const ctxValue: ToastContextValue = {
    push,
    success: msg => push(msg, 'success'),
    info: msg => push(msg, 'info'),
    error: msg => push(msg, 'error'),
    warning: msg => push(msg, 'warning'),
  }

  return (
    <ToastCtx.Provider value={ctxValue}>
      {children}
      {/* Contenedor de toasts */}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-[min(92vw,420px)] flex-col gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map(t => (
          <div
            key={t.id}
            role="alert"
            className={`rounded-xl border px-4 py-2 text-sm shadow bg-white transition-all
              ${t.tone === 'success' ? 'border-emerald-200 text-emerald-700' :
                t.tone === 'error' ? 'border-rose-200 text-rose-700' :
                t.tone === 'warning' ? 'border-amber-200 text-amber-700' :
                'border-sky-200 text-sky-700'}
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

// ===== Hook =====
export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider />')
  return ctx
}
