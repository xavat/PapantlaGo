"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Bell, Sparkles, ChevronRight, Clock, Search, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

const featuredEvents = [
  {
    id: "cumbre-tajin",
    title: "Cumbre Tajín",
    date: "20 - 23 de Marzo",
    img: "/images/events/cumbre_tajin.png",
    color: "from-amber-600",
  },
  {
    id: "carnaval-alegria",
    title: "Carnaval de la Alegría",
    date: "4 de Junio",
    img: "/images/events/carnaval_alegria.png",
    color: "from-pink-600",
  },
  {
    id: "corpus-christi",
    title: "Feria de Corpus Christi",
    date: "30 de Mayo - 7 de Junio",
    img: "/images/events/corpus_christi.png",
    color: "from-blue-600",
  },
];

const allEvents = [
  { id: "festival-tamal", title: "Festival del Tamal y el Atole", date: "Del 1 al 3 de febrero", month: 1, dayRange: [1, 2, 3], year: 2026 },
  { id: "enamorate-kachikin", title: "Enamórate en Kachikín", date: "14 de febrero", month: 1, dayRange: [14], year: 2026 },
  { id: "cumbre-tajin-detail", title: "Papantla en la Cumbre", date: "Del 20 - 23 de marzo", month: 2, dayRange: [20, 21, 22, 23], year: 2026 },
  { id: "rancho-fest", title: "Rancho Fest", date: "3 y 4 de Abril", month: 3, dayRange: [3, 4], year: 2026 },
  { id: "carnaval-alegria-detail", title: "Carnaval de la Alegría", date: "4 de junio", month: 5, dayRange: [4], year: 2026 },
  { id: "corpus-christi-detail", title: "Feria de Corpus Christi", date: "Del 30 de mayo al 7 de Junio", month: 4, dayRange: [30, 31], year: 2026 },
  { id: "corpus-christi-detail-2", title: "Feria de Corpus Christi", date: "Del 30 de mayo al 7 de Junio", month: 5, dayRange: [1, 2, 3, 4, 5, 6, 7], year: 2026 },
  { id: "fiestas-patrias", title: "Fiestas Patrias", date: "15 de Septiembre", month: 8, dayRange: [15], year: 2026 },
  { id: "ninin", title: "Ninín", date: "2 de Noviembre", month: 10, dayRange: [2], year: 2026 },
  { id: "navidad-papantla", title: "Navidad en Papantla", date: "Del 26 al 29 de Diciembre", month: 11, dayRange: [26, 27, 28, 29], year: 2026 },
];

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function EventosPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Start at June 2026
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const viewMonth = currentDate.getMonth();
  const viewYear = currentDate.getFullYear();

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewMonth, viewYear]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewMonth, viewYear]);

  const eventsInMonth = useMemo(() => {
    return allEvents.filter(e => e.month === viewMonth && e.year === viewYear);
  }, [viewMonth, viewYear]);

  const prevMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const selectedEvent = useMemo(() => {
    return allEvents.find(e => e.id === selectedEventId);
  }, [selectedEventId]);

  return (
    <div className="pb-32 flex flex-col bg-background min-h-screen font-outfit">
      {/* HEADER */}
      <header className="px-6 pt-24 pb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Eventos</h1>
          </motion.div>
          <div className="flex gap-2">
            <button className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-foreground/70">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-foreground/70">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-black opacity-70 leading-tight max-w-xs">
          Descubre la magia, cultura y tradición de Papantla a través de sus festividades.
        </p>
      </header>

      {/* FEATURED CAROUSEL */}
      <section className="px-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
          <Sparkles className="w-4 h-4" /> Destacados
        </div>
        
        <div className="flex gap-5 overflow-x-auto pb-8 -mx-6 px-6 no-scrollbar snap-x">
          {featuredEvents.map((event, i) => (
            <motion.div
              key={i}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[300px] h-[420px] relative rounded-[48px] overflow-hidden snap-start shadow-2xl group cursor-pointer"
            >
              <Link href={`/eventos/${event.id}`}>
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${event.color}/80 via-transparent to-transparent`} />
                <div className="absolute bottom-10 left-8 right-8">
                  <span className="text-[12px] font-bold uppercase text-white/90 tracking-widest mb-2 block">{event.date}</span>
                  <h3 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">{event.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CALENDAR SECTION */}
      <section className="px-6 mt-10">
        <h2 className="text-2xl font-black tracking-tight text-foreground mb-8">Agenda <span className="text-primary font-black">Cultural</span></h2>
        
        <div className="flex flex-col gap-8">
          {/* Calendar Visual */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[40px] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                 <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{viewYear}</span>
                 <h4 className="font-black text-2xl uppercase tracking-tighter">{months[viewMonth]}</h4>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={prevMonth}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-y-6 text-center">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                <span key={d} className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50">{d}</span>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const eventsOnDay = eventsInMonth.filter(e => e.dayRange.includes(day));
                const isEvent = eventsOnDay.length > 0;
                const isSelected = eventsOnDay.some(e => e.id === selectedEventId);
                
                return (
                  <button 
                    key={day}
                    onClick={() => isEvent && setSelectedEventId(eventsOnDay[0].id)}
                    className="relative flex flex-col items-center justify-center py-2 group"
                  >
                    <span className={`text-sm font-black z-10 transition-colors ${
                        isSelected ? "text-white" : isEvent ? "text-primary" : "text-foreground opacity-40 hover:opacity-100"
                    }`}>
                      {day}
                    </span>
                    {isSelected && (
                      <motion.div 
                        layoutId="activeDay"
                        className="absolute w-10 h-10 rounded-2xl bg-primary shadow-lg shadow-primary/30"
                      />
                    )}
                    {isEvent && !isSelected && (
                      <div className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full bottom-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Event Card or List */}
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <CalendarIcon className="w-24 h-24" />
                   </div>
                   <div className="relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 block mb-2">{selectedEvent.date}</span>
                      <h5 className="text-2xl font-black mb-6 leading-tight">{selectedEvent.title}</h5>
                      <Link 
                        href={`/eventos/${selectedEvent.id}`}
                        className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                      >
                         Ver detalles <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => setSelectedEventId(null)}
                        className="ml-4 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100"
                      >
                        Cerrar
                      </button>
                   </div>
                </motion.div>
              ) : (
                <motion.div
                   key="list"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="flex flex-col gap-4"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 mb-2">Próximos Eventos</h3>
                  {allEvents.filter(e => e.month >= viewMonth || e.year > viewYear).slice(0, 5).map((ev) => (
                    <motion.div
                      key={ev.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white/5 backdrop-blur-sm p-6 rounded-[32px] border border-white/5 flex items-center gap-5 hover:bg-white/10 transition-all group"
                      onClick={() => setSelectedEventId(ev.id)}
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0 border border-primary/10">
                         <span className="text-primary font-black text-lg leading-none">{ev.dayRange[0]}</span>
                         <span className="text-[8px] font-black text-primary/70 leading-none mt-1 uppercase">{months[ev.month].substring(0, 3)}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-black text-foreground text-sm leading-tight group-hover:text-primary transition-colors">{ev.title}</h5>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary/50" /> {ev.date}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
