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
        warna={isOwn ? '#7FBF95' : '#D8A9B6'}
        className="flex-shrink-0"
      />

      {/* Bubble */}
      <div className={`max-w-[80%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Nama samaran */}
        <span className="mb-1 text-xs text-tinta-lembut">
          {message.alias}
        </span>

        {/* Pesan */}
        <div
          className={`rounded-radius-kartu px-4 py-2.5 ${
            isOwn
              ? 'bg-tape-hijau/20 text-tinta'
              : 'bg-karton text-tinta'
          }`}
          style={{ wordBreak: 'break-word' }}
        >
          <p className="text-sm leading-relaxed">{message.body}</p>
        </div>

        {/* Waktu */}
        <span className="mt-1 text-[10px] text-tinta-lembut/60">
          {time}
        </span>
      </div>
    </div>
  )
}
