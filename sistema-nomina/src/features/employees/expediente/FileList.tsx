import { useEmployeeDocs, useDeleteEmployeeDoc } from '../hooks';
import type { EmployeeDocDTO } from '../api';

export default function FileList({ empleadoId }: { empleadoId: number }) {
  const { data, isLoading, isError, refetch } = useEmployeeDocs(empleadoId);
  const del = useDeleteEmployeeDoc(empleadoId);

  if (isLoading) return <p>Cargando documentos…</p>;
  if (isError) return <p className="text-rose-600">Error al cargar documentos.</p>;

  const rows: EmployeeDocDTO[] = data?.data ?? [];

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-gray-500">
        Aún no hay documentos.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Tipo</th>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d: EmployeeDocDTO) => (
            <tr key={d.id} className="odd:bg-gray-50/30">
              <td className="px-4 py-3">{d.nombreOriginal}</td>
              <td className="px-4 py-3">{d.nombreTipo ?? d.tipoDocumentoId}</td>
              <td className="px-4 py-3">
                {d.fechaSubida ? new Date(d.fechaSubida).toLocaleString() : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    onClick={() => d.rutaArchivo && window.open(d.rutaArchivo, '_blank', 'noopener,noreferrer')}
                    aria-label={`Abrir ${d.nombreOriginal}`}
                  >
                    Abrir
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50"
                    onClick={() => del.mutate(d.id, { onSuccess: () => refetch() })}
                    aria-label={`Eliminar ${d.nombreOriginal}`}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2 text-sm text-gray-500">Total: {data?.meta.total ?? 0}</p>
    </div>
  );
}
