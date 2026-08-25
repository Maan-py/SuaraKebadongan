# Bab 1 — Big Picture Dunia Web Modern & Arsitektur Proyek Kita

## 1. Peta Besar: Bagaimana Website Bekerja

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

## 2. Kenapa React → Next.js

React memecahkan masalah ini: **membuat UI yang kompleks dari komponen-komponen kecil yang bisa dipakai ulang**. Tanpa framework, React hanya bisa menjalankan JavaScript di sisi browser (*client-side rendering* — semua HTML dihasilkan di browser).

**Masalah murni CSR untuk proyek galeri:**
- SEO buruk (Google tidak bisa baca konten yang dihasilkan JavaScript)
- Loading lambat untuk pengguna pertama (harus download semua JS baru bisa tampil)
- Tidak cocok untuk proyek yang datanya banyak

**Next.js memecahkan ini dengan menambahkan sisi server.**

---

## 3. Next.js App Router — Konsep Inti

Next.js menggunakan sistem **file-based routing** — struktur folder menentukan halaman website:

```
app/
  ├── page.tsx           → halaman utama (URL: /)
  ├── galeri/page.tsx    → halaman galeri (URL: /galeri)
  ├── admin/page.tsx     → halaman admin (URL: /admin)
  └── layout.tsx         → layout bersama yang membungkus semua halaman
```

### Server Components (komponen default di App Router)

```tsx
// GaleriAlbum.tsx — SERVER COMPONENT (default, tanpa 'use client')
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

### Client Components (opt-in dengan 'use client')

```tsx
'use client'  // ← menandakan komponen ini berjalan di browser
import { useState } from 'react'

export default function Lightbox({ src, alt }: Props) {
  const [buka, setBuka] = useState(false)
  // ... kode interaktif
}
```

**Kapan pakai Client Component:**
- Membutuhkan `useState`, `useEffect`, event handler (`onClick`, `onSubmit`)
- Interaksi langsung: lightbox, form, dialog, carousel
- **Di proyek ini:** Lightbox, form admin, form note, upload dialog

**Prinsip emas:** mulai dengan Server Component, tambahkan `'use client'` hanya saat butuh interaksi.

### Route Groups — folder dengan kurung buka-kurung tutup

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

## 4. Supabase — Satu Layanan, Banyak Masalah Terpecahkan

### PostgreSQL (Database)
- **Relasional** — data terstruktur dalam tabel, bisa dihubungkan (album ↔ foto via foreign key)
- **RLS (Row Level Security)** — keamanan di level baris: bisa akses baris X tetapi tidak baris Y
- Di proyek kita: 5 tabel, semua dihubungkan oleh foreign key `album_id`

### Storage (Penyimpanan Berkas)
- Untuk foto-foto di `/uploads/` (bukan di database — database hanya menyimpan URL/path-nya)
- Bandwidth/egress: 5 GB/bulan (5GB cached + 5GB non-cache)
- Ada built-in image transformation (resize via URL param — berguna untuk thumbnail)

### Realtime
- Perubahan data di database langsung dideteksi browser tanpa perlu refresh
- Contoh: admin menghapus note → semua yang sedang buka galeri itu langsung melihat note hilang
- Diaktifkan per-channel per-tabel dengan filter

### REST API (Auto-generated)
- Setiap tabel langsung bisa di-query dari browser lewat `supabase.from('album').select('*')`
- **Keamanan bergantung pada RLS** — kalau RLS salah-salah set, data bisa bocor

---

## 5. TypeScript — Mengapa Tidak JavaScript Biasa

TypeScript adalah JavaScript + **tipe data yang diperiksa saat dikompilasi**:

```typescript
// Tanpa TypeScript — kesalahan hanya ditemukan saat runtime
const album = await fetchAlbums()
album.titel  // ❌ typo — baru error ketika user klik

// Dengan TypeScript — kesalahan ditangkap SEBELUM running
interface Album {
  id: number
  judul: string
  created_at: string
}
const album: Album = await fetchAlbums()
album.titel  // ❌ error langsung di IDE
album.judul  // ✅ benar
```

**Di proyek ini:** semua interface tipe data ada di `types/database.types.ts` (generated dari schema Supabase).

---

## 6. Tailwind CSS v4 — Utility-First dengan Pendekatan Baru

**Perubahan besar Tailwind v4 (2026):**
- **CSS-first** — konfigurasi di `globals.css`, bukan lagi `tailwind.config.js` file terpisah
- Theme didefinisikan dengan `@theme inline` block di CSS
- Color tokens dari DESIGN.md diinjek ke Tailwind lewat CSS custom properties
- **Zero JavaScript config** — desain token dari dokumen proyek masuk langsung ke CSS tanpa wrapper

---

## 7. Animasi Stack — Peran Masing-Masing

| Library | Peran | Contoh di Proyek |
|---|---|---|
| **Lenis** | Smooth scroll | Halaman galeri yang panjang |
| **Motion** | Komponen animasi React | Fade-in foto, mount/unmount |
| **GSAP** | Timeline kompleks | Hero section, animasi dekoratif |
| **React Spring** | Physics-based animation | Angka counter, scroll-linked |

---

## 8. Simulasi Satu Alur Nyata

### Langkah 1: Browser → Server (Landing)
```
Anggota buka https://suara-kebadongan.vercel.app/
├── Vercel menerima request
├── Next.js App Router → app/(public)/page.tsx
├── Komponen berjalan sebagai SERVER COMPONENT
└── HTML dikirim ke browser → splash page muncul
```

### Langkah 2: Ketik Passcode → Validasi
```
Form di CLIENT COMPONENT → fetch POST ke /api/gate
Server:
  ├── Hitung HMAC-SHA256(passcode, GATE_SECRET)
  ├── Bandingkan dengan env variable
  ├── Cocok → Set-Cookie (httpOnly, 7 hari)
  └── Salah → catat attempt, ≥10/gal → 429
Browser redirect ke /galeri
```

### Langkah 3: Galeri Memuat Data
```
/galeri → SERVER COMPONENT
├── fetchAlbums() → Supabase REST → Postgres
├── fetchPhotos() → Supabase REST → Postgres
└── Render HTML → browser hydrate
```

### Langkah 4: Klik Foto → Lightbox
```
CLIENT COMPONENT Lightbox:
├── Foto asli dimuat
├── Info: judul, tanggal, deskripsi
└── Tombol: Unduh asli, Tutup
```

### Langkah 5: Refresh / Sesi Baru
```
Browser kirim cookie → proxy cek HMAC
├── Valid → halaman dimuat
└── Expired → redirect ke / → ketik passcode lagi
```

---

## 9. Koneksi ke Kode

```
PRD.md ──────────────────→ Fitur & batasan
  ↓
DESIGN.md ───────────────→ Token → globals.css
  ↓
SCHEMA.md ───────────────→ 5 tabel → types/database.types.ts
  ↓
API_CONTRACT.md ──────────→ Endpoint → route handlers
  ↓
ARCHITECTURE.md ──────────→ Keputusan teknis → pola kode
```

Setiap keputusan kode mengacu ke salah satu dokumen ini.
