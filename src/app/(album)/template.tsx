'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function AlbumTemplate({ children }: { children: React.ReactNode }) {
  const gerakDiizinkan = !useReducedMotion()

  if (!gerakDiizinkan) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
