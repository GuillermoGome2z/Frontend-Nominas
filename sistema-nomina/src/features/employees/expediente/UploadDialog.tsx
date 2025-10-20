import { useRef, useState } from 'react';
import { useUploadEmployeeDoc } from '../hooks';

type Props = { empleadoId: number };

export default function UploadDialog({ empleadoId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tipo, setTipo] = useState<number>(1);
  const up = useUploadEmployeeDoc(empleadoId);

  const submit = () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;
    up.mutate({ file, tipoDocumentoId: tipo }, {
      onError: (e: any) => {
        if (e?.status === 413) alert('Archivo demasiado grande (413).');
        else if (e?.status === 422) alert('Tipo/MIME inválido (422).');
        else alert(e?.message ?? 'Error al subir documento.');
      },
    });
  };

  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="file"
        ref={inputRef}
        aria-label="Seleccionar archivo"
        className="w-full max-w-sm rounded-xl border px-3 py-2"
      />
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Tipo:</label>
        <input
          type="number"
          value={tipo}
          onChange={(e) => setTipo(Number(e.target.value))}
          className="w-28 rounded-xl border px-3 py-2"
          aria-label="Tipo de documento"
        />
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={up.isPending}
        className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {up.isPending ? 'Subiendo…' : 'Subir'}
      </button>
    </div>
  );
}
