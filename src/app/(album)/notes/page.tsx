'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase/client'
import NoteForm from '@/components/notes/NoteForm'
import NoteCard from '@/components/notes/NoteCard'

interface Note {
  id: string
  body: string
  color: string
  created_at: string
  updated_at: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  // Load data
  const loadNotes = useCallback(async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setNotes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Subscribe to realtime events
  useEffect(() => {
    const channel = supabase
      .channel('catatan')
      .on(
        'postgres_changes' as never,
        { event: 'INSERT', schema: 'public', table: 'notes' },
        (payload: { new?: Note }) => {
          if (payload.new) {
            setNotes((prev) => [payload.new as Note, ...prev])
          }
        },
      )
      .on(
        'postgres_changes' as never,
        { event: 'UPDATE', schema: 'public', table: 'notes' },
        (payload: { new?: Note }) => {
          if (payload.new) {
            const updated = payload.new as Note
            setNotes((prev) =>
              prev.map((n) => (n.id === updated.id ? updated : n)),
            )
          }
        },
      )
      .on(
        'postgres_changes' as never,
        { event: 'DELETE', schema: 'public', table: 'notes' },
        (payload: { old?: { id?: string } }) => {
          if (payload.old?.id) {
            setNotes((prev) => prev.filter((n) => n.id !== payload.old!.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Handle delete from local state
  const handleNoteDeleted = useCallback((deletedId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== deletedId))
  }, [])

  if (loading) {
    return (
      <div className="min-h-dvh">
        <div className="blok-maroon px-4 py-8 md:px-6">
          <div className="mb-3 h-8 w-40 animate-pulse rounded bg-polaroid/20" />
          <div className="h-32 animate-pulse rounded-radius-kartu bg-polaroid/15" />
        </div>
        <div className="blok-maroon min-h-dvh px-4 py-8 md:px-6">
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="mb-4 break-inside-avoid animate-pulse rounded bg-polaroid/15"
                style={{ height: 80 + (i % 3) * 30 }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* ── BLOK MAROON: judul + formulir ── */}
      <section className="blok-maroon px-4 pb-10 pt-8 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold text-marker-kuning">
            Cat Tempel
          </h1>
          <p className="font-tulis text-base text-polaroid/70">
            tempel di sini, biar yang lain baca juga
          </p>
        </div>

        {/* Formulis */}
        <NoteForm onNoteCreated={loadNotes} />
      </section>

      {/* ── BLOK MAROON GELAP: papan catatan ── */}
      <section className="bg-maroon-900 px-4 py-8 md:px-6">
        {/* Papan catatan */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Hantu garis putus-putus */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-4 text-polaroid/30"
              strokeDasharray="4 4"
            >
              <rect x="16" y="12" width="48" height="56" rx="4" />
              <line x1="24" y1="24" x2="56" y2="24" />
              <line x1="24" y1="32" x2="48" y2="32" />
              <line x1="24" y1="40" x2="52" y2="40" />
            </svg>
            <p className="font-tulis text-lg text-polaroid/80">
              Papan masih kosong nih. Jadi orang pertama yang naruh tempel di dinding!
            </p>
          </div>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 max-w-[1100px] mx-auto">
            <AnimatePresence>
              {notes.map((note, i) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={i}
                  onNoteUpdated={loadNotes}
                  onNoteDeleted={handleNoteDeleted}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  )
}
