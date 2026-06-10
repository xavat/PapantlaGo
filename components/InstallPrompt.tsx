"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share } from "lucide-react";

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [prompt, setPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Initial check for non-Chrome browsers (static check)
    // For iOS, we show it after a few seconds
    if (isIOSDevice) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome event
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setPrompt(e);
      setTimeout(() => setShow(true), 3000); // Show after 3s
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = () => {
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choice: any) => {
        if (choice.outcome === "accepted") {
          setShow(false);
        }
      });
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 md:bottom-8 md:left-auto md:right-8 md:max-w-sm z-50"
      >
        <div className="bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-orange-50 relative">
          <button 
            onClick={() => setShow(false)}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
               <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
               <h3 className="font-bold text-lg text-gray-900">Instala la App</h3>
               <p className="text-sm text-gray-500 mt-1 leading-snug">
                 Accede rápidamente a la cultura de Papantla instalando nuestra plataforma en tu {isIOS ? 'iPhone' : 'dispositivo'}.
               </p>
            </div>
          </div>

          <div className="mt-6">
            {isIOS ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                <span>Toca</span>
                <Share className="w-4 h-4 text-blue-500" />
                <span>luego</span>
                <span className="font-bold">"Agregar al inicio"</span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Instalar Ahora
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
