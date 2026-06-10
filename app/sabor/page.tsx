"use client";

import { Suspense, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import IOSCard from "@/components/IOSCard";
import { 
  Utensils, 
  MapPin, 
  ChevronRight, 
  Pizza, 
  ChefHat, 
  Phone, 
  ArrowLeft,
  Flame,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fuzzyMatch } from "@/utils/search";

const traditionalMenu = [
  { title: "Zacahuil", sub: "Rey de los tamales", img: "/images/sabores/zacahuil.jpg" },
  { title: "Mole Papanteco", sub: "Sabor ancestral", img: "/images/sabores/mole.jpg" },
  { title: "Bocoles", sub: "Maíz y Tradición", img: "/images/sabores/bocoles.jpg" },
  { title: "Beso Papanteco", sub: "Dulce herencia", img: "/images/sabores/beso.jpg" },
  { title: "Atole Morado", sub: "Bebida sagrada", img: "/images/sabores/atole.jpg" },
];

const traditionalRestaurants = [
  {
    name: "Restaurante Nakú",
    address: "Heroico Colegio Militar s/n-s/n, Manantiales, 93400 Papantla de Olarte, Ver.",
    phone: "784 842 3112",
    mapUrl: "https://maps.app.goo.gl/1B8GdK4MsHbvT99B6",
    image: "/images/sabores/naku/1.jpg"
  },
  {
    name: "La Boca",
    address: "Aquiles Serdán 700, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    phone: "784 842 5756",
    mapUrl: "https://maps.app.goo.gl/p8kS9FGC1SPZArc87",
    image: "/images/sabores/laboca/1.jpg"
  },
  {
    name: "Restaurante la Parroquia de Papantla",
    address: "Cjon 16 de Septiembre 114, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.",
    phone: "784 888 5904",
    mapUrl: "https://maps.app.goo.gl/R3Nd1hT6jdGC3jG98",
    image: "/images/sabores/parroquia/1.jpg"
  },
  {
    name: "Al Son del Chapala",
    address: "Reforma #100 altos, Centro, 93400 Papantla, Ver.",
    phone: "784 842 3517",
    mapUrl: "https://maps.app.goo.gl/xP2cWBsnHaMQjGpAA",
    image: "/images/sabores/chapala/1.jpg"
  },
  {
    name: "Plaza Pardo",
    address: "Juan Enríquez 105, Centro, 93449 Papantla de Olarte, Ver.",
    phone: "784 842 0059",
    mapUrl: "https://maps.app.goo.gl/s1WTaBJCYQrvkhHr9",
    image: "/images/sabores/plazapardo/1.jpg"
  },
  {
    name: "Restaurante Humo",
    address: "93400, Cjon 16 de Septiembre 104, Santa Cruz, 93400 Papantla, Ver.",
    phone: "784 842 0400",
    mapUrl: "https://maps.app.goo.gl/o3nV7Vq5trXB2jsC9",
    image: "/images/sabores/humo/1.jpg"
  },
  {
    name: "Restaurante Totonaco",
    address: "José de Jesús, Lázaro Muñoz 104, El Naranjo, 93400 Papantla de Olarte, Ver.",
    phone: "784 112 2581",
    mapUrl: "https://maps.app.goo.gl/v1k7ytRULDZcV88XA",
    image: "/images/sabores/totonaco/1.jpg"
  },
  {
    name: "Don Pope Restaurante",
    address: "Francisco I Madero 206, Barrio del San Juan, 93449 Papantla, Ver.",
    phone: "784 213 5289",
    mapUrl: "https://maps.app.goo.gl/fgVBoLuKatkTSvBf7",
    image: "/images/sabores/donpope/1.jpg"
  },
  {
    name: "Restaurante Papantla Kachikin",
    address: "Chote - Papantla, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    phone: "784 133 5190",
    mapUrl: "https://maps.app.goo.gl/SwYGng9L6wLUYb3JA",
    image: "/images/sabores/kachikin/1.jpg"
  },
  {
    name: "Centro Turístico Saberes Ancestrales de la Vainilla",
    address: "Revolución 116, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    phone: "784 115 0077",
    mapUrl: "https://maps.app.goo.gl/ikLEed7rgApJyF6M7",
    image: "/images/sabores/vainilla/1.jpg"
  },
];

const foodBusinesses = [
  { name: "Café Catedral", address: "Curato s/n, Barrio del Naranjo, 93400 Poza Rica de Hidalgo, Ver.", phone: "784 842 5317", mapUrl: "https://maps.app.goo.gl/Xk78Zq2sGodrBbMz8", categories: ["Cafetería"], image: "/images/sabores/cafecatedral/1.jpg" },
  { name: "La choza de Lucy", address: "Cjon 16 de Septiembre centro 829, Barrio del Zapote, 93400 Papantla de Olarte, Ver.", phone: "784 842 4980", mapUrl: "https://maps.app.goo.gl/ZH4ME7xq2ynUotJc8", categories: ["Mariscos"], image: "/images/sabores/chozalucy/1.jpg" },
  { name: "Zacahuil \"Perla\"", address: "Cjon 16 de Septiembre 907, Barrio del Zapote, 93400 Papantla de Olarte, Ver.", phone: "784 134 6603", mapUrl: "https://maps.app.goo.gl/sZgU1sqJPnqZMnqW9", categories: ["Comida Típica"], image: "/images/sabores/zacahuilperla/1.jpg" },
  { name: "SUSHI & DRINKS MR. ROLLO", address: "C. José de J. Núñez 18, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.", phone: "", mapUrl: "https://maps.app.goo.gl/dhzD1EHxZC44JK9b8", categories: ["Sushi y Comida Asiática", "Bebidas y coctelería", "Snacks"], image: "/images/sabores/mrrollo/1.jpg" },
  { name: "Pizzas y Volovanes El Uli Sucursal Centro", address: "C. José de J. Núñez s/n, Centro, 93400 Papantla, Ver.", phone: "7848420064", mapUrl: "https://maps.app.goo.gl/p8kS9FGC1SPZArc87", categories: ["Pizzería", "Hamburguesas y Tortas"], image: "/images/sabores/pizzasuli/1.jpg" },
  { name: "Idea Pizza", address: "Cjon 16 de Septiembre 101, Centro, 93400 Papantla de Olarte, Ver.", phone: "7848422083", mapUrl: "https://maps.app.goo.gl/Xk78Zq2sGodrBbMz8", categories: ["Pizzería"], image: "/images/sabores/ideapizza/1.jpg" },
  { name: "Las Canastas", address: "José Azueta 105, Barrio del San Juan, 93400 Papantla de Olarte, Ver.", phone: "784 144 2168", mapUrl: "https://maps.app.goo.gl/t9JHDca26PVxULpH8", categories: ["Comida Típica"], image: "/images/sabores/canastas/1.jpg" },
  { name: "Mexicanísimas", address: "Juan Enríquez 213, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.", phone: "784 114 0955", mapUrl: "https://maps.app.goo.gl/SbMdHBw4hghZmcNQ9", categories: ["Comida Típica"], image: "/images/sabores/mexicanisimas/1.jpg" },
  { name: "Café Del Centro", address: "Artes 108, Barrio del San Juan, 93400 Papantla, Ver.", phone: "784 842 1163", mapUrl: "https://maps.app.goo.gl/mcuXHDvVN4Vymr4Z8", categories: ["Cafetería", "Snacks", "Hamburguesas y Tortas"], image: "/images/sabores/cafecentro/1.jpg" },
  { name: "Me Perdonas ️", address: "C. Rodolfo Curti 118, Santa Cruz, 93400 Papantla de Olarte, Ver.", phone: "784 121 8557", mapUrl: "https://maps.app.goo.gl/BURRJANMVhE74zd6A", categories: ["Cafetería", "Snacks", "Helados y Postres"], image: "/images/sabores/meperdonas/1.jpg" },
  { name: "Clandestino", address: "C. Andrés Q.R. 201, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.", phone: "784 849 9423", mapUrl: "https://maps.app.goo.gl/BF1V2jTwzacvyUx39", categories: ["Hamburguesas y Tortas", "Snacks"], image: "/images/sabores/clandestino/1.jpg" },
  { name: "La Jarochita", address: "Leandro Valle s/n, Centro, 93449 Papantla de Olarte, Ver.", phone: "784 134 4357", mapUrl: "https://maps.app.goo.gl/wvJmUfWwtEweX3tr7", categories: ["Mariscos", "Bebidas y coctelería", "Bares y Cantinas"], image: "/images/sabores/jarochita/1.jpg" },
  { name: "Tacos Rojos", address: "Barrio del San Juan, 93449 Papantla de Olarte, Ver.", phone: "", mapUrl: "https://maps.app.goo.gl/UzQLrQURAViDvh1A7", categories: ["Taquería"], image: "/images/sabores/tacosrojos/1.jpg" },
  { name: "Taqueria Pozo del Zanjon", address: "C. Josefa Ortiz de Domínguez 101, Barrio del Zapote, 93400 Papantla de Olarte, Ver.", phone: "", mapUrl: "https://maps.app.goo.gl/f2HKzufattpntCSs6", categories: ["Taquería"], image: "/images/sabores/pozozanjon/1.jpg" },
  { name: "Taqueria EL TIZON", address: "Veracruz - Poza Rica 505, Barrio del San Juan, 93400 Papantla de Olarte, Ver.", phone: "", mapUrl: "https://maps.app.goo.gl/APH3EuA9Jw1vuwgv7", categories: ["Taquería"], image: "/images/sabores/eltizon/1.jpg" },
  { name: "Super Taquería \"El Gordo\"", address: "calle Francisco I. Madero FRENTE A WALDOS, Barrio del San Juan, 93400 Papantla, Ver.", phone: "784 108 7880", mapUrl: "https://maps.app.goo.gl/2jPkouqjDNF1C6mq6", categories: ["Taquería"], image: "/images/sabores/elgordo/1.jpg" },
  { name: "Taquería Serpet", address: "93400, Barrio del San Juan, 93400 Papantla, Ver.", phone: "", mapUrl: "https://maps.app.goo.gl/xvArA9h59CsAor6i9", categories: ["Taquería"], image: "/images/sabores/serpet/1.jpg" },
  { name: "Antojitos Doña Carmen", address: "De La Libertad 308, Barrio del Zapote, 93440 Papantla de Olarte, Ver.", phone: "784 688 1200", mapUrl: "https://maps.app.goo.gl/TdZfzCBfTW5W344M7", categories: ["Antojitos"], image: "/images/sabores/donacarmen/1.jpg" },
  { name: "Las tortugas", address: "C. José de J. Núñez Col, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.", phone: "784 121 4753", mapUrl: "https://maps.app.goo.gl/z3rgAuksDregf8Z28", categories: ["Hamburguesas y Tortas"], image: "/images/sabores/tortugas/1.jpg" },
];

const categories = [
  "Todos",
  "Comida Típica",
  "Antojitos",
  "Cafetería",
  "Sushi y Comida Asiática",
  "Taquería",
  "Pizzería",
  "Hamburguesas y Tortas",
  "Mariscos",
  "Snacks",
  "Helados y Postres",
  "Bebidas y coctelería",
  "Bares y Cantinas",
];

function SaborContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeSection = (searchParams.get("section") as "menu" | "sabores" | "alimentos") || "menu";
  const selectedCategory = searchParams.get("category") || "Todos";
  const [searchQuery, setSearchQuery] = useState("");

  const setSection = (section: string) => {
    if (typeof window !== "undefined") window.scrollTo(0, 0);
    const params = new URLSearchParams(searchParams.toString());
    if (section === "menu") {
      params.delete("section");
    } else {
      params.set("section", section);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const filteredTraditional = useMemo(() => {
    return traditionalRestaurants.filter(resto => 
      fuzzyMatch(searchQuery, resto.name) ||
      fuzzyMatch(searchQuery, resto.address)
    );
  }, [searchQuery]);

  const filteredBusinesses = useMemo(() => {
    return foodBusinesses.filter(biz => {
      const matchesCategory = selectedCategory === "Todos" || biz.categories.includes(selectedCategory);
      const matchesSearch = fuzzyMatch(searchQuery, biz.name) || 
                           fuzzyMatch(searchQuery, biz.address);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openMap = (url: string) => {
    window.open(url, "_blank");
  };

  const callNumber = (phone: string) => {
    if (!phone) return;
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen font-outfit">
      <AnimatePresence mode="wait">
        {activeSection === "menu" ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <header className="px-6 pt-32 pb-10 flex flex-col gap-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner backdrop-blur-xl">
                  <Utensils className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-foreground mt-2 uppercase">Gastronomía</h1>
              </div>
              <p className="text-gray-400 font-medium tracking-tight max-w-xs mx-auto text-[11px] leading-tight uppercase opacity-70">
                Sabores ancestrales y el perfume de la vainilla en cada rincón de Papantla
              </p>
            </header>

            <section className="px-6 flex flex-col gap-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                <Flame className="w-4 h-4 text-orange-500" />
                Platillos Tradicionales
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
                {traditionalMenu.map((dish, i) => (
                  <div key={i} className="min-w-[240px] snap-start">
                    <IOSCard title={dish.title} subtitle={dish.sub} imageUrl={dish.img} />
                  </div>
                ))}
              </div>
            </section>

            <section className="px-6 mt-10 grid grid-cols-1 gap-5">
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setSection("sabores")}
                className="relative overflow-hidden group bg-primary/10 dark:bg-primary/20 backdrop-blur-[40px] border border-primary/20 p-8 rounded-[40px] flex items-center gap-6 shadow-2xl shadow-primary/10 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <ChefHat className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-foreground font-black text-xl tracking-tight uppercase">Sabores Papantecos</span>
                  <span className="text-primary text-[10px] uppercase font-black tracking-[0.2em] mt-1">Restaurantes de Tradición</span>
                </div>
                <ChevronRight className="ml-auto text-primary group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setSection("alimentos")}
                className="relative overflow-hidden group bg-white/5 dark:bg-white/5 backdrop-blur-[40px] border border-white/20 p-8 rounded-[40px] flex items-center gap-6 shadow-xl text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary shadow-inner">
                  <Pizza className="w-7 h-7" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-black text-xl tracking-tight uppercase">Alimentos y bebidas</span>
                  <span className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mt-1">Directorio de Negocios</span>
                </div>
                <ChevronRight className="ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </section>
          </motion.div>
        ) : activeSection === "sabores" ? (
          <motion.div
            key="sabores"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <header className="pt-32 pb-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSection("menu"); setSearchQuery(""); }}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar restaurante"
                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[24px] py-4 pl-14 pr-12 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Sabores Papantecos</h1>
                <p className="text-gray-400 font-bold tracking-tight text-[11px] uppercase opacity-60">Especialidades locales que preservan el legado Totonaca</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
              <AnimatePresence>
                {filteredTraditional.map((resto, i) => (
                  <motion.div 
                    layout
                    key={resto.name} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-lg group hover:border-primary/30 transition-all"
                  >
                    <Link href={`/sabor/${resto.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image 
                          src={resto.image} 
                          alt={resto.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5">
                          <h3 className="font-black text-xl tracking-tight text-white mb-1 group-hover:text-primary transition-colors uppercase">{resto.name}</h3>
                          <div className="flex items-start gap-1.5 text-white/70 text-[10px]">
                            <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1 leading-relaxed font-bold">{resto.address}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 flex gap-2">
                      <button 
                        onClick={() => openMap(resto.mapUrl)}
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-primary/20"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Ubicación
                      </button>
                      <button 
                        onClick={() => callNumber(resto.phone)}
                        className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-green-500/20"
                      >
                        <Phone className="w-3.5 h-3.5" /> Llamar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="alimentos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <header className="pt-32 pb-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { setSection("menu"); setSearchQuery(""); }}
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative flex-1 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar negocio"
                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[24px] py-4 pl-14 pr-12 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Alimentos y Bebidas</h1>
                <p className="text-gray-400 font-bold tracking-tight text-[11px] uppercase opacity-60">Directorio completo de delicias gastronómicas</p>
              </div>
            </header>

            {/* CATEGORIES SCROLL */}
            <div className="flex gap-2 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar snap-x">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest whitespace-nowrap transition-all snap-start border ${
                    selectedCategory === cat 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105 border-primary" 
                      : "bg-white/5 backdrop-blur-md text-gray-400 border-black/5 dark:border-white/10 hover:border-primary/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
              <AnimatePresence>
                {filteredBusinesses.map((biz, i) => (
                  <motion.div 
                    layout
                    key={biz.name} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[32px] flex flex-col overflow-hidden shadow-lg group hover:border-primary/30 transition-all font-bold"
                  >
                    <Link href={`/sabor/${biz.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image 
                          src={biz.image} 
                          alt={biz.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-4 flex flex-wrap gap-1.5">
                          {biz.categories.map(c => (
                            <span key={c} className="text-[7px] uppercase font-black tracking-widest text-white bg-primary px-2 py-0.5 rounded-lg backdrop-blur-md bg-opacity-80">
                              {c}
                            </span>
                          ))}
                        </div>
                        <div className="absolute bottom-4 left-5 right-5">
                          <h3 className="font-black text-xl tracking-tight text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors uppercase">{biz.name}</h3>
                          <div className="flex items-start gap-1.5 text-white/70 text-[9px] font-bold">
                            <MapPin className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{biz.address}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 flex gap-2">
                      <button 
                        onClick={() => openMap(biz.mapUrl)}
                        className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-primary/20"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Ubicación
                      </button>
                      {biz.phone && (
                        <button 
                          onClick={() => callNumber(biz.phone)}
                          className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-600 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border border-green-500/20"
                        >
                          <Phone className="w-3.5 h-3.5" /> Llamar
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SaborPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SaborContent />
    </Suspense>
  );
}
