'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useRouter, usePathname } from 'next/navigation'

interface Photo {
  id: string
  storage_path: string
  caption: string
  taken_on: string | null
}

const DEBOUNCE_MS = 400

export default function TombolKejutan() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEmpty, setIsEmpty] = useState(false)
  const [lastPhotoId, setLastPhotoId] = useState<string | null>(null)
  const lastFetchTime = useRef(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const gerakDiizinkan = !useReducedMotion()
  const router = useRouter()

  // Sembunyikan di halaman chat
  if (pathname === '/chat') {
    return null
  }

  // Wiggle idle: goyang tiap ±8 detik
  useEffect(() => {
    if (!gerakDiizinkan || isOpen) return

    let timeout: NodeJS.Timeout
    let isWiggling = false

    const startWiggle = () => {
      const delay = 7000 + Math.random() * 2000 // 7-9 detik
      timeout = setTimeout(() => {
        if (!isWiggling) {
          isWiggling = true
          // Trigger wiggle via class
          triggerRef.current?.classList.add('animate-wiggle')
          setTimeout(() => {
            isWiggling = false
            triggerRef.current?.classList.remove('animate-wiggle')
            startWiggle() // Jadwalkan berikutnya
          }, 600)
        }
      }, delay)
    }

    startWiggle()
    return () => clearTimeout(timeout)
  }, [gerakDiizinkan, isOpen])

  const fetchPhoto = useCallback(async () => {
    const now = Date.now()
    if (now - lastFetchTime.current < DEBOUNCE_MS) return

    lastFetchTime.current = now
    setIsLoading(true)
    setError('')
    setIsEmpty(false)

    try {
      const url = lastPhotoId
        ? `/api/surprise?exclude_id=${lastPhotoId}`
        : '/api/surprise'
      const res = await fetch(url)
      const data = await res.json()

      if (data.empty) {
        setIsEmpty(true)
        setPhoto(null)
      } else if (data.error) {
        setError('Fotonya macet di jalan. Coba sekali lagi ya.')
      } else {
        setPhoto(data)
        setLastPhotoId(data.id)
      }
    } catch {
      setError('Fotonya macet di jalan. Coba sekali lagi ya.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    fetchPhoto()
  }, [fetchPhoto])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setPhoto(null)
    setError('')
    setIsEmpty(false)
    // Kembalikan fokus ke tombol
    setTimeout(() => triggerRef.current?.focus(), 100)
  }, [])

  const handleLagi = useCallback(() => {
    fetchPhoto()
  }, [fetchPhoto])

  // Esc to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <>
      {/* Tombol stiker */}
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className={`fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-polaroid text-stiker-merah shadow-lg transition-transform hover:scale-105 md:bottom-6 md:right-6 md:h-16 md:w-16 ${
          gerakDiizinkan ? 'hover:scale-105' : ''
        }`}
        aria-label="Kejutan foto kenangan — Inget ga sih?"
        style={{
          boxShadow: '0 4px 12px rgba(255,253,247,.25)',
        }}
      >
        {/* Bintang meledak SVG */}
        <svg viewBox="0 0 56 56" className="h-8 w-8 md:h-10 md:w-10">
          <path
            d="M28 4l6 12 14 2-10 10 2 14-12-6-12 6 2-14L8 18l14-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -bottom-5 whitespace-nowrap text-[10px] font-bold text-stiker-merah">
          Inget ga sih?
        </span>
      </button>

      {/* Modal kejutan */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-tinta/85 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Kejutan foto kenangan"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose()
            }}
          >
            <div className="flex flex-col items-center">
              {/* Loading */}
              {isLoading && (
                <div className="flex flex-col items-center">
                  <div className="h-48 w-48 animate-pulse rounded-radius-kartu bg-polaroid/20" />
                  <p className="mt-4 font-tulis text-sm text-polaroid/60">
                    Mencari foto kenangan...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex flex-col items-center text-center">
                  <p className="font-tulis text-lg text-polaroid">{error}</p>
                  <button
                    onClick={handleLagi}
                    className="mt-4 rounded-radius-pill bg-polaroid px-6 py-2 text-sm font-semibold text-stiker-merah hover:bg-polaroid/90"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Empty */}
              {isEmpty && (
                <div className="flex flex-col items-center text-center">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="mb-4 text-polaroid/30"
                  >
                    <rect x="10" y="15" width="60" height="50" rx="4" />
                    <circle cx="28" cy="35" r="6" />
                    <path d="M10 55l18-15 14 10 12-8 16 13" />
                  </svg>
                  <p className="font-tulis text-lg text-polaroid">
                    Albummu masih kosong nih — unggah foto dulu yuk, biar ada yang bikin kangen.
                  </p>
                  <button
                    onClick={() => {
                      handleClose()
                      router.push('/galeri')
                    }}
                    className="mt-4 rounded-radius-pill bg-polaroid px-6 py-2 text-sm font-semibold text-stiker-merah hover:bg-polaroid/90"
                  >
                    ke Galeri
                  </button>
                </div>
              )}

              {/* Foto */}
              {photo && (
                <>
                  {/* Polaroid */}
                  <motion.div
                    initial={gerakDiizinkan ? { y: -100, opacity: 0, rotate: -5 } : { opacity: 1 }}
                    animate={{ y: 0, opacity: 1, rotate: Math.random() * 4 - 2 }}
                    transition={gerakDiizinkan ? { type: 'spring', stiffness: 200, damping: 15 } : { duration: 0 }}
                    className="rounded-radius-kartu bg-polaroid p-3 pb-8 shadow-xl"
                  >
                    <img
                      src={`${supabaseUrl}/storage/v1/object/public/foto/${photo.storage_path}`}
                      alt={photo.caption || 'Foto kenangan'}
                      className="block max-h-[60vh] max-w-[80vw] object-contain"
                    />
                  </motion.div>

                  {/* Caption */}
                  <div className="mt-4 text-center">
                    {photo.caption && (
                      <p className="font-tulis text-base text-polaroid">
                        {photo.caption}
                      </p>
                    )}
                    {photo.taken_on && (
                      <p className="mt-1 text-xs text-polaroid/50">
                        {new Date(photo.taken_on).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Tombol Lagi! */}
                  <button
                    onClick={handleLagi}
                    className="mt-4 rounded-radius-pill bg-polaroid px-6 py-2 text-sm font-semibold text-stiker-merah transition-colors hover:bg-polaroid/90"
                  >
                    Lagi!
                  </button>

                  {/* Caption bawah */}
                  <p className="mt-3 font-tulis text-xs text-polaroid/40 italic">
                    *klik Lagi! kalau belum cukup kangeni*
                  </p>
                </>
              )}

              {/* Silang tutup */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-polaroid/20 text-polaroid hover:bg-polaroid/30 transition-colors"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS untuk wiggle */}
      <style jsx>{`
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
      `}</style>
    </>
  )
}
