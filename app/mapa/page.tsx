"use client";

import dynamic from "next/dynamic";
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

  const categories = [
    { label: "Todos", value: null },
    { label: "Atracciones", value: "destinos" },
    { label: "Gastronomía", value: "sabor" },
    { label: "Hospedaje", value: "hospedaje" },
    { label: "Eventos", value: "eventos" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <main className="flex-1 w-full h-full relative">
        <InteractiveMap categoryFilter={categoryFilter} />
      </main>

      {/* Legend / Quick Links - Absolute Floating */}
      <div className="absolute bottom-6 left-6 right-6 z-[1000] flex gap-2 overflow-x-auto no-scrollbar py-2">
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
