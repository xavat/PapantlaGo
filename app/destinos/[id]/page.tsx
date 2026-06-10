"use client";

import { useParams } from "next/navigation";
import DetailView from "@/components/DetailView";
import { Clock, Users, Camera, Shield } from "lucide-react";
import { tourismData } from "@/data/tourism";

export default function DestinoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const decodedId = decodeURIComponent(id);
  const found = tourismData.find(item => item.id === decodedId);
  
  const data = found ? {
    ...found,
    details: found.details || [
      { label: "Tiempo", value: "2-3 hrs", icon: Clock },
      { label: "Acceso", value: "Permitido", icon: Shield },
    ],
    gallery: found.gallery || [found.imageUrl]
  } : {
    title: decodedId.replace(/-/g, ' '),
    subtitle: "Destino Turístico",
    description: "Información detallada sobre este destino próximamente. Papantla ofrece una riqueza cultural y natural inigualable que te espera para ser explorada.",
    imageUrl: "/destinos/tajin.jpg",
    rating: "4.8",
    tag: "Explorar",
    location: "Papantla, Veracruz",
    details: [
      { label: "Tiempo", value: "2 hrs", icon: Clock },
      { label: "Acceso", value: "Libre", icon: Shield },
    ]
  };

  return (
    <DetailView {...data} />
  );
}
