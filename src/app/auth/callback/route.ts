import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    const {
      data: { session, user },
    } = await supabase.auth.exchangeCodeForSession(code);

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    // Si es un reset de contraseña, redirigir a la página de reset
    if (type === 'recovery') {
      const redirectUrl = isLocalEnv
        ? `${origin}/auth/reset-password`
        : forwardedHost
          ? `https://${forwardedHost}/auth/reset-password`
          : `${origin}/auth/reset-password`;
      return NextResponse.redirect(redirectUrl);
    }

    // Si es OAuth con Twitch, procesar la suscripción
    if (session?.user.user_metadata.provider === 'twitch') {
      const url = `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=83953406&user_id=${session.user.user_metadata.sub}`;

      const options = {
        method: 'GET',
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
          Authorization: `Bearer ${session.provider_token}`,
        },
      };

      const { data, error } = await fetch(url, options).then(res => res.json());

      await supabase.from('profiles').upsert([
        {
          id: user?.id as string,
          sub: error == null && data.length > 0,
          username: user?.user_metadata.user_name || user?.user_metadata.name,
          full_name: user?.user_metadata.name,
          avatar_url: user?.user_metadata.avatar_url,
          website: user?.user_metadata.website,
        },
      ]);
    } else if (session?.user.user_metadata.provider === 'keycloak') {
      // Si es OAuth con Keycloak (configurado como proxy de KICK), crear perfil
      await supabase.from('profiles').upsert([
        {
          id: user?.id as string,
          username: user?.user_metadata.preferred_username || user?.user_metadata.username || user?.user_metadata.name,
          full_name: user?.user_metadata.name || user?.user_metadata.full_name,
          avatar_url: user?.user_metadata.avatar_url || user?.user_metadata.picture,
          website: user?.user_metadata.website,
        },
      ]);
    } else if (user) {
      // Para usuarios que se registran con email, crear perfil básico
      await supabase.from('profiles').upsert([
        {
          id: user.id,
          username: user.email?.split('@')[0] || null,
          full_name: user.user_metadata.full_name || null,
          avatar_url: user.user_metadata.avatar_url || null,
        },
      ]);
    }

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
