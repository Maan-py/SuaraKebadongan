'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { generateAlias, getRandomWarna } from '@/lib/alias'
import { getRandomHewan } from './AvatarHewan'

const MAX_CHARS = 500
const NEAR_LIMIT = 50
const DEBOUNCE_MS = 1000

interface ChatInputProps {
  onMessageSent: () => void
}

export default function ChatInput({ onMessageSent }: ChatInputProps) {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [charWarning, setCharWarning] = useState(false)
  const lastSendTime = useRef(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Counter warning di ambang 50 huruf terakhir
  useEffect(() => {
    const remaining = MAX_CHARS - text.length
    setCharWarning(remaining <= NEAR_LIMIT && remaining > 0)
  }, [text.length])

  const handleSend = useCallback(async () => {
    const now = Date.now()
    if (now - lastSendTime.current < DEBOUNCE_MS) return

    const trimmed = text.trim()
    if (!trimmed || trimmed.length > MAX_CHARS) return

    lastSendTime.current = now
    setIsSending(true)

    try {
      const alias = generateAlias()
      const avatar = getRandomHewan()
      const warna = getRandomWarna()

      const { error } = await supabase.from('messages').insert({
        body: trimmed,
        alias,
        avatar,
      })

      if (error) throw error

      setText('')
      onMessageSent()
    } catch (err) {
      console.error('Gagal mengirim:', err)
    } finally {
      setIsSending(false)
    }
  }, [text, onMessageSent])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    if (newText.length <= MAX_CHARS) {
      setText(newText)
    }
  }

  const remaining = MAX_CHARS - text.length
  const canSend = text.trim().length > 0 && !isSending

  return (
    <div className="blok-kuning p-3 pb-20 md:pb-3">
      <div className="mx-auto max-w-2xl">
        {/* Input area */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tulis apa saja… tidak ada yang tahu ini kamu kok"
            rows={1}
            className="flex-1 resize-none rounded-radius-tape border border-stiker-merah/30 bg-polaroid px-4 py-2.5 text-sm text-tinta-gelap placeholder:text-tinta-gelap/50 focus:border-stiker-merah focus:outline-none"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-stiker-merah text-polaroid transition-colors hover:bg-maroon-600 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Kirim pesan"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>

        {/* Counter */}
        <div className="mt-1.5 flex justify-between px-1">
          <span className="text-[10px] text-maroon-900/50">
            {text.length > 0 && `${remaining} huruf tersisa`}
          </span>
          {charWarning && (
            <span
              className="text-[10px] text-stiker-merah"
              aria-live="polite"
            >
              Sisa {remaining} huruf
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
