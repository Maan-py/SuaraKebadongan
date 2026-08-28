import type { Metadata } from "next";
import { Shantell_Sans, Nunito, Caveat } from "next/font/google";
import "./globals.css";

/* ── Font Google Fonts ──────────────────────────────────────
 * Tiga font, satu per peran (DESIGN.md §Tipografi):
 *   Shantell Sans → display (judul besar, logo, sapaan gerbang)
 *   Nunito         → body (paragraf, tombol, menu, caption)
 *   Caveat         → handwritten (takarir polaroid, catatan pinggir)
 *
 * next/font/google mem-host font secara otomatis → zero layout shift.
 * CSS variable di setiap font dipetakan ke @theme inline di globals.css.
 * ──────────────────────────────────────────────────────────── */

const shantellSans = Shantell_Sans({
  variable: "--font-shantell",
  subsets: ["latin"],
  weight: ["400", "700"],  // regular untuk judul, bold untuk H1
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],  // regular body, semibold tombol, bold judul kartu
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],  // regular untuk anotasi, bold untuk stiker
  display: "swap",
});

/* ── Metadata ────────────────────────────────────────────────
 * SEO basics: title & description. OG image ditambahkan nanti
 * saat file logo/foto tersedia.
 * ──────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "SuaraKebadongan — Kenangan Digital KKN",
  description:
    "Galeri kenangan digital anggota KKN Desa Kebadongan, Kebumen. Seperti buku tahunan sekolah, tapi versi kampung.",
  icons: { icon: "/logo-suara.png" },
};

/* ── Root Layout ─────────────────────────────────────────────
 * Layout ini membungkus SELURUH halaman (public & internal).
 * - lang="id" → bahasa Indonesia (bukan en)
 * - font CSS variables dipetakan ke @theme inline → bisa dipakai
 *   sebagai font-display, font-body, font-tulis di Tailwind
 * - noise texture SVG ditambahkan via className="noise-texture"
 * ──────────────────────────────────────────────────────────── */

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${shantellSans.variable} ${nunito.variable} ${caveat.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col font-body text-tinta">
        {/* Noise texture overlay — SVG feTurbulence halus untuk kesan "serat kertas" */}
        <div
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        {children}
      </body>
    </html>
  );
}
