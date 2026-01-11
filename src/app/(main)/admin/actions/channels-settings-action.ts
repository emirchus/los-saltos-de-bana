'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types_db';

export type ChannelsSettings = Database['public']['Tables']['channels_settings']['Row'];

export async function getChannelsSettings(): Promise<ChannelsSettings[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('channels_settings')
    .select('*')
    .order('channel', { ascending: true });

  if (error) {
    console.error('Error obteniendo channels_settings:', error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function updateChannelsSettings(
  channel: string,
  updates: Partial<Omit<ChannelsSettings, 'channel' | 'updated_at'>>
): Promise<ChannelsSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('channels_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('channel', channel)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando channels_settings:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function createChannelsSettings(
  channel: string,
  settings: Omit<ChannelsSettings, 'channel' | 'updated_at'>
): Promise<ChannelsSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('channels_settings')
    .insert({
      channel,
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando channels_settings:', error);
    throw new Error(error.message);
  }

  return data;
}
