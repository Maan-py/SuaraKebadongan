import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SuaraKebadongan — Kenangan Digital KKN",
  description:
    "Galeri kenangan digital anggota KKN Desa Kebadongan, Kebumen.",
};

/* ── GERBANG "/" — placeholder ──────────────────────────────
 * Halaman gerbang asli (GateCard, form passcode, validasi HMAC)
 * akan dibangun di Gelombang 2.
 * Placeholder ini memastikan design tokens sudah terpasang benar:
 *   - bg-kertas → latar kertas gading
 *   - text-tinta → teks coklat kehitaman
 *   - font-display → Shantell Sans
 *   - font-body → Nunito
 *   - font-tulis → Caveat
 * ──────────────────────────────────────────────────────────── */

export default function GerbangPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="font-display text-2xl text-tinta">Selamat datang di Badongan</h1>
      <p className="mt-4 font-body text-base text-tinta-lembut">
        Galeri kenangan digital KKN Desa Kebadongan
      </p>
      <p className="mt-6 font-tulis text-lg text-tinta-lembut">
        sst… jangan bocorkan ke desa sebelah
      </p>
    </main>
  );
}
