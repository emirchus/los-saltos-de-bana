"use server";

import "server-only";

import { createClient } from "@/lib/supabase/server";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') as string;
  const supabase = await createClient();
  const { data, error } = await supabase.from('user_stats').select('profile_pic').eq('username', username).single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  // return new Response(JSON.stringify(data), { status: 200 });

  // if data.profile_pic is not null, stream the image from the url
  if (data.profile_pic) {
    const response = await fetch(data.profile_pic);
    return new Response(response.body, { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Profile picture not found' }), { status: 404 });
}