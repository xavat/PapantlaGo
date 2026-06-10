"use client";

import { useState } from "react";
import CategoryChip from "@/components/CategoryChip";
import { ChevronLeft, ChevronRight, Bookmark, MapPin } from "lucide-react";
import Image from "next/image";

const categories = ["Todos", "Festivales", "Sabor", "Tradición"];

export default function EventsPage() {
  const [selected, setSelected] = useState("Todos");

  return (
    <div className="px-6 pt-10 pb-32 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
          Calendario <br />
          <span className="text-[#F16B24] not-italic">de Eventos</span>
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
        {categories.map((cat) => (
          <CategoryChip
            key={cat}
            label={cat}
            isSelected={selected === cat}
            onClick={() => setSelected(cat)}
          />
        ))}
      </div>

      {/* Calendar Card Simulation */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200 border border-gray-50 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <ChevronLeft className="w-6 h-6 text-gray-400" />
          <span className="font-extrabold text-xl">Marzo 2024</span>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-7 text-center gap-y-4">
          {["D", "L", "M", "M", "J", "V", "S"].map(d => (
            <span key={d} className="text-gray-300 font-bold text-xs">{d}</span>
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const highlighted = [18, 19, 20, 21].includes(day);
            return (
              <div 
                key={day}
                className={`aspect-square flex items-center justify-center font-bold text-sm rounded-full transition-all
                  ${highlighted ? 'bg-[#F16B24] text-white scale-110 shadow-lg shadow-orange-100' : 'text-gray-900'}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-4">
        Eventos para el 18 de Marzo
      </h3>

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-gray-100 border border-gray-50 flex gap-4 overflow-hidden group">
          <div className="flex-1 flex flex-col gap-1">
            <h4 className="font-extrabold text-xl leading-tight">Cumbre Tajín</h4>
            <span className="text-[#F16B24] text-xs font-bold uppercase tracking-widest">18-21 de Marzo</span>
            <div className="flex items-center gap-2 text-gray-400 text-xs mt-2">
              <MapPin className="w-3 h-3" />
              <span>Parque Takilhsukut</span>
            </div>
            <button className="mt-4 bg-orange-50 text-[#F16B24] font-black text-xs py-3 px-4 rounded-xl flex items-center gap-2 group-hover:bg-[#F16B24] group-hover:text-white transition-all w-fit">
              <Bookmark className="w-4 h-4" />
              Agregar a mi agenda
            </button>
          </div>
          <div className="relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?auto=format&fit=crop&q=80"
              alt="Cumbre"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
