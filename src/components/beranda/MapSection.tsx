"use client";

import { motion } from "motion/react";

export default function MapSection() {
  return (
    <>
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
              Every great journey begins with a single symbol of purpose. Here's to learning, serving, and creating meaningful impact together.
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
               className="group bg-polaroid p-3 md:p-4 md:pb-12 pb-12 shadow-kertas rotate-[2deg] rounded-sm relative cursor-pointer"
               initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
               whileHover={{ 
                 scale: 1.05, 
                 rotate: 0, 
                 zIndex: 30,
                 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
               }}
               viewport={{ once: true }}
               transition={{ duration: 0.4, ease: "easeOut" }}
             >
                {/* Pin Image */}
                <img 
                  src="/push-pin.png" 
                  alt="Pin" 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-15 h-15 object-contain drop-shadow-sm z-20 group-hover:scale-110 transition-transform duration-300"
                />
                {/* Map Area */}
                 <div className="w-full aspect-[4/3] relative overflow-hidden">
                   <iframe
                     src="https://maps.google.com/maps?q=-7.699243844340109,109.62585134874638&z=15&output=embed"
                     className="absolute inset-0 w-full h-full"
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                     style={{ border: 0 }}
                     title="Lokasi Desa Kebadongan"
                   />
                 </div>

                <p className="absolute bottom-3 left-0 right-0 text-center font-tulis text-lg text-tinta group-hover:text-terracotta transition-colors">
                  Posko Sejuta Cerita
                </p>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
    <footer className="w-full pb-5 text-center bg-teal">
      {/* Social Media Icons */}
      <div className="flex items-center justify-center gap-5 pb-5">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/suarakebadongan/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-polaroid/60 hover:text-polaroid transition-colors duration-200"
          aria-label="Instagram SuaraKebadongan"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FBFAF5">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        {/* TikTok */}
        <a
          href="https://www.tiktok.com/@kkn.upnvyk.84.413"
          target="_blank"
          rel="noopener noreferrer"
          className="text-polaroid/60 hover:text-polaroid transition-colors duration-200"
          aria-label="TikTok KKN Kebadongan"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FBFAF5">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
          </svg>
        </a>
      </div>
      <p className="font-tulis text-lg text-polaroid/70 text-base tracking-wide font-bold">
        Made With ❤️ by Luqmaan
      </p>
    </footer>
    </>
  );
}
