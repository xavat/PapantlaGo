"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { Briefcase, Phone, Map, Bus, Car, Users, ChevronRight, PhoneCall, Search, Smartphone, X, MapPin, Globe, AlertTriangle } from "lucide-react";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const taxiDirectoryList = [
  {
    name: "Taxi Voladores",
    phone: "7841226672",
    whatsapp: "7841226672",
    description: "Servicio de taxi local y foráneo disponible para traslados rápidos y seguros."
  },
  {
    name: "Radio Taxi Express Papantla",
    phone: "7841046824",
    whatsapp: "7841046824",
    description: "Servicio de radio taxi expreso. Atención rápida en toda la cabecera municipal."
  },
  {
    name: "Radio Taxi Papantla",
    phone: "7841046824",
    whatsapp: "7841046824",
    description: "Servicio tradicional de radio taxi. Viajes locales y al aeropuerto."
  }
];

const emergencyList = [
  {
    name: "Protección Civil Papantla",
    phone: "7848420175",
    whatsapp: "7841368797",
    description: "Rescate, primeros auxilios, prevención de incendios y atención prioritaria en contingencias públicas."
  },
  {
    name: "Policía Municipal",
    phone: "7848420075",
    whatsapp: "",
    description: "Resguardo del orden, auxilio vecinal, prevención del delito e intervenciones de seguridad ciudadana."
  },
  {
    name: "Tránsito Municipal",
    phone: "7848420039",
    whatsapp: "",
    description: "Asistencia vial de tránsito terrestre, asesorías ante percances viales y ordenamiento de vialidades."
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
        name: "Directorio de Taxis",
        sub: "Llamada y WhatsApp",
        description: "Encuentra taxis oficiales disponibles las 24 horas. Comunícate mediante llamada telefónica o directamente por chat de WhatsApp.",
        type: "taxi_directory"
      },
      {
        name: "Directorio de Autobuses",
        sub: "ADO Terminal Papantla",
        description: "Información de contacto, ubicación en mapa y reservas en línea para la Terminal de Autobuses ADO en Papantla.",
        type: "bus_directory"
      }
    ]
  },
  {
    category: "Asistencia y Emergencia",
    items: [
      {
        name: "Líneas de Emergencia",
        sub: "Ayuda y auxilio inmediato",
        description: "Directorio telefónico y de mensajería con servicios públicos de auxilio como Protección Civil, Policía y Tránsito.",
        type: "emergency_directory"
      }
    ]
  }
];

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.449 5.424 0 9.838-4.417 9.84-9.84.002-2.628-1.02-5.1-2.88-6.961C16.326 1.94 13.848.916 11.23.916 5.804.916 1.392 5.332 1.39 10.755c-.001 1.547.41 3.055 1.193 4.405l-.1.364-1.25 4.57 4.675-1.226.376-.086zm10.963-3.589c-.27-.136-1.6-.79-1.848-.879-.249-.09-.43-.136-.61.136-.18.27-.7.879-.857 1.059-.158.18-.315.2-.585.065-.27-.136-1.136-.42-2.162-1.337-.798-.713-1.336-1.594-1.493-1.864-.157-.27-.017-.417.118-.552.122-.122.27-.315.405-.473.136-.157.18-.27.27-.45.09-.18.045-.337-.022-.473-.068-.136-.61-1.47-.836-2.013-.22-.529-.44-.457-.61-.466-.158-.007-.338-.009-.519-.009-.18 0-.473.067-.72.337-.248.27-.946.924-.946 2.25 0 1.328.969 2.61 1.103 2.79.136.18 1.906 2.91 4.62 4.08.647.278 1.152.445 1.547.57.65.207 1.24.177 1.706.108.519-.078 1.602-.656 1.828-1.26.226-.604.226-1.125.158-1.23-.068-.106-.248-.198-.519-.334z" />
  </svg>
);

function ServiciosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchGuideQuery, setSearchGuideQuery] = useState("");
  const [searchTaxiQuery, setSearchTaxiQuery] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState("Todos");

  // Dynamic Modals State synced with Query Param
  const showGuidesModal = modalParam === "guides";
  const showTaxiModal = modalParam === "taxi";
  const showBusModal = modalParam === "bus";
  const showEmergencyModal = modalParam === "emergency";

  const isAnyModalOpen = showGuidesModal || showTaxiModal || showBusModal || showEmergencyModal;

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add("gallery-open");
    } else {
      document.body.classList.remove("gallery-open");
    }
    return () => {
      document.body.classList.remove("gallery-open");
    };
  }, [isAnyModalOpen]);

  const openModal = (type: "guides" | "taxi" | "bus" | "emergency") => {
    router.push(`/servicios?modal=${type}`);
  };

  const closeModal = () => {
    router.push("/servicios");
  };

  const dragControls = useDragControls();

  const openWhatsApp = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("52") ? cleanPhone : `52${cleanPhone}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, "_blank");
  };

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

  const directSearchResults = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    
    const matchedGuides = touristGuides.filter(g => 
      g.name.toLowerCase().includes(query) ||
      g.credential.toLowerCase().includes(query) ||
      g.services.some(s => s.toLowerCase().includes(query)) ||
      g.languages.some(l => l.toLowerCase().includes(query))
    );

    const matchedTaxis = taxiDirectoryList.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.phone.includes(query) ||
      (t.description && t.description.toLowerCase().includes(query))
    );

    const matchedEmergencies = emergencyList.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.phone.includes(query) ||
      (e.description && e.description.toLowerCase().includes(query))
    );

    return {
      guides: matchedGuides,
      taxis: matchedTaxis,
      emergencies: matchedEmergencies,
      hasResults: matchedGuides.length > 0 || matchedTaxis.length > 0 || matchedEmergencies.length > 0
    };
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

  const filteredTaxis = useMemo(() => {
    if (!searchTaxiQuery) return taxiDirectoryList;
    return taxiDirectoryList.filter(taxi =>
      taxi.name.toLowerCase().includes(searchTaxiQuery.toLowerCase()) ||
      taxi.phone.replace(/[^0-9]/g, "").includes(searchTaxiQuery.replace(/[^0-9]/g, ""))
    );
  }, [searchTaxiQuery]);

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen font-outfit">
      <header className="px-6 pt-32 pb-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-lg shadow-secondary/5 font-bold">
            <Briefcase className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase animate-fade-in">Servicios</h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar guías, transporte o emergencias..."
            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[30px] py-6 pl-16 pr-8 text-sm font-bold focus:ring-4 focus:ring-secondary/10 outline-none transition-all shadow-sm"
          />
        </div>

        <p className="text-gray-400 font-bold tracking-tight uppercase text-[10px] opacity-60">Atención y calidad para que solo te preocupes de disfrutar</p>
      </header>

      <div className="px-6 flex flex-col gap-10">
        {/* Direct Search Results for Servicios */}
        {searchQuery && directSearchResults && (
          <div className="flex flex-col gap-6 animate-fade-in relative z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight uppercase text-secondary">Resultados de Búsqueda ({directSearchResults.guides.length + directSearchResults.taxis.length + directSearchResults.emergencies.length})</h2>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs font-black uppercase text-gray-400 tracking-wider hover:text-foreground"
              >
                Limpiar
              </button>
            </div>

            {directSearchResults.hasResults ? (
              <div className="flex flex-col gap-4">
                {/* Matched Emergencies */}
                {directSearchResults.emergencies.map(e => (
                  <div key={e.name} className="bg-gradient-to-br from-rose-800 to-red-950 p-6 rounded-[32px] border border-red-500/20 text-white flex flex-col gap-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-white text-md uppercase">{e.name}</h4>
                        <p className="text-[10px] text-red-200 mt-1">{e.description}</p>
                      </div>
                      <div className="text-red-300 font-extrabold text-sm">{e.phone}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={`tel:${e.phone}`}
                        className="py-3 bg-red-650 hover:bg-red-700 text-white text-[10px] font-black text-center uppercase tracking-wider rounded-xl transition-all"
                      >
                        Llamar
                      </a>
                      {e.whatsapp ? (
                        <button 
                          onClick={() => openWhatsApp(e.whatsapp, "Necesito asistencia de emergencia")}
                          className="py-3 bg-green-500 hover:bg-green-600 text-white text-[10px] font-black text-center uppercase tracking-wider rounded-xl transition-all"
                        >
                          WhatsApp
                        </button>
                      ) : (
                        <div className="bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-white/40 text-[9px] uppercase font-black">
                          No WhatsApp
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Matched Guides */}
                {directSearchResults.guides.map(g => (
                  <div 
                    key={g.name} 
                    onClick={() => {
                      setSearchGuideQuery(g.name);
                      openModal("guides");
                    }}
                    className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-black/5 dark:border-white/10 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-[8px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase mb-1.5 inline-block">Guía Turístico</span>
                      <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors text-sm uppercase truncate">{g.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{g.services[0]} - Idioma: {g.languages.join(", ")}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))}

                {/* Matched Taxis */}
                {directSearchResults.taxis.map(t => (
                  <div 
                    key={t.name}
                    onClick={() => {
                      setSearchTaxiQuery(t.name);
                      openModal("taxi");
                    }}
                    className="bg-white dark:bg-white/5 p-6 rounded-[32px] border border-black/5 dark:border-white/10 flex items-center justify-between hover:border-secondary/30 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-[8px] bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase mb-1.5 inline-block font-outfit">Transporte</span>
                      <h4 className="font-extrabold text-foreground group-hover:text-secondary transition-colors text-sm uppercase truncate">{t.name}</h4>
                      <p className="text-[10px] text-gray-400 truncate mt-0.5">{t.description || t.phone}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 bg-white dark:bg-white/5 rounded-[32px] border border-black/5 dark:border-white/10 text-center flex flex-col items-center justify-center gap-3">
                <Search className="w-8 h-8 text-gray-300 dark:text-zinc-700" />
                <p className="font-bold text-gray-400 text-sm">No encontramos ningún servicio asociado a "{searchQuery}"</p>
              </div>
            )}

            <div className="h-[1px] bg-black/5 dark:bg-white/5 my-4" />
          </div>
        )}

        <AnimatePresence>
          {filteredServices.map((section) => (
            <motion.section 
              layout
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between animate-fade-in">
                <h2 className="text-xl font-black tracking-tight uppercase">{section.category}</h2>
                <span className="text-[9px] text-secondary font-black uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full border border-secondary/15">Verificados</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {section.items.map((item) => {
                  const isGuidesDirectory = item.type === "guides_directory";
                  const isTaxiDirectory = item.type === "taxi_directory";
                  const isBusDirectory = item.type === "bus_directory";
                  const isEmergencyDirectory = item.type === "emergency_directory";
                  const isDirectory = isGuidesDirectory || isTaxiDirectory || isBusDirectory || isEmergencyDirectory;

                  return (
                    <motion.div
                      key={item.name}
                      onClick={() => {
                        if (isGuidesDirectory) openModal("guides");
                        else if (isTaxiDirectory) openModal("taxi");
                        else if (isBusDirectory) openModal("bus");
                        else if (isEmergencyDirectory) openModal("emergency");
                      }}
                      className={
                        isDirectory 
                          ? `relative overflow-hidden cursor-pointer p-[30px] rounded-[36px] border flex flex-col gap-6 shadow-2xl text-white group ${
                              isGuidesDirectory
                                ? "bg-gradient-to-br from-primary to-[#721F2C] dark:from-primary/80 dark:to-zinc-950 border-primary/20"
                                : isTaxiDirectory
                                ? "bg-gradient-to-br from-secondary to-[#BD8C5C] dark:from-secondary/60 dark:to-zinc-950 border-secondary/20"
                                : isEmergencyDirectory
                                ? "bg-gradient-to-br from-rose-800 to-red-950 dark:from-red-900/60 dark:to-zinc-950 border-red-500/20"
                                : "bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 border-zinc-500/20"
                            }`
                          : "bg-white dark:bg-white/5 p-6 rounded-[32px] border border-black/5 dark:border-white/10 flex flex-col gap-6 shadow-xl"
                      }
                    >
                      {/* Decorative patterns */}
                      {isGuidesDirectory && (
                        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 scale-150 rotate-[15deg] pointer-events-none group-hover:scale-[1.65] transition-transform duration-700">
                          <Users className="w-48 h-48 text-white" />
                        </div>
                      )}
                      {isTaxiDirectory && (
                        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 scale-150 rotate-[15deg] pointer-events-none group-hover:scale-[1.65] transition-transform duration-700">
                          <Car className="w-48 h-48 text-white" />
                        </div>
                      )}
                      {isBusDirectory && (
                        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 scale-150 rotate-[15deg] pointer-events-none group-hover:scale-[1.65] transition-transform duration-700">
                          <Bus className="w-48 h-48 text-white" />
                        </div>
                      )}
                      {isEmergencyDirectory && (
                        <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 scale-150 rotate-[15deg] pointer-events-none group-hover:scale-[1.65] transition-transform duration-700">
                          <AlertTriangle className="w-48 h-48 text-white" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${isDirectory ? 'bg-white/10 border border-white/20' : 'bg-gray-100 dark:bg-white/10'} overflow-hidden relative flex items-center justify-center`}>
                          {isGuidesDirectory ? (
                            <Users className="w-8 h-8 text-secondary animate-pulse" />
                          ) : isTaxiDirectory ? (
                            <Car className="w-8 h-8 text-secondary animate-pulse" />
                          ) : isBusDirectory ? (
                            <Bus className="w-8 h-8 text-secondary animate-pulse" />
                          ) : isEmergencyDirectory ? (
                            <AlertTriangle className="w-8 h-8 text-white animate-bounce" />
                          ) : null}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-black text-lg tracking-tight ${isDirectory ? 'text-white' : 'text-foreground'}`}>{item.name}</span>
                          <span className={`text-[10px] ${isDirectory ? 'text-secondary font-black' : 'text-gray-400 font-bold'} uppercase tracking-widest`}>{item.sub}</span>
                        </div>
                      </div>
                      <p className={`text-sm ${isDirectory ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'} font-semibold leading-relaxed`}>
                        {item.description}
                      </p>
                      
                      <motion.button 
                        whileTap={{ scale: 0.97 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isGuidesDirectory) openModal("guides");
                          else if (isTaxiDirectory) openModal("taxi");
                          else if (isBusDirectory) openModal("bus");
                          else if (isEmergencyDirectory) openModal("emergency");
                        }}
                        className={`w-full py-4.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all ${
                          isGuidesDirectory 
                            ? "bg-secondary text-white shadow-secondary/15 hover:bg-secondary/90 border border-secondary/10"
                            : isTaxiDirectory
                            ? "bg-primary text-white shadow-primary/20 hover:bg-primary/95 border border-primary/10"
                            : isEmergencyDirectory
                            ? "bg-white text-red-700 hover:bg-white/95 border border-white/20"
                            : "bg-secondary text-white shadow-secondary/25 hover:bg-secondary/90 border border-secondary/10"
                        }`}
                      >
                        {isGuidesDirectory ? (
                          <>
                            <Users className="w-4 h-4" />
                            Ver Directorio de Guías
                          </>
                        ) : isTaxiDirectory ? (
                          <>
                            <Car className="w-4 h-4" />
                            Ver Directorio de Taxis
                          </>
                        ) : isEmergencyDirectory ? (
                          <>
                            <AlertTriangle className="w-4 h-4 text-red-650" />
                            Ver Números de Emergencia
                          </>
                        ) : (
                          <>
                            <Bus className="w-4 h-4" />
                            Ver Directorio de Autobuses
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
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
            
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.85 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 0.4) {
                  closeModal();
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-h-[85vh] rounded-t-[40px] flex flex-col border-t border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Drag Handle superior que controla el arrastre */}
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full py-4 flex items-center justify-center cursor-row-resize flex-shrink-0 select-none touch-none"
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Directorio de Guías</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Credenciales oficiales y autorizadas por SECTUR</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar pb-10">
                {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide, i) => {
                    const initials = guide.name.split(" ").filter(n => !n.includes("Lic.") && !n.includes("Arqueólo")).slice(0, 2).map(n => n.charAt(0)).join("");
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

      {/* TAXI DIRECTORY MODAL */}
      <AnimatePresence>
        {showTaxiModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col justify-end"
          >
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
            
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.85 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 0.4) {
                  closeModal();
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-h-[85vh] rounded-t-[40px] flex flex-col border-t border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Drag Handle superior */}
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full py-4 flex items-center justify-center cursor-row-resize flex-shrink-0 select-none touch-none"
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Directorio de Taxis</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Taxis seguros en Papantla - Llamada y WhatsApp</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 pb-4 flex flex-col gap-4 flex-shrink-0 border-b border-black/5 dark:border-white/5">
                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={searchTaxiQuery}
                    onChange={(e) => setSearchTaxiQuery(e.target.value)}
                    placeholder="Buscar por nombre o número..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-[24px] py-4 pl-14 pr-10 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner"
                  />
                  {searchTaxiQuery && (
                    <button onClick={() => setSearchTaxiQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar pb-10">
                {filteredTaxis.length > 0 ? (
                  filteredTaxis.map((taxi, i) => {
                    const initials = taxi.name.split(" ").filter(n => !n.includes("Radio")).slice(0, 2).map(n => n.charAt(0)).join("");
                    const taxiGradients = [
                      "from-amber-400 to-orange-500",
                      "from-yellow-400 to-amber-600",
                      "from-orange-400 to-amber-500"
                    ];
                    const grad = taxiGradients[i % taxiGradients.length];

                    return (
                      <motion.div
                        key={taxi.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[32px] p-5 flex flex-col gap-4 shadow-sm hover:border-[#D4A373]/25 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0`}>
                            {initials || "TX"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="text-[7px] bg-[#D4A373]/10 text-[#D4A373] px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-[#D4A373]/20">
                                Transito Autorizado
                              </span>
                              <span className="text-[7px] bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-green-500/20">
                                Taxi Seguro
                              </span>
                            </div>
                            <h3 className="font-black text-base tracking-tight text-foreground leading-tight">{taxi.name}</h3>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                          {taxi.description}
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <motion.a
                            href={`tel:${taxi.phone}`}
                            whileTap={{ scale: 0.97 }}
                            className="py-4 bg-[#8B2635]/10 hover:bg-[#8B2635]/25 text-[#8B2635] dark:text-[#E89E9F] dark:bg-[#8B2635]/15 dark:hover:bg-[#8B2635]/30 border border-[#8B2635]/25 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Llamar taxi
                          </motion.a>
                          
                          <motion.button
                            onClick={() => openWhatsApp(taxi.whatsapp, "Hola! Me gustaría solicitar un taxi, por favor.")}
                            whileTap={{ scale: 0.97 }}
                            className="py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/15 transition-all border border-green-600/30"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            WhatsApp
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Car className="w-12 h-12 text-gray-300 dark:text-zinc-700 mb-3" />
                    <p className="font-bold text-gray-400 text-sm">No se encontraron taxis con estos criterios</p>
                    <button 
                      onClick={() => setSearchTaxiQuery("")}
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

      {/* BUS DIRECTORY MODAL */}
      <AnimatePresence>
        {showBusModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col justify-end"
          >
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
            
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.85 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 0.4) {
                  closeModal();
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-h-[85vh] rounded-t-[40px] flex flex-col border-t border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Drag Handle superior que controla el arrastre */}
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full py-4 flex items-center justify-center cursor-row-resize flex-shrink-0 select-none touch-none"
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-start flex-shrink-0 border-b border-black/5 dark:border-white/5">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">Directorio de Autobuses</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Terminales y conexiones foráneas en Papantla</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar pb-10">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[32px] p-6 flex flex-col gap-5 shadow-sm hover:border-zinc-500/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E30613] to-[#A30009] flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
                      ADO
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="text-[7px] bg-red-500/10 text-red-650 dark:text-red-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-red-500/20">
                          Primera Clase
                        </span>
                        <span className="text-[7px] bg-zinc-500/10 text-zinc-650 dark:text-zinc-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-zinc-500/20">
                          Terminal Principal
                        </span>
                      </div>
                      <h3 className="font-black text-lg tracking-tight text-foreground leading-tight">Terminal ADO, Papantla</h3>
                    </div>
                  </div>

                  <div className="space-y-3.5 my-1">
                    <div className="flex items-start gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Cjon B Juárez 408, Barrio del San Juan, 93400 Papantla, Ver.</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>Teléfono: 7841013501</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <motion.a
                      href="tel:7841013501"
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-black dark:bg-white/5 dark:hover:bg-white/10 dark:text-white border border-black/5 dark:border-white/10 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Llamar a Terminal
                    </motion.a>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.a
                        href="https://maps.app.goo.gl/2U8u4UNKvNV7MZiX7"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.97 }}
                        className="py-4 bg-[#8B2635]/10 hover:bg-[#8B2635]/25 text-[#8B2635] dark:text-[#E89E9F] dark:bg-[#8B2635]/15 dark:hover:bg-[#8B2635]/30 border border-[#8B2635]/25 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Ver Mapa
                      </motion.a>

                      <motion.a
                        href="https://www.ado.com.mx/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileTap={{ scale: 0.97 }}
                        className="py-4 bg-[#E30613] hover:bg-[#C90510] text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 transition-all border border-red-650"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Sitio Web ADO
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMERGENCY DIRECTORY MODAL */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col justify-end"
          >
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
            
            <motion.div
              drag="y"
              dragControls={dragControls}
              dragListener={false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.85 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100 || info.velocity.y > 0.4) {
                  closeModal();
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-zinc-950 w-full max-h-[85vh] rounded-t-[40px] flex flex-col border-t border-red-550/20 dark:border-red-550/30 shadow-2xl relative overflow-hidden"
            >
              {/* Drag Handle superior que controla el arrastre */}
              <div 
                onPointerDown={(e) => dragControls.start(e)}
                className="w-full py-4 flex items-center justify-center cursor-row-resize flex-shrink-0 select-none touch-none"
              >
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-zinc-800 rounded-full" />
              </div>
              
              <div className="px-6 pb-4 flex justify-between items-start flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-red-600 dark:text-red-550 uppercase flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" /> Emergencias
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Asistencia y auxilio inmediato en Papantla 24h</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/25 flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 no-scrollbar pb-10 border-t border-black/5 dark:border-white/5">
                {emergencyList.map((item, i) => {
                  const gradient = "from-red-500 to-rose-600";
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-red-50/20 dark:bg-red-950/5 border border-red-100/50 dark:border-red-950/20 rounded-[32px] p-5 flex flex-col gap-4 shadow-sm hover:border-red-500/30 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xs shadow-md flex-shrink-0`}>
                          SOS
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[7.5px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full font-black tracking-widest uppercase border border-red-200/50 dark:border-red-950/40">
                            Línea Directa
                          </span>
                          <h3 className="font-black text-base tracking-tight text-foreground leading-tight mt-1">{item.name}</h3>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                        {item.description}
                      </p>

                      <div className={`grid ${item.whatsapp ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                        <motion.a
                          href={`tel:${item.phone}`}
                          whileTap={{ scale: 0.97 }}
                          className="py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-500/15 transition-all text-center border border-red-700/30"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Llamar PC
                        </motion.a>
                        
                        {item.whatsapp && (
                          <motion.button
                            onClick={() => openWhatsApp(item.whatsapp, "Emergencia: Necesito asistencia urgente de Protección Civil, por favor.")}
                            whileTap={{ scale: 0.97 }}
                            className="py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/15 transition-all border border-green-600/30"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            WhatsApp
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServiciosPage() {
  return (
    <Suspense fallback={
      <div className="pb-32 flex flex-col bg-background min-h-screen items-center justify-center">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">Cargando directorio de servicios...</div>
      </div>
    }>
      <ServiciosContent />
    </Suspense>
  );
}
