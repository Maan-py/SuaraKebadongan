"use client";

import { motion } from "motion/react";

export default function MapSection() {
  return (
    <section className="relative w-full mt-24">
      {/* ── Background Teal Block ── */}
      <div className="absolute inset-0 bg-teal -z-10 mt-16 md:mt-24 rounded-t-3xl md:rounded-t-[4rem]" />

      <div className="max-w-5xl mx-auto px-4 pt-8 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* ── Text Content ── */}
          <div className="w-full md:w-1/2 text-center md:text-left pt-16 md:pt-24 z-10">
            <motion.h2 
              className="font-display text-3xl md:text-5xl text-polaroid mb-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Kebadongan
            </motion.h2>
            <motion.p 
              className="font-body text-base md:text-lg text-polaroid/80 mb-8 max-w-md mx-auto md:mx-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Tempat sejuta cerita dimulai. Dari jalanan setapak yang becek pas hujan, sampai warung tempat kita ngopi sambil bikin proker semalaman.
            </motion.p>
            <motion.button 
              className="btn-terracotta px-6 py-3 rounded-pill font-semibold shadow-sm inline-flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Lihat Kenangan
            </motion.button>
          </div>

          {/* ── Map Illustration (Polaroid) ── */}
          <div className="w-full md:w-1/2 z-10 relative">
             <motion.div
               className="bg-polaroid p-3 md:p-4 pb-12 shadow-kertas rotate-[2deg] rounded-sm relative"
               initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, ease: "backOut" }}
             >
                {/* Washi Tape */}
                <div className="absolute -top-3 right-8 w-16 h-5 bg-tape-hijau shadow-tape rotate-[4deg] opacity-90" />
                
                {/* Map Area */}
                <div className="w-full aspect-[4/3] bg-karton border border-garis-kertas relative overflow-hidden flex items-center justify-center">
                   {/* Dummy Roads */}
                   <svg className="absolute inset-0 w-full h-full text-tinta/10" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 0 30 C 40 40, 60 20, 100 50" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path d="M 50 0 L 50 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                      <path d="M 30 100 C 40 70, 80 80, 100 90" fill="none" stroke="currentColor" strokeWidth="4" />
                   </svg>
                   
                   {/* Dummy Pins */}
                   <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-full text-terracotta">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                   </div>
                   <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-full text-marker-kuning">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                   </div>

                   <span className="font-tulis text-tinta/40 text-lg z-10 bg-karton/50 px-2 rounded">Peta Desa Kebadongan</span>
                </div>

                <p className="absolute bottom-3 left-0 right-0 text-center font-tulis text-lg text-tinta">
                  Peta Kenangan
                </p>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
