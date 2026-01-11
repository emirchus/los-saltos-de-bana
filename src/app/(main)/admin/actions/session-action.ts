'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types_db';

export type StreamSession = Database['public']['Tables']['stream_sessions']['Row'];

export async function getActiveSession(channel: string): Promise<StreamSession | null> {
  const supabase = await createClient();

  // Buscar la sesión activa más reciente (is_live = true) para este canal
  const { data: activeSession } = await supabase
    .from('stream_sessions')
    .select('*')
    .eq('channel', channel)
    .eq('is_live', true)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (activeSession) {
    return activeSession;
  }

  // Si no hay sesión activa, buscar la sesión más reciente
  const { data: latestSession } = await supabase
    .from('stream_sessions')
    .select('*')
    .eq('channel', channel)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  return latestSession || null;
}
