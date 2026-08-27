"use client";

import { motion } from "motion/react";

const profiles = [
  { id: 1, name: "Andi", role: "Ketua", quote: "Yang penting makan bang.", imgColor: "bg-terracotta/20" },
  { id: 2, name: "Maya", role: "Sekretaris", quote: "Jangan lupa laporan!", imgColor: "bg-teal/20" },
  { id: 3, name: "Anto", role: "Humas", quote: "Warga aman, kita aman.", imgColor: "bg-marker-kuning/20" },
  { id: 4, name: "Siti", role: "Bendahara", quote: "Iuran woy iuran.", imgColor: "bg-stiker-pink/20" },
  { id: 5, name: "Budi", role: "Perkap", quote: "Kabel roll mana?", imgColor: "bg-tape-hijau/20" },
  { id: 6, name: "Rina", role: "Konsumsi", quote: "Makanannya sisa nih.", imgColor: "bg-spidol-ungu/20" },
];

export default function ProfileSection() {
  return (
    <section className="relative w-full max-w-5xl mx-auto py-16 px-4">
      <h2 className="text-center font-display text-3xl md:text-4xl text-tinta mb-12">
        Wajah-wajah Kita
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 max-w-4xl mx-auto">
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "backOut" }}
          >
            {/* Avatar Circle */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-terracotta/80 p-1 mb-4 relative shadow-sm">
              <div className={`w-full h-full rounded-full ${profile.imgColor} flex items-center justify-center overflow-hidden`}>
                 <span className="font-tulis text-tinta/50 text-xs">Foto</span>
              </div>
              {/* Small decorative dot */}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-marker-kuning border-2 border-polaroid" />
            </div>

            {/* Info */}
            <h3 className="font-body font-bold text-lg text-tinta">
              {profile.name} <span className="font-normal text-tinta-lembut">- {profile.role}</span>
            </h3>
            <p className="font-tulis text-base md:text-lg text-tinta-lembut mt-1 leading-tight px-2">
              "{profile.quote}"
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
