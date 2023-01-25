import type { APIRoute } from 'astro';
import { getSupabase } from '../../../../db/db';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const get: APIRoute = async (context) => {
  const { params, request } = context;
  console.log({ params })

  // This is needed if you're planning to invoke your function from a browser.
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = getSupabase(context);
    const { data, error } = await supabase.auth.getSession();

    const { access_token, refresh_token } = data?.session ?? {};
    if (!access_token || !refresh_token) {
      throw new Error("Missing access_token or refresh_token");
    }

    if (error) throw error; 
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}