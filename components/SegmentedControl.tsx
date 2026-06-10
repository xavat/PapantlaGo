"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface SegmentedControlProps {
  options: string[];
  onChange?: (selected: string) => void;
}

export default function SegmentedControl({ options, onChange }: SegmentedControlProps) {
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option: string) => {
    setSelected(option);
    onChange?.(option);
  };

  return (
    <div className="bg-gray-200/50 dark:bg-white/5 p-1 rounded-2xl flex relative w-full border border-black/5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-tight relative z-10 transition-colors duration-300 ${
            selected === option ? "text-foreground" : "text-gray-400"
          }`}
        >
          {option}
        </button>
      ))}
      <motion.div
        layoutId="segment"
        animate={{ x: options.indexOf(selected) * 100 + "%" }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        style={{ width: 100 / options.length + "%" }}
        className="absolute top-1 left-1 bottom-1 bg-white dark:bg-white/10 rounded-[14px] shadow-sm"
      />
    </div>
  );
}
