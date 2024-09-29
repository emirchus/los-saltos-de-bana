import { SupabaseClientTyped } from './client';

export async function fetchUserInfo(client: SupabaseClientTyped, userId: string) {
  const info = await client.from('profiles').select('*').eq('id', userId).single();

  return info.data;
}
