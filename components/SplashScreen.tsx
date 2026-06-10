"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (!hasSeenSplash) {
      setIsVisible(true);
      sessionStorage.setItem("hasSeenSplash", "true");
      const timer = setTimeout(() => setIsVisible(false), 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-[20000] flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-700"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xs flex flex-col items-center gap-10"
          >
             {/* Centered Logo container */}
             <div className="relative w-64 h-64 flex items-center justify-center">
                <motion.div
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ duration: 1.5, delay: 0.3 }}
                   className="relative z-10 w-full h-full"
                >
                   <img 
                      src="/splash-logo.jpg" 
                      alt="Papantla Logo" 
                      className="w-full h-full object-contain rounded-full shadow-2xl transition-all duration-700 dark:grayscale-0"
                   />
                </motion.div>
                
                {/* Decorative halos */}
                <motion.div
                   animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                   transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                   className="absolute -inset-8 border border-primary/10 rounded-full"
                />
             </div>

             <div className="flex flex-col items-center gap-4 text-center">
                <motion.h1 
                   initial={{ letterSpacing: "0.2em", opacity: 0 }}
                   animate={{ letterSpacing: "0.8em", opacity: 1 }}
                   transition={{ duration: 2, delay: 0.8 }}
                   className="text-4xl font-black text-primary dark:text-primary transition-colors duration-500 uppercase tracking-[0.8em] mr-[-0.8em]"
                >
                   PAPANTLA
                </motion.h1>
                <motion.div
                   initial={{ opacity: 0, scaleX: 0 }}
                   animate={{ opacity: 1, scaleX: 1 }}
                   transition={{ delay: 1.8, duration: 1 }}
                   className="flex items-center gap-4 w-full"
                >
                   <div className="h-[1px] flex-1 bg-primary/20" />
                   <p className="text-primary font-black uppercase text-[11px] tracking-[0.4em] whitespace-nowrap">
                      La Ciudad que Perfuma
                   </p>
                   <div className="h-[1px] flex-1 bg-primary/20" />
                </motion.div>
             </div>
          </motion.div>

          {/* Loading bar */}
          <div className="absolute bottom-20 w-48 h-[1px] bg-primary/10 overflow-hidden">
             <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-primary"
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
