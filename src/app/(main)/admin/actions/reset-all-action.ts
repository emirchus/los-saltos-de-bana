'use server';

import { createClient } from '@/lib/supabase/server';

export async function resetAllStats() {
  const supabase = await createClient();

  try {
    // Resetear todos los puntos y estrellas en user_stats
    const { error: globalError } = await supabase
      .from('user_stats')
      .update({
        points: 0,
        stars: 0,
        updated_at: new Date().toISOString(),
      })
      .neq('user_id', ''); // Actualizar todos los registros

    if (globalError) {
      console.error('Error reseteando user_stats:', globalError);
      throw new Error(globalError.message);
    }

    // Resetear todos los puntos en user_stats_session
    const { error: sessionError } = await supabase
      .from('user_stats_session').delete()

    if (sessionError) {
      console.error('Error reseteando user_stats_session:', sessionError);
      throw new Error(sessionError.message);
    }

    return {
      success: true,
      message: 'Todos los puntos y estrellas han sido reseteados correctamente',
    };
  } catch (error) {
    console.error('Error en resetAllStats:', error);
    throw error;
  }
}
