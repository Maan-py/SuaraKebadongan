# ARCHITECTURE — SuaraKebadongan

> Kerangka teknis website SuaraKebadongan — ditulis SEBELUM kode pertama sebagai pegangan implementasi.
> Sumber: `PRD.md` (apa) · `DESIGN.md` (tampilan & gerak) · `SCHEMA.md` (data) · `API_CONTRACT.md` (perilaku interface).
>
> **Konvensi penamaan:** semua identifier kode (file, komponen, fungsi, variabel) memakai **Bahasa Inggris**
> mengikuti best practice ekosistem TypeScript/Next.js. Komentar kode dan copy UI tetap **Bahasa Indonesia**.
> Tiga hal sengaja TIDAK diterjemahkan (lihat Keputusan #11): nama token desain (`--kertas`, `bg-kertas`),
> nama channel realtime (`suara`, `papan`, …), dan path URL publik (`/galeri`, `/chat`, `/notes`).

---

## 1. Ringkasan Stack

| Lapisan | Teknologi | Catatan |
|---|---|---|
| Framework | Next.js **terbaru (16.x)** App Router, TypeScript, direktori `src/` | Owner override atas pin "Next.js 15" di PRD §teknologi |
| Konvensi penjaga rute | `src/proxy.ts` — **bukan** `middleware.ts` | Middleware berganti nama menjadi proxy di Next.js 16 |
| Styling | Tailwind CSS v4 (CSS-first `@theme inline`) | Token dari DESIGN.md dipetakan 1:1 |
| Font | `next/font/google`: Shantell_Sans (`--font-display`), Nunito (`--font-body`), Caveat (`--font-tulis`) | Self-host otomatis, tanpa layout shift |
| Database | Supabase Postgres (skema = SCHEMA.md, RLS anon permisif) | |
| Storage | Supabase Storage bucket publik `foto` | Kompresi dilakukan di klien sebelum unggah |
| Realtime | Supabase Realtime (`postgres_changes` + `broadcast`) | Channel `suara`, `galeri`, `papan` |
| Hosting | Vercel (free tier) | Env vars diset di dashboard |
| Animasi | Lenis + GSAP ScrollTrigger + Motion (CORE); React Spring (RECOMMENDED) | Three.js & Trig.js DILARANG |

---

## 2. Diagram Arsitektur

```
                            ┌─────────────────────────────────────────┐
 pengunjung ──── HTTP ────▶ │  src/proxy.ts  (runtime nodejs)         │
                            │  verifikasi cookie badongan_gate        │
                            └──────────┬───────────────────┬──────────┘
                              invalid/ │                   │ valid
                              tanpa    ▼                   ▼
                     ┌─────────────────────┐    ┌──────────────────────────┐
                     │  /  GERBANG         │    │  route group (app)/      │
                     │  page.tsx           │    │  /galeri  /chat  /notes  │
                     │  └ GateCard         │    │  layout: TabBar+Logout+  │
                     │    ('use client')   │    │  offline + SurpriseBtn   │
                     └──────────┬──────────┘    │  template.tsx crossfade  │
                                │               └───────────▲──────────────┘
                     POST /api/gate          redirect setelah│cookie terpasang
                                │                             │
                     benar: Set-Cookie badongan_gate ───────────┘
                     salah: {ok:false} ramah · ≥10 gagal/60dtk: 429 {locked:true}
```

```
 Browser ── supabase-js (anon key publik) ──▶ Supabase: Postgres(RLS) · Storage(foto) · Realtime(3 channel)
        ── fetch /api/gate, /api/surprise ──▶ Route Handler (server) ──▶ env GATE_PASSCODE/GATE_SECRET
```

Prinsip besar: **dua pintu keluar browser** — konten kenangan lewat klien Supabase
langsung (cepat, realtime native); operasi yang menyentuh *secret* lewat route handler server.

---

## 3. Peta Direktori `src/`

```
src/
├── proxy.ts                      # Gate keeper: cek cookie, redirect 307 (BUKAN middleware.ts!)
├── app/
│   ├── layout.tsx                # <html lang="id"> + 3 font variable + body bg-kertas tekstur
│   ├── globals.css               # token :root verbatim DESIGN.md + @theme inline + class komponen (.tape dll.)
│   ├── page.tsx                  # GERBANG "/" — satu-satunya rute luar grup
│   ├── api/
│   │   ├── gate/route.ts         # POST masuk (timingSafeEqual + rate-limit) · DELETE keluar
│   │   └── surprise/route.ts     # GET foto acak ≠ sebelumnya (RPC random_photo)
│   └── (app)/                    # area SETELAH gerbang — URL tetap /galeri dst.
│       ├── layout.tsx            # App Shell: TabBar, LogoutButton, OfflineBanner, slot SurpriseButton
│       ├── template.tsx          # crossfade antarhalaman (fade 200ms; instan saat reduced-motion)
│       ├── galeri/page.tsx       # F2: unggah+kompresi, album, masonry polaroid, lightbox
│       ├── chat/page.tsx         # F3: identitas per-pesan, riwayat 50, realtime
│       └── notes/page.tsx        # F4: papan cat tempel optimistic + sinkron realtime
├── components/
│   ├── gate/GateCard.tsx             # kartu karton + semua state (kosong/loading/galat/lockout)
│   ├── shell/TabBar.tsx              # mobile bottom h64px ↔ desktop header; target ≥44px
│   ├── shell/LenisProvider.tsx       # smooth scroll; konduktor jam gsap.ticker (pola DESIGN.md:458-468)
│   ├── shell/OfflineBanner.tsx       # "Sinyal hilang — kenangan tidak kemana-mana kok…"
│   ├── shell/LogoutButton.tsx        # DELETE /api/gate → push /
│   ├── gallery/UploadZone.tsx        # drag&drop + validasi + pipeline kompresi
│   ├── gallery/PhotoCard.tsx         # .bingkai-polaroid + rotasi bergantian + tape aksen
│   ├── gallery/PhotoLightbox.tsx     # prev/next/takarir/tanggal/pindah album/unduh/hapus + focus trap
│   ├── gallery/AlbumModal.tsx        # buat album + chip filter
│   ├── chat/ChatBubble.tsx           # bubble --karton; milik-sendiri tint --tape-hijau
│   ├── chat/MessageComposer.tsx      # counter sisa 500 + debounce spam
│   ├── chat/AnimalAvatar.tsx         # 6 SVG hewan gambar-tangan (props: animal, color)
│   ├── chat/TypingIndicator.tsx      # broadcast anonim, hilang 3 dtk
│   ├── notes/NoteComposer.tsx        # textarea 280 + swatch 6 warna berlabel
│   ├── notes/NoteCard.tsx            # pin/tape bergantian + popover edit inline
│   └── surprise/SurpriseButton.tsx   # stiker "Inget ga sih?" global + modal foto acak
└── lib/
    ├── supabase/client.ts        # browser client (anon key — memang dirancang publik)
    ├── supabase/server.ts        # server client utk route handler
    ├── session.ts                # buat & verifikasi nilai HMAC cookie (constant-time)
    ├── motion.ts                 # SATU saklar reduced-motion: isMotionAllowed()
    └── compress.ts               # canvas → WebP q0.85 sisi ≤2000px (fallback JPEG q0.85)
```

---

## 4. Strategi Server vs Client Components

| Unit | Mode | Alasan |
|---|---|---|
| `proxy.ts`, `api/gate/*`, `api/surprise/*` | **Server-only** | Menyentuh `GATE_PASSCODE`/`GATE_SECRET`; tidak boleh sampai bundle browser |
| `app/layout.tsx` | RSC | Muat font & shell statis sekali di server |
| `page.tsx` gerbang, tiap `page.tsx` fitur | **RSC tipis** → render 1 komponen `'use client'` | Halaman tetap punya entry server (SEO/metadata), interaktivitas terkurung di anak |
| `template.tsx` | `'use client'` | Butuh animasi Motion saat navigasi |
| Semua komponen `components/**` interaktif | `'use client'` | Form, realtime subscription, animasi |

Aturan praktis: **default RSC; turun ke `'use client'` hanya jika butuh state/event/animasi/subscription** — dan hanya pada daun paling kecil, bukan layout.

---

## 5. Alur Autentikasi Gerbang (F1)

1. Pengunjung buka URL apa pun → `proxy.ts` cek cookie `badongan_gate`; tidak valid → redirect 307 ke `/`.
2. Gerbang: submit passcode → `POST /api/gate`.
3. Server bandingkan dengan `crypto.timingSafeEqual` (**hash kedua sisi dulu**, tahan timing attack).
4. Benar → Set-Cookie `badongan_gate = HMAC-SHA256(GATE_PASSCODE, GATE_SECRET)` — httpOnly, secure, sameSite=lax, Max-Age 7 hari → klien push `/galeri`.
5. Salah → catat `gate_attempts(ip_hash = SHA-256(IP + salt harian))`; hitung window 60 detik; ≥10 gagal → `429 {locked:true}`.
6. Verifikasi berikutnya cukup recompute HMAC + compare constant-time — **tanpa tabel sesi** (stateless).
7. Keluar: `DELETE /api/gate` menghapus cookie → proxy mengembalikan ke gerbang.

---

## 6. Lapisan Data & Realtime

| Fitur | Baca | Tulis | Langganan Realtime |
|---|---|---|---|
| F2 Galeri | `photos` join `albums` (client select) | upload Storage → insert row; update caption/tanggal/album_id; delete row+objek | channel `galeri`: `DELETE photos` |
| F3 Suara | `messages` DESC LIMIT 50 → reverse render | insert `{body, alias, avatar}` (identitas digenerate klien PER PESAN) | channel `suara`: INSERT `messages` + broadcast `mengetik` (throttle 2 dtk, indikator mati 3 dtk) |
| F4 Papan | `notes` DESC | optimistic insert/update/delete → rekonsiliasi by-id, last-write-wins `updated_at` | channel `papan`: INSERT/UPDATE/DELETE `notes` |
| F5 Kejutan | `GET /api/surprise?exclude=` (RPC `random_photo`) | — | — |

Aturan: **tidak ada BFF passthrough untuk konten** — latensi rendah, realtime gratis;
route handler hanya untuk operasi berkunci rahasia (gate, surprise RPC server-side).

---

## 7. Animasi & Performa

- **Tiering** sesuai tabel DESIGN.md:413–427 — CORE: Lenis (smooth scroll), GSAP ScrollTrigger, Motion (UI); RECOMMENDED naik kapal: React Spring (bubble chat, cat tempel); DILARANG: Three.js, Trig.js.
- **Satu saklar gerak**: semua animasi membaca `isMotionAllowed()` (`lib/motion.ts`, wrapper matchMedia + `useReducedMotion` dari `motion/react`). Tidak boleh ada `matchMedia` liar lain.
- **Batas dynamic-import**: `gsap` + `ScrollTrigger` HANYA di komponen Galeri (hemat bundle HP); Lenis hidup di `LenisProvider`.
- **Budget**: total JS animasi ≤±60KB gzip (asersi keras ≤70KB) — diukur dari chunk `.next/static` saat build QA.
- **Kompresi di tepi klien**: file ≤10MB divalidasi → canvas WebP q0.85 sisi ≤2000px → baru menyentuh jaringan; thumbnail lazy-load, foto asli hanya di lightbox.
- Animasi hanya `transform`/`opacity` — tidak pernah layout property (aturan anti-jank).

---

## 8. Keamanan & Privasi

1. **Sesi stateless** — cookie bernilai HMAC yang selalu bisa dihitung ulang server; tidak ada tabel sesi. Trade-off diterima: tak bisa mencabut satu perangkat spesifik; cukup logout global + kedaluwarsa 7 hari.
2. **Kebersihan secret** — `GATE_PASSCODE`, `GATE_SECRET` TANPA prefix `NEXT_PUBLIC_` sehingga mustahil masuk bundle browser. Sebaliknya `NEXT_PUBLIC_SUPABASE_ANON_KEY` memang dirancang publik; penjaganya RLS, bukan kerahasiaan key.
3. **Anti brute-force** — rate-limit per `ip_hash` salt harian: jejak tak bisa dibalik jadi alamat dan otomatis hangus saat ganti hari; IP mentah tidak pernah disimpan.
4. **Anonimitas by schema** — `messages` tanpa kolom identitas apa pun (PRD janji produk); nama samaran/avatar hanyalah dekorasi acak per pesan.
5. **Postur RLS anon permisif** — semua yang lolos gerbang dipercaya sama ("prinsip saling percaya"); keputusan sadar dan didokumentasikan, cocok untuk grup tertutup ±10–30 orang.

---

## 9. Keputusan Arsitektur Penting

1. **`proxy.ts`, bukan `middleware.ts`** — konvensi resmi Next.js 16; runtime tetap Node.js karena proxy tidak mendukung edge dan kita butuh modul `crypto` node.
2. **Route group `(app)`** — satu shell bersama (tab bar, keluar, offline, tombol kejutan) tanpa mengubah struktur URL. Nama grup tidak ikut URL, maka bebas dinamai English.
3. **Tanpa BFF untuk konten** — klien → Supabase langsung; server hanya di depan secret. Lebih sedikit lompatan jaringan, realtime tetap end-to-end.
4. **Halaman = RSC tipis, interaktivitas = komponen daun client** — menjaga area hidrasi sekecil mungkin.
5. **Sesi stateless HMAC** — nol tabel sesi, nol roundtrip DB di jalur panas (dicek proxy per request).
6. **Saklar reduced-motion terpusat** — audit 13/13 perilaku DESIGN.md tinggal memeriksa satu modul (`lib/motion.ts`).
7. **Dynamic import hanya pustaka berat** — GSAP/ScrollTrigger dimuat malas khusus Galeri; budget gzip terjaga.
8. **Kompresi sebelum jaringan** — hemat kuota Storage free tier dan kuota data pengguna sekaligus.
9. **Tailwind v4 CSS-first** — token DESIGN.md tetap satu sumber kebenaran; utility (`bg-kertas`, `font-tulis`) lahir dari pemetaan `@theme inline`, bukan duplikasi hex.
10. **Tanpa framework unit-test** — keputusan terdokumentasi: QA bertingkat (`tsc --noEmit` → lint → build produksi → assertion struktural → smoke Playwright end-to-end). Cukup untuk skala ini; framework baru bisa menyusul bila kompleksitas meminta.
11. **Identifier kode = English, komentar & copy UI = Indonesian** — best practice ekosistem TS/Next (tooling, autocomplete, konvensi komunitas). Tiga pengecualian sadar yang tetap Bahasa Indonesia: (a) **token desain** `--kertas`, `--tinta`, `--tape-hijau`, dst. + utility turunannya (`bg-kertas`) — dikunci oleh DESIGN.md sebagai satu sumber kebenaran visual; (b) **nama channel/event realtime** `suara`, `galeri`, `papan`, `mengetik` — bagian dari protokol wire yang sudah dikontrak di API_CONTRACT.md sekaligus identitas produk; (c) **path URL publik** `/galeri`, `/chat`, `/notes` — adalah microcopy produk yang dispesifikasi eksplisit di PRD F1–F4.

---

*Konsistensi penamaan file/kolom/channel mengacu ke `SCHEMA.md` dan `API_CONTRACT.md`. Perubahan arah arsitektur wajib memperbarui dokumen ini lebih dulu, baru kodenya.*
