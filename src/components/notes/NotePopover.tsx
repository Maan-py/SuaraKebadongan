'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Note {
  id: string
  body: string
  color: string
  created_at: string
  updated_at: string
}

interface NotePopoverProps {
  note: Note
  onClose: () => void
  onNoteUpdated: () => void
  onNoteDeleted: (id: string) => void
}

const COLORS = [
  { id: 'kuning', label: 'Kuning', bg: '#FFF3C4' },
  { id: 'pink', label: 'Pink', bg: '#FDE7EF' },
  { id: 'hijau', label: 'Hijau', bg: '#E3F2E8' },
  { id: 'ungu', label: 'Ungu', bg: '#EEE8F6' },
  { id: 'merah', label: 'Merah', bg: '#FBE3DA' },
  { id: 'karton', label: 'Karton', bg: '#F5EDE0' },
]

const MAX_CHARS = 280

export default function NotePopover({ note, onClose, onNoteUpdated, onNoteDeleted }: NotePopoverProps) {
  const [body, setBody] = useState(note.body)
  const [color, setColor] = useState(note.color)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Focus trap
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSave = async () => {
    if (!body.trim() || body.length > MAX_CHARS) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('notes')
        .update({ body: body.trim(), color })
        .eq('id', note.id)

      if (error) throw error
      onNoteUpdated()
      onClose()
    } catch {
      // biarkan terbuka agar user bisa coba lagi
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id)

      if (error) throw error
      onNoteDeleted(note.id)
      onClose()
    } catch {
      // biarkan terbuka
    }
  }

  const selectedColor = COLORS.find((c) => c.id === color) || COLORS[0]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/40 p-4">
      <div
        ref={popoverRef}
        className="w-full max-w-sm rounded-radius-kartu p-4 shadow-lg"
        style={{ backgroundColor: selectedColor.bg }}
        role="dialog"
        aria-modal="true"
        aria-label="Edit catatan"
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-tinta-lembut">Edit catatan</span>
          <button
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center rounded-full text-tinta-lembut hover:text-tinta"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
          rows={3}
          className="w-full resize-none rounded-radius-tape border-none bg-transparent text-sm text-tinta placeholder:text-tinta-lembut/50 focus:outline-none"
          style={{ backgroundColor: 'transparent' }}
        />

        {/* Counter */}
        <p className="mt-1 text-[10px] text-tinta-lembut/50">
          {body.length}/{MAX_CHARS}
        </p>

        {/* Warna */}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="text-[10px] text-tinta-lembut mr-1">Warna:</span>
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              aria-label={c.label}
              className={`h-5 w-5 rounded-full border-2 transition-transform ${
                color === c.id ? 'scale-110 border-tinta' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.bg }}
            />
          ))}
        </div>

        {/* Tombol aksi */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-radius-pill border border-stiker-merah px-3 py-1.5 text-xs text-stiker-merah hover:bg-stiker-merah/10 transition-colors"
          >
            Hapus
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-radius-pill px-3 py-1.5 text-xs text-tinta-lembut hover:text-tinta transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!body.trim() || body.length > MAX_CHARS || isSaving}
              className="rounded-radius-pill bg-spidol-ungu px-4 py-1.5 text-xs font-medium text-polaroid hover:bg-spidol-ungu/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? '...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>

      {/* Konfirmasi hapus */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-tinta/60 p-4">
          <div className="w-full max-w-xs rounded-radius-modal bg-kertas p-6 text-center shadow-lg">
            <p className="font-tulis text-lg text-tinta">
              Cabut catatan ini dari papan?
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
    </div>
  )
}
