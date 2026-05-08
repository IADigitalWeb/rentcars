import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
}

export const STORAGE_BUCKETS = {
  CARS: "cars",
  AVATARS: "avatars",
  CATEGORIES: "categories",
} as const;
