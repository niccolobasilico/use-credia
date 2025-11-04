'use client';

import { useMemo, useState, useTransition } from 'react';

import {
  PRACTICE_INCASSO_BADGES,
  PRACTICE_INCASSO_LABELS,
  PRACTICE_STATUSES,
  PRACTICE_STATUS_BADGES,
  PRACTICE_STATUS_LABELS,
  type PracticeStatus,
} from '#/lib/constants/practices';
import type { PracticeRecord } from '#/lib/types/practice';
import { formatCurrency, formatDate } from '#/lib/utils/format';
import { updatePracticeIncasso, updatePracticeStatus } from '#/lib/services/practices';
import { Badge } from '#/ui/badge';

interface PracticeTableProps {
  practices: PracticeRecord[];
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
}

export function PracticeTable({ practices, role }: PracticeTableProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedPractices = useMemo(
    () =>
      [...practices].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [practices],
  );

  const canUpdateStatus = role === 'ADMIN' || role === 'EMPLOYEE';
  const canUpdateIncasso = true;

  const handleStatusChange = (practiceId: string, status: PracticeStatus) => {
    if (!canUpdateStatus) return;
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await updatePracticeStatus({ practiceId, status });
        setMessage('Stato pratica aggiornato.');
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    });
  };

  const handleIncassoChange = (practiceId: string, current: boolean, value: boolean) => {
    if (role === 'CLIENT' && value === true && current === false) {
      setError('Contatta UseCredia per ripristinare incassata a SÌ.');
      return;
    }

    if (role === 'CLIENT' && value === true && current === true) {
      // nothing to do
      return;
    }

    setMessage(null);
    setError(null);

    startTransition(async () => {
      try {
        await updatePracticeIncasso({ practiceId, incassata: value });
        setMessage('Informazione incasso aggiornata.');
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Pratica</th>
              <th className="px-4 py-3 text-left">Cliente finale</th>
              <th className="px-4 py-3 text-left">Importo</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Stato</th>
              <th className="px-4 py-3 text-left">Incassata</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Assegnata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedPractices.map((practice) => (
              <tr key={practice.id} className="hover:bg-white/5">
                <td className="px-4 py-4 align-top">
                  <div className="font-semibold text-white">{practice.id}</div>
                  <div className="text-xs text-white/50">{practice.clientCompanyName}</div>
                </td>
                <td className="px-4 py-4 align-top text-white/80">{practice.customerName}</td>
                <td className="px-4 py-4 align-top">
                  <div className="font-semibold text-white">{formatCurrency(practice.amount)}</div>
                </td>
                <td className="px-4 py-4 align-top text-white/70">{practice.type}</td>
                <td className="px-4 py-4 align-top">
                  {canUpdateStatus ? (
                    <select
                      defaultValue={practice.status}
                      className="w-40 rounded-lg border border-white/20 bg-gray-950/80 px-3 py-2 text-sm text-white/80 focus:border-white/50 focus:outline-none"
                      disabled={isPending}
                      onChange={(event) => handleStatusChange(practice.id, event.target.value as PracticeStatus)}
                    >
                      {PRACTICE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {PRACTICE_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Badge className={PRACTICE_STATUS_BADGES[practice.status]}>
                      {PRACTICE_STATUS_LABELS[practice.status]}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  {canUpdateIncasso ? (
                    <select
                      defaultValue={practice.incassata ? 'true' : 'false'}
                      className="w-28 rounded-lg border border-white/20 bg-gray-950/80 px-3 py-2 text-sm text-white/80 focus:border-white/50 focus:outline-none"
                      disabled={isPending}
                      onChange={(event) =>
                        handleIncassoChange(
                          practice.id,
                          practice.incassata,
                          event.target.value === 'true',
                        )
                      }
                    >
                      <option value="true">Sì</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <Badge className={PRACTICE_INCASSO_BADGES[practice.incassata]}>
                      {PRACTICE_INCASSO_LABELS[practice.incassata]}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-4 align-top text-xs text-white/60">
                  <div>Creata: {formatDate(practice.createdAt)}</div>
                  {practice.expectedPayoutDate ? (
                    <div>Scadenza: {formatDate(practice.expectedPayoutDate)}</div>
                  ) : null}
                  {practice.liquidatedAt ? (
                    <div>Liquidata: {formatDate(practice.liquidatedAt)}</div>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top text-xs text-white/60">
                  {practice.assignedEmployeeName ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(message || error) && (
        <div
          className={`border-t px-6 py-3 text-sm ${
            error
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-100'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
          }`}
        >
          {error ?? message}
        </div>
      )}
    </div>
  );
}
