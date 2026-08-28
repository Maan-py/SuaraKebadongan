"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const timelineData = [
  {
    id: 1,
    title: "First Meet",
    desc: "A new story begins, and countless memories are waiting to be created",
    label: "22 Mei 2026",
    rot: -2,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/first-meet.jpeg",
  },
  {
    id: 2,
    title: "Survey ke Desa Kebadongan",
    desc: "For the next chapter, we'll be learning, growing, and serving alongside the amazing community of Desa Kebadongan, Kecamatan Klirong, Kebumen.",
    label: "29 Mei 2026",
    rot: 1,
    tapeColor: "bg-tape-hijau",
    imgSrc: "/timeline/second.jpeg",
  },
  {
    id: 3,
    title: "That 2 Wayangan Days",
    desc: "A small step today marks the beginning of our great journey",
    label: "20 — 21 Juni 2026",
    rot: -1,
    tapeColor: "bg-marker-kuning",
    imgSrc: "/timeline/third.jpeg",
  },
  {
    id: 4,
    title: "Last Meet Before KKN",
    desc: "Last meet before the KKN journey begins!",
    label: "29 Juli 2026",
    rot: 2,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/fourth.jpeg",
  },
  {
    id: 5,
    title: "Pelepasan Day",
    desc: "One month down, and the journey is about to start!",
    label: "30 Juli 2026",
    rot: -2,
    tapeColor: "bg-tape-hijau",
    imgSrc: "/timeline/penerjunan.jpeg",
  },
  {
    id: 6,
    title: "First Week",
    desc: "satu minggu pertama, betah betah yaaa, semangattt",
    label: "1 — 7 Juli 2026 ",
    rot: 1,
    tapeColor: "bg-marker-kuning",
    imgSrc: "/timeline/week1.jpeg",
  },
  {
    id: 7,
    title: "Second Week",
    desc: "week 2 is coming!!! SEMANGATT GUYSS✨😝",
    label: "8 — 14 Juli 2026",
    rot: -1,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/week2.jpeg",
  },
  {
    id: 8,
    title: "Third Week",
    desc: "minggu ketiga yang dipenuhi dengan huru hara, last fighting before last week!",
    label: "15 — 21 Juli 2026",
    rot: 2,
    tapeColor: "bg-tape-hijau",
    imgSrc: "/timeline/week3.jpeg",
  },
  {
    id: 9,
    title: "Last Week",
    desc: "FINALLY KKN 30 HARI TUNTAS DILAKSANAKAN!!!",
    label: "22 — 29 Juli 2026",
    rot: -1,
    tapeColor: "bg-tape-hijau",
    imgSrc: "/timeline/week4.jpeg",
  },{
    id: 10,
    title: "Farewell Day",
    desc: "Momen haru berpamitan, pamit pulang dengan segudang cerita",
    label: "30 Juli 2026",
    rot: 2,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/farewell.jpeg",
  },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="relative w-full max-w-6xl mx-auto py-16 md:py-24 px-4 overflow-hidden" ref={containerRef}>
      <h2 className="text-center font-display text-3xl md:text-4xl text-tinta mb-16 md:mb-24 relative z-10">
        Lini Masa Kenangan
      </h2>

      {/* Doodle: Kamera di atas */}
      <svg className="absolute top-12 md:top-20 right-1/4 w-16 h-16 text-tinta/30 rotate-12 -z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <rect x="20" y="30" width="60" height="40" rx="4" />
         <circle cx="50" cy="50" r="10" />
      </svg>
      {/* Doodle: Hati kiri atas */}
      <svg className="absolute top-10 left-4 md:left-12 w-10 h-10 text-stiker-pink/40 -rotate-12 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {/* Doodle: Coretan/underline di bawah judul */}
      <svg className="absolute top-28 md:top-35 left-1/2 -translate-x-1/2 w-40 h-6 text-marker-kuning/60 pointer-events-none" viewBox="0 0 160 20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <path d="M10 15 Q 80 5 150 12" />
      </svg>
      {/* Doodle: Bintang kiri atas kecil */}
      <svg className="absolute top-20 left-8 md:left-20 w-7 h-7 text-marker-kuning/60 rotate-6 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {/* Doodle: Panah melingkar kanan bawah */}
      <svg className="absolute bottom-12 right-2 md:right-10 w-14 h-20 text-terracotta/30 pointer-events-none" viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M40 10 C 60 20, 60 40, 40 50 C 20 60, 10 40, 20 30 C 30 20, 45 35, 40 60" />
        <path d="M30 52 L 40 60 L 48 50" />
      </svg>
      {/* Doodle: Noda kopi kiri bawah */}
      <svg className="absolute bottom-8 left-0 md:left-8 w-20 h-20 text-tinta/10 -rotate-6 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="38" strokeDasharray="8 4" opacity="0.7" />
        <circle cx="48" cy="52" r="34" opacity="0.4" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 space-y-20">
        {[timelineData.slice(0, 4), timelineData.slice(4, 8), timelineData.slice(8, 10)].map((rowItems, rowIndex) => (
          <div key={rowIndex} className="relative">
            {/* Connecting Line */}
            <div className="absolute top-[35%] left-0 right-0 h-[2px] bg-tinta/80 -z-10 hidden md:block" />

            <div className={`grid grid-cols-1 gap-12 md:gap-6 ${
                rowItems.length < 4 
                  ? `md:grid-cols-2 grid-cols-1 md:w-1/2 mx-auto` 
                  : 'md:grid-cols-4 grid-cols-1'
              }`}>
              {rowItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="flex flex-col items-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                >
                  {/* Polaroid Card */}
                  <div
                    className="bg-polaroid p-3 pb-10 shadow-kertas border border-garis-kertas/50 relative mb-6 w-60 md:w-full max-w-[220px]"
                    style={{ transform: `rotate(${item.rot}deg)` }}
                  >
                    {/* Washi Tape */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 ${item.tapeColor} shadow-tape -rotate-3 opacity-90`} />
                    
                    {/* Pin Image */}
                    <img 
                      src="/push-pin.png" 
                      alt="Pin" 
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 object-contain drop-shadow-sm z-20 hover:scale-110 transition-transform"
                    />

                    {/* Photo Placeholder */}
                    {/* <div className="w-full aspect-square bg-karton border border-sepia-terang/20 flex items-center justify-center p-4 text-center">
                       <span className="font-tulis text-tinta-lembut text-sm opacity-60">Foto Jurnal</span>
                    </div> */}
                    {item.imgSrc && (
                      <img 
                        src={item.imgSrc}
                        alt="Foto Jurnal"
                        className="w-full bg-karton border border-sepia-terang/20 flex items-center justify-center p-4 text-center"
                      />
                    )}
                    
                    {/* Label */}
                    <p className="absolute bottom-2 left-0 right-0 text-center font-tulis text-lg text-tinta">
                      {item.label}
                    </p>
                  </div>

                  {/* Connecting Pin Image (Desktop) */}
                  {/* <div className="hidden md:block absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <img 
                      src="/push-pin.png" 
                      alt="Pin" 
                      className="w-10 h-10 object-contain drop-shadow-md -translate-y-3 hover:scale-110 transition-transform"
                    />
                  </div> */}

                  {/* Text Info */}
                  <h3 className="font-body font-bold text-lg text-tinta text-center mb-2 px-1 leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-tinta-lembut text-center px-2 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Decorative Leaves */}
      <svg className="absolute left-0 bottom-0 w-32 h-32 text-tinta opacity-20 -rotate-12" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 90 Q 30 50 80 10 M 30 70 Q 50 40 70 30 M 40 80 Q 60 50 80 40" />
      </svg>
    </section>
  );
}
