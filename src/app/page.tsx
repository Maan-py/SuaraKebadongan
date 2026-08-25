import type { Metadata } from "next";
import GateCard from "@/components/gate/GateCard";

export const metadata: Metadata = {
  title: "SuaraKebadongan — Kenangan Digital KKN",
  description:
    "Galeri kenangan digital anggota KKN Desa Kebadongan, Kebumen.",
};

/* ── GERBANG "/" ─────────────────────────────────────────────
 * Halaman gerbang: satu kartu passcode di tengah layar.
 * GateCard adalah CLIENT COMPONENT (butuh useState, fetch, router).
 * Metadata ini adalah SERVER COMPONENT — menjalankan di server.
 *
 * Proxy (src/proxy.ts) sudah menangani:
 * - Cookie valid + path "/" → redirect ke /galeri
 * - Cookie invalid + path "/" → izinkan (halaman ini)
 * ──────────────────────────────────────────────────────────── */

export default function GerbangPage() {
  return <GateCard />;
}
