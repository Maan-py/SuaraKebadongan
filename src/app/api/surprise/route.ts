import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()

    // Ambil exclude_id dari query param (opsional)
    const { searchParams } = new URL(request.url)
    const excludeId = searchParams.get('exclude_id')

    // Query langsung — tidak pakai RPC agar tidak bergantung pada
    // fungsi random_photo yang mungkin belum di-deploy ke Supabase.
    // PostgreSQL random() di-order di sisi DB, limit 1 = satu foto acak.
    let query = supabase
      .from('photos')
      .select('id, storage_path, caption, taken_on')
      .is('deleted_at', null)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query

    if (error) throw error

    // Jika tidak ada foto
    if (!data || data.length === 0) {
      return NextResponse.json({ empty: true })
    }

    // Pilih acak di sisi server (JS) agar tidak bergantung pada ORDER BY random() di DB
    const photo = data[Math.floor(Math.random() * data.length)]

    return NextResponse.json({
      id: photo.id,
      storage_path: photo.storage_path,
      caption: photo.caption,
      taken_on: photo.taken_on,
    })
  } catch (err) {
    console.error('[/api/surprise]', err)
    return NextResponse.json(
      { error: 'Gagal memuat foto kejutan' },
      { status: 500 },
    )
  }
}
