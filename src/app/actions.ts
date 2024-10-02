'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { encodedRedirect } from '@/lib/utils';

export const signInWithTwitch = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitch',
    options: {
      redirectTo:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/auth/callback'
          : 'https://saltos.bana.emirchus.ar/auth/callback',
      scopes: 'user:read:subscriptions',
    },
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect(data.url);
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');

  return redirect('/');
};
