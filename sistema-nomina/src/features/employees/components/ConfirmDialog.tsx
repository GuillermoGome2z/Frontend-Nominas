// src/features/employees/components/ConfirmDialog.tsx

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  title?: string
  description?: string
  onCancel?: () => void
  onConfirm?: () => void
}

export default function ConfirmDialog({
  open,
  setOpen,
  title = 'Confirmar',
  description,
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? "confirm-dialog-desc" : undefined}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          setOpen(false)
          onCancel?.()
        }}
        aria-hidden="true"
      />
      {/* dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="confirm-dialog-title" className="text-lg font-semibold">{title}</h3>
        {description && (
          <p id="confirm-dialog-desc" className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border px-4 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => {
              setOpen(false)
              onCancel?.()
            }}
            aria-label="Cancelar acción"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            onClick={() => {
              setOpen(false)
              onConfirm?.()
            }}
            aria-label="Confirmar eliminación"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
