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
  const [onlineCount, setOnlineCount] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [newCount, setNewCount] = useState(0)
  const [ownIds, setOwnIds] = useState<string[]>([])

  // Track online users using Supabase Presence (Channel khusus: online_presence)
  useEffect(() => {
    let sid = sessionStorage.getItem('chat_session_id')
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 9)
      sessionStorage.setItem('chat_session_id', sid)
    }

    const presenceChannel = supabase.channel('online_presence', {
      config: { presence: { key: sid } },
    })

    const updateCount = () => {
      const state = presenceChannel.presenceState()
      const keys = Object.keys(state)
      setOnlineCount(keys.length > 0 ? keys.length : 1)
    }

    presenceChannel
      .on('presence', { event: 'sync' }, updateCount)
      .on('presence', { event: 'join' }, updateCount)
      .on('presence', { event: 'leave' }, updateCount)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(presenceChannel)
    }
  }, [])

  // Load own messages IDs from local storage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('own_messages') || '[]')
      setOwnIds(stored)
    } catch {
      // ignore
    }
  }, [messages.length]) // trigger check again when messages array changes

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
      <div className="min-h-dvh bg-karton">
        <div className="px-4 py-4 md:px-6">
          <div className="mb-1 h-7 w-32 animate-pulse rounded bg-tinta/10" />
        </div>
        <div className="min-h-dvh space-y-3 px-4 py-6 md:px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="h-9 w-9 flex-shrink-0 animate-pulse rounded-full bg-tinta/10" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-24 animate-pulse rounded bg-tinta/5" />
                <div className="h-10 w-3/4 animate-pulse rounded-radius-kartu bg-tinta/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    // h-[calc(100dvh-4rem)] = dvh dikurangi tinggi tab bar mobile (h-16 = 4rem), -mb-4 memepetkan ke tab bar
    <div className="flex h-[calc(100dvh-4rem)] -mb-4 flex-col md:mb-0 md:h-[calc(100dvh-3.5rem)]">
      {/* ── HEADER ── */}
      <header className="flex-shrink-0 px-4 pb-3 pt-8 md:px-6 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-terracotta">Chat</h1>
          <p className="font-tulis text-lg md:text-xl text-tinta/70 mt-1">
            Chat anonymously with others!
          </p>
        </div>

        {/* Indikator Online Users */}
        <div className="flex items-center gap-2 bg-polaroid border border-garis-kertas/40 px-3 py-1.5 rounded-full shadow-sm mb-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-tulis text-xs font-semibold text-tinta-gelap">
            {onlineCount} Online
          </span>
        </div>
      </header>

      {/* ── AREA PESAN ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 md:px-6"
        data-lenis-prevent
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
              className="mb-4 text-tinta/20"
            >
              <path d="M12 48c0 4 4 8 8 8h24c4 0 8-4 8-8V24c0-4-4-8-8-8H20c-4 0-8 4-8 8v24z" />
              <path d="M24 32h16" />
              <path d="M32 24v16" />
            </svg>
            <p className="font-tulis text-lg text-tinta/70">
              Belum ada chat sama sekali. Kasih salam pertama buat yang lain yuk!
            </p>
          </div>
        ) : (
          <>
            {/* Teks informatif */}
            <p className="mb-4 text-center font-tulis text-sm text-tinta/50">
              cuma {LIMIT} chat terakhir yang tersimpan — yang lewat ya sudah lewat
            </p>

            {/* Bubble */}
            <div className="max-w-2xl mx-auto flex flex-col">
              {messages.map((msg) => {
                const isOwn = ownIds.includes(msg.id)
                return (
                  <div key={msg.id} className={isOwn ? "flex justify-end w-full" : "flex justify-start w-full"}>
                    <ChatBubble
                      message={msg}
                      isOwn={isOwn}
                    />
                  </div>
                )
              })}
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
          className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-radius-pill bg-terracotta px-4 py-1.5 text-xs font-semibold text-polaroid shadow-lg transition-transform hover:scale-105 md:bottom-20"
        >
          {newCount} pesan baru ↓
        </button>
      )}

      {/* ── BLOK KUNING: input bar ── */}
      <div className="flex-shrink-0">
        <ChatInput onMessageSent={scrollToBottom} />
      </div>
    </div>
  )
}
