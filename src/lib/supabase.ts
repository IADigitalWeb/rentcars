import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
}

export const STORAGE_FOLDERS = {
  CARS: "cars",
  CATEGORIES: "categories",
} as const;

export async function uploadImage(folder: string, file: File): Promise<string> {
  const admin = createAdminClient();
  const ext = file.name.split(".").pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await admin.storage.from(supabaseBucket).upload(filename, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return filename;
}

export async function deleteImage(path: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.storage.from(supabaseBucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

export function getPublicUrl(path: string): string {
  const client = createClient();
  const { data } = client.storage.from(supabaseBucket).getPublicUrl(path);
  return data.publicUrl;
}
