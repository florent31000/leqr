import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) {
    throw new Error("Supabase non configuré — vérifiez vos variables d'environnement.");
  }
  _supabase = createClient(url, key);
  return _supabase;
}

export const supabase = typeof window !== "undefined"
  ? (() => {
      try { return getSupabase(); } catch { return null as unknown as SupabaseClient; }
    })()
  : (null as unknown as SupabaseClient);

export type QRCode = {
  id: string;
  user_id: string;
  short_code: string;
  initial_target_url: string;
  target_url: string;
  label: string | null;
  fg_color: string;
  bg_color: string;
  is_dynamic: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: string;
  qr_id: string;
  ip: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  referer: string | null;
  scanned_at: string;
};
