# Gelombang 3 — App Shell

> **Commit:** `116975f` · **Dependencies:** `lenis`, `gsap`

## Apa yang Dibuat?

App Shell adalah "kerangka buku" yang menempel di SEMUA halaman setelah gerbang.
Bayangkan ini seperti sampul + daftar isi yang selalu terlihat walau isi bukunya berganti.

## 1. Route Group `(album)`

```tsx
src/app/(album)/
├── layout.tsx      ← membungkus /galeri, /chat, /notes
├── template.tsx    ← crossfade antarhalaman
├── galeri/page.tsx ← placeholder
├── chat/page.tsx   ← placeholder
└── notes/page.tsx  ← placeholder
```

**Apa itu route group?**
Tanda kurung `(album)` di nama folder **tidak muncul di URL**.
Ini cara Next.js berkata: "Grupkan beberapa halaman di bawah layout yang sama,
tapi jangan tambahkan `/album/` ke path."

Jadi `/galeri`, `/chat`, `/notes` semua pakai `layout.tsx` yang sama.
Kalau tanpa route group, kita harus copy-paste layout ke setiap halaman.

## 2. TabBar — Navigasi Bawah (Mobile) / Atas (Desktop)

**Kenapa menu di bawah?**
Ergonomi jempol: 49% waktu pegang HP, ibu jari hidup di sepertiga bawah layar.
Menu di atas = jempol harus akrobat; menu di bawah = sekali jentek.

**Kenapa bukan hamburger menu?**
Hamburger menyembunyikan navigasi — user harus tap dua kali untuk pindah halaman.
Tab bar selalu terlihat, satu tap langsung sampai.

**Kenapa 3 tab, bukan 5 atau lebih?**
Hukum Miller: manusia bisa mengingat 7±2 item.
3 tab = cukup untuk produk inti tanpa overwhelming.

### Fitur TabBar:
- **Mobile (<768px):** fixed bottom, tinggi 64px, 3 tab ikon+label
- **Desktop (≥768px):** header horizontal di atas
- **Tab aktif:** lingkaran stabilo `--marker-kuning` di belakang ikon + label menebal
- **Indikator sliding:** Motion 250ms ease-in-out
- **Aksesibilitas:** `aria-current="page"`, target ≥44px

### Kenapa `aria-current="page"` penting?
Screen reader (NVDA, VoiceOver) membaca: "Galeri, tab, halaman saat ini."
Tanpa `aria-current`, user tunanetra tidak tahu tab mana yang aktif.

## 3. LenisProvider — Smooth Scroll

**Apa itu smooth scroll?**
Ketika user scroll, konten bergerak lebih halus dari scroll native browser.
Efeknya terasa "premium" dan konsisten di semua browser/device.

**Siapa konduktor jam? (gsap.ticker)**

```ts
lenis.on('scroll', ScrollTrigger.update) // beri tahu ScrollTrigger
gsap.ticker.add((time) => {               // GSAP jadi satu-satunya jam
  lenis.raf(time * 1000)                  // putar Lenis
})
gsap.ticker.lagSmoothing(0)               // matikan fitur yang menunda frame
```

**Kenapa perlu satu konduktor?**
Lenis dan ScrollTrigger sama-sama ingin tahu posisi scroll.
Kalau keduanya punya jam masing-masing, gerakan jidat-jedat.
Satu konduktor = semua musisi patuh.

**Kenapa `lagSmoothing(0)`?**
GSAP punya fitur menunda waktu saat frame drop (untuk animasi biasa bagus).
Tapi untuk smooth scroll, ini malah terasa tersentak. Matikan.

**Kenapa dynamic import?**
GSap + Lenis hanya dibutuhkan di browser.
Kalau di-import statis, mereka ikut bundle dan memperlambat loading.
Dynamic import = hanya dimuat saat komponen mount di browser.

**Kenapa `import('gsap/ScrollTrigger')` terpisah dari `import('gsap')`?**
Karena GSAP memisahkan plugin ke file terpisah untuk tree-shaking.
ScrollTrigger berat (~30KB) dan hanya dibutuhkan di galeri.

## 4. Template Crossfade

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
```

**Apa itu crossfade?**
Saat user pindah dari `/galeri` ke `/chat`, halaman lama fade-out (opacity 0→1)
dan halaman baru fade-in. Tidak ada layar kosong/putih di antaranya.

**Kenapa pakai `template.tsx`, bukan `layout.tsx`?**
Layout TIDAK re-mount saat navigasi dalam route group yang sama.
Template SELALU re-mount — ini yang membuat fade-in/out bekerja.

**Kenapa 200ms, bukan lebih lama?**
200ms = sweet spot: cukup terasa untuk kesan "lembar baru",
cukup cepat untuk tidak menghambat navigasi.
Google Material Design juga pakai 200ms untuk page transitions.

**Reduced-motion:**
`useReducedMotion()` mendeteksi preferensi OS user.
Kalau aktif, konten muncul instan tanpa fade — menghormati kesehatan.

## 5. OfflineBanner

```tsx
"Sinyal hilang — kenangan tidak kemana-mana kok, sabar sedikit."
```

**Kenapa copy yang menenangkan?**
User panik kalau koneksi hilang. Copy ini bilang: "Sabar, ini tidak fatal."
Banner warna `--marker-kuning` (kuning stabilo) = peringatan, bukan error.

**Kenapa auto-hilang saat online?**
User tidak perlu tap tombol untuk menutup. Sistem mendeteksi koneksi pulih
dan banner hilang sendiri. Zero friction.

## 6. SurpriseButton (Placeholder)

Tombol "Inget ga sih?" fixed di kanan-bawah DI ATAS tab bar.
Sekarang masih disabled — akan diisi di Todo 13 (lightbox foto acak).

## 7. LogoutButton

**Kenapa tidak ada dialog konfirmasi?**
Sesi ini ringan (cookie saja). Tidak ada data yang hilang.
Dialog konfirmasi menambah friction yang tidak perlu.

**Mobile:** ikon kecil pojok kanan atas (44px target)
**Desktop:** teks "Keluar Sebentar" kanan atas header

## Flow Navigasi

```
User tap "Suara" di TabBar
  → router.push('/chat')
  → Next.js render ChatPage (server component)
  → template.tsx fade-in (opacity 0→1, 200ms)
  → TabBar indicator slide ke tab "Suara" (250ms)
  → URL berubah ke /chat
  → aria-current="page" pindah ke tab Suara
```

## Yang Dipelajari

| Konsep | Penjelasan |
|---|---|
| Route Group | Folder dengan `(nama)` = grup tanpa URL |
| `template.tsx` vs `layout.tsx` | Template re-mount (fade), layout tidak |
| `aria-current="page"` | Screen reader tahu halaman aktif |
| Dynamic import | Hemat bundle, muat saat dibutuhkan |
| gsap.ticker | Satu konduktor untuk semua animasi scroll |
| `lagSmoothing(0)` | Matikan frame delay untuk smooth scroll |
| `useReducedMotion()` | Hormati preferensi aksesibilitas user |
| Ergonomi jempol | Menu bawah > menu atas untuk mobile |

## File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `src/app/(album)/layout.tsx` | Route group layout |
| `src/app/(album)/template.tsx` | Crossfade antarhalaman |
| `src/app/(album)/galeri/page.tsx` | Placeholder galeri |
| `src/app/(album)/chat/page.tsx` | Placeholder chat |
| `src/app/(album)/notes/page.tsx` | Placeholder notes |
| `src/components/shell/TabBar.tsx` | Navigasi tab |
| `src/components/shell/LenisProvider.tsx` | Smooth scroll |
| `src/components/shell/OfflineBanner.tsx` | Indikator offline |
| `src/components/surprise/SurpriseButton.tsx` | Placeholder tombol kejutan |
| `package.json` | +lenis, +gsap |
