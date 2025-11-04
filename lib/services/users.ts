import bcrypt from 'bcryptjs';

import { isSupabaseConfigured } from '#/lib/config';
import { demoUsers } from '#/lib/mock-data';
import { getSupabaseAdminClient } from '#/lib/supabase/admin';

export interface UserRecord {
  id: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  clientCompanyId?: string | null;
  displayName?: string | null;
  passwordHash?: string | null;
}

export const getUserByEmail = async (email: string): Promise<UserRecord | null> => {
  if (!email) {
    return null;
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role, client_company_id, display_name')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Errore Supabase getUserByEmail', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      role: data.role,
      clientCompanyId: data.client_company_id,
      displayName: data.display_name,
      passwordHash: data.password_hash,
    };
  }

  const demoUser = demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

  if (!demoUser) {
    return null;
  }

  return demoUser;
};

export const verifyUserPassword = async (user: UserRecord, password: string) => {
  if (!user.passwordHash) {
    return false;
  }

  try {
    return await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.error('Errore verifica password', error);
    return false;
  }
};
