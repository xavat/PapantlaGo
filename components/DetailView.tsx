"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Share2, Star, Clock, Info, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DetailViewProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  rating?: string;
  tag?: string;
  location?: string;
  details?: { label: string; value: string; icon: any }[];
  gallery?: string[];
}

export default function DetailView({
  title,
  subtitle,
  description,
  imageUrl,
  rating,
  tag,
  location,
  details,
  gallery,
}: DetailViewProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<number | null>(null);

  const nextImage = () => {
    if (gallery && activeImage !== null) {
      setActiveImage((activeImage + 1) % gallery.length);
    }
  };

  const prevImage = () => {
    if (gallery && activeImage !== null) {
      setActiveImage((activeImage - 1 + gallery.length) % gallery.length);
    }
  };

  // Handle back button to close gallery and auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeImage !== null && gallery && gallery.length > 1) {
      // Auto-play every 5 seconds
      interval = setInterval(() => {
        nextImage();
      }, 5000);

      const handlePopState = () => {
        setActiveImage(null);
      };
      window.history.pushState({ galleryOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [activeImage, gallery]);

  return (
    <div className="min-h-screen bg-background pb-32 font-sans">
      {/* Cinematic Header Image */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full"
        >
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className="w-full h-full object-cover"
            priority
          />
        </motion.div>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Top Controls */}
        <div className="absolute top-24 left-6 right-6 flex items-center justify-between z-10">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-xl">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-12 left-8 right-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            {tag && (
              <span className="bg-primary px-3 py-1 rounded-full text-white text-[9px] font-black uppercase tracking-widest w-fit mb-2">
                {tag}
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-none uppercase">
              {title}
            </h1>
            <p className="text-muted-foreground font-bold tracking-widest uppercase text-[10px]">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-8 flex flex-col gap-10 -mt-6 relative z-10 lg:max-w-4xl lg:mx-auto">
        
        {/* Quick Stats - Perfect single line alignment */}
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 transition-transform group-hover:rotate-12" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black leading-none">{rating || "4.5"}</span>
              <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Rating</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
            <Clock className="w-6 h-6 text-primary transition-transform group-hover:-rotate-12" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black leading-none">Disponibles</span>
              <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Habitaciones</span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
             <div className="w-6 h-6 text-primary transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9l3 3 3-3 3 3 3-3 3 3Z"/></svg>
             </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-black leading-none">Wifi / AC</span>
              <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Servicios</span>
            </div>
          </div>
        </div>

        {/* Main Text */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
             <Info className="w-6 h-6 text-primary" />
             Información
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Gallery Section */}
        {gallery && gallery.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               Galería de Imágenes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((img, i) => (
                <motion.div
                  key={i}
                  layoutId={`image-${i}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveImage(i)}
                  className="aspect-square relative rounded-[30px] overflow-hidden border border-black/5 dark:border-white/5 shadow-xl cursor-pointer group"
                >
                  <Image 
                    src={img} 
                    alt={`Gallery ${i}`} 
                    fill 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                     <span className="opacity-0 group-hover:opacity-100 text-white font-black text-[10px] uppercase tracking-widest translate-y-2 group-hover:translate-y-0 transition-all">Ver Imagen</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Carousel Modal */}
        <AnimatePresence>
          {activeImage !== null && gallery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl"
            >
              <button 
                onClick={() => setActiveImage(null)}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110] active:scale-90"
              >
                <X className="w-10 h-10" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 md:left-8 text-white/40 hover:text-white transition-all z-[110] active:scale-90 p-4"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 md:right-8 text-white/40 hover:text-white transition-all z-[110] active:scale-90 p-4"
              >
                <ChevronRight className="w-12 h-12" />
              </button>

              <motion.div 
                key={activeImage}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full h-full max-w-5xl max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image 
                  src={gallery[activeImage]} 
                  alt="Full size" 
                  fill 
                  className="object-contain"
                />
              </motion.div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 font-black text-sm tracking-[0.3em] uppercase">
                {activeImage + 1} / {gallery.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Section */}
        {location && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <MapPin className="w-6 h-6 text-primary" />
               Ubicación
            </h2>
            <div className="w-full bg-gray-100 dark:bg-white/5 rounded-[40px] border border-black/5 dark:border-white/5 relative overflow-hidden group shadow-2xl">
               <div className="p-8">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Dirección Exacta</span>
                        <p className="text-lg font-bold text-foreground leading-snug">
                           {location}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="h-[400px] w-full relative">
                  {/* Real Google Maps Iframe */}
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    className="grayscale dark:invert transition-all group-hover:grayscale-0 dark:group-hover:invert-0"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(title + " " + location)}&output=embed`}
                  />
                  
                  {/* Open Maps Button Overlay */}
                  <button 
                     onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(title + " " + location)}`, "_blank")}
                     className="absolute bottom-6 right-6 bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                  >
                     <ExternalLink className="w-4 h-4" /> Abrir en Google Maps
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ExternalLink = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);
