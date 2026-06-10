"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, User } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { tourismData } from "@/data/tourism";

// Fix for default marker icons in Leaflet with Next.js
const createIcon = (color: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg`} style={{ backgroundColor: color }}>
        <MapPin className="w-4 h-4" />
      </div>
      <div className={`absolute -bottom-1 w-2 h-2 rotate-45`} style={{ backgroundColor: color }} />
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const userIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center">
      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white animate-pulse">
        <Navigation className="w-3 h-3 fill-white" />
      </div>
    </div>
  ),
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const defaultIcon = createIcon("#8B2635");
const secondaryIcon = createIcon("#D4AF37");

// DATA from Sabores
const locations = tourismData.map(item => ({
  name: item.title,
  coords: item.coords,
  type: item.category === "sabor" ? "Sabores" : item.category === "mural" ? "Mural" : "Destinos",
  id: item.id
}));

function LocationMarker({ setUserPos }: { setUserPos: (pos: [number, number]) => void }) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        setUserPos(newPos);
        // map.flyTo(newPos, map.getZoom()); // Optional: follow user
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [map, setUserPos]);

  return position === null ? null : (
    <>
      <Marker position={position} icon={userIcon}>
        <Popup>Estás aquí</Popup>
      </Marker>
      <Circle center={position} radius={20} pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'transparent' }} />
    </>
  );
}

export default function MapView() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[20.446, -97.323]} 
        zoom={16} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {locations.map((loc, i) => (
          <Marker 
            key={i} 
            position={loc.coords as [number, number]} 
            icon={loc.type === "Sabores" ? defaultIcon : loc.type === "Mural" ? secondaryIcon : defaultIcon}
          >
            <Popup className="premium-popup">
              <div className="p-3 min-w-[150px]">
                <h4 className="font-black text-sm mb-1">{loc.name}</h4>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-3">{loc.type}</p>
                <div className="flex flex-col gap-2">
                   <Link 
                      href={`/${loc.type === "Sabores" ? "sabor" : loc.type === "Mural" ? "destinos" : "destinos"}/${loc.id}`}
                      className="bg-primary text-white text-[9px] font-black uppercase py-2 px-3 rounded-xl text-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
                   >
                      Ver Detalles
                   </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationMarker setUserPos={setUserPos} />
      </MapContainer>
      
      {/* HUD Overlay */}
      <div className="absolute top-24 left-6 right-6 z-[1000] pointer-events-none">
          <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-black/5 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Navigation className="w-6 h-6 animate-pulse" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Navegación Activa</p>
                <p className="text-sm font-bold text-foreground">Explorando Papantla</p>
             </div>
          </div>
      </div>
    </div>
  );
}
