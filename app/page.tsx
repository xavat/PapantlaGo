"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowDown, Landmark, Search, X, Compass, Palette, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { tourismData } from "@/data/tourism";
import { fuzzyMatch } from "@/utils/search";

const homeItems = [
  {
    title: "Zona Arqueológica del Tajín",
    subtitle: "Ciudad Trueno",
    desc: "Capital del imperio Totonaca famosa por su Pirámide de los Nichos",
    img: "/tajin.jpg",
    id: "tajin"
  },
  {
    title: "Centro Histórico de Papantla",
    subtitle: "Corazón del Pueblo",
    desc: "Arquitectura vernácula y el aroma de la vainilla en cada esquina",
    img: "/centro.jpg",
    id: "centro-historico"
  },
  {
    title: "Mural de la Cultura Totonaca",
    subtitle: "Historia en Piedra",
    desc: "La cosmogonía de un pueblo grabada para la eternidad",
    img: "/mural.jpg",
    id: "mural-totonaca"
  },
  {
    title: "Monumento al Volador",
    subtitle: "Símbolo de Papantla",
    desc: "Homenaje al ritual ancestral que desafía las alturas",
    img: "/volador.jpg",
    id: "monumento-volador"
  },
];

const cultureImages = [
  "https://images.unsplash.com/photo-1626081498877-c93d8e57eeff?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const imgBPath = "/hero-b-background.jpg";

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    return tourismData.filter(item => 
      fuzzyMatch(searchQuery, item.title) ||
      fuzzyMatch(searchQuery, item.subtitle) ||
      fuzzyMatch(searchQuery, item.tag) ||
      fuzzyMatch(searchQuery, item.description)
    ).slice(0, 5);
  }, [searchQuery]);

  return (
    <div className="flex flex-col bg-white dark:bg-black transition-colors duration-500 overflow-x-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center text-center">
         <div className="absolute inset-0 z-0">
            <Image 
               src={imgBPath} 
               alt="Papantla Hero" 
               fill
               className="w-full h-full object-cover"
               priority
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
         </div>

         <div className="relative z-10 flex flex-col items-center px-6">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1 }}
               className="flex flex-col items-center"
            >
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-[1px] w-8 bg-white/40" />
                  <span className="text-white text-[10px] font-black tracking-[0.5em] uppercase">México</span>
                  <div className="h-[1px] w-8 bg-white/40" />
               </div>

               <h1 className="text-6xl md:text-8xl lg:text-[12rem] font-black text-white leading-[0.8] tracking-tighter uppercase">
                  PAPANTLA
               </h1>

               <div className="flex items-center gap-4 mt-8">
                  <div className="w-2 h-2 bg-primary rotate-45" />
                  <span className="text-white text-md md:text-2xl font-black uppercase tracking-widest drop-shadow-2xl">
                     LA CIUDAD QUE PERFUMA
                  </span>
                  <div className="w-2 h-2 bg-primary rotate-45" />
               </div>

               <Link href="#explore" scroll={true}>
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-16 px-12 py-4 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-white/20"
                    >
                    Explorar Más
                    </motion.button>
               </Link>
            </motion.div>
         </div>

         <div className="absolute bottom-10 animate-bounce opacity-40">
            <ArrowDown className="text-white w-6 h-6" />
         </div>
      </section>

      {/* SECTION 2: EXPLORAR MÁS */}
      <section id="explore" className="py-24 px-6 bg-gray-50 dark:bg-[#050505]">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
             
             {/* GLOBAL SEARCH BANNER */}
             <div className="relative w-full max-w-3xl mx-auto mb-8 z-[50]">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center">
                      <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearching(true)}
                      placeholder="Buscar y Explorar"
                      className="w-full py-6 pl-16 pr-14 bg-white dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[30px] font-bold text-foreground text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-xl"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-primary">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {searchQuery && isSearching && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl rounded-[32px] border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden p-2 z-[60]"
                    >
                      {searchResults.length > 0 ? (
                        <div className="flex flex-col">
                          {searchResults.map((item) => (
                            <Link 
                              key={item.id} 
                              href={`/${item.category}/${item.id}`}
                              className="flex items-center gap-4 p-4 hover:bg-primary/10 rounded-[24px] transition-colors group"
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                              </div>
                              <div className="flex flex-col flex-1 overflow-hidden text-left">
                                <span className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors truncate">{item.title}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{item.subtitle}</span>
                              </div>
                              <div className="bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg">
                                {item.category}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center gap-4">
                          <Search className="w-8 h-8 text-gray-400" />
                          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Sin resultados</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* MAIN CONTENT ITEMS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {homeItems.map((item, i) => (
                    <motion.div
                       key={item.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       whileInView={{ opacity: 1, scale: 1 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                       className="group relative h-[500px] rounded-[50px] overflow-hidden shadow-2xl"
                    >
                        <Image 
                           src={item.img} 
                           alt={item.title} 
                           fill 
                           className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                        <div className="absolute bottom-12 left-10 right-10 text-left">
                           <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-4 block">
                              {item.subtitle}
                           </span>
                           <h3 className="text-4xl font-black text-white leading-none tracking-tight mb-4 uppercase">
                              {item.title}
                           </h3>
                           <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              {item.desc}
                           </p>
                           <Link href={`/destinos/${item.id}`}>
                            <button className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-md px-6 py-3 rounded-full hover:bg-primary transition-all">
                                Ver Detalle <ChevronRight className="w-4 h-4" />
                            </button>
                           </Link>
                        </div>
                    </motion.div>
                ))}
             </div>
          </div>
      </section>

      {/* SECTION 3: HISTORIA Y CULTURA (Collage carousel at the bottom) */}
      <section className="py-24 px-6 bg-white dark:bg-black">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-12 text-center">
             <div className="flex flex-col items-center gap-4">
                <Landmark className="text-primary w-10 h-10" />
                <h3 className="text-5xl md:text-6xl font-black tracking-tight text-black dark:text-white uppercase">
                    Historia & <span className="text-primary">Cultura</span>
                </h3>
             </div>
             
             <div className="relative w-full overflow-hidden py-10">
                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x px-6 -mx-6">
                  {cultureImages.map((img, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="min-w-[320px] aspect-[4/5] rounded-[40px] overflow-hidden relative shadow-2xl snap-center"
                    >
                      <Image src={img} alt="Cultura" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                         <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <Camera className="w-5 h-5" />
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
             </div>

             <div className="max-w-2xl mx-auto flex flex-col gap-8 mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-relaxed">
                   Papantla es un crisol de tradiciones milenarias Descubre el legado Totonaca y el arte que nace de la tierra
                </p>
                <Link href="/destinos/mural-a-la-cultura-totonaca">
                  <button className="px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-2xl">
                     Saber más de nuestra cultura
                  </button>
                </Link>
             </div>
          </div>
      </section>
    </div>
  );
}
