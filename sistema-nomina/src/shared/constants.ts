export const LOCALE = 'es-GT' as const
export const CURRENCY = 'GTQ' as const
export const CURRENCY_SYMBOL = 'Q' as const

export const GT_CURRENCY = new Intl.NumberFormat('es-GT', {
  style: 'currency',
  currency: 'GTQ',
});

export const formatDateGT = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(+d)
    ? '—'
    : d.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
};
