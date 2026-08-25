'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

const MAX_CHARS = 280

const COLORS = [
  { id: 'kuning', label: 'Kuning', bg: '#FFF3C4' },
  { id: 'pink', label: 'Pink', bg: '#FDE7EF' },
  { id: 'hijau', label: 'Hijau', bg: '#E3F2E8' },
  { id: 'ungu', label: 'Ungu', bg: '#EEE8F6' },
  { id: 'merah', label: 'Merah', bg: '#FBE3DA' },
  { id: 'karton', label: 'Karton', bg: '#F5EDE0' },
]

interface NoteFormProps {
  onNoteCreated: () => void
}

export default function NoteForm({ onNoteCreated }: NoteFormProps) {
  const [body, setBody] = useState('')
  const [color, setColor] = useState('kuning')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_CHARS - body.length
  const canSend = body.trim().length > 0 && !isSending && remaining >= 0

  useEffect(() => {
    if (remaining < 0) {
      setError('Kependekan! Maksimal 280 huruf.')
    } else if (remaining === 0) {
      setError('Habis! Tidak bisa nambah huruf lagi.')
    } else {
      setError('')
    }
  }, [remaining])

  const handleSend = async () => {
    if (!canSend) return

    setIsSending(true)
    try {
      const { error: insertError } = await supabase.from('notes').insert({
        body: body.trim(),
        color,
      })

      if (insertError) throw insertError

      setBody('')
      setColor('kuning')
      onNoteCreated()
    } catch (err) {
      setError('Gagal menempel catatan. Coba lagi ya!')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const selectedColor = COLORS.find((c) => c.id === color) || COLORS[0]

  return (
    <div className="mb-8">
      <div
        className="rounded-radius-kartu p-4 shadow-sm"
        style={{ backgroundColor: selectedColor.bg }}
      >
        {/* Label */}
        <p className="mb-2 text-xs text-tinta-lembut">
          Catatan paling baru (milikmu)
        </p>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          placeholder="Tulis pesan, doa, atau kejadian konyol hari ini…"
          rows={3}
          className="w-full resize-none rounded-radius-tape border-none bg-transparent text-sm text-tinta placeholder:text-tinta-lembut/50 focus:outline-none"
          style={{ backgroundColor: 'transparent' }}
        />

        {/* Error / Counter */}
        <div className="flex justify-between px-1">
          <span className="text-[10px] text-tinta-lembut/50">
            {body.length > 0 && `sisa ${remaining} huruf`}
          </span>
          {error && (
            <span className="text-[10px] text-stiker-merah" aria-live="polite">
              {error}
            </span>
          )}
        </div>

        {/* Warna + Tombol */}
        <div className="mt-3 flex items-center justify-between">
          {/* Swatch warna */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-tinta-lembut mr-1">Pilih warna:</span>
            {COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                aria-label={c.label}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                  color === c.id ? 'scale-110 border-tinta' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.bg }}
              />
            ))}
          </div>

          {/* Tombol tempel */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="rounded-radius-pill bg-stiker-merah px-5 py-1.5 text-sm font-medium text-polaroid transition-colors hover:bg-stiker-merah/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSending ? '...' : 'Tempel!'}
          </button>
        </div>
      </div>

      {/* Petunjuk keyboard */}
      <p className="mt-2 text-center text-[10px] text-tinta-lembut/40">
        Ctrl+Enter untuk tempel cepat
      </p>
    </div>
  )
}
