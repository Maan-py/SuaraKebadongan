# CATATAN-BELAJAR — SuaraKebadongan

> Buku pelajaran pribadi dari proyek ini. Satu bab per gelombang, diakhiri satu bab terakhir setelah F4 selesai.
> Dibuat: 25 Agustus 2026 · Level: Menengah atas (sudah paham React, fokus belajar Next.js + Supabase + arsitektur)

---

## Bab 1 — Big Picture Dunia Web Modern & Arsitektur Proyek Kita

### 1. Peta Besar: Bagaimana Website Bekerja

Setiap kali seseorang membuka alamat website di browser, terjadi percakapan:

```
[Browser/HP/Kamu]  ──HTTP request──▶  [Server]  ──query──▶  [Database]
       ▲                                              │
       └────────────HTTP response──────────────────────┘
```

**Browser (client)**: yang dijalankan di HP/orang — Chrome, Safari, dll. Menjalankan JavaScript, menampilkan halaman.

**Server**: mesin jauh yang menjalankan kode aplikasi — menerima permintaan, memproses, mengirim kembali data.

**Database**: tempat data tersimpan permanen (album, foto, catatan, log passcode). Tanya jawab pakai bahasa SQL.

Dalam bahasa manusiawi, untuk proyek kita:

> Anggota KKN mengetik passcode di browser → browser kirim ke server → server cek ke database apakah passcode cocok → kalau iya, database kasih balik daftar album → browser tampilkan galeri.

---

### 2. Kenapa React → Next.js (Pertanyaan Kunci untuk yang Sudah Paham React)

React memecahkan masalah ini: **membuat UI yang kompleks dari komponen-komponen kecil yang bisa dipakai ulang**. Tanpa framework, React hanya bisa menjalankan JavaScript di sisi browser (*client-side rendering* — semua HTML dihasilkan di browser).

**Masalah murni CSR untuk proyek galeri:**
- SEO buruk (Google tidak bisa baca konten yang dihasilkan JavaScript)
- Loading lambat untuk pengguna pertama (harus download semua JS baru bisa tampil)
- Tidak cocok untuk proyek yang datanya banyak

**Next.js memecahkan ini dengan menambahkan sisi server.**

---

### 3. Next.js App Router — Konsep Inti yang Harus Dipahami

Next.js menggunakan sistem **file-based routing** — struktur folder menentukan halaman website:

```
app/
  ├── page.tsx           → halaman utama (URL: /)
  ├── galeri/page.tsx    → halaman galeri (URL: /galeri)
  ├── admin/page.tsx     → halaman admin (URL: /admin)
  └── layout.tsx         → layout bersama yang membungkus semua halaman
```

**Yang membuat Next.js modern (v16+) berbeda dari Next.js lama:**

#### Server Components (komponen default di App Router)

```tsx
// GaleriAlbum.tsx — ini SERVER COMPONENT (default, tanpa 'use client')
// Berjalan di server, mengirim HTML final ke browser
// Tidak perlu download React runtime ke client
import { fetchAlbums } from '@/lib/supabase'

export default async function GaleriAlbum() {
  const albums = await fetchAlbums()  // ← query database LANGSUNG di server
  return (
    <div>
      {albums.map(album => <CardAlbum key={album.id} {...album} />)}
    </div>
  )
}
```

**Kapan pakai Server Component (default):**
- Mengambil data dari database/Supabase
- Tidak ada interaksi langsung dengan pengguna (klik, ketik)
- Komponen murni tampilan (card, layout, daftar)
- **Inilah yang dipakai 80% waktu di proyek ini**

#### Client Components (opt-in dengan 'use client')

```tsx
// Lightbox.tsx — CLIENT COMPONENT, harus pakai 'use client' di baris paling atas
'use client'  // ← menandakan komponen ini berjalan di browser

import { useState } from 'react'

export default function Lightbox({ src, alt }: Props) {
  const [buka, setBuka] = useState(false)  // ← useState hanya bisa di client
  // ... kode interaktif
}
```

**Kapan pakai Client Component:**
- Membutuhkan `useState`, `useEffect`, event handler (`onClick`, `onSubmit`)
- Interaksi langsung: lightbox, form, dialog, carousel
- **Di proyek ini:** Lightbox, form admin, form note, upload dialog

**Prinsip emas:** mulai dengan Server Component, tambahkan `'use client'` hanya saat butuh interaksi.

#### Route Groups — folder dengan kurung buka-kurung tutup

```
app/
  ├── (internal)/          ← tidak menghasilkan segment URL
  │   ├── admin/page.tsx   → /admin (bukan /internal/admin)
  │   └── layout.tsx       → layout admin
  └── (public)/            ← tidak menghasilkan segment URL
      ├── page.tsx         → /
      └── galeri/page.tsx  → /galeri
```

**Kegunaan di proyek kita:** memisahkan kode admin/internal dari kode publik secara fisik tanpa mempengaruhi URL.

---

### 4. Supabase — Satu Layanan, Banyak Masalah yang Terpecahkan

Supabase bukan sekadar database. Satu paket mencakup:

#### PostgreSQL (Database)
- **Relasional** — data terstruktur dalam tabel, bisa dihubungkan (album ↔ foto via foreign key)
- **RLS (Row Level Security)** — keamanan di level baris: bisa akses baris X tetapi tidak baris Y
- Di proyek kita: 5 tabel, semua dihubungkan oleh foreign key `album_id`

#### Storage (Penyimpanan Berkas)
- Untuk foto-foto di `/uploads/` (bukan di database — database hanya menyimpan URL/path-nya)
- Bandwidth/egress: 5 GB/bulan (5GB cached + 5GB non-cache)
- Ada built-in image transformation (resize via URL param — berguna untuk thumbnail)

#### Realtime
- Perubahan data di database langsung dideteksi browser tanpa perlu refresh
- Contoh: admin menghapus note → semua yang sedang buka galeri itu langsung melihat note hilang
- Diaktifkan per-channel per-tabel dengan filter

#### REST API (Auto-generated)
- Setiap tabel langsung bisa di-query dari browser lewat `supabase.from('album').select('*')`
- **Keamanan bergantung pada RLS** — kalau RLS salah-salah set, data bisa bocor

---

### 5. TypeScript — Mengapa Tidak JavaScript Biasa

TypeScript adalah JavaScript + **tipe data yang diperiksa saat dikompilasi**:

```typescript
// Tanpa TypeScript (JavaScript biasa) — kesalahan hanya ditemukan saat runtime
const album = await fetchAlbums()
album.titel  // ❌ typo — baru error ketika user klik, sulit dilacak

// Dengan TypeScript — kesalahan ditangkap SEBELUM running
interface Album {
  id: number
  judul: string
  created_at: string
}
const album: Album = await fetchAlbums()
album.titel  // ❌ error langsung di IDE: property 'titel' tidak ada di Album
album.judul  // ✅ benar
```

**Di proyek ini:** semua interface tipe data ada di `types/database.types.ts` (generated dari schema Supabase), jadi tidak ada lagi tebak-tebak struktur data.

---

### 6. Tailwind CSS v4 — Utility-First dengan Pendekatan Baru

Tailwind memecahkan masalah klasik: **bagaimana menyatukan desainer dan pengembang** dengan menjadikan CSS sebagai utility class.

```html
<!-- Tanpa Tailwind: banyak CSS custom, konsisten sulit -->
<div class="card card-lg">

<!-- Dengan Tailwind: langsung dari spesifikasi desain -->
<div class="bg-cream-100 rounded-[12px] p-6 shadow-md">
```

**Perubahan besar Tailwind v4 (2026):**
- **CSS-first** — konfigurasi di `globals.css`, bukan lagi `tailwind.config.js` file terpisah
- Theme didefinisikan dengan `@theme inline` block di CSS
- Color tokens dari DESIGN.md diinjek ke Tailwind lewat CSS custom properties
- **Zero JavaScript config** — desain token dari dokumen proyek masuk langsung ke CSS tanpa wrapper

---

### 7. Animasi Stack — Peran Masing-Masing

Proyek ini menggunakan empat library animasi yang **dibedakan berdasarkan kebutuhan** (bukan redundan):

| Library | Peran | Contoh di Proyek |
|---|---|---|
| **Lenis** | Smooth scroll (kinetik, physics-based) | Halaman galeri yang panjang, scroll halus |
| **Motion (Framer Motion)** | Komponen animasi React-native | Fade-in foto, layout animation, mount/unmount |
| **GSAP** | Timeline kompleks, animasi SVG/visual | Hero section, animasi dekoratif splash |
| **React Spring** | Physics-based value animation | Angka counter, scroll-linked transforms |

Prinsip: **Lenis untuk scroll, Motion untuk UI transitions, GSAP untuk timeline visual, React Spring untuk physics values**.

---

### 8. Simulasi Satu Alur Nyata: Dari Passcode Sampai Galeri

Mari kita lacak lapis demi lapis apa yang terjadi di proyek kita saat anggota KKN membuka situs:

#### Langkah 1: Browser → Server (Landing)
```
Anggota buka https://suara-kebadongan.vercel.app/
├── Vercel menerima request
├── Next.js App Router mencocokkan → app/(public)/page.tsx
├── Komponen HalamanUtama berjalan sebagai SERVER COMPONENT
│   └── Tidak ada query database (hanya tampilan)
└── HTML dikirim ke browser → splash page muncul
```

#### Langkah 2: Ketik Passcode → Validasi
```
Anggota mengetik "KN2026" di form, tekan Enter
├── Form berada di CLIENT COMPONENT (ada 'use client' — butuh onClick)
├── Browser menjalankan JavaScript → fetch POST ke /api/auth
├── Server route handler:
│   ├── Terima { passcode: "KN2026" }
│   ├── Hitung HMAC-SHA256("KN2026", process.env.PASSCODE_HMAC_SECRET)
│   ├── Bandingkan hash dengan yang ada di environment variable
│   ├── Kalau cocok: buat JWT berisi { role: "admin" }
│   └── Kirim Set-Cookie header ke browser
└── Browser redirect ke /galeri
```

#### Langkah 3: Galeri Memuat Data
```
Browser buka /galeri
├── app/(public)/galeri/page.tsx (SERVER COMPONENT)
│   ├── fetchAlbums() → query Supabase REST API
│   │   └── GET https://[project].supabase.co/rest/v1/album?select=*
│   │       └── Supabase kirim ke Postgres → Postgres jalankan SQL → hasil dikirim balik
│   ├── fetchPhotosForAlbum() → query foto untuk setiap album
│   └── Render <GaleriGrid albums={albums} photos={photos} />
├── HTML + data dikirim ke browser (data sudah ada di HTML — tidak perlu loading terpisah)
└── React hydrate → komponen interaktif aktif
```

#### Langkah 4: Klik Foto → Lightbox
```
Klik thumbnail foto tertentu
├── State buka = true → Lightbox muncul
├── Component <Lightbox> (CLIENT COMPONENT) render
│   ├── Foto asli dimuat (bisa dari Supabase Storage URL)
│   ├── Info: judul, tanggal, deskripsi
│   └── Tombol: Unduh asli, Tutup
└── GSAP/Motion animasi overlay fade-in
```

#### Langkah 5: Refresh / Sesi Baru
```
Buka kembali /galeri setelah 1 jam
├── Browser kirim request ke /galeri dengan cookie JWT
├── Next.js Middleware verifikasi JWT di sisi server
│   ├── Kalau valid: halaman dimuat, data dikirim
│   └── Kalau tidak valid/expired: redirect ke /
├── Tidak perlu login ulang selama cookie masih valid (7 hari)
└── Kalau cookie expired → kembali ke splash → ketik passcode lagi
```

---

### 9. Mengapa Dokumen Proyek Ini Penting (Koneksi ke Kode)

Kelima dokumen kita bukan hanya "dokumentasi sampingan" — **mereka adalah sumber kebenaran yang kode harus patuhi:**

```
PRD.md ──────────────────→ Fitur & batasan yang DIBUAT
  ↓
DESIGN.md ───────────────→ Token, warna, font, spacing → globals.css
  ↓
SCHEMA.md ───────────────→ 5 tabel + kunci asing → types/database.types.ts + SQL migration
  ↓
API_CONTRACT.md ──────────→ Endpoint, request/response → route handlers + API client
  ↓
ARCHITECTURE.md ──────────→ Keputusan teknis → pola kode, direktori, komentar penjelasan
```

Saat saya menulis kode, **setiap keputusan akan mengacu ke salah satu dokumen ini**. Kalau saya menulis `rounded-[12px]`, itu karena DESIGN.md. Kalau saya buat table `album` dengan kolom `cover_photo_url`, itu karena SCHEMA.md. Kalau ada komentar `// Mitigasi: verifikasi HMAC disimpan di cookie HttpOnly`, itu karena ARCHITECTURE.md §6.

---

**Bersambung ke Bab 2: Gelombang 1 — Git Init, Scaffold, Design Tokens**
