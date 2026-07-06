"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Phone, Map, Bus, Car, Users, ChevronRight, PhoneCall, Search, Smartphone, X } from "lucide-react";
import { useState, useMemo } from "react";

const touristGuides = [
  {
    name: "Laura Pérez Martínez",
    credential: "L003463",
    languages: ["ESPAÑOL"],
    phone: "+52 784-105-8872",
    services: [
      "Recorrido por el Centro Histórico"
    ]
  },
  {
    name: "Nuria García Vargas",
    credential: "L003391",
    languages: ["ESPAÑOL", "INGLÉS"],
    phone: "+52 784-135-1589",
    services: [
      "Recorrido por el Centro Histórico",
      "Recorrido en Ruta de la Vainilla",
      "Recorrido en Ruta del Café Totonaco",
      "Recorrido por la Playa Totonaca",
      "Talleres Artesanales"
    ]
  },
  {
    name: "Fernando Ramírez Jiménez",
    credential: "L002630",
    languages: ["ESPAÑOL"],
    phone: "+52 784-127-1487",
    services: [
      "Recorrido por el Centro Histórico",
      "Recorrido en Ruta de la Vainilla",
      "Recorrido en Ruta del Café Totonaco",
      "Recorrido por la Playa Totonaca",
      "Talleres Artesanales"
    ]
  },
  {
    name: "Larissa Juárez Acosta",
    credential: "L003464",
    languages: ["ESPAÑOL"],
    phone: "+52 784-848-9567",
    services: [
      "Recorrido por el Centro Histórico",
      "Recorrido en Ruta de la Vainilla"
    ]
  },
  {
    name: "Diego Castaño Hernández",
    credential: "L008098",
    languages: ["TUTUNAKÚ", "ESPAÑOL"],
    phone: "+52 784-105-5988",
    services: [
      "Recorrido por la Zona Arqueológica del Tajín",
      "Recorrido por el Centro Histórico",
      "Taller de Danza",
      "Taller de la Lengua Tutunakú"
    ]
  },
  {
    name: "Arqueólogo Juan Ángel García Gonzáles",
    credential: "N00505",
    languages: ["ESPAÑOL", "INGLÉS"],
    phone: "+52 784-105-6474",
    services: [
      "Recorrido por la Zona Arqueológica del Tajín",
      "Recorrido por el Centro Histórico",
      "Expositor en Etnobotánica de la Costa",
      "Ponente en talleres de plantío de Vainilla Planifolia"
    ]
  },
  {
    name: "Lic. Eusebio Castaño Santes",
    credential: "L008098",
    languages: ["TUTUNAKÚ", "ESPAÑOL", "INGLÉS"],
    phone: "+52 784-108-5580",
    services: [
      "Recorrido por la Zona Arqueológica del Tajín",
      "Recorrido por el Centro Histórico",
      "Taller de Danza"
    ]
  },
  {
    name: "Lic. Fernando Cruz Ticante",
    credential: "L00155",
    languages: ["ESPAÑOL"],
    phone: "+52 784-888-2264",
    services: [
      "Recorrido por la Zona Arqueológica del Tajín",
      "Recorrido por el Centro Histórico",
      "Recorrido por vainillales",
      "Recorrido por la Zona Arqueológica de Cuyuxquihui"
    ]
  },
  {
    name: "Lic. Antonio Hernández Monfil",
    credential: "L003464",
    languages: ["INGLÉS"],
    phone: "+52 784-107-9844",
    services: [
      "Recorrido por la Zona Arqueológica del Tajín",
      "Recorrido por el Centro Histórico",
      "Recorrido por vainillales"
    ]
  }
];

const services = [
  {
    category: "Guía Turística",
    items: [
      {
        name: "Guías Certificados de Papantla",
        sub: "Directorio Oficial SECTUR",
        description: "Accede al directorio de guías profesionales acreditados ante la Secretaría de Turismo. Todo el conocimiento ancestral e histórico de forma organizada y segura.",
        type: "guides_directory"
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
  const [showGuidesModal, setShowGuidesModal] = useState(false);
  const [searchGuideQuery, setSearchGuideQuery] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("Todos");

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

  const filteredGuides = useMemo(() => {
    return touristGuides.filter(guide => {
      const matchesSearch = guide.name.toLowerCase().includes(searchGuideQuery.toLowerCase()) ||
                            guide.credential.toLowerCase().includes(searchGuideQuery.toLowerCase()) ||
                            guide.services.some(s => s.toLowerCase().includes(searchGuideQuery.toLowerCase()));
      const matchesLanguage = selectedLanguageFilter === "Todos" ||
                              guide.languages.includes(selectedLanguageFilter.toUpperCase());
      return matchesSearch && matchesLanguage;
    });
  }, [searchGuideQuery, selectedLanguageFilter]);

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen font-outfit">
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
            placeholder="Buscar guías, transporte o atención..."
            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[30px] py-6 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm"
          />
        </div>

        <p className="text-gray-400 font-bold tracking-tight uppercase text-[10px] opacity-60">Atención y calidad para que solo te preocupes de disfrutar</p>
      </header>

      <div className="px-6 flex flex-col gap-10">
        <AnimatePresence>
          {filteredServices.map((section) => (
            <motion.section 
              layout
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight uppercase">{section.category}</h2>
                <span className="text-[9px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/15">Verificados</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item) => {
                  const isGuidesDirectory = item.type === "guides_directory";
                  return (
                    <motion.div
                      key={item.name}
                      className={
                        isGuidesDirectory 
                          ? "relative overflow-hidden bg-gradient-to-br from-primary to-[#721F2C] dark:from-primary dark:to-zinc-950 p-[30px] rounded-[36px] border border-primary/20 flex flex-col gap-6 shadow-2xl text-white group" 
                          : "bg-white dark:bg-white/5 p-6 rounded-[32px] border border-black/5 dark:border-white/10 flex flex-col gap-6 shadow-xl"
                      }
                    >
                      {/* Decorative pattern for the guide directory card */}
                      {isGuidesDirectory && (
                        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 scale-150 rotate-[15deg] pointer-events-none group-hover:scale-[1.65] transition-transform duration-700">
                          <Users className="w-48 h-48 text-white" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${isGuidesDirectory ? 'bg-white/10 border border-white/20' : 'bg-gray-100 dark:bg-white/10'} overflow-hidden relative flex items-center justify-center`}>
                          {isGuidesDirectory ? (
                            <Users className="w-8 h-8 text-secondary animate-pulse" />
                          ) : ('icon' in item && item.icon ? (
                            <div className="w-full h-full flex items-center justify-center text-secondary">
                              <item.icon className="w-8 h-8" />
                            </div>
                          ) : null)}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-black text-lg tracking-tight ${isGuidesDirectory ? 'text-white' : 'text-foreground'}`}>{item.name}</span>
                          <span className={`text-[10px] ${isGuidesDirectory ? 'text-secondary font-black' : 'text-gray-400 font-bold'} uppercase tracking-widest`}>{item.sub}</span>
                        </div>
                      </div>
                      <p className={`text-sm ${isGuidesDirectory ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'} font-semibold leading-relaxed`}>
                        {item.description}
                      </p>
                      
                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          if (isGuidesDirectory) {
                            setShowGuidesModal(true);
                          } else if ("phone" in item && item.phone) {
                            window.location.href = `tel:${item.phone}`;
                          }
                        }}
                        className={`w-full py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all ${
                          isGuidesDirectory 
                            ? "bg-secondary text-white shadow-secondary/15 hover:bg-secondary/90 border border-secondary/10"
                            : "bg-secondary text-white shadow-secondary/20 hover:bg-secondary/90"
                        }`}
                      >
                        {isGuidesDirectory ? (
                          <>
                            <Users className="w-4 h-4" />
                            Ver Directorio de Guías
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4" />
                            Llamar ahora
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </AnimatePresence>
      </div>

      {/* GUIDES DIRECTORY MODAL */}
      <AnimatePresence>
        {showGuidesModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col justify-end"
          >
            {/* Backdrop Dismiss click */}
            <div className="absolute inset-0 -z-10" onClick={() => setShowGuidesModal(false)} />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-h-[85vh] rounded-t-[40px] flex flex-col border-t border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Decorative handle bar */}
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full mx-auto my-4 flex-shrink-0" />
              
              {/* Header */}
              <div className="px-6 pb-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Directorio de Guías</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Credenciales oficiales y autorizadas por SECTUR</p>
                </div>
                <button 
                  onClick={() => setShowGuidesModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-search & Filters */}
              <div className="px-6 pb-4 flex flex-col gap-4 flex-shrink-0 border-b border-black/5 dark:border-white/5">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchGuideQuery}
                    onChange={(e) => setSearchGuideQuery(e.target.value)}
                    placeholder="Buscar por nombre, ruta o credencial..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[24px] py-4 pl-14 pr-10 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner"
                  />
                  {searchGuideQuery && (
                    <button onClick={() => setSearchGuideQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x py-1">
                  {["Todos", "Español", "Inglés", "Tutunakú"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguageFilter(lang)}
                      className={`px-5 py-2.5 rounded-full font-black text-[9px] uppercase tracking-wider whitespace-nowrap transition-all border snap-start ${
                        selectedLanguageFilter === lang 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                          : "bg-gray-50 dark:bg-white/5 text-gray-400 border-black/5 dark:border-white/10 hover:border-primary/20"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guides List (Scrollable) */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar pb-10">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide, i) => {
                    const initials = guide.name.split(" ").filter(n => !n.includes("Lic.") && !n.includes("Arqueólo")).slice(0, 2).map(n => n.charAt(0)).join("");
                    // Let's create key gradients for each guide
                    const gradients = [
                      "from-rose-500 to-orange-500",
                      "from-blue-500 to-indigo-650",
                      "from-emerald-400 to-teal-600",
                      "from-amber-400 to-orange-600",
                      "from-cyan-500 to-blue-600",
                      "from-violet-500 to-fuchsia-600",
                      "from-purple-500 to-indigo-500",
                      "from-green-400 to-emerald-600",
                      "from-orange-400 to-red-500"
                    ];
                    const grad = gradients[i % gradients.length];
                    
                    return (
                      <motion.div
                        key={guide.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[32px] p-5 flex flex-col gap-4 shadow-sm hover:border-primary/25 transition-all"
                      >
                        {/* Profile Header */}
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0`}>
                            {initials || "GT"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="text-[7px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-green-500/20">
                                SECTUR Acreditado
                              </span>
                              <span className="text-[7px] bg-primary/10 text-primary dark:text-primary-dark px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-primary/20">
                                Cred: {guide.credential}
                              </span>
                            </div>
                            <h3 className="font-black text-base tracking-tight text-foreground leading-tight">{guide.name}</h3>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-1.5">
                          {guide.languages.map(lang => {
                            const badgeColors: Record<string, string> = {
                              ESPAÑOL: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                              INGLÉS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                              TUTUNAKÚ: "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            };
                            const color = badgeColors[lang.toUpperCase()] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
                            return (
                              <span key={lang} className={`text-[7.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border ${color}`}>
                                {lang}
                              </span>
                            );
                          })}
                        </div>

                        {/* Services / Routes */}
                        <div className="space-y-1.5">
                          <span className="text-[8px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">Recorridos & Especialidades</span>
                          <ul className="grid grid-cols-1 gap-1.5">
                            {guide.services.map(srv => (
                              <li key={srv} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 font-semibold leading-tight">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                                <span>{srv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Direct Dialer Button */}
                        <motion.a
                          href={`tel:${guide.phone.replace(/[\s\(\)\+-]/g, "")}`}
                          whileTap={{ scale: 0.97 }}
                          className="w-full py-4 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 dark:bg-green-500/5 dark:hover:bg-green-500/15 border border-green-500/20 hover:border-green-500/30 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Llamar al {guide.phone}
                        </motion.a>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Users className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-3" />
                    <p className="font-bold text-gray-400 text-sm">No se encontraron guías con estos criterios</p>
                    <button 
                      onClick={() => { setSearchGuideQuery(""); setSelectedLanguageFilter("Todos"); }}
                      className="mt-3 text-xs text-primary font-black uppercase tracking-wider underline"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
