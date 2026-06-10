"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, User, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  const isHome = pathname === "/";
  const useAdaptive = !isHome || scrolled;

  const navItemClass = (path: string) => `
    text-[11px] font-black uppercase tracking-[0.15em] transition-all relative group
    ${pathname === path ? "text-primary" : useAdaptive ? "text-foreground" : "text-white"}
    hover:text-primary dark:hover:text-primary
  `;

  const themeIcon = mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${
          scrolled 
            ? "bg-white/10 dark:bg-black/10 backdrop-blur-[24px] py-3 shadow-2xl border-b border-white/20 dark:border-white/10" 
            : isHome ? "bg-transparent py-6" : "bg-white/40 dark:bg-black/40 backdrop-blur-xl py-3 border-b border-black/5 dark:border-white/10 shadow-lg shadow-black/5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between relative">
          
          {/* MOBILE: LEFT - Dark Mode Button */}
          <div className="flex lg:hidden items-center">
              <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-full transition-all ${useAdaptive ? "text-foreground bg-black/5 dark:bg-white/10" : "text-white bg-white/10"}`}
              >
                  {themeIcon}
              </button>
          </div>

          {/* LEFT NAV items (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            <Link href="/" className={navItemClass("/")}>Inicio</Link>
            <Link href="/destinos" className={navItemClass("/destinos")}>Destinos</Link>
            <Link href="/eventos" className={navItemClass("/eventos")}>Eventos</Link>
            <Link href="/sabor" className={navItemClass("/sabor")}>Sabor</Link>
          </div>

          {/* CENTER LOGO */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <Link href="/" className="flex flex-col items-center group">
                  <motion.div 
                      animate={scrolled ? { scale: 0.85 } : { scale: 1 }}
                      className="flex flex-col items-center"
                  >
                      <span className={`text-2xl md:text-3xl font-black tracking-tighter leading-none text-center transition-colors duration-500 ${useAdaptive ? "text-foreground" : "text-white"}`}>
                          PAPANTLA
                      </span>
                      <div className="flex items-center gap-1 mt-0.5 opacity-80">
                        <div className="h-[1px] w-1.5 bg-primary/40" />
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.12em]">La Ciudad que Perfuma</span>
                        <div className="h-[1px] w-1.5 bg-primary/40" />
                      </div>
                  </motion.div>
              </Link>
          </div>

          {/* RIGHT NAV items (Desktop) */}
          <div className="hidden lg:flex items-center justify-end gap-6 flex-1">
            <Link href="/hospedaje" className={navItemClass("/hospedaje")}>Hospedaje</Link>
            <Link href="/servicios" className={navItemClass("/servicios")}>Servicios</Link>
            <Link href="/mapa" className={navItemClass("/mapa")}>Mapa</Link>
            
            <div className="h-3 w-[1px] bg-black/10 dark:bg-white/10 mx-2" />
            
            <div className="flex items-center gap-3">
              <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${useAdaptive ? "bg-black/5 dark:bg-white/5 text-foreground" : "bg-white/10 text-white"}`}
              >
                  {themeIcon}
              </button>
              <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${useAdaptive ? "bg-black/5 dark:bg-white/10 text-foreground" : "bg-white/10 text-white"}`}>
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MOBILE: RIGHT - Menu Button */}
          <div className="flex lg:hidden items-center">
              <button 
                  onClick={() => setIsOpen(true)}
                  className={`p-2 rounded-full transition-all ${useAdaptive ? "text-foreground bg-black/5 dark:bg-white/10" : "text-white bg-white/10"}`}
              >
                  <Menu className="w-5 h-5" />
              </button>
          </div>
        </div>
      </nav>

      {/* FLOATING MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-3xl rounded-[48px] shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between p-8 border-b border-black/5 dark:border-white/5">
                <span className="text-xl font-black uppercase tracking-tighter">Explorar</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                <div className="flex flex-col gap-6">
                  {[
                    { name: "Inicio", path: "/" },
                    { name: "Destinos", path: "/destinos" },
                    { name: "Eventos", path: "/eventos" },
                    { name: "Sabor", path: "/sabor" },
                    { name: "Hospedaje", path: "/hospedaje" },
                    { name: "Servicios", path: "/servicios" },
                    { name: "Mapa", path: "/mapa" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link 
                        href={item.path} 
                        className="flex items-center justify-between group"
                      >
                        <span className={`text-2xl font-black uppercase tracking-tighter transition-all group-hover:text-primary ${pathname === item.path ? "text-primary" : "text-foreground"}`}>
                          {item.name}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-black/5 dark:bg-white/10 group-hover:bg-primary group-hover:text-white`}>
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex gap-4">
                  <button className="flex-1 h-14 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                     <User className="w-5 h-5" /> Mi Perfil
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
