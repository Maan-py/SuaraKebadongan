'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Album {
  id: string
  name: string
  description: string
}

interface AlbumChipsProps {
  albums: Album[]
  selectedAlbumId: string | null
  onSelectAlbum: (id: string | null) => void
  onAlbumCreated: () => void
}

export default function AlbumChips({
  albums,
  selectedAlbumId,
  onSelectAlbum,
  onAlbumCreated,
}: AlbumChipsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState('')
  const [newAlbumDesc, setNewAlbumDesc] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) return

    setIsCreating(true)
    try {
      const { error } = await supabase.from('albums').insert({
        name: newAlbumName.trim(),
        description: newAlbumDesc.trim(),
      })

      if (error) throw error

      setNewAlbumName('')
      setNewAlbumDesc('')
      setIsModalOpen(false)
      onAlbumCreated()
    } catch (err) {
      console.error('Gagal buat album:', err)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Chip "Semua" */}
        <button
          onClick={() => onSelectAlbum(null)}
          className={`rounded-radius-pill border px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedAlbumId === null
              ? 'border-marker-kuning bg-marker-kuning text-maroon-900'
              : 'border-marker-kuning/40 text-marker-kuning hover:bg-marker-kuning/10'
          }`}
        >
          Semua
        </button>

        {/* Chip album */}
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => onSelectAlbum(album.id)}
            className={`rounded-radius-pill border px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedAlbumId === album.id
                ? 'border-marker-kuning bg-marker-kuning text-maroon-900'
                : 'border-marker-kuning/40 text-marker-kuning hover:bg-marker-kuning/10'
            }`}
          >
            {album.name}
          </button>
        ))}

        {/* Tombol tambah album */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-radius-pill border border-dashed border-marker-kuning/50 px-4 py-1.5 text-sm text-marker-kuning/80 hover:border-marker-kuning hover:bg-marker-kuning/10 transition-colors"
        >
          + Album Baru
        </button>
      </div>

      {/* Modal buat album */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-900/70 p-4">
          <div className="w-full max-w-sm rounded-radius-modal bg-polaroid p-6 shadow-lg">
            <h3 className="font-display text-md font-semibold text-stiker-merah mb-4">
              Album Baru
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm text-tinta-lembut">Nama Album</label>
                <input
                  type="text"
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="Contoh: Bersih Desa"
                  className="w-full rounded-radius-tape border border-garis-kertas bg-polaroid px-3 py-2 text-tinta-gelap placeholder:text-tinta-gelap/50 focus:border-stiker-merah focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-tinta-lembut">Deskripsi (opsional)</label>
                <input
                  type="text"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Cerita singkat tentang album ini..."
                  className="w-full rounded-radius-tape border border-garis-kertas bg-polaroid px-3 py-2 text-tinta-gelap placeholder:text-tinta-gelap/50 focus:border-stiker-merah focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-radius-pill px-4 py-1.5 text-sm text-tinta-lembut hover:text-tinta transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateAlbum}
                disabled={!newAlbumName.trim() || isCreating}
                className="rounded-radius-pill bg-stiker-merah px-4 py-1.5 text-sm font-medium text-polaroid hover:bg-maroon-600 transition-colors disabled:opacity-50"
              >
                {isCreating ? '...' : 'Buat Album'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
