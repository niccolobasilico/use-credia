import { getAdminDashboardData } from '#/lib/services/dashboard';
import { listClientCompanies } from '#/lib/services/clients';
import { PracticeTable } from '#/ui/dashboard/practice-table';
import { PracticeCreateForm } from './practice-create-form';

export const revalidate = 0;

export default async function AdminPracticesPage() {
  const [dashboard, clients] = await Promise.all([
    getAdminDashboardData(),
    listClientCompanies(),
  ]);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Gestione pratiche</h1>
        <p className="text-sm text-white/50">
          Crea nuove pratiche, assegna responsabili e aggiorna stato e incasso in tempo reale.
        </p>
      </header>

      <PracticeCreateForm clients={clients} />

      <PracticeTable practices={dashboard.practices} role="ADMIN" />
    </div>
  );
}
