import { useEmployeeDocs, useDeleteEmployeeDoc } from '../hooks'
import type { EmployeeDocDTO } from '../api' // <-- importa desde ./api, no desde ../types
import { getEmployeeDocSignedUrl } from '../api' // para pedir la SAS URL

export default function FileList({ empleadoId }: { empleadoId: number }) {
  const { data, isLoading, isError, refetch } = useEmployeeDocs(empleadoId)
  const del = useDeleteEmployeeDoc(empleadoId)

  if (isLoading) return <p>Cargando documentos…</p>
  if (isError) return <p className="text-rose-600">Error al cargar documentos.</p>

  const rows: EmployeeDocDTO[] = data?.data ?? []
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-gray-500">
        Aún no hay documentos.
      </div>
    )
  }

  const abrirDocumento = async (docId: number) => {
    try {
      const sas = await getEmployeeDocSignedUrl(empleadoId, docId, 10, false)
      if (sas?.url) window.open(sas.url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      alert('No se pudo abrir el documento.')
    }
  }

  return (
    <div className="mt-2 overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} className="odd:bg-gray-50/30">
              <td className="px-4 py-2">{d.nombreOriginal ?? '—'}</td>
              <td className="px-4 py-2">{d.nombreTipo ?? d.tipoDocumentoId}</td>
              <td className="px-4 py-2">
                {d.fechaSubida ? new Date(d.fechaSubida).toLocaleString('es-GT') : '—'}
              </td>
              <td className="px-4 py-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                    onClick={() => abrirDocumento(d.id)}
                  >
                    Abrir
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border px-3 py-1 text-rose-600 hover:bg-rose-50"
                    onClick={() =>
                      del.mutate(d.id, {
                        onSuccess: () => refetch(),
                        onError: () => alert('No se pudo eliminar.'),
                      })
                    }
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
  )
}
