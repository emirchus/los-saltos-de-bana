'use server';

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types_db';

export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type UserStatsSession = Database['public']['Tables']['user_stats_session']['Row'];

export interface UserWithSession extends UserStats {
  sessionStats?: UserStatsSession | null;
}

export interface GetUsersResult {
  users: UserWithSession[];
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

  // Obtener datos de sesión para cada usuario
  const usersWithSession: UserWithSession[] = await Promise.all(
    (data || []).map(async user => {
      // Buscar la sesión activa para este canal
      const { data: activeSession } = await supabase
        .from('stream_sessions')
        .select('id')
        .eq('channel', user.channel)
        .eq('is_live', true)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      let sessionId: string | null = null;

      if (activeSession) {
        sessionId = activeSession.id;
      } else {
        const { data: latestSession } = await supabase
          .from('stream_sessions')
          .select('id')
          .eq('channel', user.channel)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (latestSession) {
          sessionId = latestSession.id;
        }
      }

      // Obtener stats de la sesión si existe
      let sessionStats: UserStatsSession | null = null;
      if (sessionId) {
        const { data: sessionData } = await supabase
          .from('user_stats_session')
          .select('*')
          .eq('user_id', user.user_id)
          .eq('channel', user.channel)
          .eq('session_id', sessionId)
          .single();

        sessionStats = sessionData || null;
      }

      return {
        ...user,
        sessionStats,
      };
    })
  );

  return {
    users: usersWithSession,
    total: count || 0,
  };
}

export async function updateUserStats(
  userId: string,
  channel: string,
  updates: Partial<Pick<UserStats, 'points' | 'stars'>>,
  updateType: 'global' | 'session' | 'both' = 'both'
): Promise<UserStats> {
  const supabase = await createClient();

  // Actualizar user_stats (global) si es necesario
  if (updateType === 'global' || updateType === 'both') {
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

    // Si solo actualizamos global, retornar
    if (updateType === 'global') {
      return data;
    }
  }

  // Actualizar la sesión activa si es necesario
  if (updateType === 'session' || updateType === 'both') {
    if (updates.points !== undefined) {
      // Buscar la sesión activa más reciente (is_live = true) para este canal
      const { data: activeSession } = await supabase
        .from('stream_sessions')
        .select('id')
        .eq('channel', channel)
        .eq('is_live', true)
        .order('started_at', { ascending: false })
        .limit(1)
        .single();

      let sessionId: string | null = null;

      if (activeSession) {
        sessionId = activeSession.id;
      } else {
        const { data: latestSession } = await supabase
          .from('stream_sessions')
          .select('id')
          .eq('channel', channel)
          .order('started_at', { ascending: false })
          .limit(1)
          .single();

        if (latestSession) {
          sessionId = latestSession.id;
        }
      }

      // Si encontramos una sesión, obtener los puntos actuales de la sesión y globales
      if (sessionId) {
        // Obtener puntos actuales de la sesión
        const { data: currentSessionStats } = await supabase
          .from('user_stats_session')
          .select('points')
          .eq('user_id', userId)
          .eq('channel', channel)
          .eq('session_id', sessionId)
          .single();

        const oldSessionPoints = currentSessionStats?.points || 0;
        const newSessionPoints = updates.points;
        const pointsDifference = newSessionPoints - oldSessionPoints;

        // Actualizar la sesión
        const sessionUpdates: Partial<Pick<UserStatsSession, 'points'>> = {
          points: newSessionPoints,
        };

        const { error: sessionError } = await supabase
          .from('user_stats_session')
          .update(sessionUpdates)
          .eq('user_id', userId)
          .eq('channel', channel)
          .eq('session_id', sessionId);

        if (sessionError) {
          console.error('Error actualizando user_stats_session:', sessionError);
          throw new Error(sessionError.message);
        }

        // Si solo actualizamos sesión, también actualizar los puntos globales sumando la diferencia
        if (updateType === 'session' && pointsDifference !== 0) {
          // Obtener puntos globales actuales
          const { data: currentGlobalStats } = await supabase
            .from('user_stats')
            .select('points')
            .eq('user_id', userId)
            .eq('channel', channel)
            .single();

          const currentGlobalPoints = currentGlobalStats?.points || 0;
          const newGlobalPoints = currentGlobalPoints + pointsDifference;

          // Actualizar puntos globales
          const { error: globalError } = await supabase
            .from('user_stats')
            .update({
              points: newGlobalPoints,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('channel', channel);

          if (globalError) {
            console.error('Error actualizando user_stats:', globalError);
            throw new Error(globalError.message);
          }
        }
      }
    }

    // Si solo actualizamos sesión, obtener los datos globales actualizados para retornar
    if (updateType === 'session') {
      const { data: globalData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('channel', channel)
        .single();

      return globalData!;
    }
  }

  // Obtener los datos actualizados (para 'both' o 'global')
  const { data: updatedData } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('channel', channel)
    .single();

  return updatedData!;
}
