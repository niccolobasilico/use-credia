const currencyFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  return dateFormatter.format(date);
};
