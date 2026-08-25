/**
 * Supabase Browser Client
 *
 * Digunakan di CLIENT COMPONENT ('use client').
 * Menggunakan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
 * yang memang dirancang untuk dikirim ke browser.
 *
 * Keamanan: anon key publik, penjaganya RLS (ARCHITECTURE.md §8.3).
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Satu instance untuk seluruh browser session.
 * Jangan buat baru di dalam component — gunakan yang sudah di-export ini.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
