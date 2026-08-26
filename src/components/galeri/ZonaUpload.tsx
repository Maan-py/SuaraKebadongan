'use client'

import { useCallback, useRef, useState } from 'react'
import { compressImage, validateFile } from '@/lib/compress'
import { supabase } from '@/lib/supabase/client'

interface UploadItem {
  id: string
  file: File
  status: 'compressing' | 'uploading' | 'done' | 'error'
  error?: string
  progress: number
}

interface ZonaUploadProps {
  albumId: string | null
  onUploadComplete: () => void
}

export default function ZonaUpload({ albumId, onUploadComplete }: ZonaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File, itemId: string) => {
      const error = validateFile(file)
      if (error) {
        setUploads((prev) =>
          prev.map((u) => (u.id === itemId ? { ...u, status: 'error' as const, error } : u)),
        )
        return
      }

      try {
        setUploads((prev) =>
          prev.map((u) => (u.id === itemId ? { ...u, status: 'compressing' as const } : u)),
        )

        const compressed = await compressImage(file)
        const ext = compressed.blob.type.includes('webp') ? 'webp' : 'jpg'
        const path = `${crypto.randomUUID()}.${ext}`

        setUploads((prev) =>
          prev.map((u) => (u.id === itemId ? { ...u, status: 'uploading' as const } : u)),
        )

        const { error: uploadError } = await supabase.storage
          .from('foto')
          .upload(path, compressed.blob, { contentType: compressed.blob.type, upsert: false })

        if (uploadError) throw uploadError

        const { error: dbError } = await supabase.from('photos').insert({
          storage_path: path,
          caption: '',
          taken_on: null,
          album_id: albumId,
        })

        if (dbError) throw dbError

        setUploads((prev) =>
          prev.map((u) => (u.id === itemId ? { ...u, status: 'done' as const, progress: 100 } : u)),
        )

        onUploadComplete()
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Gagal mengunggah'
        setUploads((prev) =>
          prev.map((u) => (u.id === itemId ? { ...u, status: 'error' as const, error: msg } : u)),
        )
      }
    },
    [albumId, onUploadComplete],
  )

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const newUploads: UploadItem[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'compressing' as const,
        progress: 0,
      }))

      setUploads((prev) => [...prev, ...newUploads])

      newUploads.forEach((item) => {
        processFile(item.file, item.id)
      })
    },
    [processFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleClick = () => fileInputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  return (
    <div className="mb-6">
      {/* Zona drag & drop */}
      <button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full rounded-radius-kartu border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-marker-kuning bg-marker-kuning/20'
            : 'border-marker-kuning/50 hover:border-marker-kuning hover:bg-marker-kuning/10'
        }`}
      >
        <p className="font-tulis text-lg text-marker-kuning">
          Seret fotonya ke sini, atau ketuk untuk memilih — boleh banyak sekaligus!
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </button>

      {/* Daftar upload */}
      {uploads.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {uploads.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 rounded-radius-pill px-3 py-1.5 text-xs ${
                item.status === 'done'
                  ? 'bg-polaroid text-stiker-merah'
                  : item.status === 'error'
                  ? 'bg-marker-kuning/30 text-maroon-900'
                    : 'bg-marker-kuning/15 text-marker-kuning'
              }`}
            >
              <span className="max-w-24 truncate">{item.file.name}</span>
              {item.status === 'compressing' && <span>...</span>}
              {item.status === 'uploading' && <span>↑</span>}
              {item.status === 'done' && <span>✓</span>}
              {item.status === 'error' && <span>✗</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
