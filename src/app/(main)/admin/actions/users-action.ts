'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types_db';

export type UserStats = Database['public']['Tables']['user_stats']['Row'];

export interface GetUsersResult {
  users: UserStats[];
  total: number;
}

export async function getUsers(
  options?: {
    channel?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<GetUsersResult> {
  const supabase = await createClient();
  const { channel, search, page = 0, pageSize = 20 } = options || {};

  // Primero obtener el total para la búsqueda
  let countQuery = supabase.from('user_stats').select('*', { count: 'exact', head: true });

  if (channel) {
    countQuery = countQuery.eq('channel', channel);
  }

  if (search) {
    const searchPattern = `%${search}%`;
    countQuery = countQuery.or(
      `username.ilike.${searchPattern},user_id.ilike.${searchPattern},channel.ilike.${searchPattern}`
    );
  }

  const { count } = await countQuery;

  // Luego obtener los datos paginados
  let query = supabase
    .from('user_stats')
    .select('*')
    .order('stars', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (channel) {
    query = query.eq('channel', channel);
  }

  if (search) {
    const searchPattern = `%${search}%`;
    query = query.or(
      `username.ilike.${searchPattern},user_id.ilike.${searchPattern},channel.ilike.${searchPattern}`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error obteniendo usuarios:', error);
    throw new Error(error.message);
  }

  return {
    users: data || [],
    total: count || 0,
  };
}

export async function updateUserStats(
  userId: string,
  channel: string,
  updates: Partial<Pick<UserStats, 'points' | 'stars'>>
): Promise<UserStats> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_stats')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('channel', channel)
    .select()
    .single();

  if (error) {
    console.error('Error actualizando user_stats:', error);
    throw new Error(error.message);
  }

  return data;
}