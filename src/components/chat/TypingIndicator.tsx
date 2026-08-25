'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TypingIndicator() {
  const [isTyping, setIsTyping] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const channel = supabase.channel('typing')

    channel
      .on('broadcast', { event: 'mengetik' }, () => {
        setIsTyping(true)

        // Reset timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setIsTyping(false), 3000)
      })
      .subscribe()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      supabase.removeChannel(channel)
    }
  }, [])

  if (!isTyping) return null

  return (
    <div className="px-4 py-2" aria-live="polite" aria-atomic="true">
      <p className="text-xs text-tinta-lembut italic">
        Seseorang sedang mengetik
        <span className="inline-flex w-6 justify-between">
          <span className="animate-[typing-dots_900ms_linear_infinite]">.</span>
          <span className="animate-[typing-dots_900ms_linear_infinite_200ms]">.</span>
          <span className="animate-[typing-dots_900ms_linear_infinite_400ms]">.</span>
        </span>
      </p>
    </div>
  )
}
