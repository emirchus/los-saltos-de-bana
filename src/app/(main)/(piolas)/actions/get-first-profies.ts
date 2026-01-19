"use server";
import { createPublicClient } from "@/lib/supabase/server";
import "server-only";

export async function getFirstProfiles() {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from('user_stats').select('username').order('points', { ascending: false }).limit(10);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return [
    ...data.map((user) => user.username),
    "emirchus",
    "emaidana09"
  ]
}