'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import NotePopover from './NotePopover'

interface Note {
  id: string
  body: string
  color: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

interface NoteCardProps {
  note: Note
  index: number
  onNoteUpdated: () => void
  onNoteDeleted: (id: string) => void
}

const COLOR_MAP: Record<string, string> = {
  kuning: '#FFF6C8', // krem lemon lembut — warna kertas catatan
  pink: '#F8DEE5',   // rose — tint stiker-merah #6E0521
  hijau: '#E1EFE5',  // sage — tint tape-hijau #4A8C5C
  ungu: '#EEE8F7',   // lavender — tint spidol-ungu #9B7FC4
  merah: '#FBE7D9',  // peach hangat — keluarga sepia
  karton: '#FAF1DF', // krim manila hangat
}

// Pola rotasi bergantian: [-1.5°, +1°, -0.5°, +1.5°]
const ROTATIONS = [-1.5, 1, -0.5, 1.5]

export default function NoteCard({ note, index, onNoteUpdated, onNoteDeleted }: NoteCardProps) {
  const [showPopover, setShowPopover] = useState(false)
  const gerakDiizinkan = !useReducedMotion()

  const rotation = ROTATIONS[index % ROTATIONS.length]
  const bgColor = COLOR_MAP[note.color] || COLOR_MAP.karton

  // Ornamen: pin merah atau tape bergantian
  const isPin = index % 3 === 0

  const createdDate = new Date(note.created_at)
  const formattedDate = createdDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = createdDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <motion.div
        initial={gerakDiizinkan ? { scale: 0.9, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={gerakDiizinkan ? { scale: 0.8, opacity: 0 } : { scale: 1, opacity: 0 }}
        transition={gerakDiizinkan ? { type: 'spring', stiffness: 260, damping: 20 } : { duration: 0 }}
        className="mb-4 break-inside-avoid"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <button
          onClick={() => setShowPopover(true)}
          className="relative w-full rounded-radius-kartu p-4 pt-6 pb-4 min-h-[12rem] flex flex-col justify-between text-left shadow-sm transition-shadow hover:shadow-md"
          style={{ backgroundColor: bgColor }}
        >
          {/* Ornamen: pin Image */}
          <img 
            src="/push-pin.png" 
            alt="Pin" 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-12 object-contain drop-shadow-sm z-20 hover:scale-110 transition-transform"
          />

          {/* Isi catatan */}
          <div>
            <p className="font-tulis text-lg leading-relaxed text-tinta mt-1" style={{ wordBreak: 'break-word' }}>
              {note.body}
            </p>
          </div>

          {/* Hari, Tanggal & Waktu */}
          <p className="mt-3 text-xs md:text-sm font-tulis text-tinta-lembut/70 border-t border-tinta-lembut/15 pt-2">
            {formattedDate} • {formattedTime}
          </p>
        </button>
      </motion.div>

      {/* Popover edit */}
      {showPopover && (
        <NotePopover
          note={note}
          onClose={() => setShowPopover(false)}
          onNoteUpdated={onNoteUpdated}
          onNoteDeleted={onNoteDeleted}
        />
      )}
    </>
  )
}
