# PRD — SuaraKebadongan

> Website kenangan digital untuk anggota KKN Desa Kebadongan, Kebumen.
> Versi: 1.0 · Status: Disetujui · Terakhir diperbarui: Agustus 2026

## 1. Deskripsi Produk

**SuaraKebadongan** adalah website kenangan digital untuk satu grup KKN (Kuliah Kerja Nyata) di Desa Kebadongan, Kebumen. Setelah program berakhir, website ini menjadi "posko virtual" tempat para anggota kembali berkumpul untuk: bernostalgia di halaman Beranda (lini masa & profil), melihat dan berbagi dokumentasi foto (Galeri), mengobrol secara anonim secara *real-time* (Chat), serta meninggalkan catatan singkat berupa *sticky notes* (Notes) — ditambah tombol kejutan untuk mengenang momen acak.

**Untuk siapa:** Anggota KKN Desa Kebadongan (±10–30 orang). Akses dibatasi menggunakan satu *passcode* bersama — tanpa akun, tanpa email, tanpa identitas. Konsepnya sederhana: *"kalau kamu pernah tinggal di Badongan, kamu tahu suara pintu masuknya."*

**Prinsip produk:**
- **Tanpa akun** — satu passcode untuk semua anggota; privasi & kesederhanaan di atas segalanya.
- **Anonim penuh** — server tidak menyimpan identitas siapa pun, termasuk di chat.
- **Playful** — visual ceria, warna-warni, kaya stiker, seperti buku tahunan sekolah; responsif *mobile-first* karena mayoritas akses dari HP.

**Teknologi:** Next.js 15 + TypeScript + Tailwind CSS, Supabase (Database, Storage, Realtime), di-hosting gratis di Vercel.

---

## 2. Fitur

### F1. Gerbang Passcode
Halaman pembuka dengan input passcode bersama sebagai satu-satunya gerbang akses seluruh isi website.

**Kriteria penerimaan (acceptance criteria):**
- [ ] Pengunjung tanpa sesi yang membuka URL mana pun dialihkan ke halaman gerbang (`/`).
- [ ] Memasukkan passcode yang benar akan membuat cookie `httpOnly` dan mengarahkan pengunjung ke halaman utama (`/beranda`).
- [ ] Passcode salah → menampilkan pesan galat yang jelas, tidak ada detail teknis yang bocor.
- [ ] Semua halaman (`/beranda`, `/galeri`, `/chat`, `/notes`) dan endpoint API menolak akses tanpa sesi valid.
- [ ] Tersedia tombol keluar untuk menghapus sesi.
- [ ] Rate-limit sederhana pada percobaan passcode untuk mencegah tebakan paksa (*brute force*).

### F2. Beranda Kenangan
Halaman utama (*landing page* setelah masuk) yang menampilkan rangkuman perjalanan KKN.

**Kriteria penerimaan:**
- [ ] Terdapat **Hero Section** berupa foto memori utama (seperti foto grup/posko) dengan blok aksen warna terracotta/teal ala halaman scrapbook.
- [ ] Terdapat **Lini Masa Kenangan** (Timeline) yang menampilkan jepretan polaroid perjalanan per minggu/acara yang saling terhubung garis.
- [ ] Terdapat seksi **Wajah-wajah Kita** (Profil) yang merangkum anggota-anggota dalam bentuk avatar bundar beserta perannya.
- [ ] Terdapat ilustrasi grafis **Peta Lokasi** desa.

### F3. Galeri Foto
Tempat mengunggah, mengelola, dan menjelajahi dokumentasi foto yang dikelompokkan per acara (album).

**Kriteria penerimaan:**
- [ ] Unggah banyak foto sekaligus lewat seret & letakkan (*drag & drop*) maupun pemilih berkas.
- [ ] Setiap foto dapat diberi takarir (*caption*) dan tanggal kegiatan.
- [ ] Berkas foto tersimpan di Supabase Storage; metadata (album, takarir, tanggal) di tabel `photos`.
- [ ] Album dapat dibuat dengan nama + deskripsi; foto dapat dimasukkan ke album.
- [ ] Daftar foto ditampilkan sebagai masonry grid responsif dengan rasio asli.
- [ ] Mengklik foto membuka lightbox: navigasi sebelumnya/berikutnya, takarir, tanggal, tombol unduh foto asli.
- [ ] Foto dapat dihapus oleh anggota mana pun (prinsip saling percaya).
- [ ] Unggahan gagal (format tidak didukung / ukuran melebihi batas) menampilkan pesan galat yang ramah.

### F4. Obrolan Anonim Waktu-Nyata
Papan obrolan grup tanpa identitas — inti dari "Suara".

**Kriteria penerimaan:**
- [ ] Pesan baru muncul otomatis tanpa memuat ulang (Supabase Realtime).
- [ ] Setiap pesan ditampilkan dengan nama samaran acak bergaya kampung (mis. "Bu Marni Penjual Tempe") + avatar hewan acak; nama digenerate ulang per pesan.
- [ ] Tidak ada kolom identitas apa pun (id pengguna, IP, perangkat) yang disimpan untuk pesan.
- [ ] Riwayat N pesan terakhir dimuat saat halaman dibuka.
- [ ] Indikator "seseorang sedang mengetik…" tampil waktu-nyata tanpa mengungkap nama.
- [ ] Pesan tidak boleh kosong; maksimal ±500 karakter dengan penghitung sisa.
- [ ] Gulir otomatis (*scroll*) ke bawah saat pesan baru masuk, kecuali pengguna sedang membaca riwayat di atas.
- [ ] Pesan tidak dapat diedit/dihapus setelah terkirim (sifat obrolan anonim).

### F5. Catatan Tempel (Notes)
Papan cat tempel kolektif untuk meninggalkan pesan singkat, doa, atau kejadian konyol.

**Kriteria penerimaan:**
- [ ] Pengguna dapat menambah catatan berisi teks (maksimal ±280 karakter).
- [ ] Warna catatan dapat dipilih dari palet warna playful.
- [ ] Catatan ditampilkan sebagai papan masonry warna-warni, terbaru di depan.
- [ ] Catatan dapat diedit dan dihapus oleh anggota mana pun.
- [ ] Perubahan (tambah/edit/hapus) tersinkron antar pengguna secara real-time.
- [ ] Papan tetap terbaca dan rapi di layar HP.

### F6. Tombol "Inget ga sih?"
Tombol seru yang menampilkan satu foto/momen acak dari galeri — cara cepat kena rindu dadakan.

**Kriteria penerimaan:**
- [ ] Tombol "Inget ga sih?" tampil menempel (sticker-style) di semua halaman setelah melewati gerbang passcode.
- [ ] Klik tombol membuka modal/lightbox berisi 1 foto acak dari seluruh galeri, lengkap dengan takarir dan tanggal.
- [ ] Tersedia tombol "Lagi!" untuk mengacak foto lain tanpa menutup modal.
- [ ] Foto acak tidak sama dengan yang terakhir ditampilkan (tidak ada pengulangan beruntun).
- [ ] Jika galeri masih kosong → tampil pesan ramah mengajak unggah foto dulu.
- [ ] Modal mudah ditutup (klik area gelap / tombol silang) dan nyaman dipakai di HP.

---

## 3. Di Luar Cakupan (Out of Scope)

Fitur berikut **tidak** dibangun pada versi 1.0, namun menjadi calon pengembangan selanjutnya:

| Fitur | Catatan |
|---|---|
| Arsip dokumen | Proposal, laporan, LPJ, surat resmi |
| Reaksi emoji di obrolan | Sementara cukup teks polos |
| Unggah video | v1 hanya foto (efisiensi penyimpanan free tier) |
| Tagging orang/warga di foto | Butuh model data tambahan |
| Notifikasi (email/WA) | Untuk obrolan/catatan baru |
| Filter/moderasi kata | Bergantung pada kebutuhan nyata setelah dipakai |
| Dukungan multi-grup KKN | Saat ini hanya satu grup (single-tenant) |

**Keputusan desain yang disengaja (bukan backlog):** tidak ada sistem akun/email — privasi dan kesederhanaan adalah bagian dari produk.
