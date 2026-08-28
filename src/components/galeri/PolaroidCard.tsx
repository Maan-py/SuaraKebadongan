'use client'

import { useMemo } from 'react'

interface Photo {
  id: string
  storage_path: string
  caption: string
  taken_on: string | null
  album_id: string | null
  created_at: string
}

interface PolaroidCardProps {
  photo: Photo
  onSelect: (photo: Photo) => void
  index: number
}

// Pola rotasi bergantian: [-1.5°, +1°, +0.5°]
const ROTATIONS = [-1.5, 1, 0.5]

// Warna aksen untuk tape
const TAPE_COLORS = [
  'bg-stiker-merah/40',
  'bg-maroon-400/50',
  'bg-tape-hijau/40',
  'bg-pulpen-biru/40',
  'bg-stiker-pink/40',
  'bg-spidol-ungu/40',
]

export default function PolaroidCard({ photo, onSelect, index }: PolaroidCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length]
  const tapeColor = TAPE_COLORS[index % TAPE_COLORS.length]

  // Seed acak untuk posisi tape (konsisten per kartu)
  const tapeSeed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < photo.id.length; i++) {
      hash = (hash << 5) - hash + photo.id.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }, [photo.id])

  const tapeLeft = 30 + (tapeSeed % 40)
  const tapeRotate = -5 + (tapeSeed % 10)

  // URL thumbnail: gunakan public URL dengan transform width 640
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const thumbnailUrl = `${supabaseUrl}/storage/v1/object/public/foto/${photo.storage_path}?width=640`

  const altText = photo.caption || 'Foto tanpa caption'

  return (
    <button
      onClick={() => onSelect(photo)}
      className="group mb-4 break-inside-avoid"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="bingkai-polaroid rounded-radius-kartu bg-polaroid p-2 pb-6 shadow-[2px_3px_8px_rgba(46,33,24,.12)] transition-transform duration-200 hover:!scale-[1.02] hover:shadow-[2px_4px_12px_rgba(46,33,24,.18)]">
    
        
        {/* Pin Image */}
        <img 
          src="/push-pin.png" 
          alt="Pin" 
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 object-contain drop-shadow-sm z-20 hover:scale-110 transition-transform"
        />

        {/* Foto dengan overlay sepia */}
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={thumbnailUrl}
            alt={altText}
            loading="lazy"
            decoding="async"
            className="block w-full object-cover"
          />
          {/* Overlay sepia terang — kesan roll film */}
          <div className="absolute inset-0 bg-sepia-terang/10 mix-blend-multiply" />
        </div>

        {/* Caption (jika ada) */}
        {photo.caption && (
          <p className="mt-2 text-center font-tulis text-sm text-tinta-gelap/80">
            {photo.caption}
          </p>
        )}
      </div>
    </button>
  )
}
