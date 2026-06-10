"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Compass, Star, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { fuzzyMatch } from "@/utils/search";

const destinations = [
  {
    title: "Zona Arqueológica El Tajín",
    subtitle: "Patrimonio Mundial UNESCO",
    imageUrl: "/destinos/tajin.jpg",
    rating: 4.9,
    tag: "Historia",
  },
  {
    title: "Centro Histórico",
    subtitle: "Pueblo Mágico de Papantla",
    imageUrl: "/destinos/centro.jpg",
    rating: 4.8,
    tag: "Cultura",
  },
  {
    title: "Mural de la Cultura Totonaca",
    subtitle: "Obra de Teodoro Cano",
    imageUrl: "/destinos/mural.jpg",
    rating: 4.7,
    tag: "Arte",
  },
  {
    title: "Monumento al Volador",
    subtitle: "Vista Panorámica",
    imageUrl: "/destinos/volador.jpg",
    rating: 4.9,
    tag: "Mirador",
  },
  {
    title: "Zona Arqueológica Coyuxquihui",
    subtitle: "Legado Totonaca",
    imageUrl: "/destinos/coyuxquihui.jpg",
    rating: 4.6,
    tag: "Aventura",
  },
  {
    title: "La Bocana",
    subtitle: "Unión de Río y Mar",
    imageUrl: "/destinos/bocana.jpg",
    rating: 4.7,
    tag: "Naturaleza",
  },
  {
    title: "Rancho Playa",
    subtitle: "Costa Esmeralda",
    imageUrl: "/destinos/rancho-playa.jpg",
    rating: 4.8,
    tag: "Playa",
  },
];

export default function DestinosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) =>
      fuzzyMatch(searchQuery, dest.title) ||
      fuzzyMatch(searchQuery, dest.subtitle) ||
      fuzzyMatch(searchQuery, dest.tag)
    );
  }, [searchQuery]);

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen">
      <header className="px-8 pt-32 pb-12 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Explorar</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-none">
                Destinos
            </h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Encuentra tu próximo destino..."
            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[30px] py-6 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      <div className="px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
        <AnimatePresence>
          {filteredDestinations.map((dest, i) => (
            <Link 
              key={dest.title} 
              href={`/destinos/${dest.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[40px] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl transition-all duration-500 hover:border-primary/30 h-full"
              >
               {/* Image container */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                     src={dest.imageUrl} 
                     alt={dest.title} 
                     fill
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-3 mb-3">
                          <div className="bg-primary px-3 py-1 rounded-xl text-white text-[8px] font-black uppercase tracking-widest shadow-xl">
                              {dest.tag}
                          </div>
                          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-2 text-white border border-white/10">
                              <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />
                              <span className="text-[10px] font-black">{dest.rating}</span>
                          </div>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tighter leading-tight mb-1">
                         {dest.title}
                      </h3>
                      <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{dest.subtitle}</p>
                  </div>

                  <div className="absolute top-6 right-6">
                     <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all rotate-[-45deg] group-hover:rotate-0">
                        <ChevronRight className="w-5 h-5" />
                     </div>
                  </div>
               </div>
            </motion.div>
            </Link>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
