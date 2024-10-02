import { SupabaseClientTyped } from './client';

export async function fetchUserInfo(client: SupabaseClientTyped, userId: string) {
  const info = await client.rpc('get_user_by_id', { user_id: userId });
  return info.data;
}
