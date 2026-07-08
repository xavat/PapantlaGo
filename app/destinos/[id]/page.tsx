"use client";

import { useParams } from "next/navigation";
import DetailView from "@/components/DetailView";
import { Clock, Users, Camera, Shield } from "lucide-react";
import { tourismData } from "@/data/tourism";

export default function DestinoDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const decodedId = decodeURIComponent(id);
  
  const normalize = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const found = tourismData.find(item => {
    const normalItemId = normalize(item.id);
    const normalDecodedId = normalize(decodedId);
    return normalItemId === normalDecodedId || 
           (normalItemId !== "" && normalDecodedId.includes(normalItemId)) ||
           (normalDecodedId !== "" && normalItemId.includes(normalDecodedId));
  });
  
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
