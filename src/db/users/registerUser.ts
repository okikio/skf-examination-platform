import { supabase } from "../client";

export async function registerUser(email: string, password: string) {
  const { data, error } = await (
    await supabase()
  ).auth.signUp({
    email,
    password,
  });
  if (error) {
    return { data, error: true, message: error.message };
  }
  return { data, error: false };
}
