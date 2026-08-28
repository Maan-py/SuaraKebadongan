"use client";

import { motion } from "motion/react";

const profiles = [
  { id: 1, name: "Audy", role: "Ketua", quote: "gtw, lupa 😭", imgColor: "bg-terracotta/20", imgUrl: "/profile/audy.jpg" },
  { id: 2, name: "Flo", role: "Sekretaris", quote: "siapa yang belom isi absensii!?", imgColor: "bg-teal/20", imgUrl: "/profile/flo.jpg"  },
  { id: 3, name: "Bia", role: "Bendahara", quote: "uangnya masih berapa?", imgColor: "bg-teal/20", imgUrl: "/profile/bia.jpg" },
  { id: 4, name: "Anggie", role: "Humas", quote: "nak tempura", imgColor: "bg-marker-kuning/20", imgUrl: "/profile/anggie.jpg" },
  { id: 5, name: "Chevin", role: "Humas", quote: "kacamataku mana ya?", imgColor: "bg-stiker-pink/20", imgUrl: "/profile/chevin.jpg" },
  { id: 6, name: "El", role: "PDD", quote: "gtw, lupa 😭", imgColor: "bg-tape-hijau/20", imgUrl: "/profile/el.jpg" },
  { id: 7, name: "Puput", role: "PDD", quote: "gtw, lupa 😭", imgColor: "bg-spidol-ungu/20", imgUrl: "/profile/puput.jpg" },
  { id: 8, name: "Arya", role: "Logistik", quote: "ooo, i see", imgColor: "bg-spidol-ungu/20", imgUrl: "/profile/arya.jpg" },
  { id: 9, name: "Luqmaan", role: "Logistik", quote: "gtw, ap yh 😭", imgColor: "bg-spidol-ungu/20", imgUrl: "/profile/luqmaan.jpg" },
  { id: 10, name: "Sulthan", role: "Logistik", quote: "gtw, lupa 😭", imgColor: "bg-spidol-ungu/20", imgUrl: "/profile/sulthan.jpg" },
];

export default function ProfileSection() {
  return (
    <section className="relative w-full max-w-5xl mx-auto py-16 px-4 overflow-hidden">
      {/* Doodle: Bintang sudut kiri atas */}
      <svg className="absolute top-8 left-2 md:left-8 w-12 h-12 text-terracotta/40 -rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {/* Doodle: Hati sudut kanan atas */}
      <svg className="absolute top-10 right-2 md:right-8 w-10 h-10 text-stiker-pink/50 rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {/* Doodle: Coretan/underline di bawah judul */}
      <svg className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 w-40 h-6 text-marker-kuning/60 pointer-events-none" viewBox="0 0 160 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M10 15 Q 80 5 150 12" />
      </svg>
      {/* Doodle: Bunga kiri bawah */}
      <svg className="absolute bottom-10 left-0 md:left-4 w-16 h-16 text-tape-hijau/40 rotate-12 pointer-events-none" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 25 C 35 15, 45 25, 25 35 C 5 25, 15 15, 25 25" />
        <path d="M25 25 C 15 15, 25 5, 25 25 C 35 5, 45 15, 25 25" />
        <path d="M25 25 C 10 30, 10 40, 25 35 C 40 40, 40 30, 25 25" />
        <circle cx="25" cy="27" r="3" fill="currentColor" />
      </svg>
      {/* Doodle: Spiral kanan bawah */}
      <svg className="absolute bottom-8 right-0 md:right-4 w-16 h-20 text-spidol-ungu/30 pointer-events-none" viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M40 10 C 60 20, 60 40, 40 50 C 20 60, 10 40, 20 30 C 30 20, 45 35, 40 60" />
      </svg>

      <h2 className="text-center font-display text-3xl md:text-4xl text-tinta mb-12 relative z-10">
        Wajah-Wajah Kita
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12 max-w-20xl mx-auto flex">
        {profiles.map((profile, i) => (
          <motion.div
            key={profile.id}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Avatar Circle */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-terracotta/80 p-1 mb-4 relative shadow-sm flex-shrink-0">
              <div className={`w-full h-full rounded-full ${profile.imgColor} overflow-hidden relative`}>
                 <img 
                   className="absolute inset-0 w-full h-full rounded-full object-cover object-top"
                   src={profile.imgUrl} 
                   alt={`Foto ${profile.name}`}
                 />
              </div>
              {/* Small decorative dot */}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-marker-kuning border-2 border-polaroid" />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <h3 className="font-body font-bold text-lg text-tinta ">
                {profile.name} 
              </h3>
              <span className="font-bold text-tinta-lembut font-tulis text-lg">{profile.role}</span>
              <p className="font-tulis text-base md:text-lg text-tinta-lembut mt-1 leading-tight px-2">
                "{profile.quote}"
              </p>
            </div>  
          </motion.div>
        ))}
      </div>
    </section>
  );
}
