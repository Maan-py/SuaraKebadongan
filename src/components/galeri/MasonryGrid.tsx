'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import PolaroidCard from './PolaroidCard'

interface Photo {
  id: string
  storage_path: string
  caption: string
  taken_on: string | null
  album_id: string | null
  created_at: string
}

interface MasonryGridProps {
  photos: Photo[]
  onSelectPhoto: (photo: Photo) => void
}

export default function MasonryGrid({ photos, onSelectPhoto }: MasonryGridProps) {
  const gerakDiizinkan = !useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  // GSAP ScrollTrigger stagger animation
  useEffect(() => {
    if (!gerakDiizinkan || photos.length === 0) return

    let kill = () => {}

    ;(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      gsap.registerPlugin(ScrollTrigger)

      const cards = gridRef.current?.querySelectorAll('.bingkai-polaroid')
      if (!cards || cards.length === 0) return

      // Set initial state
      gsap.set(cards, { scale: 0.96, opacity: 0 })

      // Animate each card
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true,
        },
      })

      tl.to(cards, {
        scale: 1,
        opacity: 1,
        duration: 0.35,
        ease: 'back.out(1.4)',
        stagger: 0.06,
      })

      kill = () => {
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    })()

    return () => kill()
  }, [gerakDiizinkan, photos.length])

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Doodle kamera */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 text-terracotta/40"
        >
          <rect x="10" y="22" width="60" height="46" rx="6" />
          <circle cx="40" cy="45" r="14" />
          <circle cx="40" cy="45" r="8" />
          <path d="M28 22V18a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4" />
          <circle cx="58" cy="32" r="3" />
        </svg>
        <p className="font-tulis text-lg text-terracotta">
          Belum ada satu pun foto. Album kenangan dimulai dari satu jepretan pertama nih.
        </p>
      </div>
    )
  }

  return (
    <div
      ref={gridRef}
      className="columns-2 gap-3 sm:columns-3 lg:columns-4 md:grid md:grid-cols-4 max-w-[1100px] mx-auto"
    >
      {photos.map((photo, i) => (
        <PolaroidCard
          key={photo.id}
          photo={photo}
          onSelect={onSelectPhoto}
          index={i}
        />
      ))}
    </div>
  )
}
