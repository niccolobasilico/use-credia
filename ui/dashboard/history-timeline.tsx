import { PRACTICE_INCASSO_BADGES, PRACTICE_INCASSO_LABELS, PRACTICE_STATUS_BADGES, PRACTICE_STATUS_LABELS } from '#/lib/constants/practices';
import type { PracticeHistoryRecord } from '#/lib/types/practice';
import { formatDate } from '#/lib/utils/format';
import { Badge } from '#/ui/badge';

interface HistoryTimelineProps {
  items: PracticeHistoryRecord[];
}

export function HistoryTimeline({ items }: HistoryTimelineProps) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6 text-sm text-white/50">
        Nessuna attività recente.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-white/70">Attività recenti</h3>
      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="relative pl-6 text-sm text-white/80">
            <span className="absolute left-0 top-1 size-2 rounded-full bg-gradient-to-b from-[#667eea] to-[#764ba2]" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={PRACTICE_STATUS_BADGES[item.status]}>
                {PRACTICE_STATUS_LABELS[item.status]}
              </Badge>
              <Badge className={PRACTICE_INCASSO_BADGES[item.incassata]}>
                INCASSATA {PRACTICE_INCASSO_LABELS[item.incassata].toUpperCase()}
              </Badge>
              <span className="text-xs text-white/50">{formatDate(item.createdAt)}</span>
            </div>
            <p className="mt-2 text-white/90">{item.note ?? 'Aggiornamento stato pratica'}</p>
            <p className="text-xs text-white/50">Operatore: {item.userName ?? item.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
