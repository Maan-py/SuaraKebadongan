# Gelombang 5 — Chat "Suara"

> **Commits:** `feat(suara): identitas per-pesan + kirim + riwayat 50 + realtime` + `feat(suara): typing anonim, auto-scroll cerdas, bubble spring`

## Apa yang Dibuat?

Chat anonim adalah "inti dari nama SuaraKebadongan" — obrolan grup waktu-nyata
tanpa identitas. Nama samaran berganti TIAP PESAN.

## 1. Kenapa Nama Samaran Berganti Tiap Pesan?

**Alasan keamanan:**
Kalau nama konsisten, "Bu Marni" yang rajin chat bisa dikenali polanya.
Anonimitas jadi bocor lewat perilaku. Berganti tiap pesan = pelacakan mustahil.

**Alasan emosional:**
Lottery lucu! Setiap bubble adalah kejutan — nama samarannya kocak.
Bayangkan: "Mas Tugimin Tukang Sepeda Ontel" → "Nduk Sarinem Penjaga Sawah" → "Mbah Rejo Juragan Bebek".

## 2. Generator Alias (`src/lib/alias.ts`)

```
gelaran × nama × identitas = 6 × 6 × 6 = 216 kombinasi
```

Contoh hasil:
- "Bu Marni Penjual Tempe"
- "Mas Tugimin Tukang Sepeda Ontel"
- "Mbak Rejo Warga RT 03"

**Kenapa tidak pakai UUID/nomor?**
"User-3847" terasa dingin dan dehumanisasi.
"Bu Marni Penjual Tempe" terasa hangat dan kampung — sesuai tema.

## 3. Avatar Hewan (`src/components/chat/AvatarHewan.tsx`)

6 SVG inline: kucing, ayam, kambing, cicak, bebek, belut.

**Kenapa SVG inline, bukan gambar?**
- Zero network request (tidak perlu load file gambar)
- Bisa diwarnai langsung via props `warna`
- Skala tanpa pecah (vector, bukan raster)
- Ukuran file kecil (~200 bytes per hewan)

**Kenapa warna acak?**
Sama seperti nama — agar setiap bubble terasa unik dan tidak bisa dilacak
berdasarkan kombinasi warna + avatar.

## 4. Chat Bubble (`src/components/chat/ChatBubble.tsx`)

**Fitur:**
- Max-width 80% (tidak memenuhi layar)
- Bubble orang lain: bg `--karton`, rata kiri
- Bubble milik sendiri: bg `--tape-hijau/20`, rata kanan
- Avatar + nama samaran + waktu
- `word-break: break-word` untuk string panjang

**Kenapa max-width 80%?**
Pesan sangat panjang tanpa spasi (URL, copypaste) bisa memenuhi seluruh layar.
80% memberi ruang untuk napas visual.

## 5. Chat Input (`src/components/chat/ChatInput.tsx`)

**Fitur:**
- Placeholder: "Tulis apa saja… tidak ada yang tahu ini kamu kok"
- Counter: "sisa 500 huruf" (muncul saat mengetik)
- Warning di ambang 50 huruf terakhir (aria-live polite)
- Tombol kirim disabled saat kosong/spasi
- Debounce 1 detik anti-spam
- Enter kirim, Shift+Enter baris baru

**Kenapa 500 batas huruf?**
Obrolan seharusnya pendek dan spontan. 500 huruf ≈ 2-3 kalimat pendek.
Terlalu panjang = bukan chat lagi, tapi essay.

**Kenapa debounce 1 detik?**
User bisa tap tombol kirim berkali-kali dengan cepat.
Tanpa debounce, satu pesan bisa terkirim 5-10 kali.

## 6. Realtime INSERT

```ts
supabase.channel('suara')
  .on('postgres_changes', { event: 'INSERT', table: 'messages' }, ...)
  .subscribe()
```

**Apa yang terjadi:**
1. User A kirim pesan → INSERT ke database
2. Supabase Realtime broadcast event ke semua client
3. User B (dan A) terima event → bubble muncul tanpa refresh

**Channel name 'suara':**
Ini nama channel realtime. Bisa apa saja, tapi harus konsisten
antara publisher (yang kirim) dan subscriber (yang terima).

## 7. Auto-scroll + Pill "N pesan baru ↓"

**Logic:**
- Jika user di dasar (threshold 80px) → auto-scroll saat pesan baru
- Jika user scroll ke atas → TIDAK paksa scroll, tampilkan pill
- Klik pill → lompat ke dasar + reset counter

**Kenapa tidak paksa scroll?**
Bayangkan sedang baca riwayat lama, tiba-tiba scroll terpaksa ke bawah.
Frustrating! Auto-scroll hanya aktif jika user memang di dasar.

## 8. Typing Indicator

```ts
// Kirim saat mengetik (throttled maks 1/2 detik)
channel.send({ type: 'broadcast', event: 'mengetik', payload: {} })

// Terima → tampilkan "Seseorang sedang mengetik…"
channel.on('broadcast', { event: 'mengetik' }, () => { ... })
```

**Kenapa TANPA nama?**
Anonimitas! "Seseorang" tidak mengungkap siapa yang mengetik.
Kalau pakai nama, identitas bocor lewat perilaku mengetik.

**Kenapa timeout 3 detik?**
Jika user berhenti mengetik, indikator harus hilang.
3 detik = waktu yang cukup untuk jeda antar kalimat.

## 9. Loading State

**Skeleton:** 3 bubble kosong `--karton` bergerak (animate-pulse)
**Empty state:** Doodle + "Belum ada suara sama sekali. Kasih salam pertama buat yang lain yuk!"

**Kenapa skeleton, bukan spinner?**
Skeleton meniru bentuk konten yang akan muncul (bubble).
User bisa memprediksi apa yang akan datang. Spinner generik tidak memberi petunjuk.

## Flow Kirim Pesan

```
User ketik "Halo semuanya!"
  → Counter turun: "492 huruf tersisa"
  → Enter atau tap tombol kirim
  → generateAlias() → "Mas Slamet Pemilik Warung"
  → getRandomHewan() → "bebek"
  → supabase.from('messages').insert({ text, alias, avatar })
  → INSERT event → Realtime broadcast
  → Semua client terima → bubble muncul di dasar
  → User lain lihat: [Avatar Bebek] Mas Slamet Pemilik Warung
                      "Halo semuanya!"
```

## Yang Dipelajari

| Konsep | Penjelasan |
|---|---|
| Anonimitas aktif | Nama berganti tiap pesan = pelacakan mustahil |
| Generator alias | Gabungan acak gelaran × nama × identitas |
| SVG inline | Zero request, bisa diwarnai, skala tanpa pecah |
| Debounce | Batasi frekuensi eksekusi (anti-spam) |
| Auto-scroll | Scroll otomatis hanya jika user di dasar |
| `aria-live="polite"` | Screen reader umumkan pesan baru tanpa interupsi |
| Realtime broadcast | Channel untuk event non-database (typing indicator) |
| Word break | `break-word` mencegah layout pecah oleh string panjang |

## File yang Dibuat/Diubah

| File | Aksi |
|---|---|
| `src/lib/alias.ts` | Generator nama samaran |
| `src/components/chat/AvatarHewan.tsx` | 6 SVG avatar hewan |
| `src/components/chat/ChatBubble.tsx` | Bubble pesan |
| `src/components/chat/ChatInput.tsx` | Form input + counter + debounce |
| `src/components/chat/TypingIndicator.tsx` | "Seseorang sedang mengetik…" |
| `src/app/(album)/chat/page.tsx` | Halaman chat utama |
