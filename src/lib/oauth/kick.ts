import { cookies } from 'next/headers';
import { generatePKCE } from './pkce';

const KICK_AUTHORIZE_URL = 'https://id.kick.com/oauth/authorize';
const KICK_TOKEN_URL = 'https://id.kick.com/oauth/token';
const KICK_API_URL = 'https://kick.com/api/v1';

export interface KickTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface KickUser {
  id: number;
  username: string;
  email?: string;
  bio?: string;
  profile_pic?: string;
  created_at?: string;
}

/**
 * Genera la URL de autorización de KICK con PKCE
 */
export async function getKickAuthorizationUrl(redirectUri: string): Promise<{ url: string; codeVerifier: string }> {
  const clientId = process.env.KICK_CLIENT_ID;

  if (!clientId) {
    throw new Error('KICK_CLIENT_ID no está configurado');
  }

  const { codeVerifier, codeChallenge } = generatePKCE();

  // Guardar code_verifier en cookie para usarlo en el callback
  const cookieStore = await cookies();
  cookieStore.set('kick_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutos
    path: '/',
  });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'user:read',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: crypto.randomUUID(),
  });

  return {
    url: `${KICK_AUTHORIZE_URL}?${params.toString()}`,
    codeVerifier,
  };
}

/**
 * Intercambia el código de autorización por un token de acceso
 */
export async function exchangeKickCodeForToken(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<KickTokenResponse> {
  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('KICK_CLIENT_ID o KICK_CLIENT_SECRET no están configurados');
  }

  const response = await fetch(KICK_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al intercambiar código por token: ${response.status} - ${error}`);
  }

  return response.json();
}

/**
 * Obtiene la información del usuario de KICK
 */
export async function getKickUser(accessToken: string): Promise<KickUser> {
  const response = await fetch(`${KICK_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error al obtener usuario de KICK: ${response.status} - ${error}`);
  }

  return response.json();
}
