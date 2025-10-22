import { useToast } from './ToastContext'

export default function ToastContainer() {
  const { toasts, remove } = useToast()
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-4 top-4 z-[1000] flex w-[min(92vw,420px)] flex-col gap-2"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          role="alert"
          className={[
            'rounded-2xl p-3 shadow-lg border',
            t.kind === 'success' && 'bg-green-50 border-green-200',
            t.kind === 'info' && 'bg-blue-50 border-blue-200',
            t.kind === 'warning' && 'bg-yellow-50 border-yellow-200',
            t.kind === 'error' && 'bg-red-50 border-red-200'
          ].filter(Boolean).join(' ')}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              {t.title && <p className="font-semibold">{t.title}</p>}
              <p className="text-sm">{t.message}</p>
            </div>
            <button
              aria-label="Cerrar notificación"
              className="rounded p-1 hover:bg-black/5"
              onClick={() => remove(t.id)}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
