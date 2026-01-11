"use server";

import "server-only";

import { createClient } from "@/lib/supabase/server";

interface KickChannelResponse {
  user: {
    profile_pic: string | null;
  };
}


const timeToSleep = 60 * 1000; // 1min

const BATCH_SIZE = 10;

export const loadProfilePicturesAction = async () => {
  const supabase = await createClient();

  // Obtener todos los usuarios sin foto de perfil
  const { data: users, error: fetchError } = await supabase
    .from('user_stats')
    .select('user_id, username, profile_pic')
    .order('points', { ascending: false })
    .is('profile_pic', null)


  if (fetchError) {
    console.error('Error obteniendo usuarios:', fetchError);
    throw new Error(fetchError.message);
  }

  if (!users || users.length === 0) {
    return {
      message: 'No hay usuarios sin foto de perfil',
      processed: 0,
      updated: 0,
      errors: 0
    };
  }

  let updated = 0;
  let errors = 0;
  const errorDetails: Array<{ username: string; error: string }> = [];

  // Procesar en batches de 10
  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);

    // Procesar batch en paralelo
    const batchPromises = batch.map(async (user) => {
      try {
        const response = await fetch(
          `https://kick.com/api/v2/channels/${user.username}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              "User-Agent": "BotKick/1.0"
            },
          }
        );

        console.log(response);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: KickChannelResponse = await response.json();

        console.log(data);

        if (!data.user?.profile_pic) {
          throw new Error('No se encontró foto de perfil en la respuesta');
        }

        // Actualizar en la base de datos
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({ profile_pic: data.user.profile_pic })
          .eq('user_id', user.user_id);


        if (updateError) {
          throw new Error(`Error actualizando BD: ${updateError.message}`);
        }

        return { success: true, username: user.username };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        errorDetails.push({ username: user.username, error: errorMessage });
        return { success: false, username: user.username, error: errorMessage };
      }
    });

    const results = await Promise.all(batchPromises);

    // Contar resultados
    results.forEach((result) => {
      if (result.success) {
        updated++;
      } else {
        errors++;
      }
    });

    // Pequeña pausa entre batches para no saturar la API
    if (i + BATCH_SIZE < users.length) {
      await new Promise((resolve) => setTimeout(resolve, timeToSleep / 2));
    }
  }

  return {
    message: `Procesados ${users.length} usuarios`,
    processed: users.length,
    updated,
    errors,
    errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
  };
};