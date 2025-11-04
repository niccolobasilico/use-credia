import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { config, isSupabaseConfigured } from '#/lib/config';

let cachedClient: SupabaseClient | null = null;

export const getSupabaseAdminClient = () => {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase non è configurato. Impostare SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nelle variabili ambiente.',
    );
  }

  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient(config.supabaseUrl!, config.supabaseServiceRoleKey!, {
    auth: { persistSession: false },
  });

  return cachedClient;
};
