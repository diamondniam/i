import type { Database } from "@/types/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  return createSupabaseClient<Database>(supabaseUrl, supabaseKey);
}
