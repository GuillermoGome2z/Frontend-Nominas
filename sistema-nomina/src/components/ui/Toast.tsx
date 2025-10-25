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
            className={`rounded-2xl px-6 py-4 text-sm font-medium shadow-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105 animate-in slide-in-from-right-5 fade-in-0
              ${t.tone === 'success' 
                ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200/50 text-emerald-800 shadow-emerald-500/20' 
                : t.tone === 'error' 
                ? 'bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-200/50 text-rose-800 shadow-rose-500/20' 
                : t.tone === 'warning' 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/50 text-amber-800 shadow-amber-500/20' 
                : 'bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200/50 text-sky-800 shadow-sky-500/20'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`text-lg
                ${t.tone === 'success' ? '🎉' : 
                  t.tone === 'error' ? '⚠️' : 
                  t.tone === 'warning' ? '⚠️' : 
                  'ℹ️'}
              `}>
                {t.tone === 'success' ? '🎉' : 
                 t.tone === 'error' ? '❌' : 
                 t.tone === 'warning' ? '⚠️' : 
                 'ℹ️'}
              </span>
              <span className="flex-1 leading-relaxed">{t.message}</span>
            </div>
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
