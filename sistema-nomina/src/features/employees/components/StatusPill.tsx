

type Props = {
  /** Puede venir como string (ACTIVO...) o incluso number; lo normalizamos a string */
  value?: string | number | null;
};

export default function StatusPill({ value }: Props) {
  const key = String(value ?? '');
  const classesByStatus: Record<string, string> = {
    ACTIVO: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    SUSPENDIDO: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    RETIRADO: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  };

  const cls = classesByStatus[key] ?? 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
      {key || '—'}
    </span>
  );
}
