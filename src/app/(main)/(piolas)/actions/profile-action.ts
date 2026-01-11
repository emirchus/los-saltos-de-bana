'use server';

import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/server';
import { Database } from '@/types_db';

export type UserStats = Database['public']['Tables']['user_stats']['Row'];
export type UserStatsSession = Database['public']['Tables']['user_stats_session']['Row'] & {
  stream_sessions: Database['public']['Tables']['stream_sessions']['Row'];
};

export interface UserProfile {
  userStats: UserStats[];
  sessions: UserStatsSession[];
}

/**
 * Obtiene el perfil de un usuario por su username
 */
export async function getUserProfile(username: string): Promise<UserProfile | null> {
  'use cache';
  cacheTag('user-profile', `user-profile-${username}`);
  cacheLife('minutes'); // Cache por 1 minuto

  const supabase = createPublicClient();

  // Obtener todas las estadísticas del usuario (puede tener múltiples canales)
  const { data: userStats, error: statsError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('username', username)
    .order('stars', { ascending: false });

  if (statsError) {
    console.error('Error obteniendo user_stats:', statsError);
    throw new Error(statsError.message);
  }

  if (!userStats || userStats.length === 0) {
    return null;
  }

  // Obtener todas las sesiones del usuario
  // Necesitamos obtener los user_ids de todas las estadísticas
  const userIds = [...new Set(userStats.map(stat => stat.user_id))];

  const { data: sessions, error: sessionsError } = await supabase
    .from('user_stats_session')
    .select('*, stream_sessions!inner(*)')
    .in('user_id', userIds)
    .limit(100); // Obtener más sesiones para luego ordenarlas

  if (sessionsError) {
    console.error('Error obteniendo sesiones:', sessionsError);
    throw new Error(sessionsError.message);
  }

  // Ordenar sesiones por fecha de inicio (más recientes primero) y limitar a 50
  const sortedSessions = (sessions || [])
    .map(s => s as UserStatsSession)
    .sort((a, b) => {
      const dateA = new Date(a.stream_sessions.started_at).getTime();
      const dateB = new Date(b.stream_sessions.started_at).getTime();
      return dateB - dateA; // Orden descendente (más recientes primero)
    })
    .slice(0, 50);

  return {
    userStats: userStats || [],
    sessions: sortedSessions,
  };
}

/**
 * Obtiene las estadísticas agregadas del usuario (suma de todos los canales)
 */
export async function getUserAggregatedStats(username: string) {
  'use cache';
  cacheTag('user-stats', `user-stats-${username}`);
  cacheLife('minutes');

  const profile = await getUserProfile(username);

  if (!profile) {
    return null;
  }

  // Agregar estadísticas de todos los canales
  const aggregated = profile.userStats.reduce(
    (acc, stat) => ({
      totalPoints: acc.totalPoints + stat.points,
      totalStars: acc.totalStars + stat.stars,
      totalMessages: acc.totalMessages + stat.messages_count,
      totalWalltexts: acc.totalWalltexts + stat.walltext_count,
      channels: acc.channels + 1,
      isOg: acc.isOg || stat.is_og,
    }),
    {
      totalPoints: 0,
      totalStars: 0,
      totalMessages: 0,
      totalWalltexts: 0,
      channels: 0,
      isOg: false,
    }
  );

  return {
    ...aggregated,
    username,
    profilePic: profile.userStats[0]?.profile_pic || null,
    sessionsCount: profile.sessions.length,
  };
}
