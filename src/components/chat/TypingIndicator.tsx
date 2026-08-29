'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TypingIndicator() {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mySessionId = useRef<string>('')

  useEffect(() => {
    let sid = sessionStorage.getItem('chat_session_id')
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 9)
      sessionStorage.setItem('chat_session_id', sid)
    }
    mySessionId.current = sid

    const channel = supabase.channel('chat_typing')

    channel
      .on('broadcast', { event: 'mengetik' }, (payload) => {
        const senderId = payload?.payload?.senderId
        // Hanya tampilkan jika yang mengetik adalah pengguna lain
        if (senderId && senderId !== mySessionId.current) {
          setIsTyping(true)

          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          timeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
        }
      })
      .subscribe()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      supabase.removeChannel(channel)
    }
  }, [])

  if (!isTyping) return null

  return (
    <div className="px-4 py-2 my-1" aria-live="polite" aria-atomic="true">
      <p className="font-tulis text-sm text-tinta-lembut italic flex items-center gap-1.5">
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </span>
        <span className="text-terracotta font-medium">Seseorang sedang mengetik…</span>
      </p>
    </div>
  )
}
