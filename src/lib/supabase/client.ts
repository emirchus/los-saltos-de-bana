import { createBrowserClient } from '@supabase/ssr';

import 'react';

import type { Database } from '@/types_db';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientTyped = SupabaseClient<Database>;

let supabaseClient: SupabaseClientTyped;

function createClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return supabaseClient;
}

export const supabase = createClient();
