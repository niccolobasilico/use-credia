import { listClientCompanies } from '#/lib/services/clients';
import { formatDate } from '#/lib/utils/format';
import { ClientManager } from './client-manager';

export const revalidate = 0;

export default async function AdminClientsPage() {
  const clients = await listClientCompanies();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-white">Clienti UseCredia</h1>
        <p className="text-sm text-white/50">
          Gestisci aziende clienti, contatti e inviti agli account con accesso ruolo CLIENT.
        </p>
      </header>

      <ClientManager clients={clients} />

      <section className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">Anagrafica rapida</h2>
        <ul className="mt-4 grid gap-3 text-sm text-white/80 md:grid-cols-2">
          {clients.map((client) => (
            <li key={client.id} className="rounded-xl border border-white/5 bg-white/5 p-4">
              <div className="font-semibold text-white">{client.name}</div>
              <div className="text-xs text-white/50">{client.email ?? '—'}</div>
              <div className="mt-2 text-xs text-white/50">
                Creato il {formatDate(client.createdAt)} · {client.province ?? 'NA'}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
