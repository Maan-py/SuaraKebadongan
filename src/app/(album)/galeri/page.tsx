'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import ZonaUpload from '@/components/galeri/ZonaUpload'
import AlbumChips from '@/components/galeri/AlbumChips'
import MasonryGrid from '@/components/galeri/MasonryGrid'
import Lightbox from '@/components/galeri/Lightbox'

interface Photo {
  id: string
  storage_path: string
  caption: string
  taken_on: string | null
  album_id: string | null
  created_at: string
}

interface Album {
  id: string
  name: string
  description: string
}

export default function GaleriPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

  // Load data
  const loadData = useCallback(async () => {
    const [photosResult, albumsResult] = await Promise.all([
      supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('albums')
        .select('*')
        .order('name'),
    ])

    if (photosResult.data) setPhotos(photosResult.data)
    if (albumsResult.data) setAlbums(albumsResult.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Subscribe to DELETE events
  useEffect(() => {
    const channel = supabase
      .channel('galeri')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'photos' },
        (payload: { old?: { id?: string } }) => {
          const deletedId = payload.old?.id
          if (deletedId) {
            setPhotos((prev) => prev.filter((p) => p.id !== deletedId))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Filter photos by album
  const filteredPhotos = selectedAlbumId
    ? photos.filter((p) => p.album_id === selectedAlbumId)
    : photos

  // Handle photo selected from grid
  const handleSelectPhoto = useCallback(
    (photo: Photo) => {
      const index = filteredPhotos.findIndex((p) => p.id === photo.id)
      if (index !== -1) setSelectedPhotoIndex(index)
    },
    [filteredPhotos],
  )

  // Handle photo deleted from lightbox
  const handlePhotoDeleted = useCallback(
    (deletedId: string) => {
      setPhotos((prev) => prev.filter((p) => p.id !== deletedId))
      setSelectedPhotoIndex(null)
    },
    [],
  )

  if (loading) {
    return (
      <div className="blok-maroon min-h-dvh px-4 py-8 md:px-6">
        <div className="mb-6 space-y-3">
          <div className="h-8 w-48 animate-pulse rounded bg-polaroid/20" />
          <div className="h-4 w-64 animate-pulse rounded bg-polaroid/15" />
        </div>
        <div className="mb-6 h-20 animate-pulse rounded-radius-kartu bg-polaroid/15" />
        <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="mb-4 break-inside-avoid animate-pulse rounded bg-polaroid/10" style={{ height: 150 + (i % 3) * 60 }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── BLOK 1: MAROON — judul + zona upload ── */}
      <section className="blok-maroon px-4 pb-10 pt-8 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-marker-kuning">
            Album Kenangan
          </h1>
          <p className="font-tulis text-base text-polaroid/70">
            ditempel pelan-pelan, biar kenangannya awet
          </p>
        </div>

        {/* Zona upload */}
        <ZonaUpload albumId={selectedAlbumId} onUploadComplete={loadData} />
      </section>

      {/* ── BLOK 2: KUNING — chip album ── */}
      <section className="blok-kuning px-4 py-5 md:px-6">
        <AlbumChips
          albums={albums}
          selectedAlbumId={selectedAlbumId}
          onSelectAlbum={setSelectedAlbumId}
          onAlbumCreated={loadData}
        />
      </section>

      {/* ── BLOK 3: MAROON — masonry polaroid ── */}
      <section className="blok-maroon px-4 py-8 md:px-6">
        {/* Grid masonry polaroid */}
        <MasonryGrid
          photos={filteredPhotos}
          onSelectPhoto={handleSelectPhoto}
        />
      </section>

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={selectedPhotoIndex}
          albums={albums}
          onClose={() => setSelectedPhotoIndex(null)}
          onPhotoUpdated={loadData}
          onPhotoDeleted={handlePhotoDeleted}
        />
      )}
    </div>
  )
}
