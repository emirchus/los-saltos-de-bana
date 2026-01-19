'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { encodedRedirect } from '@/lib/utils';

export const signInWithTwitch = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitch',
    options: {
      redirectTo:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/auth/callback'
          : 'https://losmaspiola.com/auth/callback',
      scopes: 'user:read:subscriptions',
    },
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect(data.url);
};

export const signInWithKick = async () => {
  const redirectUri =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/auth/kick/callback'
      : 'https://losmaspiola.com/auth/kick/callback';

  const { getKickAuthorizationUrl } = await import('@/lib/oauth/kick');

  try {
    const { url } = await getKickAuthorizationUrl(redirectUri);
    return redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión con KICK';
    return encodedRedirect('error', '/login', message);
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  return redirect('/');
};
