import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { exchangeKickCodeForToken, getKickUser } from '@/lib/oauth/kick';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { encodedRedirect } from '@/lib/utils';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const origin = requestUrl.origin;
  const next = requestUrl.searchParams.get('next') ?? '/';

  // Si hay un error de KICK, redirigir con el mensaje
  if (error) {
    const errorDescription = requestUrl.searchParams.get('error_description') || 'Error al autenticar con KICK';
    return encodedRedirect('error', '/login', errorDescription);
  }

  if (!code) {
    return encodedRedirect('error', '/login', 'No se recibió el código de autorización');
  }

  try {
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get('kick_code_verifier')?.value;

    if (!codeVerifier) {
      return encodedRedirect('error', '/login', 'Sesión expirada. Por favor, intenta de nuevo.');
    }

    // Limpiar el code_verifier de la cookie
    cookieStore.delete('kick_code_verifier');

    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/kick/callback'
        : 'https://losmaspiola.com/auth/kick/callback';

    // Intercambiar código por token
    const tokenResponse = await exchangeKickCodeForToken(code, redirectUri, codeVerifier);

    console.log(tokenResponse);

    // Obtener información del usuario
    const kickUser = await getKickUser(tokenResponse.access_token);

    console.log(kickUser);

    // Usar Admin API de Supabase para crear/actualizar usuario
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = kickUser.email || `kick_${kickUser.user_id}@kick.com`;
    const kickId = kickUser.user_id.toString();

    // Buscar usuario existente por email o por metadata kick_id
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users.find(u => u.email === email || u.user_metadata?.kick_id === kickId);

    const userId = existingUser
      ? await (async () => {
        // Actualizar usuario existente
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
          user_metadata: {
            provider: 'kick',
            kick_id: kickId,
            username: kickUser.name,
            name: kickUser.name,
            avatar_url: kickUser.profile_picture,
            provider_token: tokenResponse.access_token,
            provider_refresh_token: tokenResponse.refresh_token,
          },
        });

        if (updateError) throw updateError;
        return existingUser.id;
      })()
      : await (async () => {
        // Crear nuevo usuario
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: {
            provider: 'kick',
            kick_id: kickId,
            username: kickUser.name,
            name: kickUser.name,
            avatar_url: kickUser.profile_picture,
            provider_token: tokenResponse.access_token,
            provider_refresh_token: tokenResponse.refresh_token,
          },
        });

        if (createError || !newUser.user) {
          throw new Error(createError?.message || 'Error al crear usuario');
        }

        return newUser.user.id;
      })();


    // Generar link de magic link para iniciar sesión
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (linkError || !linkData) {
      throw new Error(linkError?.message || 'Error al generar link de sesión');
    }

    // Crear o actualizar perfil
    const supabase = await createServerClient();
    await supabase.from('profiles').upsert([
      {
        id: userId,
        username: kickUser.name,
        full_name: kickUser.name,
        avatar_url: kickUser.profile_picture || null,
      },
    ]);

    // Extraer el token del link y establecer la sesión usando el cliente del servidor
    const linkUrl = new URL(linkData.properties.action_link);
    const tokenHash = linkUrl.hash.substring(1); // Remover el #
    const params = new URLSearchParams(tokenHash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // Establecer sesión usando el cliente del servidor
      const supabase = await createServerClient();
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (sessionError) {
        throw sessionError;
      }
    }

    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`);
    } else {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } catch (error) {
    console.log(error);
    const message = error instanceof Error ? error.message : 'Error al procesar autenticación de KICK';
    return encodedRedirect('error', '/login', message);
  }
}
