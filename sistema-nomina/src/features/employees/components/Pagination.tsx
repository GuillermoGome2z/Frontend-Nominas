type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
};

export default function Pagination({ page, pageSize, total, onPageChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm text-gray-500">
        Total: {total} • Página {page} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={prev}
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          disabled={page >= totalPages}
          onClick={next}
          className="rounded-lg border px-3 py-2 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
