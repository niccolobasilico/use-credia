import { PRACTICE_INCASSO_BADGES, PRACTICE_INCASSO_LABELS } from '#/lib/constants/practices';
import { formatCurrency } from '#/lib/utils/format';
import { Badge } from '#/ui/badge';

interface IncassoRadialProps {
  yes: number;
  no: number;
}

export function IncassoRadial({ yes, no }: IncassoRadialProps) {
  const total = yes + no;
  const yesPercentage = total === 0 ? 0 : Math.round((yes / total) * 100);
  const noPercentage = 100 - yesPercentage;

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-white/60">Incasso pratiche</p>
          <p className="mt-3 text-3xl font-semibold text-white">{yesPercentage}%</p>
          <p className="text-sm text-white/50">Pratiche incassate</p>
        </div>
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 42 42" className="h-full w-full">
            <circle
              className="stroke-white/10"
              cx="21"
              cy="21"
              r="15.9155"
              fill="transparent"
              strokeWidth="6"
            />
            <circle
              className="stroke-[#667eea]"
              cx="21"
              cy="21"
              r="15.9155"
              fill="transparent"
              strokeWidth="6"
              strokeDasharray={`${yesPercentage} ${100 - yesPercentage}`}
              strokeDashoffset="25"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
            {yesPercentage}%
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <Badge className={PRACTICE_INCASSO_BADGES[true]}>{PRACTICE_INCASSO_LABELS[true]}</Badge>
          <span className="text-white/70">{formatCurrency(yes)}</span>
        </div>
        <div className="flex items-center justify-between">
          <Badge className={PRACTICE_INCASSO_BADGES[false]}>{PRACTICE_INCASSO_LABELS[false]}</Badge>
          <span className="text-white/70">{formatCurrency(no)}</span>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Totale</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      <p className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/60">
        I clienti possono segnalare eventuali incassi mancanti, che verranno verificati dal team UseCredia.
      </p>
    </div>
  );
}
