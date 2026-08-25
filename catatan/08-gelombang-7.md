# Gelombang 7 — Tombol Kejutan

> **Commit:** `feat(kejutan): tombol Inget ga sih + modal foto acak + lagi-flip`

## Apa yang Dibuat?

Tombol sticker-style yang menempel di SEMUA halaman — satu ketukan, satu foto acak, satu serangan rindu dadakan.

## 1. Kenapa Tombolnya GLOBAL?

**Rindu tidak pernah datang di jadwal.**
Bisa saat buka chat, bisa saat baca catatan lama.
Kejutan harus selalu dalam jangkauan satu jempol.

**Bentuknya stiker sobek, bukan tombol sistem.**
Stiker tempelan yang minta dicolek — bukan tombol CTA iklan.
Bintang-meledak SVG `--stiker-merah` + outline die-cut `--polaroid`.

## 2. API Route (`/api/surprise`)

```ts
// Server-side: panggil RPC random_photo
const { data } = await supabase.rpc('random_photo', { exclude_id: null })
```

**Apa itu RPC?**
Remote Procedure Call — fungsi PostgreSQL yang dipanggil dari luar database.
`random_photo` adalah fungsi yang sudah dibuat di migration:
```sql
create or replace function random_photo(exclude_id uuid)
returns setof photos
language sql
as $$
  select * from photos
  where id <> exclude_id and deleted_at is null
  order by random()
  limit 1;
$$;
```

**Kenapa `order by random()`?**
PostgreSQL memilih baris secara acak dari seluruh tabel.
Efisien untuk tabel kecil (<1000 baris).
Untuk tabel besar, ada cara lebih cepat (index-based sampling).

## 3. TombolKejutan (`src/components/surprise/TombolKejutan.tsx`)

**Fitur:**
- Stiker bintang-meledak SVG 56px (mobile) / 64px (desktop)
- Wiggle idle: goyang tiap ±8 detik (mati saat reduced-motion)
- Modal: polaroid jatuh dari atas + settle rotasi acak ±2°
- Tombol "Lagi!" swap foto tanpa menutup modal
- Empty state: "Albummu masih kosong nih..."
- Error state: "Fotonya macet di jalan..."
- Focus trap + Esc tutup + kembali ke tombol

## 4. Wiggle Idle

```ts
useEffect(() => {
  if (!gerakDiizinkan || isOpen) return
  let timeout: NodeJS.Timeout
  const startWiggle = () => {
    const delay = 7000 + Math.random() * 2000 // 7-9 detik
    timeout = setTimeout(() => {
      triggerRef.current?.classList.add('animate-wiggle')
      setTimeout(() => {
        triggerRef.current?.classList.remove('animate-wiggle')
        startWiggle()
      }, 600)
    }, delay)
  }
  startWiggle()
}, [gerakDiizinkan, isOpen])
```

**Kenapa random 7-9 detik?**
Jika tetap (misal 8 detik tepat), user akan belajar polanya dan menjadi biasa.
Random = terasa hidup dan tidak predictable.

**Kenapa mati saat reduced-motion?**
User dengan vertigo/MS tidak toleran terhadap gerakan berulang.
Wiggle = gerakan berulang. Matikan total.

## 5. Animasi Polaroid Drop

```tsx
<motion.div
  initial={{ y: -100, opacity: 0, rotate: -5 }}
  animate={{ y: 0, opacity: 1, rotate: random±2° }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
/>
```

**Kenapa spring, bukan tween?**
Polaroid jatuh dari atas → perlu "memantul" saat mendarat.
Spring memberi efek kenyal yang natural. Tween terasa kaku.

## 6. Debounce "Lagi!"

**Debounce 400ms:**
User bisa spam tap "Lagi!" — tanpa debounce, 5 tap = 5 fetch.
Dengan debounce: 5 tap = 1 fetch + 4 diabaikan.

**Kenapa 400ms?**
Cukup cepat untuk tidak terasa lambat.
Cukup lambat untuk mencegah spam.

## 7. Empty State

```
Albummu masih kosong nih — unggah foto dulu yuk, biar ada yang bikin kangen.
```

+ tombol "ke Galeri" → redirect ke `/galeri`

## 8. Error State

```
Fotonya macet di jalan. Coba sekali lagi ya.
```

+ tombol "Coba Lagi" → fetch ulang

## Yang Dipelajari

| Konsep | Penjelasan |
|---|---|
| RPC (Remote Procedure Call) | Fungsi PostgreSQL dipanggil dari Next.js |
| Wiggle idle | Animasi menggoda tanpa mengganggu |
| Spring animation | Efek kenyal untuk "jatuh" |
| Debounce | Batasi frekuensi fetch |
| Focus trap | Tahan fokus di dalam modal |
| Reduced-motion | Matikan animasi untuk aksesibilitas |

## File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `src/app/api/surprise/route.ts` | API route random_photo RPC |
| `src/components/surprise/TombolKejutan.tsx` | Tombol + modal kejutan |
| `src/app/(album)/layout.tsx` | Ganti SurpriseButton → TombolKejutan |
