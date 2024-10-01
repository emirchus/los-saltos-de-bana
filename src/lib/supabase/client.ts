import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import type { Database } from '@/types_db';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientTyped = SupabaseClient<Database>;

export const supabase = createClientComponentClient<Database>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
