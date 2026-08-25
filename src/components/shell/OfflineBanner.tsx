'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)
  const gerakDiizinkan = !useReducedMotion()

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cek status awal
    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={gerakDiizinkan ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={gerakDiizinkan ? { opacity: 0, y: -10 } : { opacity: 0, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-14 left-0 right-0 z-40 bg-marker-kuning/90 px-4 py-2 text-center text-sm text-tinta md:top-14"
          role="status"
          aria-live="polite"
        >
          Sinyal hilang — kenangan tidak kemana-mana kok, sabar sedikit.
        </motion.div>
      )}
    </AnimatePresence>
  )
}
