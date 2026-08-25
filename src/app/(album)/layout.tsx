import LenisProvider from '@/components/shell/LenisProvider'
import TabBar from '@/components/shell/TabBar'
import OfflineBanner from '@/components/shell/OfflineBanner'
import SurpriseButton from '@/components/surprise/SurpriseButton'

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <TabBar />
      <OfflineBanner />
      <SurpriseButton />

      {/* Padding: atas untuk header desktop (56px), bawah untuk tab bar mobile (64px) + safe area */}
      <main className="min-h-dvh pt-0 pb-20 md:pt-14 md:pb-0">
        {children}
      </main>
    </LenisProvider>
  )
}
