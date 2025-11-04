'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '#/auth';
import { isSupabaseConfigured } from '#/lib/config';
import { getSupabaseAdminClient } from '#/lib/supabase/admin';
import { PRACTICE_STATUSES, type PracticeStatus } from '#/lib/constants/practices';

const practiceStatusEnum = z.enum(
  PRACTICE_STATUSES as [PracticeStatus, ...PracticeStatus[]],
);

const statusSchema = z.object({
  practiceId: z.string().min(1, 'ID pratica richiesto'),
  status: practiceStatusEnum,
  note: z.string().max(500).optional(),
});

const incassoSchema = z.object({
  practiceId: z.string().min(1, 'ID pratica richiesto'),
  incassata: z.boolean(),
  note: z.string().max(500).optional(),
});

const practiceSchema = z.object({
  clientCompanyId: z.string().min(1),
  customerName: z.string().min(1),
  amount: z.number().positive(),
  type: z.string().min(1),
  status: practiceStatusEnum.default('IN_ATTESA'),
  assignedEmployeeId: z.string().nullable().optional(),
  incassata: z.boolean().default(true),
  expectedPayoutDate: z.string().optional(),
});

const ensureAdminOrEmployee = (role: string) => {
  if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
    throw new Error('Operazione consentita solo a amministratori o dipendenti');
  }
};

const assertSupabase = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase non configurato: impostare SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY per abilitare le mutazioni.',
    );
  }
};

const revalidateDashboards = (role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT') => {
  revalidatePath('/admin/dashboard');
  revalidatePath('/admin/practices');
  revalidatePath('/client/dashboard');

  if (role !== 'CLIENT') {
    revalidatePath('/admin/clients');
  }
};

export const updatePracticeStatus = async (input: z.infer<typeof statusSchema>) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Utente non autenticato');
  }

  ensureAdminOrEmployee(session.user.role);
  const payload = statusSchema.parse(input);

  assertSupabase();

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('practices')
    .update({ status: payload.status })
    .eq('id', payload.practiceId)
    .select('id, client_company_id, incassata')
    .maybeSingle();

  if (error) {
    throw new Error(`Aggiornamento stato pratica fallito: ${error.message}`);
  }

  if (!data) {
    throw new Error('Pratica non trovata');
  }

  const historyInsert = await supabase.from('practice_status_history').insert({
    practice_id: payload.practiceId,
    status: payload.status,
    incassata: data.incassata,
    note: payload.note ?? null,
    user_id: session.user.id,
  });

  if (historyInsert.error) {
    throw new Error(`Aggiornamento storico fallito: ${historyInsert.error.message}`);
  }

  revalidateDashboards(session.user.role);
};

export const updatePracticeIncasso = async (input: z.infer<typeof incassoSchema>) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Utente non autenticato');
  }

  const payload = incassoSchema.parse(input);

  if (session.user.role === 'CLIENT' && payload.incassata) {
    throw new Error('I clienti possono solo segnalare incasso = NO');
  }

  assertSupabase();

  const supabase = getSupabaseAdminClient();

  const { data: practice, error } = await supabase
    .from('practices')
    .select('id, status, incassata, client_company_id')
    .eq('id', payload.practiceId)
    .maybeSingle();

  if (error) {
    throw new Error(`Recupero pratica fallito: ${error.message}`);
  }

  if (!practice) {
    throw new Error('Pratica non trovata');
  }

  if (session.user.role === 'CLIENT' && session.user.clientCompanyId !== practice.client_company_id) {
    throw new Error('Non puoi aggiornare pratiche di altre aziende');
  }

  const updateResult = await supabase
    .from('practices')
    .update({ incassata: payload.incassata })
    .eq('id', payload.practiceId)
    .select('status, incassata')
    .maybeSingle();

  if (updateResult.error) {
    throw new Error(`Aggiornamento incasso fallito: ${updateResult.error.message}`);
  }

  const historyInsert = await supabase.from('practice_status_history').insert({
    practice_id: payload.practiceId,
    status: (updateResult.data?.status ?? practice.status) as PracticeStatus,
    incassata: payload.incassata,
    note: payload.note ?? (payload.incassata ? 'Pratica incassata' : 'Segnalato incasso NO'),
    user_id: session.user.id,
  });

  if (historyInsert.error) {
    throw new Error(`Aggiornamento storico fallito: ${historyInsert.error.message}`);
  }

  revalidateDashboards(session.user.role);
};

export const createPractice = async (input: z.infer<typeof practiceSchema>) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Utente non autenticato');
  }

  ensureAdminOrEmployee(session.user.role);

  const payload = practiceSchema.parse(input);

  assertSupabase();

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('practices')
    .insert({
      client_company_id: payload.clientCompanyId,
      customer_name: payload.customerName,
      amount: payload.amount,
      type: payload.type,
      status: payload.status,
      assigned_employee_id: payload.assignedEmployeeId,
      incassata: payload.incassata,
      expected_payout_date: payload.expectedPayoutDate,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    throw new Error(`Creazione pratica fallita: ${error.message}`);
  }

  if (!data) {
    throw new Error('Creazione pratica non ha restituito un ID');
  }

  const historyInsert = await supabase.from('practice_status_history').insert({
    practice_id: data.id,
    status: payload.status,
    incassata: payload.incassata,
    note: 'Pratica creata',
    user_id: session.user.id,
  });

  if (historyInsert.error) {
    throw new Error(`Creazione storico fallita: ${historyInsert.error.message}`);
  }

  revalidateDashboards(session.user.role);

  return data.id as string;
};
