# Gelombang 6 — Catatan Tempel

> **Commit:** `feat(notes): papan cat tempel realtime + spring tempel/lepas`

## Apa yang Dibuat?

Papan cat kolektif — pesan singkat, doa, atau kejadian konyol.
Maksimal 280 karakter, sinkron real-time.

## 1. Kenapa 280 Karakter?

**Alasan desain:**
Satu catatan tempel fisik memang cuma muat beberapa baris.
Kalau lebih panjang, orang menulis di kertas kedua — dan itulah keajaibannya:
satu pikiran = satu catatan.

**Alasan teknis:**
- Hemat storage (free tier 500MB)
- Papan tetap padat-rapi di layar HP
- Memaksa pesan jadi padat dan lucu

## 2. Formulis (`src/components/notes/NoteForm.tsx`)

**Fitur:**
- Textarea: "Tulis pesan, doa, atau kejadian konyol hari ini…"
- Counter: "sisa 280 huruf"
- 6 swatch warna dengan LABEL TEKS (bukan hanya warna)
- Tombol "Tempel!"
- Ctrl+Enter untuk tempel cepat

**Kenapa swatch wajib berlabel?**
Aksesibilitas! Warna tidak boleh menjadi satu-satunya cara menyampaikan informasi.
User tunanetra warna (color blind) perlu tahu swatch mana yang dipilih.

**Kenapa `Ctrl+Enter`?**
Power user tidak ingin jari berpindah ke mouse.
Keyboard shortcut = produktivitas tanpa friction.

## 3. 6 Warna Pale

| Warna | Hex | Makna |
|---|---|---|
| Kuning | `#FFF6C8` | Tint marker-kuning #FED92E |
| Pink | `#F8DEE5` | Rose — tint stiker-merah #6E0521 |
| Hijau | `#E1EFE5` | Sage — tint tape-hijau #4A8C5C |
| Ungu | `#EEE8F7` | Lavender — tint spidol-ungu #9B7FC4 |
| Merah | `#FBE7D9` | Peach hangat, keluarga sepia |
| Karton | `#FAF1DF` | Krim manila hangat |

**Kenapa pale, bukan saturated?**
Setiap pastel adalah tint (campuran putih) dari satu token aksen tema — jadi papan cat terasa seperti satu keluarga dengan kanvas maroon. Teks `--tinta-gelap` harus kontras tinggi di atas warna catatan.
Warna saturated = kontras rendah = teks tidak terbaca.
Pale = kontras tinggi = teks nyaman dibaca.

## 4. NoteCard (`src/components/notes/NoteCard.tsx`)

**Fitur:**
- Rotasi bergantian ±1-2° (scrapbook feel)
- Ornamen: pin merah atau tape kuning (bergantian)
- Spring animation: scale .9→1 overshoot 250ms
- Click → edit popover

**Kenapa ornamen bergantian?**
Variasi visual = papan terasa hidup dan unik.
Jika semua catatan sama, terasa seperti daftar bukan papan tempel.

## 5. NotePopover (`src/components/notes/NotePopover.tsx`)

**Fitur:**
- Edit inline: ubah teks + warna
- Hapus dengan konfirmasi: "Cabut catatan ini dari papan?"
- Focus trap + Esc menutup
- Siapa saja boleh edit/hapus (saling percaya)

**Kenapa tanpa hierarki admin?**
Produk ini lahir dari saling percaya. Tidak ada "pemilik" catatan.
Semua orang bisa edit/hapus — seperti dinding pengumuman desa.

## 6. Realtime CRUD

```ts
supabase.channel('catatan')
  .on('postgres_changes', { event: 'INSERT', ... }) // catatan baru
  .on('postgres_changes', { event: 'UPDATE', ... }) // catatan diedit
  .on('postgres_changes', { event: 'DELETE', ... }) // catatan dihapus
  .subscribe()
```

**Optimistic UI:**
Ketika user klik "Tempel!", catatan langsung muncul di papan (lokal).
Server INSERT dijalankan di background. Jika gagal, catatan dihapus dari lokal.

**Kenapa optimistic?**
User tidak perlu menunggu 100-500ms untuk melihat hasilnya.
Respons instan = terasa seperti aplikasi native.

**Last-write-wins:**
Jika dua orang edit catatan yang sama bersamaan, yang terakhir menyimpan menang.
Sederhana, tidak perlu conflict resolution rumit.

## 7. Empty State

```
Papan masih kosong nih. Jadi orang pertama yang naruh tempel di dinding!
```

Dengan ilustrasi "hantu" garis putus-putus — catatan kosong yang menunggu diisi.

## 8. Loading State

Formulis langsung aktif (optimistic), papan menampilkan skeleton catatan.

## Flow Tempel Catatan

```
User ketik "Semoga kita ketemu lagi di Badongan"
  → Pilih warna hijau
  → Klik "Tempel!"
  → supabase.from('notes').insert({ body, color })
  → INSERT event → Realtime broadcast
  → Semua client terima → catatan muncul di papan
  → Spring animation: scale .9→1 overshoot
```

## Yang Dipelajari

| Konsep | Penjelasan |
|---|---|
| Optimistic UI | Munculkan hasil dulu, server di background |
| Last-write-wins | Konflik sederhana: yang terakhir menang |
| Swatch berlabel | Aksesibilitas: warna + teks |
| Spring animation | Kenyal dan natural (stiffness ~260) |
| Focus trap | Tahan fokus di dalam dialog |
| Realtime INSERT/UPDATE/DELETE | Sinkron papan antar device |

## File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `src/components/notes/NoteForm.tsx` | Formulis catatan |
| `src/components/notes/NoteCard.tsx` | Kartu catatan individual |
| `src/components/notes/NotePopover.tsx` | Popover edit/hapus |
| `src/app/(album)/notes/page.tsx` | Halaman papan cat tempel |
