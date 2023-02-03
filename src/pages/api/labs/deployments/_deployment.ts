import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '@/workers/config';

import rascal from 'rascal';
const { createBrokerAsPromised } = rascal;

export async function getLabs(supabase: SupabaseClient<any, "public", any>) { 
  const { data, error } = await supabase.auth.getSession();

  const { access_token, refresh_token } = data?.session ?? {};
  if (!access_token || !refresh_token) {
    throw new Error("Missing access_token or refresh_token");
  }

  if (error) throw error; 
  const labs = await supabase.from("labs").select("id, name, description, level")
  return labs;
}

export function deployLabs(instanceId: string | number, userId: string | number) {

}