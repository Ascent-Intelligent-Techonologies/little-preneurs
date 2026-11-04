import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client. Every database call goes through the route
// handlers in app/api (or server components), so this uses the secret
// (service-role) key and the tables carry no RLS policies for the public key
// — see supabase/migrations.
//
// The key must never be exposed with a NEXT_PUBLIC_ prefix. Both the
// Supabase-on-Vercel integration's names and the original names work.
export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)"
    );
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
