# API CONTRACT — SuaraKebadongan

> Kontrak lengkap permukaan API website SuaraKebadongan: endpoint REST custom,
> pola akses Supabase (DB/Storage/RPC/RLS), dan pesan realtime.
> Sumber kebutuhan: `PRD.md` v1.0 (F1–F5) · Struktur data: `SCHEMA.md` v1.0
>
> Prinsip utama kontrak ini (dari PRD): **tidak ada teks teknis yang bocor ke UI** —
> semua galat dibungkus pesan ramah berbahasa Indonesia.

---

## 1. Konvensi Umum

### 1.1 Sesi & Autentikasi

| Aspek | Nilai |
|---|---|
| Mekanisme | Cookie tunggal `badongan_gate` — tanpa akun, tanpa token Bearer |
| Nilai cookie | `HMAC-SHA256(GATE_PASSCODE, GATE_SECRET)` — tidak menyimpan passcode plaintext |
| Flag cookie | `HttpOnly; Secure; SameSite=Lax` |
| Masa berlaku | `Max-Age=604800` (7 hari) |
| Penjaga rute | `src/proxy.ts` (konvensi Next.js 16, runtime nodejs): path ≠ `/` tanpa cookie valid → redirect 307 ke `/`; path `/` dengan cookie VALID → redirect ke `/galeri` |
| Pengecualian matcher | `/api/gate`, `_next/static`, `_next/image`, favicon — agar tidak loop |

### 1.2 Amplop Respons Seragam

```jsonc
// Sukses
{ "ok": true, "...data": "..." }

// Galat ramah (selalu HTTP 200 kecuali lockout)
{ "ok": false, "message": "<teks ramah Bahasa Indonesia>" }

// Lockout rate-limit (satu-satunya respons selain 200/307)
// HTTP 429
{ "locked": true, "message": "<pesan design.md>" }
```

Aturan wajib:

1. Respons galat TIDAK PERNAH memuat stack trace, kode SQL, nama tabel, atau status internal.
2. Pesan galat harus persis seperti yang tercantum di seksi ini (microcopy adalah bagian dari kontrak).
3. Endpoint apa pun selain `POST /api/gate` yang diakses tanpa cookie valid ditolak oleh proxy — bukan oleh handler.

---

## 2. Endpoint REST

### 2.1 `POST /api/gate` — Masuk Gerbang

Verifikasi passcode bersama. Satu-satunya endpoint yang boleh diakses tanpa sesi.

**Request**

```json
{ "passcode": "suara-pintu-badongan" }
```

**Respons — sukses (HTTP 200)**

```jsonc
{ "ok": true }
// + header Set-Cookie: badongan_gate=<hmac>; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/
```

**Respons — passcode salah (HTTP 200)**

```json
{ "ok": false, "message": "Hmm, itu bukan suara pintu Badongan. Coba ingat-ingat lagi ya." }
```

Setiap kegagalan mencatat satu baris `gate_attempts(ip_hash, attempted_at)` — lihat §3.6.

**Respons — lockout (HTTP 429)**

Dikembalikan saat percobaan gagal ≥10 kali dalam jendela 60 detik untuk `ip_hash` yang sama:

```json
{ "locked": true, "message": "Pintunya lagi dikunci dulu sebentar. Tarik napas, hitung sampai enam puluh, coba lagi ya." }
```

Catatan implementasi: perbandingan passcode memakai `crypto.timingSafeEqual`
(hash kedua sisi dulu) agar tahan *timing attack*; `ip_hash = SHA-256(IP + salt harian)`.

### 2.2 `DELETE /api/gate` — Keluar

Menghapus sesi. Wajib cookie valid (dijaga proxy).

**Request**: tanpa body.

**Respons (HTTP 200)**

```json
{ "ok": true }
// + header Set-Cookie: badongan_gate=; Max-Age=0; Path=/  (cookie terhapus)
```

### 2.3 `GET /api/surprise?exclude=<uuid>` — Tombol "Inget ga sih?"

Menyerahkan satu foto acak dari seluruh galeri, tidak sama dengan yang terakhir tampil.
Server-side route handler yang memanggil RPC `random_photo` (lihat §3.5).

**Request**

```
GET /api/surprise?exclude=b3f8…uuid-foto-sebelumnya
```

Parameter `exclude` opsional (dikosongkan pada pembukaan pertama).

**Respons — ada foto (HTTP 200)**

```jsonc
{
  "ok": true,
  "photo": {
    "id": "b3f8a1c2-4d5e-4f6a-8b9c-0d1e2f3a4b5c",
    "storage_path": "7c9d2e3f-a1b2-4c3d-9e4f-5a6b7c8d9e0f.webp",
    "caption": "Panen raya bareng pak Karto!",
    "taken_on": "2026-07-14"
  }
}
```

**Respons — galeri masih kosong (HTTP 200)**

```json
{ "ok": true, "empty": true }
```

UI lalu menampilkan: *"Albummu masih kosong nih — unggah foto dulu yuk, biar ada yang bikin kangen."*

**Respons — galat jaringan/server (HTTP 200, bentuk ramah)**

```json
{ "ok": false, "message": "Fotonya macet di jalan. Coba sekali lagi ya." }
```

---

## 3. Kontrak Supabase (Akses Data Langsung)

Fitur F2–F4 tidak melewati server Next.js — klien memanggil Supabase langsung
(`@supabase/supabase-js`) menggunakan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
Postur RLS: **anon permisif** (semua orang yang lolos gerbang dipercaya sama) —
keputusan produk yang didokumentasikan, bukan kelalaian keamanan.

### 3.1 Peta Operasi Tabel per Fitur

| Tabel | Select | Insert | Update | Delete | Dipakai fitur |
|---|---|---|---|---|---|
| `albums` | ✅ semua | ✅ `{name, description}` | — | — | F2 galeri (chip album + modal buat album) |
| `photos` | ✅ semua | ✅ setelah upload Storage | ✅ `caption`, `taken_on`, `album_id` | ✅ baris + objek storage | F2 galeri, F5 surprise |
| `messages` | ✅ `ORDER BY created_at DESC LIMIT 50` (di-reverse saat render) | ✅ `{body, alias, avatar}` | ❌ **tidak ada** | ❌ **tidak ada** | F3 chat |
| `notes` | ✅ `ORDER BY created_at DESC` | ✅ `{body, color}` | ✅ `body`, `color`, `updated_at` | ✅ | F4 cat tempel |
| `gate_attempts` | ✅ COUNT window 60 dtk (server route saja) | ✅ (server route saja) | ❌ | ❌ (baris tua dipangkas berkala) | F1 gerbang |

### 3.2 Contoh Operasi — Chat (F3)

```jsonc
// INSERT pesan baru (identitas digenerate klien, disimpan agar riwayat konsisten)
{
  "body": "halo Badongan!!",
  "alias": "Bu Marni Penjual Tempe",
  "avatar": "kucing"
}
// body: 1..500 char (CHECK di DB) · alias: gabungan gelaran×nama×identitas
// avatar: salah satu ENUM('kucing','ayam','kambing','cicak','bebek','belut')

// SELECT riwayat
// .from('messages').select('*').order('created_at', { ascending: false }).limit(50)
```

### 3.3 Contoh Operasi — Notes (F4)

```jsonc
// INSERT catatan baru
{ "body": "Jangan lupa fotoin posko sebelum dibongkar!", "color": "kuning" }

// UPDATE (siapa pun boleh) — reconciled by id, last-write-wins via updated_at
{ "body": "teks revisi", "color": "pink", "updated_at": "2026-08-25T09:00:00Z" }

// color ∈ ENUM('kuning','pink','hijau','ungu','merah','karton')
// hex pale (#FFF3C4, #FDE7EF, …) dipetakan di frontend
```

### 3.4 Aturan Bucket Storage `foto` (publik)

| Aturan | Nilai |
|---|---|
| Format diterima | `image/jpeg`, `image/png` (validasi sebelum kompresi) |
| Ukuran maksimum | ±10 MB per file SEBELUM kompresi |
| Kompresi klien | Canvas → WebP q0.85, sisi panjang maks 2000px (fallback JPEG q0.85 bila WebP tak tersedia) |
| Path objek | `${crypto.randomUUID()}.webp` — `upsert: false` |
| Akses baca | Publik via `/object/public/foto/<path>` |
| Hapus | Anggota mana pun boleh (hapus baris `photos` + objek storage bersamaan) |
| Gagal unggah | Per-file: *"Waduh, format ini belum bisa ditempel di album. Coba JPG atau PNG ya."* |

### 3.5 RPC `random_photo` (dipakai §2.3)

```sql
random_photo(exclude_id uuid DEFAULT NULL)
RETURNS SETOF photos LANGUAGE sql VOLATILE SECURITY INVOKER
-- body: SELECT * FROM photos WHERE id <> exclude_id ORDER BY random() LIMIT 1;
-- GRANT EXECUTE TO anon
```

### 3.6 `gate_attempts` (dipakai §2.1)

```jsonc
// INSERT tiap kegagalan
{ "ip_hash": "9f86d081884c7d65…" }   // CHAR(64) hex, SHA-256(IP + salt harian)

// COUNT untuk lockout
// SELECT count(*) FROM gate_attempts
//  WHERE ip_hash = $1 AND attempted_at > now() - interval '60 seconds'
// count >= 10 → respons {locked:true} TANPA mencatat attempt baru
```

---

## 4. Kontrak Realtime

Semua langganan memakai Supabase Realtime (`postgres_changes` + `broadcast`),
publication `supabase_realtime` berisi tabel `messages`, `photos`, `notes`.

### 4.1 Channel `suara` — Chat (F3)

**Event `postgres_changes` INSERT di `messages`** — bubble baru muncul tanpa reload:

```jsonc
{
  "eventType": "INSERT",
  "table": "messages",
  "new": {
    "id": "d4e5f6a7-b8c9-4d0e-8f1a-2b3c4d5e6f70",
    "body": "siapa yang kemarin ketiduran pas rapat?",
    "alias": "Mbah Rejo Penjaga Sawah",
    "avatar": "bebek",
    "created_at": "2026-08-25T09:12:40.120Z"
  },
  "old": {}
}
```

**Event `broadcast` `mengetik`** — indikator "Seseorang sedang mengetik…" (TANPA nama):

```jsonc
// dikirim throttled maks 1× per 2 detik saat pengguna aktif mengetik
{ "event": "mengetik", "payload": { "t": 1756115560120 } }
```

Aturan: indikator hilang otomatis 3 detik setelah event terakhir; penerima
mengumumkan lewat aria-live hanya SEKALI per giliran mengetik.

### 4.2 Channel `galeri` — Sinkronisasi Foto (F2)

**Event `postgres_changes` DELETE di `photos`** — kartu hilang mulus di semua klien;

```jsonc
{
  "eventType": "DELETE",
  "table": "photos",
  "old": { "id": "b3f8a1c2-4d5e-4f6a-8b9c-0d1e2f3a4b5c" },
  "new": {}
}
```

Aturan lanjutan: jika foto yang terhapus sedang terbuka di lightbox/surprise → tutup mulus + toast *"Fotonya dicopot dari album."*
(INSERT/UPDATE foto tidak disubscribe — daftar cukup di-refresh lokal karena hanya pengunggah yang menambah.)

### 4.3 Channel `papan` — Cat Tempel (F4)

**Event `postgres_changes` INSERT/UPDATE/DELETE di `notes`** — sinkron antar pengguna:

```jsonc
// INSERT
{ "eventType": "INSERT", "table": "notes",
  "new": { "id": "…", "body": "doa terbaik buat desa", "color": "hijau",
           "created_at": "2026-08-25T09:20:01Z", "updated_at": "2026-08-25T09:20:01Z" } }

// UPDATE (reconcile by id; last-write-wins membandingkan updated_at)
{ "eventType": "UPDATE", "table": "notes",
  "old": { "updated_at": "2026-08-25T09:20:01Z" },
  "new": { "id": "…", "body": "teks revisi", "color": "ungu",
           "updated_at": "2026-08-25T09:21:33Z" } }

// DELETE
{ "eventType": "DELETE", "table": "notes", "old": { "id": "…" } }
```

Aturan: UI notes bersifat **optimistic** — tulisan lokal tampil instan lalu direkonsiliasi
dengan event (map berbasis `id`); kiriman gagal mendapat badge "belum nempel — ketuk untuk coba lagi".

---

## 5. Aturan Validasi Ringkas

| Input | Batasan | Penegakan berlapis |
|---|---|---|
| `messages.body` | 1–500 karakter | `maxLength` input + counter "sisa N huruf" → CHECK DB |
| `notes.body` | 1–280 karakter | `maxLength` + counter → CHECK DB |
| `photos.caption` | ≤300 karakter (boleh kosong) | form → kolom VARCHAR(300) |
| `albums.name` | wajib, ≤100 karakter | form → NOT NULL VARCHAR(100) |
| `albums.description` | opsional, ≤500 karakter | form → VARCHAR(500) |
| Berkas foto | JPG/PNG, ≤10 MB pra-kompresi; hasil WebP q0.85 sisi ≤2000 px | validasi type+size klien sebelum upload |
| `passcode` | string tak kosong | `required` + timingSafeEqual server |
| Rate-limit gerbang | maks 10 gagal / 60 detik / ip_hash | tabel `gate_attempts` + index `attempted_at` |

Konsistensi penamaan kolom, nilai ENUM, dan CHECK panjang mengacu penuh pada `SCHEMA.md`.
Perubahan salah satu dokumen wajib menyinkronkan dokumen satunya.
