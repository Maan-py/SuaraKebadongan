'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { supabase } from '@/lib/supabase/client'

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
}

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  albums: Album[]
  onClose: () => void
  onPhotoUpdated: () => void
  onPhotoDeleted: (id: string) => void
}

export default function Lightbox({
  photos,
  currentIndex,
  albums,
  onClose,
  onPhotoUpdated,
  onPhotoDeleted,
}: LightboxProps) {
  const [photo, setPhoto] = useState<Photo>(photos[currentIndex])
  const [caption, setCaption] = useState(photo.caption)
  const [takenOn, setTakenOn] = useState(photo.taken_on || '')
  const [albumId, setAlbumId] = useState(photo.album_id)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState('')

  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const gerakDiizinkan = !useReducedMotion()

  // Update state saat index berubah
  useEffect(() => {
    setPhoto(photos[currentIndex])
    setCaption(photos[currentIndex].caption)
    setTakenOn(photos[currentIndex].taken_on || '')
    setAlbumId(photos[currentIndex].album_id)
  }, [currentIndex, photos])

  // Focus trap
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) {
        // Navigasi ke foto berikutnya — parent yang handle
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        // Navigasi ke foto sebelumnya — parent yang handle
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, currentIndex, photos.length])

  // Save caption, date, album
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('photos')
        .update({
          caption,
          taken_on: takenOn || null,
          album_id: albumId,
        })
        .eq('id', photo.id)

      if (error) throw error
      onPhotoUpdated()
      showToast('Perubahan tersimpan!')
    } catch (err) {
      showToast('Gagal menyimpan perubahan')
    } finally {
      setIsSaving(false)
    }
  }

  // Delete photo
  const handleDelete = async () => {
    try {
      // Hapus dari storage
      const { error: storageError } = await supabase.storage
        .from('foto')
        .remove([photo.storage_path])

      if (storageError) throw storageError

      // Hapus dari database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id)

      if (dbError) throw dbError

      onPhotoDeleted(photo.id)
      showToast('Fotonya dicopot dari album.')
      onClose()
    } catch (err) {
      showToast('Gagal menghapus foto')
    }
  }

  // Download photo
  const handleDownload = async () => {
    try {
      const { data } = await supabase.storage
        .from('foto')
        .createSignedUrl(photo.storage_path, 3600)

      if (data?.signedUrl) {
        const a = document.createElement('a')
        a.href = data.signedUrl
        a.download = photo.storage_path
        a.click()
      }
    } catch {
      showToast('Gagal mengunduh foto')
    }
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const fullUrl = `${supabaseUrl}/storage/v1/object/public/foto/${photo.storage_path}`

  return (
    <>
      {/* Trigger ref for focus return */}
      <button ref={triggerRef} className="hidden" aria-hidden="true" />

      <motion.div
        initial={gerakDiizinkan ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={gerakDiizinkan ? { opacity: 0 } : { opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/90 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Lihat foto"
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="flex max-h-[90vh] w-full max-w-4xl flex-col md:flex-row">
          {/* Foto */}
          <div className="relative flex-1 overflow-hidden rounded-radius-modal bg-polaroid">
            {/* Area sentuh prev */}
            {currentIndex > 0 && (
              <button
                onClick={() => {/* parent handle */}}
                className="absolute left-0 top-0 z-10 h-full w-1/4 opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Foto sebelumnya"
              >
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl text-polaroid/80">‹</span>
              </button>
            )}

            <img
              src={fullUrl}
              alt={photo.caption || 'Foto tanpa takarir'}
              className="block h-full w-full object-contain"
            />

            {/* Area sentuh next */}
            {currentIndex < photos.length - 1 && (
              <button
                onClick={() => {/* parent handle */}}
                className="absolute right-0 top-0 z-10 h-full w-1/4 opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Foto berikutnya"
              >
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl text-polaroid/80">›</span>
              </button>
            )}

            {/* Tombol tutup */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-tinta/50 text-polaroid hover:bg-tinta/70 transition-colors"
              aria-label="Tutup lightbox"
            >
              ✕
            </button>

            {/* Tombol unduh */}
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 z-20 rounded-radius-pill bg-tape-hijau px-4 py-2 text-sm font-medium text-polaroid hover:bg-tape-hijau/90 transition-colors"
            >
              Simpan Fotonya
            </button>
          </div>

          {/* Panel samping: takarir + tanggal + album */}
          <div className="mt-4 w-full flex-shrink-0 space-y-4 rounded-radius-modal bg-karton p-4 md:mt-0 md:ml-4 md:w-72">
            <div>
              <label className="mb-1 block font-tulis text-sm text-tinta-lembut">Takarir</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ketik cerita di sini..."
                className="w-full rounded-radius-tape border border-garis-kertas bg-polaroid px-3 py-2 font-tulis text-tinta placeholder:text-tinta-lembut/50 focus:border-pulpen-biru focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-tulis text-sm text-tinta-lembut">Tanggal Diambil</label>
              <input
                type="date"
                value={takenOn}
                onChange={(e) => setTakenOn(e.target.value)}
                className="w-full rounded-radius-tape border border-garis-kertas bg-polaroid px-3 py-2 text-tinta focus:border-pulpen-biru focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-tulis text-sm text-tinta-lembut">Album</label>
              <select
                value={albumId || ''}
                onChange={(e) => setAlbumId(e.target.value || null)}
                className="w-full rounded-radius-tape border border-garis-kertas bg-polaroid px-3 py-2 text-tinta focus:border-pulpen-biru focus:outline-none"
              >
                <option value="">Tanpa album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-radius-pill bg-stiker-merah px-4 py-2 text-sm font-medium text-polaroid hover:bg-maroon-600 transition-colors disabled:opacity-50"
              >
                {isSaving ? '...' : 'Simpan'}
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="rounded-radius-pill border border-stiker-merah px-4 py-2 text-sm text-stiker-merah hover:bg-stiker-merah/10 transition-colors"
              >
                Hapus
              </button>
            </div>

            {photo.taken_on && (
              <p className="text-xs text-tinta-lembut">
                {new Date(photo.taken_on).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Konfirmasi hapus */}
        {showConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-tinta/60 p-4">
            <div className="w-full max-w-xs rounded-radius-modal bg-kertas p-6 text-center shadow-lg">
              <p className="font-tulis text-lg text-tinta">
                Yakin cabut foto ini dari album?
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-radius-pill px-4 py-1.5 text-sm text-tinta-lembut hover:text-tinta transition-colors"
                >
                  Urungkan
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-radius-pill bg-stiker-merah px-4 py-1.5 text-sm font-medium text-polaroid hover:bg-stiker-merah/90 transition-colors"
                >
                  Ya, Cabut
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={gerakDiizinkan ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={gerakDiizinkan ? { opacity: 0, y: 20 } : { opacity: 0 }}
              className="fixed bottom-24 left-1/2 z-[80] -translate-x-1/2 rounded-radius-pill bg-tinta px-4 py-2 text-sm text-polaroid shadow-lg"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
