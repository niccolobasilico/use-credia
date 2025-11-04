import { redirect } from 'next/navigation';

import { auth } from '#/auth';
import { getClientDashboardData } from '#/lib/services/dashboard';
import { PRACTICE_STATUS_BADGES, PRACTICE_STATUS_LABELS } from '#/lib/constants/practices';
import { formatCurrency } from '#/lib/utils/format';
import { MetricCard } from '#/ui/dashboard/metric-card';
import { IncassoRadial } from '#/ui/dashboard/incasso-radial';
import { PracticeTable } from '#/ui/dashboard/practice-table';
import { Badge } from '#/ui/badge';

export const revalidate = 0;

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (!session.user.clientCompanyId) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6 text-sm text-amber-100">
        Nessuna azienda associata al tuo account. Contatta l&apos;amministratore UseCredia per completare
        l&apos;invito.
      </div>
    );
  }

  const data = await getClientDashboardData(session.user.clientCompanyId);

  const amountByStatus = data.practices.reduce<Record<string, number>>((acc, practice) => {
    acc[practice.status] = (acc[practice.status] ?? 0) + practice.amount;
    return acc;
  }, {});

  const incassoAmount = data.practices.reduce(
    (acc, practice) => {
      if (practice.incassata) {
        acc.yes += practice.amount;
      } else {
        acc.no += practice.amount;
      }
      return acc;
    },
    { yes: 0, no: 0 },
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Dashboard cliente</h1>
        <p className="text-sm text-white/50">
          Monitora lo stato delle pratiche, aggiorna l&apos;incasso e scarica le informazioni di dettaglio.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Pratiche totali" value={data.summary.totalPractices} />
        <MetricCard label="Importo incassato" value={incassoAmount.yes} format="currency" accent="emerald" />
        <MetricCard label="Importo in verifica" value={incassoAmount.no} format="currency" accent="yellow" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Pratiche per stato</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {data.statusBreakdown.map((entry) => (
              <div key={entry.status} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <Badge className={PRACTICE_STATUS_BADGES[entry.status]}>
                    {PRACTICE_STATUS_LABELS[entry.status]}
                  </Badge>
                  <span className="text-xs text-white/60">{entry.count} pratiche</span>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {formatCurrency(amountByStatus[entry.status] ?? 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <IncassoRadial yes={incassoAmount.yes} no={incassoAmount.no} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Dettaglio pratiche</h2>
          <p className="text-sm text-white/50">
            Puoi aggiornare lo stato di incasso. Il team UseCredia riceverà una notifica e potrà verificare.
          </p>
        </div>
        <PracticeTable practices={data.practices} role={session.user.role} />
      </section>
    </div>
  );
}
