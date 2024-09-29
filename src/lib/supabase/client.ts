import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types_db';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientTyped = SupabaseClient<Database>;

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
