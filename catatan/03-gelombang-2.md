# Bab 3 — Gelombang 2: Supabase + Gerbang Backend + Gerbang UI

> 25 Agustus 2026

## Apa yang Dikerjakan

### Todo 4: Supabase Migration + Bucket + Env + Client Helpers
- `supabase/migrations/0001_init.sql` — 5 tabel PostgreSQL:
  - `albums` — pengelompokan foto per acara
  - `photos` — metadata foto (berkas di storage, bukan di DB)
  - `messages` — pesan anonim (TANPA kolom identitas!)
  - `notes` — catatan tempel 280 karakter, 6 warna
  - `gate_attempts` — log percobaan passcode gagal
- RLS diaktifkan di semua tabel + policy anon permisif
- Realtime publication: messages, photos, notes
- Fungsi `random_photo(exclude_id)` untuk tombol "Inget ga sih?"
- Bucket publik `foto` + policy select/insert/delete
- `.env.example` — 4 variabel (URL, anon key, passcode, secret)
- `src/lib/supabase/client.ts` — browser singleton
- `src/lib/supabase/server.ts` — server fresh client per request

### Todo 5: Gerbang Backend
- `src/app/api/gate/route.ts` — POST + DELETE handlers:
  - POST: hash passcode → timingSafeEqual → set cookie HMAC
  - Salah → catat attempt (ip_hash = SHA-256(IP + salt harian))
  - ≥10 attempt/60dtk → 429 {locked:true}
  - DELETE: hapus cookie (maxAge=0)
- `src/proxy.ts` — Next.js 16 convention (BUKAN middleware.ts):
  - Cookie valid + path "/" → redirect ke /galeri
  - Cookie invalid + path "/" → izinkan (gerbang)
  - Cookie invalid + path ≠ "/" → redirect ke /

### Todo 6: Gerbang UI
- `src/components/gate/GateCard.tsx` — CLIENT COMPONENT:
  - State machine: idle → loading → error/lockout
  - Form: password input + tombol "Ketuk Pintu"
  - Microcopy: placeholder, error, lockout messages
  - Animasi: fade+naik 8px mount, shake ±4px error
  - Reduced-motion: statis tanpa animasi
  - Aksesibilitas: label, aria-live="polite", focus management
- `src/app/page.tsx` — render `<GateCard />`

## Yang Dipelajari

### Kenapa RLS Policy "Semua Orang Boleh"?
Keamanan bukan di RLS, tapi di gerbang passcode. Semua yang lolos gerbang dipercaya sama ("prinsip saling percaya"). RLS tetap diaktifkan untuk:
1. Mencegah anon key dipakai dari luar website
2. Kebijakan bisa diperketat nanti tanpa ubah kode
3. Postur keamanan yang disadari dan didokumentasikan

### Kenapa messages TANPA Kolom Identitas?
Janji anonimitas PRD §F3. Tidak ada `user_id`, IP, device — bahkan tidak ada `deleted_at` (pesan immutable). Nama samaran + avatar hewan digenerate PER PESAN, disimpan hanya agar riwayat konsisten saat dibaca ulang.

### Kenapa proxy.ts, bukan middleware.ts?
Next.js 16 mengganti nama `middleware.ts` menjadi `proxy.ts`. Fungsinya sama: menjaga route. Tapi ada perbedaan: proxy tidak mendukung edge runtime, jadi kita pakai Node.js (default). Ini cocok karena kita butuh modul `crypto` untuk verifikasi HMAC.

### Kenapa ip_hash dengan Salt Harian?
`ip_hash = SHA-256(IP + GATE_SECRET + tanggal)`. Salt harian membuat jejak otomatis hangus saat ganti hari — tidak perlu cleanup script. IP mentah tidak pernah disimpan (janji privasi).

## Commits

- `cad6533` — feat(data): skema Supabase anonim + RLS + realtime + fungsi foto acak
- `b7ebd57` — feat(gerbang): sesi passcode httpOnly + rate-limit + proxy.ts
- `d3d1bf7` — feat(gerbang): UI kartu pintu + animasi masuk/shake

## ⚠️ Yang Perlu Dilakukan Sebelum Lanjut

1. **Buat Supabase project** di https://supabase.com
2. **Jalankan migration SQL** di SQL Editor: copy paste isi `supabase/migrations/0001_init.sql`
3. **Isi `.env.local`** dengan nilai dari dashboard Supabase + passcode + secret
4. **Generate GATE_SECRET**: `openssl rand -hex 32`

**Lanjut → [Bab 4: Gelombang 3 — App Shell (TabBar, Lenis, Crossfade)](./04-gelombang-3.md)**
