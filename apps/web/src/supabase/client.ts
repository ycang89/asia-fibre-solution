import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

/** Browser-safe Supabase client (anon key). Returns null if env is missing. */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

export const supabaseBrowserClient = getSupabaseBrowserClient();
