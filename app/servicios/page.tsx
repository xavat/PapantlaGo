"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Phone, Map, Bus, Car, Users, ChevronRight, PhoneCall, Search, Smartphone } from "lucide-react";
import { useState, useMemo } from "react";

const services = [
  {
    category: "Guía Turística",
    items: [
      {
        name: "Ana Victoria Xochitl",
        sub: "Guía General y Cultural",
        description: "Expertos certificados por SECTUR con conocimiento profundo de la historia Totonaca y arqueología del Tajín",
        image: "https://i.pravatar.cc/150?u=guides",
        type: "guide"
      }
    ]
  },
  {
    category: "Transporte",
    items: [
      {
        name: "Radio Taxi Papantla",
        sub: "Servicio 24 horas",
        description: "Transporte seguro y confiable dentro y fuera de la ciudad",
        icon: PhoneCall,
        type: "taxi",
        phone: "7848420000"
      },
      {
        name: "ADO Autobuses",
        sub: "Viajes Foráneos",
        description: "Conexiones principales a Poza Rica Veracruz y Ciudad de México",
        icon: Bus,
        type: "bus"
      }
    ]
  }
];

export default function ServiciosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransport, setShowTransport] = useState(true);

  const filteredServices = useMemo(() => {
    if (!searchQuery) return services;
    return services.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen">
      <header className="px-6 pt-32 pb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-lg shadow-secondary/5">
            <Briefcase className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">Servicios</h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar guías transporte o atención..."
            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[30px] py-6 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm"
          />
        </div>

        <p className="text-gray-400 font-bold tracking-tight uppercase text-[10px] opacity-60">Atención y calidad para que solo te preocupes de disfrutar</p>
      </header>

      <div className="px-6 flex flex-col gap-10">
        <AnimatePresence>
          {filteredServices.map((section, idx) => (
            <motion.section 
              layout
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black tracking-tight uppercase">{section.category}</h2>
                 <span className="text-[9px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">Verificados</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-black/5 dark:border-white/10 flex flex-col gap-6 shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 overflow-hidden relative">
                        {'image' in item && item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary">
                            {'icon' in item && item.icon && <item.icon className="w-8 h-8" />}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tight">{item.name}</span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.sub}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                      {item.description}
                    </p>
                    <motion.button 
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Contactar ahora
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
