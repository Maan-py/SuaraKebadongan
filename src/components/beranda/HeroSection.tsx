"use client";

import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

const carouselItems = [
  { src: "/lastday1.jpeg", caption: "Last Day di Kebadongan" },
  { src: "/hero1.jpeg", caption: "Glagah" },
  { src: "/hero2.jpeg", caption: "DPL Dateng" },
  { src: "/hero3.jpeg", caption: "Momen di Balai Desa" },
  { src: "/hero4.jpeg", caption: "Expo KKN" },
  { src: "/US.jpg", caption: "Us" },
];

export default function HeroSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      if (width > 0) {
        const index = Math.round(scrollLeft / width);
        setActiveIndex(index);
      }
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (scrollLeft <= 0) {
        carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-12 md:py-16 min-h-[calc(100vh-3.5rem)] md:min-h-[90vh] flex flex-col justify-center items-center">
      {/* ── Background Color Blocks (Terracotta & Teal) ── */}
      <div className="absolute -bottom-4 left-0 right-0 flex h-[50%] -z-10 w-full">
        <div className="w-1/2 bg-terracotta h-full"></div>
        <div className="w-1/2 bg-teal h-full"></div>
      </div>

      {/* ── Title Logo (Absolute, melayang agar tidak mendorong foto) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="absolute top-22 md:top-5 left-1/2 -translate-x-1/2 z-30 w-64 md:w-80 pointer-events-none flex justify-center items-center"
      >
        {/* Glow / Gradien di belakang logo hero agar selalu terbaca */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse,var(--tw-gradient-stops))] from-tinta/60 via-tinta/20 to-transparent scale-[1.8] blur-xl -z-10 rounded-full"></div>
        <img 
          src="/logo-suara.png" 
          alt="Suara Kebadongan" 
          className="w-full h-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative z-10"
        />
      </motion.div>

      {/* ── Teks Tambahan (Tulisan Tangan) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.8 }}
        className="absolute top-15 md:top-1 left-1/2 -translate-x-1/2 z-40 pointer-events-none whitespace-nowrap"
      >
        <p className="font-tulis font-bold mr-14 md:mr-20 text-3xl md:text-4xl text-terracotta-900 drop-shadow-sm">
          Jejak Langkah KKN
        </p>
      </motion.div>

      {/* ── Hero Photo (Polaroid style) ── */}
      <motion.div
        className="group relative rounded-lg border-[0.5px] border-terracotta border mx-auto w-[90%] max-w-2xl cursor-pointer"
        initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 1 }}
        whileHover={{ 
          scale: 1.03, 
          rotate: 0, 
          y: -4,
          zIndex: 30,
          boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* ── 4 Tapes at corners ── */}
        <div className="absolute -top-3 -left-5 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape -rotate-45 z-20 border border-garis-kertas/50 group-hover:scale-105 transition-transform" />
        <div className="absolute -top-3 -right-5 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape rotate-45 z-20 border border-garis-kertas/50 group-hover:scale-105 transition-transform" />
        <div className="absolute -bottom-3 -left-5 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape rotate-45 z-20 border border-garis-kertas/50 group-hover:scale-105 transition-transform" />
        <div className="absolute -bottom-3 -right-5 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape -rotate-45 z-20 border border-garis-kertas/50 group-hover:scale-105 transition-transform" />

        <div className="bg-polaroid rounded-lg p-4 pb-16 md:p-6 md:pb-20 shadow-kertas border border-garis-kertas/30 relative z-10">
          {/* Photo Carousel Container */}
          <div className="relative group">
            {/* Arrow Left */}
            <button 
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-kertas/80 text-tinta w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-terracotta hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-100"
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            {/* Arrow Right */}
            <button 
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-kertas/80 text-tinta w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:bg-terracotta hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 md:opacity-100"
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <div 
              ref={carouselRef} 
              onScroll={handleScroll}
              className="flex w-full overflow-x-auto snap-x snap-mandatory rounded-sm scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-garis-kertas/30"
            >
              {carouselItems.map((item, idx) => (
                <img
                  key={idx}
                  src={item.src}
                  alt={`Momen Suara Kebadongan ${idx + 1}`}
                  className="w-full shrink-0 snap-center aspect-[4/3] md:aspect-video object-cover object-center"
                />
              ))}
            </div>
          </div>

          <p className="absolute bottom-5 md:bottom-6 left-0 right-0 text-center font-tulis text-xl md:text-2xl text-tinta group-hover:text-terracotta transition-colors duration-300">
            {carouselItems[activeIndex]?.caption}
          </p>
        </div>

        {/* ── Doodles Left ── */}
        <div className="absolute -left-8 md:-left-20 top-10 md:top-20 z-30 pointer-events-none text-tinta opacity-80 flex flex-col gap-4 md:gap-6">
           {/* Hearts and Stars */}
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="-rotate-12">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
           </svg>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="rotate-12 ml-4">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
           </svg>
        </div>

        <div className="absolute -left-6 md:-left-12 bottom-10 md:bottom-20 z-30 pointer-events-none text-tinta opacity-80">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FAF6EE" strokeWidth="1.5" className="-rotate-6">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
           </svg>
        </div>

        {/* ── Doodles Right ── */}
        <div className="absolute -right-12 md:-right-24 top-4 md:top-10 z-30 pointer-events-none text-tinta opacity-80 flex flex-col items-center gap-3">
           {/* Hearts, Stars, and Spiral arrow */}
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="-rotate-12 mr-6">
             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
           </svg>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="rotate-45 ml-2">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
           </svg>
           {/* Spiral Arrow */}
           <svg width="50" height="70" viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-1">
             <path d="M40 10 C 60 20, 60 40, 40 50 C 20 60, 10 40, 20 30 C 30 20, 45 35, 40 60 C 35 80, 20 70, 10 75" />
             <path d="M5 65 L 10 75 L 20 70" />
           </svg>
        </div>

        <div className="absolute -right-8 md:-right-16 bottom-0 md:bottom-10 z-30 pointer-events-none text-tinta opacity-90">
           {/* Flower */}
           <svg width="40" height="70" viewBox="0 0 50 80" fill="none" stroke="#FAF6EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M25 40 C 35 30, 45 40, 25 50 C 5 40, 15 30, 25 40" />
             <path d="M25 40 C 15 30, 25 20, 25 40 C 35 20, 45 30, 25 40" />
             <path d="M25 40 C 10 45, 10 55, 25 50 C 40 55, 40 45, 25 40" />
             <circle cx="25" cy="42" r="3" fill="#FAF6EE" />
             <path d="M25 50 Q 20 70 25 80" />
             <path d="M25 60 Q 35 55 40 65 Q 30 65 25 65" />
           </svg>
        </div>

        {/* Coffee Stain (Top Right behind everything) */}
        <div className="absolute -right-8 md:-right-20 -top-6 md:-top-12 z-0 pointer-events-none opacity-20 rotate-12">
           <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#6F2C1A" strokeWidth="2">
              <circle cx="50" cy="50" r="40" strokeDasharray="10 4" opacity="0.6"/>
              <circle cx="48" cy="52" r="38" opacity="0.4"/>
           </svg>
        </div>

      </motion.div>
    </section>
  );
}
