import PlaceCard from "@/components/PlaceCard";

export default function GastronomyPage() {
  return (
    <div className="px-6 pt-10 pb-32 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
          Sabor <br />
          <span className="text-[#F16B24] not-italic">Totonaca</span>
        </h2>
        <p className="text-gray-400 font-medium text-lg italic">
          Degusta la herencia culinaria que perfuma al mundo con su vainilla.
        </p>
      </div>

      <PlaceCard
        title="Zacahuil Traditions"
        description="El tamal más grande de México, cocido en horno de tierra con leña de encino y especias tradicionales."
        imageUrl="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80"
        category="Platillo Típico"
        buttonText="Ver más"
      />

      <PlaceCard
        title="Restaurante 'El Totonacapan'"
        description="Especialistas en bocoles y cocina regional con el aroma de la vainilla auténtica de Papantla."
        imageUrl="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80"
        category="Restaurante"
        rating="4.7 (310 reseñas)"
        buttonText="Ver más"
      />

      <PlaceCard
        title="Café de Vainilla"
        description="Disfruta de una taza de café fusionada con extracto natural de la vainilla más fina de la región."
        imageUrl="https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80"
        category="Cafetería"
        rating="4.9 (150 reseñas)"
        buttonText="Ver más"
      />
    </div>
  );
}
