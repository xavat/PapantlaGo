"use client";

import dynamic from "next/dynamic";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">
          Iniciando Sistemas de Navegación
        </p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const categories = [
    { label: "Todos", value: null },
    { label: "Atracciones", value: "destinos" },
    { label: "Gastronomía", value: "sabor" },
    { label: "Hospedaje", value: "hospedaje" },
    { label: "Eventos", value: "eventos" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header - Transparent & Integrated */}
      <header className="fixed top-0 left-0 right-0 z-[1001] px-6 pt-12 pb-6 pointer-events-none">
        <div className="flex items-center justify-between">
          <Link href="/" className="pointer-events-auto">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl flex items-center justify-center text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.div>
          </Link>

          <div className="flex-1 px-4 pointer-events-none">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl px-6 py-3 shadow-2xl inline-flex items-center gap-3 ml-2 pointer-events-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <h1 className="text-sm font-black tracking-tighter uppercase">
                Mapa <span className="text-primary font-black">Live</span>
              </h1>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo((prev) => !prev)}
            className={`w-12 h-12 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center justify-center pointer-events-auto transition-all ${
              showInfo
                ? "bg-primary border-primary text-white"
                : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-primary"
            }`}
          >
            <Info className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      {/* Info Modal Dialog */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-28 left-6 right-6 z-[1002] bg-white/95 dark:bg-zinc-900/95 border border-black/5 dark:border-white/10 p-6 rounded-[30px] shadow-2xl backdrop-blur-xl flex flex-col gap-3"
          >
            <h2 className="text-md font-black uppercase text-foreground leading-tight tracking-tight">
              Modo Aventurero Pokémon Go
            </h2>
            <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold leading-relaxed flex flex-col gap-2">
              <p>
                Rastrea tu ubicación en tiempo real en un mapa 2.5D. El compás y la orientación de la cámara giran 
                de acuerdo al rumbo de tu dispositivo para brindarte una sensación inmersiva.
              </p>
              <p className="font-bold text-[#F16B24]">
                ¿Quieres probarlo ya? Activa el botón de "Caminata simulada" (<span className="inline-block text-purple-600 bg-purple-100 dark:bg-purple-950/40 p-1 rounded-md">🕹️ Modo Demo</span>) de la barra lateral derecha para simular un recorrido en vivo por el centro de Papantla.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="mt-2 py-3 bg-primary hover:bg-[#721F2C] text-white rounded-xl font-bold uppercase text-[9px] tracking-widest text-center"
            >
              Entendido
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Map View */}
      <main className="flex-1 w-full h-full relative">
        <InteractiveMap categoryFilter={categoryFilter} />
      </main>

      {/* Legend / Quick Links - Absolute Floating */}
      <div className="absolute bottom-32 left-6 right-6 z-[1000] flex gap-2 overflow-x-auto no-scrollbar py-2">
        {categories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setCategoryFilter(cat.value)}
            className={`px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap active:scale-95 transition-all backdrop-blur-xl ${
              categoryFilter === cat.value
                ? "bg-primary border-primary text-white"
                : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
