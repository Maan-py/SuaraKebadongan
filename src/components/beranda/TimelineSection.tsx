"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const timelineData = [
  {
    id: 1,
    title: "First Meet",
    desc: "Masih malu-malu kucing",
    label: "Sesi 1",
    rot: -2,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/first-meet.jpeg",
  },
  {
    id: 2,
    title: "Survey ke Desa Kebadongan",
    desc: "Berkeliling dan memetakan potensi desa bersama pemuda lokal",
    label: "Sesi 2",
    rot: 1,
    tapeColor: "bg-tape-hijau",
    imgSrc: "/timeline/second.jpeg",
  },
  {
    id: 3,
    title: "That 3 Days Wayangan",
    desc: "Musyawarah merumuskan program kerja utama KKN",
    label: "Sesi 3",
    rot: -1,
    tapeColor: "bg-marker-kuning",
    imgSrc: "/timeline/third.jpeg",
  },
  {
    id: 4,
    title: "Last Meet Before KKN",
    desc: "Kerja bakti memperbaiki saluran irigasi desa dan jalan",
    label: "Sesi 4",
    rot: 2,
    tapeColor: "bg-terracotta",
    imgSrc: "/timeline/fourth.jpeg",
  },
  {
    id: 5,
    title: "Minggu 5: Kegiatan Edukasi",
    desc: "Mengajar di SD dan mengadakan lomba cerdas cermat",
    label: "Sesi 5",
    rot: -2,
    tapeColor: "bg-tape-hijau",
  },
  {
    id: 6,
    title: "Minggu 6: Expo UMKM",
    desc: "Membantu pengemasan dan pemasaran produk UMKM warga",
    label: "Sesi 6",
    rot: 1,
    tapeColor: "bg-marker-kuning",
  },
  {
    id: 7,
    title: "Minggu 7: Makrab",
    desc: "Malam keakraban dan makan bersama perangkat desa",
    label: "Sesi 7",
    rot: -1,
    tapeColor: "bg-terracotta",
  },
  {
    id: 8,
    title: "Minggu 8: Perpisahan",
    desc: "Momen haru berpamitan, pamit pulang dengan segudang cerita",
    label: "Sesi 8",
    rot: 2,
    tapeColor: "bg-tape-hijau",
  },
];

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section className="relative w-full max-w-6xl mx-auto py-16 md:py-24 px-4 overflow-hidden" ref={containerRef}>
      <h2 className="text-center font-display text-3xl md:text-4xl text-tinta mb-16 md:mb-24 relative z-10">
        Lini Masa Kenangan
      </h2>

      {/* Camera doodle behind title */}
      <svg className="absolute top-12 md:top-20 right-1/4 w-16 h-16 text-tinta/30 rotate-12 -z-10" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <rect x="20" y="30" width="60" height="40" rx="4" />
         <circle cx="50" cy="50" r="10" />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 md:px-8 space-y-20">
        {[timelineData.slice(0, 4), timelineData.slice(4, 8)].map((rowItems, rowIndex) => (
          <div key={rowIndex} className="relative">
            {/* Connecting Line */}
            <div className="absolute top-[35%] left-0 right-0 h-[2px] bg-tinta/80 -z-10 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
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
