"use client";

import { useState } from "react";
import PlaceCard from "@/components/PlaceCard";
import CategoryChip from "@/components/CategoryChip";
import { Map as MapIcon } from "lucide-react";

const categories = ["Hoteles", "Posadas", "Boutique", "Cabañas"];

export default function LodgingPage() {
  const [selected, setSelected] = useState("Hoteles");

  return (
    <div className="px-6 pt-10 pb-32 flex flex-col gap-8 relative">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
          Tu Estancia <br />
          <span className="text-[#F16B24] not-italic">Ideal en Papantla</span>
        </h2>
        <p className="text-gray-400 font-medium text-lg italic">
          Encuentra el refugio perfecto para descansar tras un día de vuelo y cultura.
        </p>
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

      <div className="flex flex-col gap-6">
        <PlaceCard
          title="Hotel Tajín"
          category="Hotel"
          rating="4.5 (250 reseñas)"
          price="$1,500 - $3,000 MXN"
          imageUrl="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
          buttonText="Ver detalles"
        />

        <PlaceCard
          title="Posada KXLIL"
          category="Posada"
          rating="4.8 (180 reseñas)"
          price="$800 - $1,500 MXN"
          imageUrl="https://images.unsplash.com/photo-1551882547-ff43c63efe81?auto=format&fit=crop&q=80"
          buttonText="Ver detalles"
        />

        <PlaceCard
          title="Boutique Casa Vientos"
          category="Boutique"
          rating="4.9 (120 reseñas)"
          price="$2,500 - $4,500 MXN"
          imageUrl="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
          buttonText="Ver detalles"
        />
      </div>

      <button className="fixed bottom-24 right-6 p-5 bg-[#F16B24] text-white rounded-[2rem] shadow-2xl shadow-orange-300 hover:scale-110 active:scale-90 transition-all z-40 md:bottom-12 md:right-12">
        <MapIcon className="w-8 h-8 stroke-[2.5px]" />
      </button>
    </div>
  );
}
