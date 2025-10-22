import { useRef, useState } from 'react'
import { useUploadEmployeeDoc } from '../hooks'

type Props = { empleadoId: number }

export default function UploadDialog({ empleadoId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [tipoDocumentoId, setTipoDocumentoId] = useState<number>(1)
  const up = useUploadEmployeeDoc(empleadoId)

  const submit = () => {
    const file = inputRef.current?.files?.[0]
    if (!file) return
    up.mutate(
      { file, tipoDocumentoId },
      {
        onSuccess: () => {
          // limpia el input para permitir volver a seleccionar el mismo archivo si se desea
          if (inputRef.current) inputRef.current.value = ''
          alert('Archivo subido.')
        },
        onError: (e: any) => {
          const status = e?.response?.status ?? e?.status
          if (status === 413) alert('Archivo demasiado grande (413).')
          else if (status === 422) alert('Validación rechazada (422). Verifica tipo/tamaño.')
          else alert('Error al subir el archivo.')
        },
      }
    )
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input type="file" ref={inputRef} aria-label="Seleccionar archivo" />
      <input
        type="number"
        className="w-28 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={tipoDocumentoId}
        onChange={(e) => setTipoDocumentoId(Number(e.target.value) || 1)}
        aria-label="Tipo de documento"
      />
      <button
        type="button"
        onClick={submit}
        disabled={up.isPending}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {up.isPending ? 'Subiendo…' : 'Subir'}
      </button>
    </div>
  )
}
