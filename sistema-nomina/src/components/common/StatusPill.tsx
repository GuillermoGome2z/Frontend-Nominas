// src/components/common/StatusPill.tsx
type Props =
  | { value: boolean; labelTrue?: string; labelFalse?: string }
  | { value: string | null | undefined };

export default function StatusPill(props: Props) {
  const base =
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium';
  if (typeof (props as any).value === 'boolean') {
    const v = (props as any).value as boolean;
    const cls = v
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-gray-200 bg-gray-50 text-gray-600';
    const label = v
      ? (props as any).labelTrue ?? 'Activo'
      : (props as any).labelFalse ?? 'Inactivo';
    return <span className={`${base} ${cls}`}>{label}</span>;
  }

  const s = String((props as any).value ?? '').toUpperCase();
  const map: Record<string, string> = {
    ACTIVO: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    SUSPENDIDO: 'border-amber-200 bg-amber-50 text-amber-700',
    RETIRADO: 'border-rose-200 bg-rose-50 text-rose-700',
  };
  const cls = map[s] ?? 'border-gray-200 bg-gray-50 text-gray-600';
  return <span className={`${base} ${cls}`}>{s || '—'}</span>;
}
