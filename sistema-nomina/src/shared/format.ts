import { LOCALE, CURRENCY } from './constants'

export function formatCurrency(n: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatDateTime(iso: string | number | Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}
