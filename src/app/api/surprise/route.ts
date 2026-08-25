import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createServerClient()

    // Panggil RPC random_photo (tanpa exclude_id = foto acak total)
    const { data, error } = await supabase
      .rpc('random_photo', { exclude_id: null })

    if (error) throw error

    // Jika tidak ada foto
    if (!data || data.length === 0) {
      return NextResponse.json({ empty: true })
    }

    const photo = data[0]

    return NextResponse.json({
      id: photo.id,
      storage_path: photo.storage_path,
      caption: photo.caption,
      taken_on: photo.taken_on,
    })
  } catch {
    return NextResponse.json(
      { error: 'Gagal memuat foto kejutan' },
      { status: 500 },
    )
  }
}
