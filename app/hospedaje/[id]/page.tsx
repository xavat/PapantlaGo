"use client";

import { useParams } from "next/navigation";
import DetailView from "@/components/DetailView";
import { Bed, Shield, Wifi, Coffee, Clock } from "lucide-react";
import { tourismData } from "@/data/tourism";

export default function HotelDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const decodedId = decodeURIComponent(id);
  const found = tourismData.find(item => item.id === decodedId);
  
  const iconMap: Record<string, any> = {
    bed: Bed,
    shield: Shield,
    wifi: Wifi,
    coffee: Coffee,
    clock: Clock,
  };

  const data = found ? {
    ...found,
    location: found.address || found.location,
    details: found.details?.map(d => ({
      ...d,
      icon: iconMap[d.icon] || Coffee
    })) || [
      { label: "Habitaciones", value: "Disponibles", icon: Bed },
      { label: "Servicios", value: "Wifi/TV", icon: Wifi },
    ],
    gallery: found.gallery || [found.imageUrl]
  } : {
    title: decodedId.replace(/-/g, ' '),
    subtitle: "Hospedaje de Calidad",
    description: "Este establecimiento ofrece todas las comodidades necesarias para una estancia placentera en Papantla. Disfruta de la calidez de nuestra gente y la belleza de nuestro pueblo mágico.",
    imageUrl: "/images/hotels/hotel_1.png",
    rating: "4.2",
    tag: "Hospedaje",
    location: "Papantla de Olarte, Veracruz",
    details: [
      { label: "Habitaciones", value: "Disponibles", icon: Bed },
      { label: "Seguridad", value: "Garantizada", icon: Shield },
    ]
  };

  return (
    <DetailView {...data} />
  );
}
