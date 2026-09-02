/**
 * GateCard — Kartu gerbang passcode
 *
 * Satu-satunya pintu masuk seluruh website (PRD F1).
 * Desain: DESIGN.md §186-217 (Gerbang Passcode `/`)
 *
 * State:
 * - idle: form aktif, tombol bisa diklik
 * - loading: tombol disabled, teks "Mengetuk-ngetuk…"
 * - error: pesan galat ramah di bawah input
 * - lockout: rate-limit terkunci (429)
 *
 * Animasi (DESIGN.md §205):
 * - Mount: fade + naik 8px, 400ms ease-out
 * - Error: shake ±4px, 300ms ease-in-out
 * - Reduced-motion: statis tanpa animasi
 */

"use client";

import { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";

type GateState = "idle" | "loading" | "error" | "lockout";

export default function GateCard() {
  const [state, setState] = useState<GateState>("idle");
  const [message, setMessage] = useState("");
  const [passcode, setPasscode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  /* ── Submit handler ─────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = passcode.trim();
    if (!trimmed) {
      setState("error");
      setMessage("Isi dulu suara pintunya ya.");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: trimmed }),
      });

      const data = await res.json();

      if (res.status === 429 && data.locked) {
        // Rate-limit terkunci
        setState("lockout");
        setMessage(data.message);
        return;
      }

      if (data.ok) {
        // ✅ Passcode benar → redirect ke beranda
        router.push("/beranda");
        return;
      }

      // ❌ Passcode salah
      setState("error");
      setMessage(data.message);
      setPasscode("");
      inputRef.current?.focus();
    } catch {
      setState("error");
      setMessage("Ada gangguan jaringan. Coba lagi ya.");
    }
  }

  return (
    <motion.main
      className="bg-karton flex min-h-screen items-center justify-center p-6"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative w-full max-w-[420px]">
        {/* ── Doodles Latar Belakang ────────────────────────── */}
        <div aria-hidden="true" className="pointer-events-none">
          {/* Kamera */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute -left-16 top-10 text-tinta/10 -rotate-12 hidden sm:block">
            <rect x="10" y="22" width="60" height="46" rx="6" />
            <circle cx="40" cy="45" r="14" />
            <circle cx="40" cy="45" r="8" />
            <path d="M28 22V18a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4" />
            <circle cx="58" cy="32" r="3" />
          </svg>
          
          {/* Kertas Catatan */}
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute -right-20 bottom-32 text-tinta/10 rotate-12 hidden sm:block" strokeDasharray="4 4">
            <rect x="16" y="12" width="48" height="56" rx="4" />
            <line x1="24" y1="24" x2="56" y2="24" />
            <line x1="24" y1="32" x2="48" y2="32" />
            <line x1="24" y1="40" x2="52" y2="40" />
          </svg>

          {/* Bintang */}
          <svg className="absolute -top-10 -right-8 text-terracotta/20 rotate-45" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 2v20M2 12h20M7.05 7.05l9.9 9.9M7.05 16.95l9.9-9.9" />
          </svg>

          {/* Hati */}
          <svg className="absolute -bottom-8 -left-10 text-stiker-pink/40 -rotate-12" width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>

        {/* ── Tape putih miring -2° di tepi atas ────────────── */}
        <div
          className="absolute -top-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 -rotate-2 rounded-sm bg-polaroid opacity-90"
          aria-hidden="true"
        />
        {/* Pin Image */}
        <img 
          src="/push-pin.png" 
          alt="Pin" 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 object-contain drop-shadow-sm z-20 hover:scale-110 transition-transform"
        />

        {/* ── Kartu utama ─────────────────────────────────── */}
        <motion.div
          className="relative rounded-modal bg-polaroid p-8 shadow-[0_2px_4px_rgba(0,0,0,.15),0_12px_32px_rgba(0,0,0,.25)]"
          animate={
            !shouldReduceMotion && state === "error"
              ? { x: [0, -4, 4, -4, 4, 0] }
              : { x: 0 }
          }
          transition={
            !shouldReduceMotion && state === "error"
              ? { duration: 0.3, ease: "easeInOut" }
              : undefined
          }
        >
          {/* ── Stiker bintang merah pojok ────────────────── */}
          <div
            className="absolute -right-2 -top-2 text-2xl"
            style={{ color: "var(--terracotta)" }}
            aria-hidden="true"
          >
            ★
          </div>

          {/* ── Judul ──────────────────────────────────────── */}
          <h1 className="font-display text-xl text-terracotta">
            Selamat Datang
          </h1>

          {/* ── Subjudul ──────────────────────────────────── */}
          <p className="mt-3 font-body text-base text-tinta-lembut">
            Ucapkan password sebelum masuk
          </p>

          {/* ── Form passcode ─────────────────────────────── */}
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="passcode" className="sr-only">
              Passcode bersama
            </label>
            <div className="relative mb-4 mt-8">
              <input
                ref={inputRef}
                id="passcode"
                type="text"
                maxLength={9}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                disabled={state === "loading" || state === "lockout"}
                className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
                autoComplete="off"
                aria-describedby={message ? "gate-message" : undefined}
              />
              
              <div className="flex w-full justify-center gap-1 sm:gap-2 font-display text-xl tracking-widest text-terracotta" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex h-12 w-8 sm:w-10 items-end justify-center border-b-2 border-terracotta/40 pb-1">
                    {passcode[i] || '\u00A0'}
                  </span>
                ))}
                <span className="flex h-12 w-6 items-end justify-center pb-1 text-terracotta">
                  &amp;
                </span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i+4} className="flex h-12 w-8 sm:w-10 items-end justify-center border-b-2 border-terracotta/40 pb-1">
                    {passcode[i+4] || '\u00A0'}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Tombol "Ketuk Pintu" ────────────────────── */}
            <button
              type="submit"
              disabled={state === "loading" || state === "lockout"}
              className="mt-3 w-full rounded-pill bg-terracotta px-6 py-3 font-body text-base font-semibold text-polaroid transition-colors hover:bg-terracotta-700 disabled:opacity-50"
            >
              {state === "loading" ? "Mengetuk-ngetuk…" : "Ketuk Pintu"}
            </button>
          </form>

          {/* ── Pesan galat / lockout ─────────────────────── */}
          {message && (
            <p
              id="gate-message"
              aria-live="polite"
              className={`mt-4 font-body text-sm ${
                state === "lockout" ? "text-terracotta" : "text-tinta-lembut"
              }`}
            >
              {message}
            </p>
          )}

          {/* ── Anotasi Caveat ────────────────────────────── */}
          {/* <p className="mt-6 font-tulis text-sm text-tinta-lembut italic">
            sst… jangan bocorkan ke desa sebelah
          </p> */}
        </motion.div>

        {/* ── Foto Hint (Tahu Tempe) ────────────────────────── */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, delay: 0.2, type: 'spring' }}
          className="relative mx-auto mt-8 w-48 rounded-radius-kartu bg-polaroid p-2 pb-6 shadow-[2px_3px_8px_rgba(46,33,24,.12)] transition-transform hover:scale-105"
        >
          {/* Pin Image */}
          <img 
            src="/push-pin.png" 
            alt="Pin" 
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 object-contain drop-shadow-sm z-20 hover:scale-110 transition-transform"
          />
          
          <div className="relative overflow-hidden rounded-sm">
            <img 
              src="/curut.jpeg" 
              alt="Hint Password" 
              className="block w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-sepia-terang/10 mix-blend-multiply" />
          </div>
          <p className="mt-2 text-center font-tulis text-sm text-tinta-gelap/80">
            hint password: nama curut ini 👀
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
