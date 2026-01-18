import { createClient } from "@/lib/supabase/server";

export async function ensureAuthenticated() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autorizado');
  }

  return supabase;
}
