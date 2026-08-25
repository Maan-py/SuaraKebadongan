# SCHEMA — SuaraKebadongan (MySQL)

> Desain database MySQL 8+ untuk website galeri kenangan KKN Desa Kebadongan.
> Engine: `InnoDB` · Charset: `utf8mb4` · Collation: `utf8mb4_0900_ai_ci`
> Sumber kebutuhan: `PRD.md` v1.0 (fitur F1–F5).
>
> Catatan: PRD menyebut Supabase (PostgreSQL) sebagai stack asli, namun dokumen ini
> adalah desain padanan untuk MySQL sesuai permintaan — semantik tabel sama, sintaks disesuaikan.

---

## 1. Daftar Tabel

| # | Tabel | Deskripsi Singkat |
|---|---|---|
| 1 | `albums` | Pengelompokan foto per acara KKN (mis. "Bersih Desa", "Pentas Seni"). |
| 2 | `photos` | Metadata foto kenangan. Berkas fisiknya tersimpan di object storage (bucket `foto`); tabel ini hanya menyimpan path dan takarir. |
| 3 | `messages` | Pesan obrolan anonim realtime ("Suara"). Identitas pengirim sengaja TIDAK disimpan — nama samaran + avatar hewan acak digenerate per pesan. |
| 4 | `notes` | Catatan tempel kolektif (maks ±280 karakter) dengan 6 pilihan warna pale. Bisa diedit/dihapus siapa saja. |
| 5 | `gate_attempts` | Log percobaan passcode yang gagal, untuk rate-limit anti *brute force* pada gerbang akses. |

---

## 2. Detail Kolom Per Tabel

### 2.1 `albums`

| nama_kolom | tipe_data | constraint | keterangan |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4, digenerate aplikasi (bukan AUTO_INCREMENT). |
| `name` | VARCHAR(100) | NOT NULL | Nama album, mis. "Pamitan". |
| `description` | VARCHAR(500) | NULL | Deskripsi opsional album. |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Waktu album dibuat. |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu terakhir diubah (otomatis oleh MySQL). |
| `deleted_at` | TIMESTAMP | NULL | Soft delete; NULL = album masih aktif. |

### 2.2 `photos`

| nama_kolom | tipe_data | constraint | keterangan |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4. |
| `album_id` | VARCHAR(36) | NULL, FOREIGN KEY → `albums(id)` ON DELETE SET NULL | Foto boleh berdiri sendiri tanpa album. Hapus album ≠ hapus foto. |
| `storage_path` | VARCHAR(512) | NOT NULL | Path berkas di bucket `foto`, mis. `<uuid>.webp`. Binari TIDAK disimpan di DB. |
| `caption` | VARCHAR(300) | NOT NULL DEFAULT '' | Takarir foto; boleh kosong. |
| `taken_on` | DATE | NULL | Tanggal kegiatan foto (berbeda dari waktu unggah). |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Waktu unggah. |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu metadata terakhir diubah (takarir/tanggal/pindah album). |
| `deleted_at` | TIMESTAMP | NULL | Soft delete; memberi jeda pemulihan sebelum berkas fisik dibersihkan. |

Indeks: `idx_photos_album_id (album_id)`, `idx_photos_created_at (created_at DESC)`.

### 2.3 `messages`

| nama_kolom | tipe_data | constraint | keterangan |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4. |
| `body` | VARCHAR(500) | NOT NULL, CHECK (CHAR_LENGTH(body) BETWEEN 1 AND 500) | Isi pesan; batas ±500 karakter sesuai PRD F3. |
| `alias` | VARCHAR(100) | NOT NULL | Nama samaran kampung acak PER PESAN, mis. "Bu Marni Penjual Tempe". Disimpan agar riwayat konsisten saat dibaca ulang. |
| `avatar` | ENUM('kucing','ayam','kambing','cicak','bebek','belut') | NOT NULL | Avatar hewan acak per pesan; ENUM karena nilainya tertutup. |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Waktu kirim; dasar urutan riwayat. |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Ada demi konsistensi ketentuan "semua tabel", tetapi nilainya praktis tak pernah berubah — pesan immutable. |

**Sengaja TIDAK ada:** kolom `user_id` / IP / device apa pun (janji anonimitas PRD §F3), kolom `deleted_at` (pesan tak dapat diedit/dihapus setelah teririm).

Indeks: `idx_messages_created_at (created_at DESC)` untuk memuat riwayat N pesan terakhir dengan cepat.

### 2.4 `notes`

| nama_kolom | tipe_data | constraint | keterangan |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4. |
| `body` | VARCHAR(280) | NOT NULL, CHECK (CHAR_LENGTH(body) BETWEEN 1 AND 280) | Isi catatan; batas ±280 karakter sesuai PRD F4. |
| `color` | ENUM('kuning','pink','hijau','ungu','merah','karton') | NOT NULL | Warna pale catatan. Nilai hex (#FFF3C4, #FDE7EF, …) dipetakan di frontend agar makna tidak bergantung warna. |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Dasar urutan papan (terbaru di depan). |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu edit terakhir (semua orang boleh edit). |
| `deleted_at` | TIMESTAMP | NULL | Soft delete; catatan "dicabut" masih bisa dipulihkan. |

Indeks: `idx_notes_created_at (created_at DESC)`.

### 2.5 `gate_attempts`

| nama_kolom | tipe_data | constraint | keterangan |
|---|---|---|---|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4. |
| `ip_hash` | CHAR(64) | NOT NULL | SHA-256 heksadesimal dari (IP + salt harian). IP mentah TIDAK PERNAH disimpan — janji privasi PRD. Salt harian membuat jejak otomatis kedaluwarsa. |
| `attempted_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Waktu percobaan; dasar query window rate-limit 60 detik (blokir jika ≥10 gagal). |
| `created_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | Konsistensi ketentuan semua-tabel. |
| `updated_at` | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Konsistensi ketentuan semua-tabel (baris ini append-only). |

**TANPA `deleted_at`** — ini log operasional pendek; baris lama cukup dipangkas berkala (`DELETE WHERE attempted_at < NOW() - INTERVAL 1 DAY`).

Indeks: `idx_gate_attempts_attempted_at (attempted_at)` — kunci performa query rate-limit per window.

---

## 3. Relasi Antar Tabel (Foreign Keys)

```
┌────────┐ 1        N ┌────────┐
│ albums │───────────<│ photos │   photos.album_id → albums.id (SET NULL)
└────────┘            └────────┘

┌──────────┐   ┌───────────┐   ┌───────────────┐
│ messages │   │   notes   │   │ gate_attempts │   (mandiri, tanpa FK)
└──────────┘   └───────────┘   └───────────────┘
```

| Relasi | FK | Aturan Hapus | Alasan |
|---|---|---|---|
| `photos.album_id` → `albums.id` | Satu-satunya FK di skema ini | ON DELETE SET NULL | Menghapus album tidak boleh ikut menghapus kenangan foto; foto kembali "tanpa album". |

Relasi lain **sengaja tidak ada**: produk ini tanpa akun (tidak ada tabel `users`), chat anonim (pesan tidak menunjuk siapa pun), dan single-tenant (satu grup KKN, tidak ada `groups`). Ketidakadaan relasi di sini adalah keputusan desain, bukan kelalaian.

---

## 4. Keputusan Desain Penting

1. **UUID `VARCHAR(36)` untuk semua primary key (bukan AUTO_INCREMENT).**
   ID tidak bisa ditebak dari URL (foto milik grup privat), tidak membocorkan jumlah baris, dan aman digenerate paralel di aplikasi tanpa koordinasi ke server. Trade-off yang diterima: indeks lebih besar daripada `BIGINT` dan insert acak menyebabkan page split — tidak masalah pada skala ini (±10–30 pengguna).

2. **Aturan uang `BIGINT` satuan sen = TIDAK TERPAKAI (not-applicable).**
   Standar proyek menyebut kolom uang memakai `BIGINT` dalam sen (rupiah terkecil) untuk menghindari error pembulatan `FLOAT`. Namun PRD v1.0 sama sekali tidak memiliki fitur harga/transaksi (diverifikasi: seluruh seksi §2 Fitur dan §3 Out of Scope). Maka tidak ada satu pun kolom uang di skema ini. Jika v1.1 memunculkan fitur patungan/dana acara, terapkan standar tersebut saat itu.

3. **TIMESTAMP, bukan DATETIME.**
   `TIMESTAMP` menyimpan UTC dan dikonversi otomatis ke zona waktu sesi — aman untuk anggota yang membuka situs dari zona waktu berbeda. Konsekuensinya rentang terbatas s.d. 2038; untuk website kenangan ini sudah lebih dari cukup.

4. **ENUM hanya untuk nilai yang benar-benar tertutup.**
   `notes.color` (6 warna palet) dan `messages.avatar` (6 hewan) memang daftar tertutup yang berubahnya jarang — cocok untuk ENUM. Status "aktif vs terhapus" TIDAK dibuat ENUM karena sudah terwakili oleh `deleted_at IS NULL`; menggandakan keduanya akan rawan inkonsisten.

5. **Anonimitas ditegakkan di level skema.**
   `messages` tidak punya kolom identitas apa pun — mustahil bocor lewat query karena datanya memang tidak ada. `gate_attempts.ip_hash` adalah SHA-256(IP + salt harian): tetap bisa dihitung untuk rate-limit window, tapi tidak bisa dibalik menjadi alamat dan otomatis "hangus" setelah hari berganti.

6. **Cakupan soft delete dipilih selektif.**
   `deleted_at` hanya di `albums`, `photos`, `notes` — konten kenangan yang sayang jika hilang permanen dan layak diberi jeda pemulihan. `messages` tanpa soft delete karena PRD menyatakan pesan immutable (tak bisa diedit/dihapus). `gate_attempts` tanpa soft delete karena sekadar log yang dipangkas rutin.

7. **`ON DELETE SET NULL`, bukan `CASCADE`.**
    Album adalah kurasi; foto adalah kenangan. Menghapus album hanya melepas labelnya, tidak melenyapkan isinya. CASCADE di titik ini berisiko kehilangan data massal akibat satu salah klik (ingat: semua anggota boleh hapus — prinsip saling percaya).

8. **`utf8mb4` wajib.**
   Chat dan catatan tempel nyaris pasti dipakai dengan emoji. Charset default lama (`utf8`/`utf8mb3`) akan memotong baris atau menggagalkan insert. Collation `utf8mb4_0900_ai_ci` (default MySQL 8) cepat dan mendukung pencarian case-insensitive untuk Bahasa Indonesia.

9. **Berkas foto di object storage, DB hanya menyimpan path.**
   Menyimpan gambar sebagai `LONGBLOB` akan membengkak backup, memperlambat dump/restore, dan menyulitkan serving via CDN. `storage_path` VARCHAR(512) merujuk objek di bucket `foto`; kompresi WebP q0.85 dilakukan di klien sebelum unggah agar hemat kuota free tier.

10. **CHECK constraints sebagai lapis pertahanan kedua.**
    Batas panjang teks dari PRD (chat ≤500, notes ≤280, tak boleh kosong) ditahan dulu di UI, lalu ditandatangani lagi di database lewat `CHECK (CHAR_LENGTH(body) BETWEEN 1 AND …)`. MySQL 8+ benar-benar menegakkan CHECK, sehingga bug frontend tidak bisa menulis data liar.

11. **`updated_at` di tabel append-only tetap ada demi keseragaman.**
    `gate_attempts.updated_at` dan `messages.updated_at` secara semantik tidak pernah berubah (baris tidak pernah di-update), tapi dipertahankan agar seluruh tabel mengikuti satu konvensi kolom waktu yang sama — lebih mudah diaudit daripada pengecualian satu-dua tabel.
