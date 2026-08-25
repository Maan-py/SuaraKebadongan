'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function SurpriseButton() {
  const gerakDiizinkan = !useReducedMotion()

  return (
    <motion.button
      className="fixed bottom-20 right-4 z-40 flex h-12 items-center gap-2 rounded-radius-pill bg-stiker-pink px-4 text-sm font-medium text-tinta shadow-lg md:bottom-6 md:right-6"
      whileHover={gerakDiizinkan ? { scale: 1.05 } : undefined}
      whileTap={gerakDiizinkan ? { scale: 0.95 } : undefined}
      aria-label="Tombol kejutan — coming soon"
      disabled
    >
      <span className="font-tulis text-base">Inget ga sih?</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </motion.button>
  )
}
