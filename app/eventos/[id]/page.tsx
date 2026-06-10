"use client";

import { useParams } from "next/navigation";
import DetailView from "@/components/DetailView";
import { Calendar, Clock, MapPin } from "lucide-react";

const eventsData = [
  {
    id: "cumbre-tajin",
    title: "Cumbre Tajín",
    subtitle: "Festival de la Identidad",
    description: "Uno de los festivales culturales más importantes de México, celebrado en el corazón de la zona arqueológica de El Tajín. Incluye conciertos, talleres, ceremonias rituales y una profunda inmersión en la cultura totonaca.",
    imageUrl: "/images/events/cumbre_tajin.png",
    rating: "4.9",
    tag: "Festival Cultural",
    location: "Zona Arqueológica El Tajín",
    details: [
      { label: "Fecha", value: "20-23 Marzo", icon: Calendar },
      { label: "Duración", value: "4 Días", icon: Clock },
    ],
    gallery: ["/images/events/cumbre_tajin.png"]
  },
  {
    id: "carnaval-alegria",
    title: "Carnaval de la Alegría",
    subtitle: "Magia y Color",
    description: "Un desfile vibrante por las calles de Papantla con música en vivo, comparsas y la alegría característica de la región norte de Veracruz.",
    imageUrl: "/images/events/carnaval_alegria.png",
    rating: "4.7",
    tag: "Carnaval",
    location: "Calles del Centro, Papantla",
    details: [
      { label: "Fecha", value: "4 Junio", icon: Calendar },
      { label: "Ambiente", value: "Festivo", icon: Clock },
    ]
  },
  {
    id: "corpus-christi",
    title: "Feria de Corpus Christi",
    subtitle: "Máxima Tradición",
    description: "La celebración más sagrada de Papantla, donde se recrea la Danza de los Voladores en su máxima expresión y se celebra la fertilidad de la tierra.",
    imageUrl: "/images/events/corpus_christi.png",
    rating: "4.9",
    tag: "Religioso/Cultural",
    location: "Centro Histórico y Terrenos de la Feria",
    details: [
      { label: "Fecha", value: "May-Jun", icon: Calendar },
      { label: "Tradición", value: "Ancestral", icon: MapPin },
    ]
  }
];

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const decodedId = decodeURIComponent(id);
  const found = eventsData.find(item => item.id === decodedId || decodedId.includes(item.id));
  
  const data = found || {
    title: decodedId.replace(/-/g, ' ').replace('-detail', ''),
    subtitle: "Evento Cultural",
    description: "Descubre la magia de este evento tradicional en Papantla. Una celebración que une a la comunidad y preserva nuestras raíces ancestrales.",
    imageUrl: "/images/events/cumbre_tajin.png",
    rating: "4.8",
    tag: "Evento",
    location: "Papantla, Veracruz",
    details: [
      { label: "Tipo", value: "Cultural", icon: Calendar },
      { label: "Entrada", value: "Libre", icon: Clock },
    ]
  };

  return (
    <DetailView {...data} />
  );
}
