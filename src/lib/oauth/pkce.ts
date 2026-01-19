import crypto from 'crypto';

/**
 * Genera un code verifier y code challenge para PKCE (OAuth 2.1)
 */
export function generatePKCE() {
  // Generar code verifier (43-128 caracteres, URL-safe)
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Generar code challenge (SHA256 hash del verifier en base64url)
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  };
}
