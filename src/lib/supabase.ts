// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types"; // keep types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// Use a custom storage key so you don't conflict with any older clients
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "sb-chowlocal-auth",
  },
});
