/**
 * Proxy — Gate keeper untuk Next.js 16
 *
 * CATATAN: Ini BUKAN middleware.ts (deprecated di Next.js 16).
 * Konvensi Next.js 16: gunakan proxy.ts di root src/.
 *
 * Tugas:
 * 1. Cek cookie `badongan_gate` di setiap request
 * 2. Kalau tidak ada/invalid → redirect 307 ke `/` (gerbang)
 * 3. Kalau valid dan path = `/` → redirect ke `/beranda` (sudah login)
 * 4. Kalau valid dan path ≠ `/` → lanjut ke halaman
 *
 * Referensi: ARCHITECTURE.md §5, §9 Keputusan #1
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "node:crypto";

/* ── Helper: hash data ────────────────────────────────────── */
function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/* ── Helper: buat HMAC cookie value ───────────────────────── */
function makeExpectedCookieValue(): string {
  const passcode = process.env.GATE_PASSCODE!;
  const secret = process.env.GATE_SECRET!;
  return crypto.createHmac("sha256", secret).update(passcode).digest("hex");
}

/* ── Helper: verifikasi cookie ────────────────────────────── */
function verifyCookie(cookieValue: string): boolean {
  if (!process.env.GATE_PASSCODE || !process.env.GATE_SECRET) return false;
  const expected = makeExpectedCookieValue();
  if (cookieValue.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected));
}

/* ── Route Matcher ────────────────────────────────────────── */
// Ekspresi regex yang menentukan route mana yang diproteksi proxy.
// Default: semua route KECUALI static files, API routes, dan favicon.
export const config = {
  matcher: [
    /*
     * Match semua path KECUALI:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - file gambar statis (png, jpg, jpeg, svg, dll)
     * - api/* (semua API routes — handle auth sendiri)
     */
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico)|api/).*)",
  ],
};

/* ── Proxy Handler ────────────────────────────────────────── */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieValue = request.cookies.get("badongan_gate")?.value ?? "";
  const isValid = cookieValue ? verifyCookie(cookieValue) : false;

  // ── Kasus 1: Path `/` dan cookie VALID → redirect ke beranda
  // (Edge case: pengunjung yang sudah login membuka `/` langsung)
  if (pathname === "/" && isValid) {
    return NextResponse.redirect(new URL("/beranda", request.url));
  }

  // ── Kasus 2: Path `/` dan cookie TIDAK VALID → izinkan (halaman gerbang)
  if (pathname === "/" && !isValid) {
    return NextResponse.next();
  }

  // ── Kasus 3: Path BUKAN `/` dan cookie TIDAK VALID → redirect ke gerbang
  if (pathname !== "/" && !isValid) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Kasus 4: Path BUKAN `/` dan cookie VALID → izinkan
  return NextResponse.next();
}
