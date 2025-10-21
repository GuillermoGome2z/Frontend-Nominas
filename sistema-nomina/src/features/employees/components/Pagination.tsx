export default function Pagination({
  page, pageSize, total, onPageChange,
}: { page: number; pageSize: number; total: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm text-gray-500">Total: {total} • Página {page} de {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-2 rounded-lg border disabled:opacity-50">Anterior</button>
        <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-2 rounded-lg border disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  );
}