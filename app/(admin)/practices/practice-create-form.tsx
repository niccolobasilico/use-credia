'use client';

import { useRef, useState, useTransition } from 'react';

import type { ClientCompanyRecord } from '#/lib/types/client';
import { createPractice } from '#/lib/services/practices';
import { PRACTICE_STATUSES, PRACTICE_STATUS_LABELS } from '#/lib/constants/practices';

interface PracticeCreateFormProps {
  clients: ClientCompanyRecord[];
}

export function PracticeCreateForm({ clients }: PracticeCreateFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    const clientCompanyId = formData.get('clientCompanyId')?.toString() ?? '';
    const customerName = formData.get('customerName')?.toString() ?? '';
    const amountValue = Number(formData.get('amount')?.toString() ?? '0');
    const type = formData.get('type')?.toString() ?? '';
    const status = formData.get('status')?.toString() ?? 'IN_ATTESA';
    const assignedEmployeeId = formData.get('assignedEmployeeId')?.toString() ?? '';
    const expectedPayoutDate = formData.get('expectedPayoutDate')?.toString() ?? '';

    if (!clientCompanyId || !customerName || !amountValue || !type) {
      setError('Compila tutti i campi obbligatori.');
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      try {
        await createPractice({
          clientCompanyId,
          customerName,
          amount: amountValue,
          type,
          status: status as (typeof PRACTICE_STATUSES)[number],
          incassata: true,
          assignedEmployeeId: assignedEmployeeId ? assignedEmployeeId : null,
          expectedPayoutDate: expectedPayoutDate || undefined,
        });
        setMessage('Pratica creata correttamente.');
        formRef.current?.reset();
      } catch (err) {
        setError((err as Error).message);
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="rounded-2xl border border-white/10 bg-gray-900/60 p-6 text-sm text-white/80 shadow-lg shadow-black/20"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-xs text-white/60">
          Azienda cliente
          <select
            name="clientCompanyId"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Seleziona azienda
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Cliente finale
          <input
            name="customerName"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
            placeholder="Nome Cognome"
            required
          />
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Importo richiesto
          <input
            name="amount"
            type="number"
            min="0"
            step="1000"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
            placeholder="50000"
            required
          />
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Tipologia
          <input
            name="type"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
            placeholder="Cessione del quinto"
            required
          />
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Stato iniziale
          <select
            name="status"
            defaultValue="IN_ATTESA"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
          >
            {PRACTICE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {PRACTICE_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Dipendente assegnato (opzionale)
          <input
            name="assignedEmployeeId"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
            placeholder="ULID dipendente"
          />
        </label>
        <label className="space-y-2 text-xs text-white/60">
          Data incasso prevista
          <input
            name="expectedPayoutDate"
            type="date"
            className="w-full rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 text-sm text-white focus:border-[#667eea] focus:outline-none"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-[#667eea] to-[#764ba2] px-4 py-2 font-semibold text-white shadow-lg shadow-[#667eea]/30 transition hover:from-[#6c7cf0] hover:to-[#8053b1] disabled:opacity-60"
        >
          {isPending ? 'Creazione…' : 'Registra pratica'}
        </button>
        {error ? <span className="text-xs text-rose-200">{error}</span> : null}
        {message ? <span className="text-xs text-emerald-200">{message}</span> : null}
      </div>
    </form>
  );
}
