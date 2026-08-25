-- ============================================================
-- SuaraKebadongan — Migration 0001: Init
-- Jalankan di Supabase SQL Editor atau via CLI:
--   supabase db push (atau paste manual)
--
-- Sumber: SCHEMA.md (5 tabel) + ARCHITECTURE.md §6 (realtime)
-- Dibuat: 25 Agustus 2026
-- ============================================================

-- ── 1. Tabel Albums ─────────────────────────────────────────
-- Pengelompokan foto per acara KKN (mis. "Bersih Desa", "Pentas Seni").
-- Soft delete via deleted_at; ON DELETE SET NULL untuk photos.

create table if not exists albums (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

comment on table albums is 'Pengelompokan foto per acara KKN';

-- ── 2. Tabel Photos ─────────────────────────────────────────
-- Metadata foto kenangan. Berkas fisik di bucket storage 'foto'.
-- album_id nullable: foto boleh berdiri sendiri tanpa album.

create table if not exists photos (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid references albums(id) on delete set null,
  storage_path text not null,
  caption      text not null default '',
  taken_on     date,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

comment on table photos is 'Metadata foto kenangan — berkas fisik di storage';

create index if not exists idx_photos_album_id on photos(album_id);
create index if not exists idx_photos_created_at on photos(created_at desc);

-- ── 3. Tabel Messages ───────────────────────────────────────
-- Pesan obrolan anonim realtime ("Suara").
-- TANPA kolom identitas apa pun — janji anonimitas PRD §F3.
-- Pesan immutable: tidak bisa diedit/dihapus setelah teririm.

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  body       text not null check (char_length(body) between 1 and 500),
  alias      text not null,
  avatar     text not null check (avatar in ('kucing','ayam','kambing','cicak','bebek','belut')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table messages is 'Pesan obrolan anonim — tanpa identitas pengirim';

create index if not exists idx_messages_created_at on messages(created_at desc);

-- ── 4. Tabel Notes ──────────────────────────────────────────
-- Catatan tempel kolektif (maks 280 karakter), 6 warna pale.
-- Bisa diedit/dihapus siapa saja (optimitic update).

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  body       text not null check (char_length(body) between 1 and 280),
  color      text not null check (color in ('kuning','pink','hijau','ungu','merah','karton')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table notes is 'Catatan tempel kolektif — warna pale, 280 karakter';

create index if not exists idx_notes_created_at on notes(created_at desc);

-- ── 5. Tabel Gate Attempts ──────────────────────────────────
-- Log percobaan passcode gagal untuk rate-limit anti brute-force.
-- IP mentah TIDAK PERNAH disimpan — hanya hash berkadar-garam.

create table if not exists gate_attempts (
  id           uuid primary key default gen_random_uuid(),
  ip_hash      char(64) not null,
  attempted_at timestamptz not null default now()
);

comment on table gate_attempts is 'Log percobaan passcode gagal — rate-limit anti brute-force';

create index if not exists idx_gate_attempts_attempted_at on gate_attempts(attempted_at);

-- ── 6. RLS (Row Level Security) ─────────────────────────────
-- Semua tabel diaktifkan RLS-nya. Policy permisif: anon boleh CRUD.
-- Postur keamanan: "saling percaya" — semua yang lolos gerbang dipercaya.
-- (ARCHITECTURE.md §8.5)

alter table albums        enable row level security;
alter table photos        enable row level security;
alter table messages      enable row level security;
alter table notes         enable row level security;
alter table gate_attempts enable row level security;

-- Policy anon permisif — CRUD tanpa autentikasi Supabase Auth.
-- Keamanan bergantung pada: (1) gerbang passcode, (2) anon hanya melihat data yang lolos gerbang.

create policy "anon_full_access_albums" on albums
  for all using (true) with check (true);

create policy "anon_full_access_photos" on photos
  for all using (true) with check (true);

create policy "anon_full_access_messages" on messages
  for all using (true) with check (true);

create policy "anon_full_access_notes" on notes
  for all using (true) with check (true);

create policy "anon_full_access_gate_attempts" on gate_attempts
  for all using (true) with check (true);

-- ── 7. Realtime Publication ──────────────────────────────────
-- Tabel yang di-subscribe lewat Supabase Realtime:
--   - messages (F3 chat): INSERT saja (riwayat tidak berubah)
--   - photos (F2 galeri): INSERT + DELETE (kartu muncul/hilang)
--   - notes (F4 catatan): INSERT + UPDATE + DELETE (papan live)

alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table photos;
alter publication supabase_realtime add table notes;

-- ── 8. Fungsi random_photo ──────────────────────────────────
-- RPC untuk tombol "Inget ga sih?" (F5 Kejutan).
-- Mengembalikan 1 foto acak yang BUKAN exclude_id.

create or replace function random_photo(exclude_id uuid)
returns setof photos
language sql
volatile
security invoker
as $$
  select *
  from photos
  where id <> exclude_id
    and deleted_at is null
  order by random()
  limit 1;
$$;

-- Grant execute ke anon (Supabase anon key bisa memanggil)
grant execute on function random_photo(uuid) to anon;

-- ── 9. Bucket Storage ───────────────────────────────────────
-- Bucket publik 'foto' — semua orang yang lolos gerbang bisa lihat.
-- Upload hanya melalui aplikasi (compress.ts → WebP q0.85 ≤2000px).

insert into storage.buckets (id, name, public)
values ('foto', 'foto', true)
on conflict (id) do nothing;

-- Policy: anon bisa SELECT semua objek di bucket 'foto'
create policy "anon_select_foto"
  on storage.objects for select
  using (bucket_id = 'foto');

-- Policy: anon bisa INSERT ke bucket 'foto' (upload dari aplikasi)
create policy "anon_insert_foto"
  on storage.objects for insert
  with check (bucket_id = 'foto');

-- Policy: anon bisa DELETE dari bucket 'foto' (hapus foto dari galeri)
create policy "anon_delete_foto"
  on storage.objects for delete
  using (bucket_id = 'foto');
