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
        // ✅ Passcode benar → redirect ke galeri
        router.push("/galeri");
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
      className="flex min-h-screen items-center justify-center bg-stiker-merah p-6"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative w-full max-w-[420px]">
        {/* ── Tape hijau miring -2° di tepi atas ──────────── */}
        <div
          className="absolute -top-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 -rotate-2 rounded-sm opacity-80"
          style={{
            background: "linear-gradient(90deg, var(--tape-hijau) 0%, var(--tape-hijau) 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── Kartu utama ─────────────────────────────────── */}
        <motion.div
          className="relative rounded-modal bg-karton p-8 shadow-[0_2px_4px_rgba(0,0,0,.15),0_12px_32px_rgba(0,0,0,.25)]"
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
            style={{ color: "var(--marker-kuning)" }}
            aria-hidden="true"
          >
            ★
          </div>

          {/* ── Judul ──────────────────────────────────────── */}
          <h1 className="font-display text-xl text-tinta">
            Selamat datang di Badongan.
          </h1>

          {/* ── Subjudul ──────────────────────────────────── */}
          <p className="mt-3 font-body text-base text-tinta-lembut">
            Satu pintu untuk semua anggota. Kalau kamu pernah tinggal di sini,
            kamu pasti tahu suaranya.
          </p>

          {/* ── Form passcode ─────────────────────────────── */}
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="passcode" className="sr-only">
              Passcode bersama
            </label>
            <input
              ref={inputRef}
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="psst… ketik suara pintunya"
              disabled={state === "loading" || state === "lockout"}
              className="w-full rounded-tape border border-garis-kertas bg-polaroid px-4 py-3 font-body text-base text-tinta-gelap placeholder:text-tinta-gelap/60 focus:border-tape-hijau focus:outline-none focus:ring-2 focus:ring-tape-hijau/30 disabled:opacity-50"
              autoComplete="off"
              aria-describedby={message ? "gate-message" : undefined}
            />

            {/* ── Tombol "Ketuk Pintu" ────────────────────── */}
            <button
              type="submit"
              disabled={state === "loading" || state === "lockout"}
              className="mt-3 w-full rounded-pill bg-marker-kuning px-6 py-3 font-body text-base font-semibold text-tinta-gelap transition-colors hover:bg-kuning-300 disabled:opacity-50"
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
                state === "lockout" ? "text-stiker-merah" : "text-tinta-lembut"
              }`}
            >
              {message}
            </p>
          )}

          {/* ── Anotasi Caveat ────────────────────────────── */}
          <p className="mt-6 font-tulis text-sm text-tinta-lembut italic">
            sst… jangan bocorkan ke desa sebelah
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
