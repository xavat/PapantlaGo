"use client";

import { useParams } from "next/navigation";
import DetailView from "@/components/DetailView";
import { Utensils, Clock, Star } from "lucide-react";
import { tourismData } from "@/data/tourism";

export default function SaborDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const decodedId = decodeURIComponent(id);
  const found = tourismData.find(item => item.id === decodedId);
  
  const data = found ? {
    ...found,
    details: found.details || [
      { label: "Tipo", value: found.tag, icon: Utensils },
      { label: "Espera", value: "15-20 min", icon: Clock },
    ],
    gallery: found.gallery || [found.imageUrl]
  } : {
    title: decodedId.replace(/-/g, ' '),
    subtitle: "Sabor Auténtico",
    description: "Descubre la explosión de sabores tradicionales en este rincón gastronómico de Papantla. Cada platillo cuenta una historia de tradición y cultura totonaca.",
    imageUrl: "/images/locals/traditional.png",
    rating: "4.7",
    tag: "Gastronomía",
    location: "Papantla, Veracruz",
    details: [
      { label: "Tipo", value: "Comida Local", icon: Utensils },
      { label: "Ambiente", value: "Familiar", icon: Star },
    ]
  };

  return (
    <DetailView {...data} />
  );
}
