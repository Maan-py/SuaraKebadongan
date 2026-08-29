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
  const lastTypingTime = useRef(0)
  const mySessionId = useRef<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let sid = sessionStorage.getItem('chat_session_id')
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 9)
      sessionStorage.setItem('chat_session_id', sid)
    }
    mySessionId.current = sid
  }, [])

  // Counter warning di ambang 50 huruf terakhir
  useEffect(() => {
    const remaining = MAX_CHARS - text.length
    setCharWarning(remaining <= NEAR_LIMIT && remaining > 0)
  }, [text.length])

  // Broadcast typing
  const emitTyping = useCallback(() => {
    const now = Date.now()
    if (now - lastTypingTime.current > 1500) {
      lastTypingTime.current = now
      supabase.channel('chat_typing').send({
        type: 'broadcast',
        event: 'mengetik',
        payload: { senderId: mySessionId.current },
      }).catch(() => {})
    }
  }, [])

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

      const { data, error } = await supabase.from('messages').insert({
        body: trimmed,
        alias,
        avatar,
      }).select('id').single()

      if (error) throw error

      if (data?.id) {
        const ownMsgs = JSON.parse(localStorage.getItem('own_messages') || '[]')
        ownMsgs.push(data.id)
        localStorage.setItem('own_messages', JSON.stringify(ownMsgs))
      }

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
      if (newText.length > 0) {
        emitTyping()
      }
    }
  }

  const remaining = MAX_CHARS - text.length
  const canSend = text.trim().length > 0 && !isSending

  return (
    <div className="bg-karton px-3 pt-3 pb-2 md:p-3 border-t border-garis-kertas/50">
      <div className="mx-auto max-w-2xl">
        {/* Input area */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tulis apa saja… anonim kok"
            rows={1}
            className="flex-1 resize-none rounded-radius-tape border border-terracotta/30 bg-polaroid px-4 py-2.5 font-tulis text-base md:text-lg text-tinta-gelap placeholder:text-tinta-gelap/50 focus:border-terracotta focus:outline-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-terracotta text-polaroid transition-colors hover:bg-terracotta/90 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Kirim pesan"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>

        {/* Counter */}
        <div className="mt-1 flex justify-between px-1">
          <span className="font-tulis text-[11px] text-tinta/50">
            {text.length > 0 && `${remaining} huruf tersisa`}
          </span>
          {charWarning && (
            <span
              className="font-tulis text-[11px] text-terracotta"
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
