'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { useState, useEffect, useCallback } from 'react'

const tabs = [
  {
    href: '/galeri',
    label: 'Galeri',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-tinta' : 'text-tinta-lembut'}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'Suara',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-tinta' : 'text-tinta-lembut'}>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
    ),
  },
  {
    href: '/notes',
    label: 'Cat Tempel',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-tinta' : 'text-tinta-lembut'}>
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

  useEffect(() => {
    setMounted(true)
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
        className="fixed bottom-0 left-0 right-0 z-50 bg-karton border-t border-garis-kertas md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="relative flex h-16 items-center justify-around">
          {/* Indikator stabilo sliding */}
          {mounted && (
            <motion.div
              className="absolute top-2 h-10 w-16 rounded-radius-kartu bg-marker-kuning/30"
              initial={false}
              animate={gerakDiizinkan ? { x: activeIndex * 64 + 16 } : { x: activeIndex * 64 + 16 }}
              transition={gerakDiizinkan ? { type: 'tween', duration: 0.25, ease: 'easeInOut' } : { duration: 0 }}
              aria-hidden="true"
            />
          )}

          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href)
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                aria-current={isActive ? 'page' : undefined}
                className="relative z-10 flex h-11 w-16 flex-col items-center justify-center gap-0.5 rounded-radius-kartu transition-colors"
              >
                {tab.icon(isActive)}
                <span className={`text-xs font-medium ${isActive ? 'text-tinta font-semibold' : 'text-tinta-lembut'}`}>
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
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center justify-between border-b border-garis-kertas bg-karton px-6"
      >
        <div className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold text-tinta">Badongan</span>
          <span className="text-xs text-tinta-lembut tracking-wide">✦ Kenangan KKN</span>
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
                    ? 'bg-marker-kuning/30 text-tinta'
                    : 'text-tinta-lembut hover:text-tinta'
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
          className="flex items-center gap-2 text-sm text-tinta-lembut hover:text-stiker-merah transition-colors"
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tinta-lembut">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </>
  )
}
