"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Share2, Star, Clock, Info, X, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface InfoListItem {
  title?: string;
  content: string;
}

interface ParsedInfo {
  intro: string;
  listItems: InfoListItem[];
}

function parseDescriptionContent(text: string): ParsedInfo {
  if (!text) return { intro: "", listItems: [] };

  // normalize line endings
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  let introLines: string[] = [];
  const listItems: InfoListItem[] = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if it's a list item (starts with *, -, •, or is numbered like "1.")
    const isListItem = trimmed.startsWith("*") || trimmed.startsWith("-") || trimmed.startsWith("•") || /^\d+\./.test(trimmed);
    
    if (isListItem) {
      // Remove starting bullet marker/number
      let cleanLine = trimmed.replace(/^[\s*\-•\d.]+\s*/, "").trim();
      
      // Look for title like **Pirámide de los Nichos:** or **Pirámide de los Nichos** or simple "Title: Description"
      const boldMatch = cleanLine.match(/^\*\*([^*]+)\*\*\s*:?\s*(.*)$/);
      if (boldMatch) {
        const title = boldMatch[1].replace(/[*#]/g, "").trim();
        const content = boldMatch[2].replace(/[*#]/g, "").trim();
        listItems.push({ title, content });
      } else {
        // Check simple "Title: Description" without markdown bold
        const colonIndex = cleanLine.indexOf(":");
        if (colonIndex > 0 && colonIndex < 35 && !cleanLine.startsWith("http")) {
          const title = cleanLine.substring(0, colonIndex).replace(/[*#]/g, "").trim();
          const content = cleanLine.substring(colonIndex + 1).replace(/[*#]/g, "").trim();
          listItems.push({ title, content });
        } else {
          const content = cleanLine.replace(/[*#]/g, "").trim();
          if (content) {
            listItems.push({ content });
          }
        }
      }
    } else {
      // Normal paragraph
      const cleanLine = trimmed.replace(/[*#]/g, "").trim();
      if (cleanLine) {
        if (listItems.length === 0) {
          introLines.push(cleanLine);
        } else {
          listItems.push({ content: cleanLine });
        }
      }
    }
  }

  return {
    intro: introLines.join("\n\n"),
    listItems
  };
}

const cleanText = (text: string): string => {
  if (!text) return "";
  // Strip all asterisks, hashes, and leading dashes/bullets
  return text.replace(/[*#]/g, "").replace(/^[\s\-•]+\s*/, "").trim();
};

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
  coords?: [number, number];
  descriptionExtra?: {
    hours?: string;
    cost?: string;
    howToGet?: string;
    tip?: string;
  };
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
  coords,
  descriptionExtra,
}: DetailViewProps) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [currentHeaderIndex, setCurrentHeaderIndex] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${title} - PapantlaGo`,
      text: `${subtitle || "Descubre Papantla"}\n\n${description ? cleanText(description).slice(0, 120) + "..." : ""}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((err) => {
        console.error("Error sharing page:", err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2500);
    }
  };

  const parsedDesc = parseDescriptionContent(description);

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

  // Autoplay for header image
  useEffect(() => {
    if (gallery && gallery.length > 1 && activeImage === null) {
      const interval = setInterval(() => {
        setCurrentHeaderIndex((prev) => (prev + 1) % gallery.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [gallery, activeImage]);

  // Handle physical back button/gesture for the gallery modal with single pushState tracking
  useEffect(() => {
    if (activeImage === null) return;

    window.history.pushState({ galleryOpen: true }, "");

    const handlePopState = () => {
      setActiveImage(null);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (window.history.state?.galleryOpen) {
        window.history.back();
      }
    };
  }, [activeImage !== null]);

  const displayImageUrl = (gallery && gallery.length > 0 && activeImage === null) 
    ? gallery[currentHeaderIndex] 
    : imageUrl;

  const DetailIcon1 = details && details[0]?.icon;
  const DetailIcon2 = details && details[1]?.icon;

  return (
    <div className="min-h-screen bg-background pb-32 font-sans">
      {/* Cinematic Header Image */}
      <div 
        className="relative h-[60vh] w-full overflow-hidden cursor-pointer"
        onClick={() => gallery && gallery.length > 0 && setActiveImage(currentHeaderIndex)}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={displayImageUrl}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <Image 
              src={displayImageUrl} 
              alt={title} 
              fill
              className="w-full h-full object-cover"
              priority
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Navigation Arrows for Header (Optional, but user said keep arrows) */}
        {gallery && gallery.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 flex justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Arrows could be here, but they are already in the modal. 
                The user said "no la quites solo agrega y corrige la navegacion para ver todas la imágenes".
                Wait, if it's the header, arrows might be busy with the back button.
                I'll leave arrows for the modal as they were.
            */}
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-24 left-6 right-6 flex items-center justify-between z-30">
          <button 
            onClick={(e) => { e.stopPropagation(); router.back(); }}
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all shadow-xl"
            title="Compartir página"
          >
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

          {details && details[0] ? (
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
              {DetailIcon1 ? (
                <DetailIcon1 className="w-6 h-6 text-primary transition-transform group-hover:-rotate-12" />
              ) : (
                <Clock className="w-6 h-6 text-primary transition-transform group-hover:-rotate-12" />
              )}
              <div className="flex flex-col items-center">
                <span className="text-sm font-black leading-none">{details[0].value}</span>
                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">{details[0].label}</span>
              </div>
            </div>
          ) : (
             <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
               <Clock className="w-6 h-6 text-primary transition-transform group-hover:-rotate-12" />
               <div className="flex flex-col items-center">
                 <span className="text-sm font-black leading-none">Abierto</span>
                 <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Horario</span>
               </div>
             </div>
          )}

          {details && details[1] ? (
            <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
              {DetailIcon2 ? (
                <DetailIcon2 className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              ) : (
                <div className="w-6 h-6 text-primary transition-transform group-hover:scale-110">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9l3 3 3-3 3 3 3-3 3 3Z"/></svg>
                </div>
              )}
              <div className="flex flex-col items-center">
                <span className="text-sm font-black leading-none">{details[1].value}</span>
                <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">{details[1].label}</span>
              </div>
            </div>
          ) : (
             <div className="bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 shadow-2xl backdrop-blur-2xl transition-all hover:scale-105 active:scale-95 group text-center">
                <div className="w-6 h-6 text-primary transition-transform group-hover:scale-110">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9l3 3 3-3 3 3 3-3 3 3Z"/></svg>
                </div>
               <div className="flex flex-col items-center">
                 <span className="text-sm font-black leading-none">Wifi</span>
                 <span className="text-[8px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Servicios</span>
               </div>
             </div>
          )}
        </div>

        {/* Main Text */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
             <Info className="w-6 h-6 text-primary" />
             Información
          </h2>
          <div className="flex flex-col gap-6">
            {parsedDesc.intro && (
              <p className="text-foreground/85 text-[15px] md:text-base leading-relaxed font-semibold bg-white/40 dark:bg-zinc-900/40 p-6 rounded-[30px] border border-black/5 dark:border-white/5 shadow-sm backdrop-blur-md">
                {cleanText(parsedDesc.intro)}
              </p>
            )}

            {/* Aspectos Destacados */}
            {parsedDesc.listItems.length > 0 && (
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-black text-foreground flex items-center gap-2 uppercase tracking-wider text-primary">
                  <span className="w-1.5 h-4 bg-primary rounded-full" />
                  Aspectos Destacados
                </h3>
                <div className="flex flex-col gap-4">
                  {parsedDesc.listItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 4 }}
                      className="flex gap-4 p-5 rounded-[24px] bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-md transition-all hover:border-primary/20"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                        <span className="text-sm font-black text-primary">{idx + 1}</span>
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        {item.title && (
                          <h4 className="font-extrabold text-foreground text-sm tracking-tight mb-1 uppercase text-primary">
                            {cleanText(item.title)}
                          </h4>
                        )}
                        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-semibold">
                          {cleanText(item.content)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Practical Info (Description Extra) */}
        {descriptionExtra && (
          <div className="flex flex-col gap-6 mt-4">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
               <Compass className="w-6 h-6 text-primary" />
               Información Práctica
            </h2>
            <div className="flex flex-col gap-4">
              {descriptionExtra.hours && (
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-md backdrop-blur-md flex gap-5 items-start transition-all hover:border-primary/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Horarios</span>
                    <p className="text-foreground text-sm leading-relaxed font-semibold">
                      {cleanText(descriptionExtra.hours)}
                    </p>
                  </div>
                </motion.div>
              )}

              {descriptionExtra.cost && (
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-md backdrop-blur-md flex gap-5 items-start transition-all hover:border-primary/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Costos de Acceso</span>
                    <p className="text-foreground text-sm leading-relaxed font-semibold">
                      {cleanText(descriptionExtra.cost)}
                    </p>
                  </div>
                </motion.div>
              )}

              {descriptionExtra.howToGet && (
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 rounded-[30px] p-6 shadow-md backdrop-blur-md flex gap-5 items-start transition-all hover:border-primary/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Cómo llegar</span>
                    <p className="text-foreground text-sm leading-relaxed font-semibold">
                      {cleanText(descriptionExtra.howToGet)}
                    </p>
                  </div>
                </motion.div>
              )}

              {descriptionExtra.tip && (
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-[30px] p-6 shadow-lg flex gap-5 items-start relative overflow-hidden group w-full"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Compass className="w-24 h-24" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  </div>
                  <div className="flex flex-col gap-2 min-w-0 z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tip del Viajero</span>
                    <p className="text-foreground/90 text-sm leading-relaxed italic font-semibold">
                      {cleanText(descriptionExtra.tip)}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

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
              className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-xl"
            >
              <button 
                onClick={() => setActiveImage(null)}
                className="absolute top-16 right-6 md:top-8 md:right-8 text-white/70 hover:text-white transition-all z-[120] active:scale-95 bg-black/45 hover:bg-black/60 p-3 rounded-full border border-white/10 shadow-2xl backdrop-blur-md"
              >
                <X className="w-6 h-6" />
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
                className="relative w-full h-full max-w-5xl max-h-[85vh] cursor-grab active:cursor-grabbing touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipeThreshold = 60;
                  const swipeVelocity = 0.5;
                  if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
                    nextImage();
                  } else if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
                    prevImage();
                  }
                }}
              >
                <Image 
                  src={gallery[activeImage]} 
                  alt="Full size" 
                  fill 
                  className="object-contain pointer-events-none"
                  priority
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
                    src={coords ? `https://www.google.com/maps?q=${coords[0]},${coords[1]}&z=16&output=embed` : `https://www.google.com/maps?q=${encodeURIComponent(title + " " + location)}&output=embed`}
                  />
                  
                  {/* Open Maps Button Overlay */}
                  <button 
                     onClick={() => window.open(coords ? `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}` : `https://www.google.com/maps/search/${encodeURIComponent(title + " " + location)}`, "_blank")}
                     className="absolute bottom-6 right-6 bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                  >
                     <ExternalLink className="w-4 h-4" /> Abrir en Google Maps
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast feedback fallback */}
      <AnimatePresence>
        {toastOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 right-6 z-[10005] bg-black/90 dark:bg-zinc-900/95 border border-white/10 p-4.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-center gap-3 text-center max-w-sm mx-auto"
          >
            <span className="text-[11px] font-black uppercase tracking-wider text-white">
              ¡Enlace copiado al portapapeles! 📋
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ExternalLink = ({ className }: { className: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);
