'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import ChatBubble from '@/components/chat/ChatBubble'
import ChatInput from '@/components/chat/ChatInput'
import TypingIndicator from '@/components/chat/TypingIndicator'

interface Message {
  id: string
  body: string
  alias: string
  avatar: string
  created_at: string
}

const LIMIT = 50

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [newCount, setNewCount] = useState(0)

  // Load riwayat
  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(LIMIT)

    if (data) {
      setMessages(data.reverse())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Subscribe INSERT realtime
  useEffect(() => {
    const channel = supabase
      .channel('suara')
      .on(
        'postgres_changes' as never,
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload: { new?: Message }) => {
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message])

            // Auto-scroll jika di dasar
            if (isAtBottom) {
              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            } else {
              setNewCount((prev) => prev + 1)
            }
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAtBottom])

  // Scroll ke dasar
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    setNewCount(0)
    setIsAtBottom(true)
  }, [])

  // Deteksi scroll position
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    setIsAtBottom(distanceFromBottom < 80)
  }, [])

  // Initial scroll ke dasar
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView()
      }, 100)
    }
  }, [loading])

  if (loading) {
    return (
      <div className="px-4 py-8 md:px-6">
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-tinta">Suara</h1>
          <p className="font-tulis text-base text-tinta-lembut">
            kata-kata yang dilempar tanpa nama — biar saja mengambang
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-garis-kertas" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-24 animate-pulse rounded bg-garis-kertas" />
                <div className="h-10 w-3/4 animate-pulse rounded-radius-kartu bg-garis-kertas" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-4 md:px-6">
        <h1 className="font-display text-xl font-semibold text-tinta">Suara</h1>
        <p className="font-tulis text-base text-tinta-lembut">
          kata-kata yang dilempar tanpa nama — biar saja mengambang
        </p>
      </div>

      {/* Area pesan */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6"
        role="log"
        aria-live="polite"
        aria-label="Riwayat pesan"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-tinta-lembut/30"
            >
              <path d="M12 48c0 4 4 8 8 8h24c4 0 8-4 8-8V24c0-4-4-8-8-8H20c-4 0-8 4-8 8v24z" />
              <path d="M24 32h16" />
              <path d="M32 24v16" />
            </svg>
            <p className="font-tulis text-lg text-tinta-lembut">
              Belum ada suara sama sekali. Kasih salam pertama buat yang lain yuk!
            </p>
          </div>
        ) : (
          <>
            {/* Teks informatif */}
            <p className="mb-4 text-center text-[10px] text-tinta-lembut/40">
              cuma {LIMIT} suara terakhir yang tersimpan — yang lewat ya sudah lewat
            </p>

            {/* Bubble */}
            <div className="max-w-2xl mx-auto">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  isOwn={false}
                />
              ))}
            </div>
          </>
        )}

        <TypingIndicator />
        <div ref={messagesEndRef} />
      </div>

      {/* Pill "N pesan baru ↓" */}
      {newCount > 0 && !isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-radius-pill bg-tinta px-4 py-1.5 text-xs text-polaroid shadow-lg transition-transform hover:scale-105 md:bottom-20"
        >
          {newCount} pesan baru ↓
        </button>
      )}

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onMessageSent={scrollToBottom} />
      </div>
    </div>
  )
}
