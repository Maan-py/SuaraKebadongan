# Gelombang 4 — Galeri Foto

> **Commits:** `feat(galeri): unggah+kompresi, album, masonry polaroid, stagger scroll` + `feat(galeri): lightbox lengkap + takarir + unduh + hapus`

## Apa yang Dibuat?

Galeri adalah "jantung kenangan" — tempat upload, lihat, dan kelola foto.
Ini halaman paling kompleks di aplikasi ini.

## 1. Kompresi Gambar (`src/lib/compress.ts`)

**Mengapa perlu kompresi?**
Supabase free tier cuma 1GB storage. Foto HP mentah 3-5MB × 1000 foto = 3-5GB = habis.
Dengan kompresi: 3-5MB → 200-400KB = muat 2500-5000 foto.

**Bagaimana cara kerjanya?**

```
File mentah → loadImage() → drawToCanvas() → toBlob()
                                    ↓
                            Skala turun jika > 2000px
                                    ↓
                            Coba WebP q0.85
                                    ↓
                            Fallback JPEG q0.85
```

**Kenapa WebP dulu?**
WebP 25-35% lebih kecil dari JPEG dengan kualitas sama.
Didukung 97% browser modern. Fallback JPEG untuk Safari lama.

**Kenapa 2000px?**
Resolusi HP rata-rata 1080-1440px. 2000px cukup untuk tampilan retina
tanpa membuang piksel. Lebih besar = percuma, lebih kecil = kehilangan detail.

## 2. Zona Upload (`src/components/galeri/ZonaUpload.tsx`)

**Fitur:**
- Drag & drop atau klik untuk memilih
- Validasi tipe (JPG/PNG) dan ukuran (<10MB)
- Progress indicator per foto
- Pesan error ramah per foto

**Kenapa validasi per foto?**
Bayangkan upload 20 foto, 1 gagal karena format. Tanpa validasi per-fato,
seluruh upload gagal dan user harus mulai lagi dari awal.
Dengan validasi per-foto, 19 berhasil, 1 gagal — user tidak kehilangan semua.

**Kenapa `crypto.randomUUID()` untuk nama file?**
Server tidak bisa menerima nama file asli dari user (risiko path traversal).
UUID menjamin nama unik tanpa risiko keamanan.

## 3. Album Chips (`src/components/galeri/AlbumChips.tsx`)

**Fitur:**
- Pill outline `--spidol-ungu` untuk filter
- Tombol "+ Album Baru" → modal kecil
- Chip "Semua" untuk menampilkan semua foto

**Kenapa pill outline, bukan tab?**
Karena album bersifat fleksibel (bisa banyak, bisa sedikit).
Pill bisa wrap ke baris berikutnya, tab tidak bisa.

**Kenapa tidak ada badge counter?**
Produk anti-FOMO (fear of missing out). Tidak perlu menunjukkan
berapa foto di setiap album — cukup lihat isinya.

## 4. PolaroidCard (`src/components/galeri/PolaroidCard.tsx`)

**Fitur:**
- Bingkai polaroid `--polaroid` dengan padding bawah lebih tebal
- Rotasi bergantian: [-1.5°, +1°, +0.5°]
- Tape kecil warna acak dari aksen
- Overlay sepia terang untuk kesan roll film
- Lazy loading + async decoding

**Kenapa rotasi bergantian?**
Ketidakteraturan = "scrapbook" alami. Grid sempurna terasa kaku dan digital.
Rotasi kecil membuat setiap kartu terasa unik.

**Kenapa `loading="lazy"`?**
Foto yang belum terlihat di viewport tidak perlu dimuat.
Ini hemat bandwidth dan mempercepat loading awal.

**Kenapa `decoding="async"`?**
Browser bisa decode gambar di background thread, tidak memblokir rendering.

## 5. MasonryGrid (`src/components/galeri/MasonryGrid.tsx`)

**Fitur:**
- CSS columns: 2 kolom (mobile) → 3 (tablet) → 4 (desktop)
- Max-width 1100px di tengah
- GSAP ScrollTrigger stagger animation

**Apa itu masonry?**
Layout seperti batu bata — setiap kolom punya tinggi yang menyesuaikan.
Berbeda dari grid kotak seragam yang memaksa semua baris sama tinggi.

**Kenapa CSS columns, bukan JS masonry?**
CSS columns native, zero JavaScript, zero layout shift.
Kekurangannya: item diurutkan per kolom (atas→bawah, kiri→kanan),
bukan per baris. Untuk galeri foto, ini bukan masalah.

**Kenapa rasio asli harga mati?**
Foto KKN campur aduk orientasinya. Memotong foto grup di sawah
biar kotak rapi sama saja dengan memotong wajah warga.

## 6. GSAP ScrollTrigger Stagger

**Apa itu stagger?**
Animasi tidak serentak, tapi berurutan — seperti domino.
Kartu pertama muncul dulu, diikuti kartu kedua 60ms kemudian.

**Kenapa pakai GSAP, bukan CSS animation?**
GSAP bisa mendeteksi kapan kartu masuk viewport (ScrollTrigger).
CSS animation jalan saat mount, tidak peduli terlihat atau tidak.

**Kenapa dynamic import?**
GSAP (~30KB) + ScrollTrigger (~20KB) hanya dibutuhkan di galeri.
Kalau di-import statis di layout global, semua halaman ikut membawa beban.

**Pattern:**
```ts
useEffect(() => {
  if (!gerakDiizinkan) return // reduced-motion = skip
  let kill = () => {}
  ;(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    // ... setup animation
    kill = () => { /* cleanup */ }
  })()
  return () => kill()
}, [gerakDiizinkan, photos.length])
```

## 7. Lightbox (`src/components/galeri/Lightbox.tsx`)

**Fitur:**
- Backdrop coklat hangat `rgba(46,33,24,.9)`
- Foto asli (bukan thumbnail)
- Takarir + tanggal + pindah album
- Tombol "Simpan Fotonya" (download)
- Hapus dengan konfirmasi ringan
- Prev/next area sentuh lebar
- Focus trap + keyboard navigation (Esc, ←, →)
- Realtime: foto dihapus orang lain → lightbox menutup + toast

**Apa itu focus trap?**
Ketika lightbox terbuka, fokus TIDAK BOLEH keluar dari dialog.
User tidak bisa tab ke tombol di belakang lightbox.
Ini penting untuk aksesibilitas (screen reader + keyboard only).

**Kenapa konfirmasi hapus?**
Menghapus foto adalah aksi destruktif yang tidak bisa dibatalkan.
Satu dialog kecil memberi kesempatan untuk berubah pikiran.

**Kenapa "Simpan Fotonya" bukan "Download"?**
"Bahasa manusia" lebih ramah dari istilah teknis.
User tidak perlu tahu istilah "download" — mereka ingin menyimpan foto.

## 8. Realtime Subscribe DELETE

```ts
supabase.channel('galeri')
  .on('postgres_changes', { event: 'DELETE', table: 'photos' }, ...)
  .subscribe()
```

**Apa itu postgres_changes?**
Supabase Realtime mendengarkan perubahan database PostgreSQL.
Ketika ada DELETE, Supabase mengirim event ke semua client yang subscribe.

**Kapan dipakai?**
Ketika anggota lain menghapus foto dari device mereka.
Foto langsung hilang dari galeri user tanpa perlu refresh.

## Flow Upload Lengkap

```
User seret foto ke ZonaUpload
  → handleFiles() daftarkan UploadItem[]
  → processFile() dipanggil per file
  → validateFile() cek tipe + ukuran
  → compressImage() → canvas → WebP
  → supabase.storage.upload(path, blob)
  → supabase.from('photos').insert({ storage_path })
  → Status berubah: compressing → uploading → done
  → loadData() refresh daftar foto
```

## Flow Hapus Foto

```
User klik foto → Lightbox terbuka
  → Klik "Hapus"
  → Dialog: "Yakin cabut foto ini dari album?"
  → Klik "Ya, Cabut"
  → supabase.storage.remove([path])
  → supabase.from('photos').delete().eq('id')
  → onPhotoDeleted(id) → foto hilang dari grid
  → Toast: "Fotonya dicopot dari album."
```

## Yang Dipelajari

| Konsep | Penjelasan |
|---|---|
| Canvas API kompresi | Resize + encode WebP/JPEG di browser |
| CSS columns masonry | Layout alami tanpa JavaScript |
| GSAP ScrollTrigger | Animasi saat elemen masuk viewport |
| Dynamic import | Hemat bundle dengan lazy-load pustaka |
| Supabase Storage | Upload/download file via bucket |
| Realtime subscribe | Dengar perubahan database secara live |
| Focus trap | Tahan fokus di dalam dialog |
| Polaroid aesthetic | Rotasi + tape + overlay sepia |

## File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `src/lib/compress.ts` | Kompresi gambar via Canvas |
| `src/components/galeri/ZonaUpload.tsx` | Zona drag & drop upload |
| `src/components/galeri/AlbumChips.tsx` | Filter album + modal buat album |
| `src/components/galeri/PolaroidCard.tsx` | Kartu polaroid individual |
| `src/components/galeri/MasonryGrid.tsx` | Grid masonry + GSAP stagger |
| `src/components/galeri/Lightbox.tsx` | Dialog lightbox lengkap |
| `src/app/(album)/galeri/page.tsx` | Halaman galeri utama |
