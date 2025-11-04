import { getAdminDashboardData } from '#/lib/services/dashboard';
import { MetricCard } from '#/ui/dashboard/metric-card';
import { PracticeTable } from '#/ui/dashboard/practice-table';
import { StatusGrid } from '#/ui/dashboard/status-grid';
import { IncassoRadial } from '#/ui/dashboard/incasso-radial';
import { HistoryTimeline } from '#/ui/dashboard/history-timeline';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-10">
      <section className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Pratiche attive" value={data.summary.totalPractices} helper="Conteggio totale" />
        <MetricCard label="Clienti attivi" value={data.summary.totalClients} helper="Aziende collegate" accent="yellow" />
        <MetricCard label="Volume liquidato" value={data.summary.liquidatedVolume} format="currency" accent="emerald" />
        <MetricCard label="Volume in attesa" value={data.summary.pendingVolume} format="currency" accent="rose" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <StatusGrid entries={data.statusBreakdown} />
        <IncassoRadial yes={data.incassoBreakdown.yes} no={data.incassoBreakdown.no} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Pratiche recenti</h2>
          <p className="text-sm text-white/50">Monitoraggio stato, importi e incasso</p>
        </div>
        <PracticeTable practices={data.practices} role="ADMIN" />
      </section>

      <section>
        <HistoryTimeline items={data.recentHistory.slice(0, 6)} />
      </section>
    </div>
  );
}
