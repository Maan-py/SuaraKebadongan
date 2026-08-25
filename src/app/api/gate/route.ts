/**
 * POST /api/gate — Validasi passcode & set cookie sesi
 * DELETE /api/gate — Hapus cookie (keluar)
 *
 * Alur (ARCHITECTURE.md §5):
 * 1. POST terima { passcode }
 * 2. Hash passcode → bandingkan dengan GATE_PASSCODE (timingSafeEqual)
 * 3. Cocok → set cookie HMAC httpOnly 7 hari
 * 4. Salah → catat attempt, ≥10/60dtk → 429
 * 5. DELETE → hapus cookie → redirect ke /
 */

import { NextResponse } from "next/server";
import crypto from "node:crypto";

/* ── Helper: hash data ────────────────────────────────────── */
function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/* ── Helper: buat HMAC cookie value ───────────────────────── */
function makeCookieValue(): string {
  const passcode = process.env.GATE_PASSCODE!;
  const secret = process.env.GATE_SECRET!;
  return crypto.createHmac("sha256", secret).update(passcode).digest("hex");
}

/* ── Helper: bandingkan dua string secara constant-time ───── */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/* ── Helper: dapat IP dari request ────────────────────────── */
function getClientIp(request: Request): string {
  // Vercel/Fly.io/etc. menyimpan IP di x-forwarded-for
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
}

/* ── Helper: hash IP + salt harian ────────────────────────── */
function hashIp(ip: string): string {
  const secret = process.env.GATE_SECRET!;
  // Salt harian: SHA-256(GATE_SECRET + tanggal) → jejak hangus saat ganti hari
  const today = new Date().toISOString().slice(0, 10); // "2026-08-25"
  const dailySalt = sha256(secret + today);
  return sha256(ip + dailySalt);
}

/* ── POST /api/gate ───────────────────────────────────────── */
export async function POST(request: Request) {
  // Pastikan env sudah di-set
  if (!process.env.GATE_PASSCODE || !process.env.GATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Konfigurasi gerbang belum lengkap." },
      { status: 500 }
    );
  }

  // Parse body
  let body: { passcode?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Data tidak valid." },
      { status: 400 }
    );
  }

  const inputPasscode = (body.passcode ?? "").trim();
  if (!inputPasscode) {
    return NextResponse.json(
      { ok: false, message: "Isi dulu suara pintunya ya." },
      { status: 400 }
    );
  }

  // ── Bandingkan passcode ──────────────────────────────────
  // Kita hash input dulu, lalu bandingkan dengan GATE_PASSCODE yang sudah di-hash
  const inputHash = sha256(inputPasscode);
  const expectedHash = sha256(process.env.GATE_PASSCODE!);
  const isCorrect = safeCompare(inputHash, expectedHash);

  if (isCorrect) {
    // ✅ Passcode benar → set cookie
    const cookieValue = makeCookieValue();
    const response = NextResponse.json({ ok: true });

    response.cookies.set("badongan_gate", cookieValue, {
      httpOnly: true, // JS tidak bisa baca (anti XSS)
      secure: process.env.NODE_ENV === "production", // HTTPS only di production
      sameSite: "lax", // CSRF protection
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari (detik)
    });

    return response;
  }

  // ❌ Passcode salah → catat attempt
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);

  // Catat attempt ke Supabase (best-effort — kalau gagal, tetap tolak)
  try {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = createServerClient();

    await supabase.from("gate_attempts").insert({ ip_hash: ipHash });
  } catch {
    // Supabase belum terkonfigurasi — abaikan, tetap tolak
  }

  // Cek rate limit: hitung attempt di window 60 detik terakhir
  let isLocked = false;
  try {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = createServerClient();
    const sixtySecsAgo = new Date(Date.now() - 60 * 1000).toISOString();

    const { count } = await supabase
      .from("gate_attempts")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("attempted_at", sixtySecsAgo);

    if (count && count >= 10) {
      isLocked = true;
    }
  } catch {
    // Supabase belum terkonfigurasi — skip rate limit check
  }

  if (isLocked) {
    return NextResponse.json(
      {
        ok: false,
        locked: true,
        message:
          "Pintunya baru saja diketuk terus-menerus. Istirahat sebentar ya, satu menit lagi boleh coba lagi.",
      },
      { status: 429 }
    );
  }

  // Passcode salah, belum lockout
  return NextResponse.json({
    ok: false,
    message: "Hmm, itu bukan suara pintu Badongan. Coba ingat-ingat lagi ya.",
  });
}

/* ── DELETE /api/gate ─────────────────────────────────────── */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  // Hapus cookie dengan mengatur maxAge ke 0
  response.cookies.set("badongan_gate", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
