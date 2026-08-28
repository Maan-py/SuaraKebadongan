import type { Metadata } from "next";

import HeroSection from "@/components/beranda/HeroSection";
import VideoSection from "@/components/beranda/VideoSection";
import TimelineSection from "@/components/beranda/TimelineSection";
import ProfileSection from "@/components/beranda/ProfileSection";
import MapSection from "@/components/beranda/MapSection";

export const metadata: Metadata = {
  title: "Beranda — SuaraKebadongan",
  description: "Lini masa kenangan KKN Desa Kebadongan.",
};

export default function BerandaPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <HeroSection />
      <VideoSection />
      <ProfileSection />
      <TimelineSection />
      <MapSection />
    </div>
  );
}
