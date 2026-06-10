"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-papantla.jpg"
          alt="Papantla - La Ciudad que Perfuma"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-4 text-center px-6"
      >
        <span className="text-white text-xs uppercase tracking-[0.5em] font-medium mb-1 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-white/40" />
          MÉXICO
          <span className="w-8 h-[1px] bg-white/40" />
        </span>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-[-0.05em] leading-none uppercase drop-shadow-2xl">
          PAPANTLA
        </h1>

        <div className="flex items-center gap-4 text-white">
          <span className="text-primary text-xl">◆</span>
          <p className="text-lg md:text-xl font-bold uppercase tracking-[0.2em] drop-shadow-md">
            LA CIUDAD QUE PERFUMA
          </p>
          <span className="text-primary text-xl">◆</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('explore-content')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 px-10 py-3 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
        >
          EXPLORAR MÁS
        </motion.button>
      </motion.div>

      {/* Floating Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-4">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </div>

      {/* Side Social Bar (Simulating Visit Puebla) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 z-20 shadow-2xl">
        {['Instagram', 'Facebook', 'Twitter', 'Youtube'].map((social) => (
          <motion.div
            key={social}
            whileHover={{ scale: 1.2, color: "#F16B24" }}
            className="w-5 h-5 cursor-pointer flex items-center justify-center text-white/80"
          >
            {social[0]}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
