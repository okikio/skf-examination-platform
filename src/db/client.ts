import { createClient } from "@supabase/supabase-js";
import { getApiKey } from "../utils/consts";

const supabaseUrl = "https://ccsgfooankckfqpmcfyb.supabase.co";

let supabaseClient: ReturnType<typeof createClient> = null;
export const supabase = async () => {
  if (supabaseClient) return supabaseClient;
  const supabaseKey = (await getApiKey()) || "";
  return (supabaseClient = createClient(supabaseUrl, supabaseKey));
};
