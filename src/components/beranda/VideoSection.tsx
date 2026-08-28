"use client";

import { motion } from "motion/react";

export default function VideoSection() {
  return (
    <section className="relative w-full max-w-4xl mx-auto py-12 px-4 overflow-hidden">
      {/* ── Title ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 relative z-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-terracotta">
          After Movie KKN
        </h2>
        <p className="font-tulis text-xl md:text-2xl text-tinta/70 mt-1">
          Rangkuman perjalanan & tawa kita selama di Kebadongan 🎬
        </p>
      </motion.div>

      {/* ── Video Polaroid Frame ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-3xl"
      >
        {/* Tapes on top corners */}
        <div className="absolute -top-3 -left-4 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape -rotate-12 z-20 border border-garis-kertas/50 pointer-events-none" />
        <div className="absolute -top-3 -right-4 w-16 md:w-20 h-6 bg-[#E8DCC8]/90 shadow-tape rotate-12 z-20 border border-garis-kertas/50 pointer-events-none" />

        {/* Polaroid Card Wrapper */}
        <div className="bg-polaroid rounded-xl p-3 md:p-5 pb-8 shadow-kertas border border-garis-kertas/40 relative z-10">
          {/* Responsive 16:9 Aspect Ratio Container */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-garis-kertas/30 bg-black/90 shadow-inner">
            <iframe
              src="https://www.youtube.com/embed/fmuu7Py30F4"
              title="After Movie KKN Kebadongan"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          {/* Caption */}
          <p className="font-tulis text-center text-lg md:text-xl text-tinta mt-4">
            "Setiap detik kenangan yang tersimpan dalam sinematik"
          </p>
        </div>

        {/* ── Decorative Doodles ── */}
        <div className="absolute -left-6 -bottom-6 pointer-events-none text-terracotta/40 -rotate-12 hidden md:block">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
        <div className="absolute -right-6 -top-6 pointer-events-none text-marker-kuning/80 rotate-12 hidden md:block">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
