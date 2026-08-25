interface AvatarHewanProps {
  hewan: string
  warna: string
  className?: string
}

const hewanSvg: Record<string, (warna: string) => React.ReactElement> = {
  kucing: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12L6 4l6 6" stroke={warna} />
      <path d="M28 12l2-8-6 6" stroke={warna} />
      <ellipse cx="18" cy="18" rx="10" ry="12" stroke={warna} />
      <circle cx="14" cy="16" r="1.5" fill={warna} />
      <circle cx="22" cy="16" r="1.5" fill={warna} />
      <path d="M18 19v2" stroke={warna} />
      <path d="M12 22c2 2 8 2 12 0" stroke={warna} />
      <path d="M8 26c4 4 16 4 20 0" stroke={warna} />
    </svg>
  ),
  ayam: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="18" cy="20" rx="10" ry="10" stroke={warna} />
      <circle cx="18" cy="12" r="6" stroke={warna} />
      <circle cx="16" cy="11" r="1" fill={warna} />
      <circle cx="20" cy="11" r="1" fill={warna} />
      <path d="M18 8V5" stroke={warna} />
      <path d="M16 14l-2 3" stroke={warna} />
      <path d="M20 14l2 3" stroke={warna} />
      <path d="M14 28l-4 4" stroke={warna} />
      <path d="M22 28l4 4" stroke={warna} />
    </svg>
  ),
  kambing: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="18" cy="20" rx="10" ry="10" stroke={warna} />
      <path d="M10 16c-4-6-2-12 4-10" stroke={warna} />
      <path d="M26 16c4-6 2-12-4-10" stroke={warna} />
      <circle cx="14" cy="18" r="1.5" fill={warna} />
      <circle cx="22" cy="18" r="1.5" fill={warna} />
      <path d="M18 22v2" stroke={warna} />
      <path d="M16 24h4" stroke={warna} />
    </svg>
  ),
  cicak: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="18" cy="18" rx="8" ry="6" stroke={warna} />
      <circle cx="14" cy="17" r="1" fill={warna} />
      <circle cx="22" cy="17" r="1" fill={warna} />
      <path d="M10 18c-6-4-8 0-6 4" stroke={warna} />
      <path d="M26 18c6-4 8 0 6 4" stroke={warna} />
      <path d="M14 24l-4 6" stroke={warna} />
      <path d="M22 24l4 6" stroke={warna} />
      <path d="M18 12v-4" stroke={warna} />
    </svg>
  ),
  bebek: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="20" cy="20" rx="12" ry="8" stroke={warna} />
      <circle cx="12" cy="14" r="5" stroke={warna} />
      <circle cx="11" cy="13" r="1" fill={warna} />
      <path d="M7 16l-4 2 4 2" stroke={warna} />
      <path d="M8 26l-2 6" stroke={warna} />
      <path d="M14 26l2 6" stroke={warna} />
      <path d="M26 18l6-2-4 4" stroke={warna} />
    </svg>
  ),
  belut: (warna) => (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18c0-6 6-10 12-10s12 4 12 10-6 10-12 10-12-4-12-10z" stroke={warna} />
      <circle cx="14" cy="16" r="1" fill={warna} />
      <circle cx="22" cy="16" r="1" fill={warna} />
      <path d="M18 20c-2 0-4 2-4 4" stroke={warna} />
      <path d="M18 20c2 0 4 2 4 4" stroke={warna} />
      <path d="M6 18c-4 0-6 2-4 4" stroke={warna} />
      <path d="M30 18c4 0 6 2 4 4" stroke={warna} />
    </svg>
  ),
}

const hewanList = Object.keys(hewanSvg)

export function getRandomHewan(): string {
  return hewanList[Math.floor(Math.random() * hewanList.length)]
}

export default function AvatarHewan({ hewan, warna, className = '' }: AvatarHewanProps) {
  const render = hewanSvg[hewan] || hewanSvg.kucing
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {render(warna)}
    </div>
  )
}
