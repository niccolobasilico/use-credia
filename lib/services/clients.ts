import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { auth } from '#/auth';
import { isSupabaseConfigured } from '#/lib/config';
import { demoClients } from '#/lib/mock-data';
import { getSupabaseAdminClient } from '#/lib/supabase/admin';
import type { ClientCompanyRecord } from '#/lib/types/client';

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome richiesto'),
  vatNumber: z.string().optional(),
  taxCode: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  contactName: z.string().optional(),
});

const ensureAdminOrEmployee = (role: string) => {
  if (role !== 'ADMIN' && role !== 'EMPLOYEE') {
    throw new Error('Operazione consentita solo a amministratori o dipendenti');
  }
};

export const listClientCompanies = async (): Promise<ClientCompanyRecord[]> => {
  if (!isSupabaseConfigured()) {
    return demoClients;
  }

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase.from('client_companies').select('*').order('created_at', {
    ascending: false,
  });

  if (error) {
    throw new Error(`Errore nel recupero clienti: ${error.message}`);
  }

  return data.map((record) => ({
    id: record.id,
    name: record.name,
    vatNumber: record.vat_number,
    taxCode: record.tax_code,
    email: record.email,
    phone: record.phone,
    address: record.address,
    city: record.city,
    province: record.province,
    postalCode: record.postal_code,
    contactName: record.contact_name,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  }));
};

export const upsertClientCompany = async (input: z.infer<typeof clientSchema>) => {
  'use server';

  const session = await auth();

  if (!session?.user) {
    throw new Error('Utente non autenticato');
  }

  ensureAdminOrEmployee(session.user.role);

  const payload = clientSchema.parse(input);

  if (!isSupabaseConfigured()) {
    throw new Error('Configurare Supabase per modificare i clienti');
  }

  const supabase = getSupabaseAdminClient();

  if (payload.id) {
    const { error } = await supabase
      .from('client_companies')
      .update({
        name: payload.name,
        vat_number: payload.vatNumber,
        tax_code: payload.taxCode,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        province: payload.province,
        postal_code: payload.postalCode,
        contact_name: payload.contactName,
      })
      .eq('id', payload.id);

    if (error) {
      throw new Error(`Aggiornamento cliente fallito: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from('client_companies').insert({
      name: payload.name,
      vat_number: payload.vatNumber,
      tax_code: payload.taxCode,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      province: payload.province,
      postal_code: payload.postalCode,
      contact_name: payload.contactName,
    });

    if (error) {
      throw new Error(`Creazione cliente fallita: ${error.message}`);
    }
  }

  revalidatePath('/admin/clients');
};

export const deleteClientCompany = async (clientId: string) => {
  'use server';

  const session = await auth();

  if (!session?.user) {
    throw new Error('Utente non autenticato');
  }

  ensureAdminOrEmployee(session.user.role);

  if (!isSupabaseConfigured()) {
    throw new Error('Configurare Supabase per eliminare i clienti');
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from('client_companies').delete().eq('id', clientId);

  if (error) {
    throw new Error(`Eliminazione cliente fallita: ${error.message}`);
  }

  revalidatePath('/admin/clients');
};
