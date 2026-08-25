'use client'

import AvatarHewan from './AvatarHewan'

interface Message {
  id: string
  body: string
  alias: string
  avatar: string
  created_at: string
}

interface ChatBubbleProps {
  message: Message
  isOwn: boolean
}

export default function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const time = new Date(message.created_at).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} mb-3`}>
      {/* Avatar */}
      <AvatarHewan
        hewan={message.avatar}
        warna={isOwn ? '#FED92E' : '#D96B85'}
        className="flex-shrink-0"
      />

      {/* Bubble */}
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Nama samaran */}
        <span className="mb-1 text-xs text-polaroid/60">
          {message.alias}
        </span>

        {/* Pesan */}
        <div
          className={`rounded-radius-kartu px-4 py-2.5 ${
            isOwn
              ? 'bg-marker-kuning text-maroon-900'
              : 'bg-polaroid text-tinta-gelap'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className="text-sm leading-relaxed">{message.body}</p>
        </div>

        {/* Waktu */}
        <span className="mt-1 text-[10px] text-polaroid/40">
          {time}
        </span>
      </div>
    </div>
  )
}
