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
        warna={isOwn ? '#FFFDF7' : '#C55A5A'}
        className="flex-shrink-0"
      />

      {/* Bubble */}
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Nama samaran */}
        <span className="mb-1 font-tulis text-sm text-tinta-lembut">
          {message.alias}
        </span>

        {/* Pesan */}
        <div
          className={`rounded-radius-kartu px-4 py-2.5 shadow-sm ${
            isOwn
              ? 'bg-terracotta text-polaroid'
              : 'bg-polaroid text-tinta-gelap'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className="text-sm leading-relaxed">{message.body}</p>
        </div>

        {/* Waktu */}
        <span className="mt-1 text-[10px] font-tulis text-tinta/50">
          {time}
        </span>
      </div>
    </div>
  )
}
