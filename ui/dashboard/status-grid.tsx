import { PRACTICE_STATUS_BADGES, PRACTICE_STATUS_LABELS, type PracticeStatus } from '#/lib/constants/practices';
import { formatCurrency } from '#/lib/utils/format';
import { Badge } from '#/ui/badge';

interface StatusEntry {
  status: PracticeStatus;
  count: number;
  amount: number;
}

interface StatusGridProps {
  entries: StatusEntry[];
}

export function StatusGrid({ entries }: StatusGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {entries.map((entry) => (
        <div key={entry.status} className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
          <div className="flex items-center justify-between">
            <Badge className={PRACTICE_STATUS_BADGES[entry.status]}>
              {PRACTICE_STATUS_LABELS[entry.status]}
            </Badge>
            <span className="text-sm text-white/60">{entry.count} pratiche</span>
          </div>
          <p className="mt-6 text-2xl font-semibold text-white">{formatCurrency(entry.amount)}</p>
          <div className="mt-4 h-1.5 w-full rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
              style={{ width: `${Math.min(entry.count * 20, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
