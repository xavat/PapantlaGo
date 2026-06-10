"use client";

import { motion } from "framer-motion";
import { Search, Mic } from "lucide-react";

export default function FloatingSearch() {
  return (
    <div className="w-full px-6 -mt-8 relative z-20">
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl h-14 flex items-center px-4 gap-3 shadow-lg"
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="¿A dónde quieres ir?"
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-gray-400 dark:text-white"
        />
        <div className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800" />
        <Mic className="w-5 h-5 text-primary" />
      </motion.div>
    </div>
  );
}
