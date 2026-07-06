"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Carga nativa de estilos Mapbox
import { Navigation, Compass, MapPin, Star, Info, Crosshair, X, Gamepad2 } from "lucide-react";
import { tourismData, TourismItem } from "@/data/tourism";
import Link from "next/link";

// ============================================================================
// CONFIGURACIÓN DE ACCESOS DE MAPBOX
// 1. Regístrate en https://www.mapbox.com/ y obtén una cuenta gratuita.
// 2. Copia tu "Default public token" (Access Token).
// 3. Colócalo aquí o crea un archivo '.env.local' en la raíz con la variable:
//    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_access_token_aqui
// ============================================================================
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

// Estilo del mapa Pokémon GO (Modo Noche / Futurista con Neón)
const MAP_STYLE = "mapbox://styles/mapbox/navigation-dark-v1";

// Estilo libre de respaldo usando CartoDB Dark Matter si el token falla con 401
const CARTODB_DARK_STYLE = {
  version: 8 as const,
  sources: {
    "cartodb-dark": {
      type: "raster" as const,
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256
    }
  },
  layers: [
    {
      id: "cartodb-dark-layer",
      type: "raster" as const,
      source: "cartodb-dark",
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

interface InteractiveMapProps {
  categoryFilter: string | null;
}

export default function InteractiveMap({ categoryFilter }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const lastDestIdRef = useRef<string | null>(null);

  // States
  const [selectedPlace, setSelectedPlace] = useState<TourismItem | null>(null);
  const [activeDestination, setActiveDestination] = useState<TourismItem | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number]>([-97.3225, 20.4465]); // [lng, lat]
  const [mapHeading, setMapHeading] = useState<number>(0);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [mapInitialized, setMapInitialized] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [styleVersion, setStyleVersion] = useState<number>(0);

  // SIMULADOR GPS / MODO DEMO
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDemoActiveRef = useRef<boolean>(false);
  const isFollowingUserRef = useRef<boolean>(true);

  // Ruta del Simulador: Caminata virtual alrededor del Centro Histórico y Monumento al Volador
  const demoPath: [number, number][] = [
    [-97.3225, 20.4465], // Catedral / Parque Central
    [-97.3218, 20.4469], // Av 16 de Septiembre
    [-97.3210, 20.4468], // Cruce Reforma
    [-97.3204, 20.4461], // Entrada Parque Volador
    [-97.3202, 20.4455], // Monumento al Volador (Punto de Interés)
    [-97.3209, 20.4450], // Bajada por calle lateral
    [-97.3219, 20.4452], // Calle Aquiles Serdán
    [-97.3228, 20.4456], // Colegio Militar
    [-97.3235, 20.4461], // Parque Madero
    [-97.3230, 20.4465], // Vuelta hacia Catedral
  ];

  // Sincronizar referencias
  useEffect(() => {
    isDemoActiveRef.current = isDemoActive;
  }, [isDemoActive]);

  useEffect(() => {
    isFollowingUserRef.current = isFollowingUser;
  }, [isFollowingUser]);

  // Inicialización de Mapbox
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear el mapa con inclinación (pitch) estilo 2.5D
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE,
      center: userCoords,
      zoom: 16.8,
      pitch: 55, // Inclinación 3D estilo Pokémon Go
      bearing: 0,
      antialias: true,
    });

    mapRef.current = map;
    setMapInitialized(true);

    let loadingFallback = false;

    // Función para configurar capas dinámicas (edificios 3D, etc.) al cargar el estilo
    const setupLayers = () => {
      setMapLoaded(true);
      setStyleVersion((prev) => prev + 1);

      // Cargar edificios 3D para una experiencia premium (sólo funciona con fuentes vectoriales de composite)
      const layers = map.getStyle()?.layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      if (map.getSource("composite")) {
        try {
          if (!map.getLayer("3d-buildings")) {
            map.addLayer(
              {
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                filter: ["==", "extrude", "true"],
                type: "fill-extrusion",
                minzoom: 15,
                paint: {
                  "fill-extrusion-color": "#2c2a3e",
                  "fill-extrusion-height": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "height"],
                  ],
                  "fill-extrusion-base": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    15,
                    0,
                    15.05,
                    ["get", "min_height"],
                  ],
                  "fill-extrusion-opacity": 0.55,
                },
              },
              labelLayerId
            );
          }
        } catch (e) {
          console.warn("Edificios 3D no pudieron cargarse debido al error de estilo");
        }
      }
    };

    map.on("style.load", setupLayers);

    map.on("load", () => {
      setupLayers();
    });

    map.on("error", (e) => {
      // Capturar errores de token no autorizado (ej. 401)
      if (e.error && (e.error.message?.includes("Unauthorized") || e.error.message?.includes("401"))) {
        setTokenError(true);
        if (!loadingFallback) {
          loadingFallback = true;
          console.warn("Mapbox Token 401 unauthorized. Switching to free CartoDB Dark Matter style...");
          map.setStyle(CARTODB_DARK_STYLE);
        }
      }
    });

    // Marcador del Usuario (Avatar/Flecha con pulso holográfico)
    const userMarkerEl = document.createElement("div");
    userMarkerEl.className = "user-pointer-container";
    userMarkerEl.innerHTML = `
      <div class="user-pulse-outer"></div>
      <div class="user-pointer-arrow">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.95));">
          <polygon points="12 2 2 22 12 17 22 22 12 2"/>
        </svg>
      </div>
    `;

    const userMarker = new mapboxgl.Marker({
      element: userMarkerEl,
      anchor: "center",
      rotationAlignment: "map",
    })
      .setLngLat(userCoords)
      .addTo(map);

    userMarkerRef.current = userMarker;

    // Rastrear ubicación real del usuario vía GPS (watchPosition)
    const geoWatcher = navigator.geolocation.watchPosition(
      (position) => {
        if (isDemoActiveRef.current) return; // Ignorar GPS real si el Simulador de caminata está activo

        const { longitude, latitude, heading, accuracy } = position.coords;
        const newCoords: [number, number] = [longitude, latitude];

        setUserCoords(newCoords);
        setGpsAccuracy(accuracy);

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat(newCoords);
        }

        // Si tenemos dirección (heading) del GPS real, alinear la cámara y marcador
        if (heading !== null && heading !== undefined) {
          setMapHeading(Math.round(heading));
          if (userMarkerRef.current) {
            userMarkerRef.current.setRotation(heading);
          }
          if (isFollowingUserRef.current && mapRef.current) {
            mapRef.current.easeTo({
              center: newCoords,
              bearing: heading,
              duration: 800,
            });
          }
        } else if (isFollowingUserRef.current && mapRef.current) {
          mapRef.current.easeTo({
            center: newCoords,
            duration: 800,
          });
        }
      },
      (error) => {
        console.warn("Ubicación GPS denegada u ocupada:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Giro del mapa y marcador basándose en la orientación física del móvil (Brújula)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isDemoActiveRef.current) return; // Ignorar brújula si el modo simulador está activo

      let heading = (e as any).webkitCompassHeading;
      if (heading === undefined || heading === null) {
        if (e.alpha !== null) {
          heading = 360 - e.alpha;
        }
      }

      if (heading !== undefined && heading !== null) {
        const roundedHeading = Math.round(heading);
        setMapHeading(roundedHeading);

        if (userMarkerRef.current) {
          userMarkerRef.current.setRotation(roundedHeading);
        }

        if (isFollowingUserRef.current && mapRef.current) {
          mapRef.current.setBearing(roundedHeading);
        }
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      if (geoWatcher) navigator.geolocation.clearWatch(geoWatcher);
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Lógica del modo Demo: simular caminata
  useEffect(() => {
    if (!isDemoActive) {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
      return;
    }

    // Iniciar con la primera coordenada
    const startPoint = demoPath[0];
    setUserCoords(startPoint);
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat(startPoint);
      userMarkerRef.current.setRotation(0);
    }
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: startPoint,
        zoom: 17.2,
        pitch: 55,
        bearing: 0,
        duration: 1000,
      });
    }

    demoIntervalRef.current = setInterval(() => {
      setDemoIndex((prevVal) => {
        const nextVal = (prevVal + 1) % demoPath.length;
        const currentLoc = demoPath[prevVal];
        const nextLoc = demoPath[nextVal];

        // Calcular ángulo del rumbo en el que se camina
        const lngDiff = nextLoc[0] - currentLoc[0];
        const latDiff = nextLoc[1] - currentLoc[1];
        let angle = Math.atan2(lngDiff, latDiff) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const headingAngle = Math.round(angle);
        setUserCoords(nextLoc);
        setMapHeading(headingAngle);

        if (userMarkerRef.current) {
          userMarkerRef.current.setLngLat(nextLoc);
          userMarkerRef.current.setRotation(headingAngle);
        }

        if (isFollowingUserRef.current && mapRef.current) {
          mapRef.current.easeTo({
            center: nextLoc,
            bearing: headingAngle,
            pitch: 55,
            zoom: 17.2,
            duration: 1800, // Transición suave estilo joystick
          });
        }

        return nextVal;
      });
    }, 4500); // Avanzar cada 4.5 segundos

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
    };
  }, [isDemoActive]);

  // Actualizar y filtrar Marcadores circulares (estilo Poképarada) en base al filtro seleccionado.
  // Se ejecuta inmediatamente cuando el mapa es inicializado, permitiendo renderizar los portales
  // independientemente de si la API de Mapbox devuelve 401 o carga completamente.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapInitialized) return;

    // Eliminar marcadores previos
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filtrar los datos
    const filteredData = categoryFilter
      ? tourismData.filter((place) => place.category === categoryFilter)
      : tourismData;

    // Evitar que pines con exactamente las mismas coordenadas se encimen
    const renderedCoords = new Set<string>();

    filteredData.forEach((place) => {
      if (!place.coords || place.coords.length < 2) return;
      let [lat, lng] = place.coords;

      // Jitter (dispersión) de hasta 40 metros para evitar superposición perfecta
      const coordKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      if (renderedCoords.has(coordKey)) {
        lat += (Math.random() - 0.5) * 0.00065;
        lng += (Math.random() - 0.5) * 0.00065;
      }
      renderedCoords.add(coordKey);

      // Colores de la Poképarada y emoji según categoría
      let badgeColor = "#3b82f6";
      let symbol = "📍";

      switch (place.category) {
        case "sabor":
          badgeColor = "#ec4899"; // Rosa - Alimentos
          symbol = "🍺";
          break;
        case "hospedaje":
          badgeColor = "#f59e0b"; // Naranja/Amarillo - Hoteles
          symbol = "🏨";
          break;
        case "destinos":
          badgeColor = "#a855f7"; // Púrpura - Sitios turísticos
          symbol = "🏛️";
          break;
        case "eventos":
          badgeColor = "#e11d48"; // Rojo - Eventos
          symbol = "🎉";
          break;
        default:
          badgeColor = "#06b6d4"; // Cyan
          symbol = "✨";
      }

      // Crear DOM del marcador de Poképarada con imagen o emoji
      const el = document.createElement("div");
      el.className = "pokestop-container";
      el.innerHTML = `
        <div class="pokestop-pulse" style="background-color: ${badgeColor};"></div>
        <div class="pokestop-inner" style="border-color: ${badgeColor};">
          <div class="pokestop-photo" style="background-image: url('${place.imageUrl || ""}');">
            ${!place.imageUrl ? `<span class="pokestop-symbol">${symbol}</span>` : ""}
          </div>
        </div>
      `;

      // Inicializar y añadir al mapa
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([lng, lat])
        .addTo(map);

      // Listener al cliquear el portal
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedPlace(place);

        // Cámara enfoca suavemente el elemento
        map.easeTo({
          center: [lng, lat],
          zoom: 17.5,
          pitch: 50,
          duration: 1000,
        });
        setIsFollowingUser(false); // Detener el centrado del jugador
      });

      markersRef.current.push(marker);
    });
  }, [mapInitialized, categoryFilter]);

  // Dibujar y actualizar ruta de destino fijado
  useEffect(() => {
    const map = mapRef.current;
    // Solo dibujar la línea vectorial si el mapa está listo y tiene estilos cargados (evita crash en 401)
    if (!map || !mapLoaded || !map.isStyleLoaded()) return;

    const sourceId = "route-source";
    const layerId = "route-layer";

    // Si se canceló el destino, remover la ruta
    if (!activeDestination) {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      lastDestIdRef.current = null;
      return;
    }

    const destCoords: [number, number] = [
      activeDestination.coords[1], // Longitude
      activeDestination.coords[0], // Latitude
    ];

    try {
      // Actualizar coordenadas dinámicamente si ya existe la fuente
      const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [userCoords, destCoords],
          },
        });
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [userCoords, destCoords],
            },
          },
        });
      }

      // Añadir capa de línea brillante punteada si no existe
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#22d3ee", // Cyan eléctrico de neón
            "line-width": 6,
            "line-dasharray": [2, 2], // Línea discontinua
          },
        });
      }

      // Enfocar la cámara para mostrar ambos puntos sólamente al fijar destino
      if (lastDestIdRef.current !== activeDestination.id) {
        lastDestIdRef.current = activeDestination.id;
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(userCoords);
        bounds.extend(destCoords);
        map.fitBounds(bounds, {
          padding: { top: 120, bottom: 260, left: 60, right: 60 },
          maxZoom: 16.5,
          duration: 1200,
        });
        setIsFollowingUser(false);
      }
    } catch (e) {
      console.warn("No se pudo dibujar la ruta vectorial Mapbox", e);
    }
  }, [activeDestination, userCoords, mapLoaded, styleVersion]);

  // Animación interactiva en tiempo real del estilo de la línea de ruta (Láser dinámico)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !map.isStyleLoaded() || !activeDestination) return;

    let animationFrameId: number;
    let step = 0;
    const layerId = "route-layer";

    const animateDash = () => {
      if (map.getLayer(layerId)) {
        step = (step + 0.12) % 4; // Velocidad del láser brillante
        try {
          map.setPaintProperty(layerId, "line-dasharray", [2, 2, step]);
        } catch (e) {
          // Evitar errores si el componente se desmonta
        }
      }
      animationFrameId = requestAnimationFrame(animateDash);
    };

    animateDash();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeDestination, mapLoaded, styleVersion]);

  // Centrar cámara en el usuario
  const triggerCenter = () => {
    setIsFollowingUser(true);
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: userCoords,
        zoom: 17,
        pitch: 55,
        bearing: mapHeading || 0,
        duration: 1000,
      });
    }
  };

  // Alternar el modo simulado / demo
  const toggleDemoMode = () => {
    setIsDemoActive((prev) => {
      const newVal = !prev;
      if (newVal) {
        setIsFollowingUser(true);
        setDemoIndex(0);
      }
      return newVal;
    });
  };

  // Fijador de Destino
  const setWaypoint = (place: TourismItem) => {
    setActiveDestination(place);
    setSelectedPlace(null);
  };

  // Limpiar Destino
  const clearWaypoint = () => {
    setActiveDestination(null);
  };

  return (
    <div className="w-full h-full relative" id="mapbox-main-player">
      {/* Contenedor del Mapa Mapbox */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#111019]" />

      {/* COMPACTO ALERTA SI EL TOKEN ES INVÁLIDO */}
      {tokenError && (
        <div className="absolute top-28 left-6 right-6 z-50 pointer-events-none">
          <div className="bg-rose-950/95 text-white p-4 rounded-3xl shadow-xl border border-rose-500/20 backdrop-blur-xl flex flex-col gap-1 text-[11px] font-semibold leading-relaxed">
            <div className="flex items-center gap-2 text-rose-200">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-black uppercase tracking-wider">Access Token de Mapbox Inválido</span>
            </div>
            <p className="text-rose-300/80 mt-0.5 pointer-events-auto">
              El mapa se muestra negro porque tu token de cortesía o configuración no está autorizado. Agrega una variable 
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono ml-1 text-white">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> 
              en tu archivo <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-white">.env.local</code> con un token válido.
            </p>
          </div>
        </div>
      )}

      {/* CONTROLES DE NAVEGACIÓN Y GEOLOCALIZACIÓN FLOTANTES */}
      <div className="absolute top-28 right-6 z-30 flex flex-col gap-3 pointer-events-auto">
        {/* Toggle Modo Demo (Simulador GPS) */}
        <button
          onClick={toggleDemoMode}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xl active:scale-90 transition-all ${
            isDemoActive
              ? "bg-purple-600 border-purple-500 text-white animate-pulse"
              : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-foreground"
          }`}
          title={isDemoActive ? "Desactivar caminata simulada" : "Activar caminata simulada (Modo Demo)"}
        >
          <Gamepad2 className="w-5 h-5" />
        </button>

        {/* Centrar cámara en jugador */}
        <button
          onClick={triggerCenter}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xl active:scale-95 transition-all ${
            isFollowingUser
              ? "bg-cyan-500 border-cyan-400 text-white animate-pulse"
              : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-foreground"
          }`}
          title="Centrar en mi ubicación"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Cancelar Destino */}
        {activeDestination && (
          <button
            onClick={clearWaypoint}
            className="w-12 h-12 rounded-2xl bg-rose-500 border border-rose-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all font-black text-xs uppercase"
            title="Cancelar Ruta"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* BRÚJULA COMPASS CARD */}
      <div className="absolute top-28 left-6 z-30 pointer-events-none">
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5">
          <Compass
            className="w-5 h-5 text-cyan-400 transition-transform duration-200"
            style={{ transform: `rotate(${-mapHeading}deg)` }}
          />
          <div className="flex flex-col">
            <span className="text-[7.5px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider leading-none">
              Rumbo
            </span>
            <span className="text-xs font-black text-foreground mt-0.5 flex items-center justify-center">
              {mapHeading}°{" "}
              {mapHeading > 337 || mapHeading <= 22
                ? "N"
                : mapHeading > 22 && mapHeading <= 67
                ? "NE"
                : mapHeading > 67 && mapHeading <= 112
                ? "E"
                : mapHeading > 112 && mapHeading <= 157
                ? "SE"
                : mapHeading > 157 && mapHeading <= 202
                ? "S"
                : mapHeading > 202 && mapHeading <= 247
                ? "SO"
                : mapHeading > 247 && mapHeading <= 292
                ? "O"
                : "NO"}
            </span>
          </div>
        </div>
      </div>

      {/* HUD DE DESTINO FIJADO ACTIVO */}
      {activeDestination && (
        <div className="absolute top-48 left-6 right-6 z-30 pointer-events-none">
          <div className="bg-gradient-to-r from-cyan-600/95 to-blue-700/95 text-white p-4 rounded-3xl shadow-xl border border-cyan-400/20 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-cyan-200 animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-cyan-200">
                  Ruta de Destino
                </span>
                <span className="text-sm font-black tracking-tight leading-tight truncate max-w-[170px]">
                  {activeDestination.title}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearWaypoint();
              }}
              className="px-4 py-2.5 bg-black/25 hover:bg-black/40 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all pointer-events-auto border border-white/10"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* POPUP / MODAL INFERIOR DE DETALLES DEL LUGAR CLICKEADO */}
      {selectedPlace && (
        <div className="absolute bottom-28 left-6 right-6 z-40 pointer-events-auto">
          <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[35px] shadow-2xl p-5 relative overflow-hidden flex flex-col gap-4">
            {/* Header del Lugar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2.5xl">
                  {selectedPlace.category === "sabor"
                    ? "🍺"
                    : selectedPlace.category === "hospedaje"
                    ? "🏨"
                    : "🏛️"}
                </div>
                <div>
                  <span className="text-[8px] bg-primary/10 text-primary dark:bg-primary/20 dark:text-cyan-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase border border-primary/20">
                    {selectedPlace.category === "sabor"
                      ? "Gastronomía"
                      : selectedPlace.category === "hospedaje"
                      ? "Hospedaje"
                      : selectedPlace.category === "destinos"
                      ? "Atracción"
                      : "Evento"}
                  </span>
                  <h3 className="text-lg font-black text-foreground leading-tight tracking-tight mt-1">
                    {selectedPlace.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-foreground hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Descripción */}
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold line-clamp-2 leading-relaxed">
              {selectedPlace.description}
            </p>

            {/* Detalles Rápidos */}
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-zinc-400 border-t border-black/5 dark:border-white/5 pt-3">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span>{selectedPlace.rating || "4.5"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[180px]">{selectedPlace.location}</span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <Link
                href={`/${
                  selectedPlace.category === "sabor"
                    ? "sabor"
                    : selectedPlace.category === "hospedaje"
                    ? "hospedaje"
                    : "destinos"
                }/${selectedPlace.id}`}
                className="py-3.5 bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 hover:bg-gray-200 text-foreground rounded-2xl font-black uppercase text-[9px] tracking-widest text-center transition-colors border border-black/5 dark:border-white/10"
              >
                Ver Ficha
              </Link>

              <button
                onClick={() => setWaypoint(selectedPlace)}
                className="py-3.5 bg-primary hover:bg-[#721F2C] dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 dark:shadow-cyan-500/10"
              >
                <Navigation className="w-3.5 h-3.5" /> Fijar Destino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS GLOBALES CSS PARA ELEMENTOS PERSONALIZADOS DEL MAPA */}
      <style jsx global>{`
        /* MARCADOR DE COMPÁS DEL USUARIO (AVATAR / FLECHA DE JUEGO) */
        .user-pointer-container {
          position: relative;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-pulse-outer {
          position: absolute;
          width: 52px;
          height: 52px;
          background: rgba(34, 211, 238, 0.22);
          border: 2px solid rgba(34, 211, 238, 0.6);
          border-radius: 50%;
          animation: mapPulse 2s infinite ease-out;
          pointer-events: none;
        }

        .user-pointer-arrow {
          position: relative;
          transform-origin: center;
          transition: transform 0.25s ease-out;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.5));
          z-index: 15;
        }

        /* POKESTOP CUSTOM PINS */
        .pokestop-container {
          position: relative;
          width: 52px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
        }

        .pokestop-pulse {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          bottom: 10px;
          animation: mapPulse 1.8s infinite ease-out;
          opacity: 0;
          pointer-events: none;
          z-index: -1;
        }

        .pokestop-inner {
          width: 44px;
          height: 44px;
          border: 4px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          bottom: 10px;
          transform: translateY(0);
          transition: transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s;
          overflow: hidden;
          background: #ffffff;
        }

        .pokestop-container:hover .pokestop-inner {
          transform: translateY(-8px) scale(1.22);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        }

        .pokestop-photo {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e5e7eb;
        }

        .pokestop-symbol {
          font-size: 16px;
          line-height: 1;
        }

        /* Animación del pulso */
        @keyframes mapPulse {
          0% {
            transform: scale(0.65);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
