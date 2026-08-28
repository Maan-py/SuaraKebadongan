-- ============================================================
-- SuaraKebadongan — Migration 0002: Fix random_photo
-- Dibuat: 28 Agustus 2026
--
-- Bug: kondisi `id <> null` di PostgreSQL selalu NULL (bukan TRUE),
-- sehingga saat exclude_id = null tidak ada baris yang lolos filter
-- dan fungsi selalu return kosong.
--
-- Fix: ganti dengan `(exclude_id IS NULL OR id <> exclude_id)`
-- ============================================================

create or replace function random_photo(exclude_id uuid)
returns setof photos
language sql
volatile
security invoker
as $$
  select *
  from photos
  where (exclude_id is null or id <> exclude_id)
    and deleted_at is null
  order by random()
  limit 1;
$$;

-- Pastikan grant masih aktif
grant execute on function random_photo(uuid) to anon;
