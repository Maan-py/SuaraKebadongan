'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const gerakDiizinkan = !useReducedMotion()
  const lenisRef = useRef<import('lenis').default | null>(null)

  useEffect(() => {
    if (!gerakDiizinkan) return

    let lenis: import('lenis').default
    let cleanup = () => {}

    ;(async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])

      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis()
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        lenis.destroy()
        gsap.ticker.remove(lenis.raf)
      }
    })()

    return () => {
      cleanup()
    }
  }, [gerakDiizinkan])

  // Jika reduced-motion aktif, smooth scroll dimatikan total
  // Scroll tetap jalan natural via browser native
  if (!gerakDiizinkan) {
    return <>{children}</>
  }

  return <>{children}</>
}
