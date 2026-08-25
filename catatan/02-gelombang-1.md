# Bab 2 — Gelombang 1: Git Init, Scaffold, Design Tokens

> 25 Agustus 2026

## Apa yang Dikerjakan

1. `git init` → repository lokal dibuat, branch `main`
2. `.gitignore` → node_modules, .next, .env, .omo
3. Commit pertama: 6 dokumen perencanaan + .gitignore + CATATAN-BELAJAR
4. `npm create next-app@latest` → scaffold ke folder tmp, pindah ke root
5. Fix `package.json` name: "suara-kebadongan"
6. Hapus default SVG assets (file.svg, globe.svg, dll)
7. `globals.css`: 14 warna + 3 font + spasi grid 4px + radius + body base style
8. `layout.tsx`: 3 Google Fonts (Shantell_Sans, Nunito, Caveat) + noise texture overlay
9. `page.tsx`: placeholder GERBANG sementara

## Yang Dipelajari

### Kenapa `npm create next-app` tidak bisa langsung di folder yang sudah ada?
npm melarang project name dengan huruf kapital (aturan npm, bukan Next.js). Solusi: scaffold ke folder tmp (`suara-kebadongan-tmp`), lalu pindahkan file ke root.

### Kenapa `next-env.d.ts` hilang setelah pindah folder?
File ini di-auto-generate oleh Next.js saat pertama kali build/dev. Kalau hilang, `LayoutProps` type tidak dikenal → tsc error. Solusi: jalankan `next build` sekali untuk generate.

### Tailwind v4 `@theme inline` — bagaimana cara kerjanya?
- `:root { --kertas: #FFFDF7 }` → CSS custom property biasa
- `@theme inline { --color-kertas: var(--kertas) }` → menghubungkan ke Tailwind engine
- Setelah itu `bg-kertas` jadi utility class yang valid
- Tanpa mapping ini, Tailwind tidak tahu warna `--kertas` artinya apa

### Kenapa noise texture pakai `div` fixed + `aria-hidden`?
- Noise adalah dekorasi murni (non-informational) → harus `aria-hidden="true"`
- `pointer-events-none` agar tidak mengganggu klik/scroll
- `z-50` + `opacity-[0.03]` → sangat halus, tidak mengganggu konten
- `position: fixed` → texture tetap di tempat saat scroll (kesan "kertas asli")

## Commits

- `247db59` — init: baseline project docs + .gitignore + CATATAN-BELAJAR
- `1fcbcb0` — scaffold: Next.js 16.3.2 + React 19 + Tailwind v4 + TypeScript 5
- `7968be0` — tokens: design tokens → globals.css + layout.tsx

**Lanjut → [Bab 3: Gelombang 2 — Supabase + Env Vars + Komponen Awal](./03-gelombang-2.md)**
