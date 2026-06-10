"use client";

import dynamic from "next/dynamic";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Iniciando Sistemas de Navegación</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header - Transparent & Integrated */}
      <header className="fixed top-0 left-0 right-0 z-[1001] px-6 pt-12 pb-6 pointer-events-none">
        <div className="flex items-center justify-between">
          <Link href="/" className="pointer-events-auto">
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/5 shadow-2xl flex items-center justify-center text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.div>
          </Link>
          
          <div className="flex-1 px-4 pointer-events-none">
             <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/5 rounded-2xl px-6 py-3 shadow-2xl inline-flex items-center gap-3 ml-2 pointer-events-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <h1 className="text-sm font-black tracking-tighter uppercase">
                   Mapa <span className="text-primary font-black">Live</span>
                </h1>
             </div>
          </div>

          <motion.div 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/5 shadow-2xl flex items-center justify-center text-primary pointer-events-auto"
          >
            <Info className="w-6 h-6" />
          </motion.div>
        </div>
      </header>

      {/* Main Map View */}
      <main className="flex-1 w-full h-full relative">
        <InteractiveMap />
      </main>

      {/* Legend / Quick Links - Absolute Floating */}
      <div className="absolute bottom-32 left-6 right-6 z-[1000] flex gap-2 overflow-x-auto no-scrollbar py-2">
         {["Sabores", "Alimentos", "Murales", "Sitios"].map((cat) => (
           <button 
             key={cat}
             className="px-6 py-3 bg-white/95 dark:bg-black/95 backdrop-blur-xl border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap active:scale-95 transition-all"
           >
             {cat}
           </button>
         ))}
      </div>
    </div>
  );
}

