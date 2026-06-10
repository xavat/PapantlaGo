"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface IOSCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  className?: string;
}

export default function IOSCard({ title, subtitle, imageUrl, className = "" }: IOSCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`relative rounded-[20px] overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
        {subtitle && (
          <span className="text-white/60 text-[10px] uppercase font-bold tracking-[0.2em]">
            {subtitle}
          </span>
        )}
        <h3 className="text-white text-xl font-bold tracking-tight">
          {title}
        </h3>
      </div>
    </motion.div>
  );
}
