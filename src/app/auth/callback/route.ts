import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();

    const {
      data: { session, user },
    } = await supabase.auth.exchangeCodeForSession(code);

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    const url = `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=83953406&user_id=${session?.user.user_metadata.sub}`;

    const options = {
      method: 'GET',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
        Authorization: `Bearer ${session?.provider_token}`,
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
