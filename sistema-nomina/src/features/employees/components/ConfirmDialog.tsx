
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          setOpen(false)
          onCancel?.()
        }}
      />
      {/* dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-xl border px-4 py-2"
            onClick={() => {
              setOpen(false)
              onCancel?.()
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="rounded-xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
            onClick={() => {
              setOpen(false)
              onConfirm?.()
            }}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
