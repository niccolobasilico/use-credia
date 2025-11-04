'use client';

import { useMemo, useState, useTransition } from 'react';

import type { ClientCompanyRecord } from '#/lib/types/client';
import { upsertClientCompany, deleteClientCompany } from '#/lib/services/clients';

interface ClientManagerProps {
  clients: ClientCompanyRecord[];
}

interface FormState {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  vatNumber?: string;
  contactName?: string;
  city?: string;
  province?: string;
}

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  vatNumber: '',
  contactName: '',
  city: '',
  province: '',
};

export function ClientManager({ clients }: ClientManagerProps) {
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedClients = useMemo(
    () => [...clients].sort((a, b) => a.name.localeCompare(b.name)),
    [clients],
  );

  const startCreate = () => {
    setForm(emptyForm);
    setExpanded(true);
    setMessage(null);
    setError(null);
  };

  const startEdit = (client: ClientCompanyRecord) => {
    setForm({
      id: client.id,
      name: client.name,
      email: client.email ?? '',
      phone: client.phone ?? '',
      vatNumber: client.vatNumber ?? '',
      contactName: client.contactName ?? '',
      city: client.city ?? '',
      province: client.province ?? '',
    });
    setExpanded(true);
    setMessage(null);
    setError(null);
  };

  const handleSubmit = () => {
    if (!form.name) {
      setError('Inserire il nome azienda.');
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      try {
        await upsertClientCompany({
          id: form.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          vatNumber: form.vatNumber,
          contactName: form.contactName,
          city: form.city,
          province: form.province,
        });
        setMessage(form.id ? 'Cliente aggiornato.' : 'Cliente creato.');
        setExpanded(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await deleteClientCompany(id);
        setMessage('Cliente eliminato.');
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Anagrafica clienti</h2>
          <p className="text-sm text-white/50">Gestisci accessi CLIENT e aggiornamenti anagrafici.</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#667eea]/30 transition hover:from-[#6c7cf0] hover:to-[#8053b1]"
        >
          Nuovo cliente
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Azienda</th>
              <th className="px-4 py-3 text-left">Contatto</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Telefono</th>
              <th className="px-4 py-3 text-left">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedClients.map((client) => (
              <tr key={client.id} className="hover:bg-white/5">
                <td className="px-4 py-4">
                  <div className="font-semibold text-white">{client.name}</div>
                  <div className="text-xs text-white/50">P.IVA {client.vatNumber ?? '—'}</div>
                </td>
                <td className="px-4 py-4 text-white/70">{client.contactName ?? '—'}</td>
                <td className="px-4 py-4 text-white/70">{client.email ?? '—'}</td>
                <td className="px-4 py-4 text-white/70">{client.phone ?? '—'}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => startEdit(client)}
                      className="rounded-lg border border-white/20 px-3 py-1 text-white/80 hover:border-white/40 hover:text-white"
                    >
                      Modifica
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(client.id)}
                      className="rounded-lg border border-rose-500/40 px-3 py-1 text-rose-100 hover:border-rose-400 hover:text-rose-50"
                    >
                      Elimina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {expanded ? (
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-6 shadow-lg shadow-black/20">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            {form.id ? 'Aggiorna cliente' : 'Nuovo cliente'}
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs text-white/60">
              Ragione sociale
              <input
                value={form.name}
                onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="Azienda Srl"
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Email amministrazione
              <input
                value={form.email}
                onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="contabile@azienda.it"
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Telefono
              <input
                value={form.phone}
                onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="+39"
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Partita IVA / CF
              <input
                value={form.vatNumber}
                onChange={(event) => setForm((state) => ({ ...state, vatNumber: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="IT..."
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Referente
              <input
                value={form.contactName}
                onChange={(event) => setForm((state) => ({ ...state, contactName: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="Nome Cognome"
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Città
              <input
                value={form.city}
                onChange={(event) => setForm((state) => ({ ...state, city: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="Milano"
              />
            </label>
            <label className="space-y-2 text-xs text-white/60">
              Provincia
              <input
                value={form.province}
                onChange={(event) => setForm((state) => ({ ...state, province: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-4 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
                placeholder="MI"
                maxLength={2}
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              disabled={isPending}
              onClick={handleSubmit}
              className="rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-2 font-semibold text-white shadow-lg shadow-[#667eea]/30 transition hover:from-[#6c7cf0] hover:to-[#8053b1] disabled:opacity-60"
            >
              {isPending ? 'Salvataggio…' : 'Salva' }
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setExpanded(false)}
              className="rounded-xl border border-white/20 px-4 py-2 text-white/70 hover:border-white/40 hover:text-white"
            >
              Annulla
            </button>
          </div>
          {error ? (
            <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">{error}</p>
          ) : null}
          {message ? (
            <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">
              {message}
            </p>
          ) : null}
        </div>
      ) : null}

      {!expanded && message ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100">{message}</p>
      ) : null}
      {!expanded && error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs text-rose-100">{error}</p>
      ) : null}
    </section>
  );
}
