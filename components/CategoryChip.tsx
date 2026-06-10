"use client";

import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function CategoryChip({ label, isSelected, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-8 py-4 rounded-[1.5rem] text-sm font-extrabold transition-all border border-transparent flex-shrink-0 active:scale-95 shadow-sm",
        isSelected 
          ? "bg-[#F16B24] text-white shadow-orange-100 border-[#F16B24]" 
          : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
      )}
    >
      {label}
    </button>
  );
}
