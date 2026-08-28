'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'

const tabs = [
  {
    href: '/beranda',
    label: 'Beranda',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/galeri',
    label: 'Galeri',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    ),
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
        <polyline points="14,3 14,8 21,8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
      </svg>
    ),
  },
]

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const gerakDiizinkan = !useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/gate', { method: 'DELETE' })
    } catch {
      // error diabaikan — tetap redirect
    }
    router.push('/')
  }, [router])

  // Cari tab aktif berdasarkan pathname
  const activeTab = tabs.find((t) => pathname.startsWith(t.href)) ?? tabs[0]

  // Hitung posisi indikator stabilo
  const activeIndex = tabs.indexOf(activeTab)

  return (
    <>
      {/* ── Mobile: tab bar fixed bottom ── */}
      <nav
        aria-label="Navigasi utama"
        className="fixed bottom-0 left-0 right-0 z-50 bg-terracotta border-t border-terracotta-700 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="relative grid grid-cols-4 h-16 items-center">
          {/* Indikator sliding — kuning IG */}
          {mounted && (
            <motion.div
              className="absolute top-2 bottom-2 left-0 w-1/4 flex justify-center"
              initial={false}
              animate={gerakDiizinkan ? { x: `${activeIndex * 100}%` } : { x: `${activeIndex * 100}%` }}
              transition={gerakDiizinkan ? { type: 'tween', duration: 0.25, ease: 'easeInOut' } : { duration: 0 }}
              aria-hidden="true"
            >
              <div className="h-11 w-16 rounded-radius-kartu bg-marker-kuning" />
            </motion.div>
          )}

          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative z-10 flex h-11 w-16 flex-col items-center justify-center mx-auto gap-0.5 rounded-radius-kartu transition-colors ${isActive ? 'text-terracotta-900 font-semibold' : 'text-polaroid/70'}`}
              >
                {tab.icon(isActive)}
                <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Desktop: header horizontal ── */}
      <nav
        aria-label="Navigasi utama"
        className={`hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? 'bg-karton backdrop-blur-sm border-b border-garis-kertas' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex items-center gap-2 relative">
          {/* Efek gradien/glow di belakang logo agar selalu terlihat */}
          <div className="absolute h-10 inset-0 bg-[radial-gradient(ellipse,var(--tw-gradient-stops))] from-tinta/60 via-tinta/10 to-transparent scale-[2.5] blur-md -z-10 rounded-full"></div>
          <img 
            src="/logo-suara.png" 
            alt="Suara Kebadongan" 
            className="h-8 md:h-10 w-auto object-contain drop-shadow-[15px_10px_12px_rgba(0,0,0,0.6)] relative z-10"
          />
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-10 items-center gap-2 rounded-radius-pill px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-terracotta text-polaroid shadow-sm'
                    : 'text-tinta-lembut hover:text-terracotta hover:bg-karton'
                }`}
              >
                {tab.icon(isActive)}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-tinta-lembut hover:text-terracotta transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Keluar Sebentar
        </button>
      </nav>

      {/* ── Mobile: tombol keluar (pojok kanan atas area konten) ── */}
      <button
        onClick={handleLogout}
        className="fixed top-3 right-3 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-karton border border-garis-kertas shadow-sm md:hidden"
        aria-label="Keluar sebentar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-terracotta">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </>
  )
}
