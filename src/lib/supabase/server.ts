/**
 * Supabase Server Client
 *
 * Digunakan di SERVER COMPONENTS dan ROUTE HANDLERS.
 * Menggunakan service role key atau anon key — tergantung konteks.
 *
 * Catatan: Kita TIDAK pakai Supabase Auth (sesuai PRD: tanpa akun).
 * Cookie yang kita pakai adalah HMAC passcode (badongan_gate),
 * bukan session Supabase. Maka server client ini hanya butuh
 * NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 *
 * Untuk operasi yang menyentuh secret (gate, surprise RPC server-side),
 * pakai route handler terpisah — BUKAN client ini.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Buat fresh client per request di server.
 * Tidak bisa pakai singleton seperti browser karena
 * server handle banyak request bersamaan.
 */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
