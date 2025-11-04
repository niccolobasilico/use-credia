import clsx from 'clsx';

import { formatCurrency } from '#/lib/utils/format';

interface MetricCardProps {
  label: string;
  value: number;
  format?: 'currency' | 'number';
  accent?: 'violet' | 'emerald' | 'yellow' | 'rose';
  helper?: string;
}

const accents: Record<NonNullable<MetricCardProps['accent']>, string> = {
  violet: 'border-violet-400/50 bg-violet-500/10 text-violet-100',
  emerald: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-100',
  yellow: 'border-amber-400/50 bg-amber-500/10 text-amber-100',
  rose: 'border-rose-400/50 bg-rose-500/10 text-rose-100',
};

export function MetricCard({ label, value, format = 'number', accent = 'violet', helper }: MetricCardProps) {
  const formattedValue = format === 'currency' ? formatCurrency(value) : value.toLocaleString('it-IT');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
      <p className="text-xs uppercase tracking-widest text-white/60">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{formattedValue}</p>
      {helper ? <p className="mt-3 text-xs text-white/50">{helper}</p> : null}
      <div className="mt-6 flex items-center gap-2">
        <span className={clsx('rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide', accents[accent])}>
          KPI
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>
    </div>
  );
}
