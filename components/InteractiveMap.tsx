"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "leaflet/dist/leaflet.css";
import { Navigation, Compass, MapPin, Star, Info, Crosshair, X, Gamepad2 } from "lucide-react";
import { tourismData, TourismItem } from "@/data/tourism";
import Link from "next/link";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

const MAP_STYLE = "mapbox://styles/mapbox/navigation-dark-v1";

interface InteractiveMapProps {
  categoryFilter: string | null;
}

export default function InteractiveMap({ categoryFilter }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs para instancias de mapas
  const mapboxMapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxUserMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const mapboxMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Refs de Leaflet (cargados dinámicamente)
  const leafletMapRef = useRef<any>(null);
  const leafletUserMarkerRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const leafletRouteLineRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  // States
  const [mapType, setMapType] = useState<"mapbox" | "leaflet" | "none">("none");
  const [selectedPlace, setSelectedPlace] = useState<TourismItem | null>(null);
  const [activeDestination, setActiveDestination] = useState<TourismItem | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number]>([-97.3225, 20.4465]); // [lng, lat]
  const [mapHeading, setMapHeading] = useState<number>(0);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isDemoActiveRef = useRef<boolean>(false);
  const isFollowingUserRef = useRef<boolean>(true);
  const userCoordsRef = useRef<[number, number]>(userCoords);

  // Ruta del Simulador
  const demoPath: [number, number][] = [
    [-97.3225, 20.4465],
    [-97.3218, 20.4469],
    [-97.3210, 20.4468],
    [-97.3204, 20.4461],
    [-97.3202, 20.4455],
    [-97.3209, 20.4450],
    [-97.3219, 20.4452],
    [-97.3228, 20.4456],
    [-97.3235, 20.4461],
    [-97.3230, 20.4465],
  ];

  // Sincronizar referencias
  useEffect(() => {
    isDemoActiveRef.current = isDemoActive;
  }, [isDemoActive]);

  useEffect(() => {
    isFollowingUserRef.current = isFollowingUser;
  }, [isFollowingUser]);

  useEffect(() => {
    userCoordsRef.current = userCoords;
  }, [userCoords]);

  // Inicialización Unificada
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapboxInstance: mapboxgl.Map | null = null;
    let leafletInstance: any = null;
    let L: any = null;

    const setupLeafletFallback = () => {
      console.warn("Utilizando fallback de Leaflet.");
      setTokenError(true);
      setMapType("leaflet");

      // Cargar Leaflet dinámicamente en cliente
      L = require("leaflet");
      LRef.current = L;

      // Fix para los iconos de Leaflet por defecto
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const initialCoords = userCoordsRef.current;
      leafletInstance = L.map(mapContainerRef.current!, {
        center: [initialCoords[1], initialCoords[0]], // [lat, lng]
        zoom: 17,
        zoomControl: false,
        attributionControl: false,
      });

      // Capa de mapa oscura estilo neon
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
      }).addTo(leafletInstance);

      // Marcador del Jugador en Leaflet
      const userMarkerHtml = `
        <div class="user-pointer-container leaflet-user-pointer">
          <div class="user-pulse-outer"></div>
          <div class="user-pointer-arrow" style="transform: rotate(0deg);">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#22d3ee" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.95));">
              <polygon points="12 2 2 22 12 17 22 22 12 2"/>
            </svg>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userMarkerHtml,
        className: "custom-leaflet-user-icon",
        iconSize: [52, 52],
        iconAnchor: [26, 26],
      });

      const leafletUserMarker = L.marker([initialCoords[1], initialCoords[0]], { icon: userIcon }).addTo(leafletInstance);
      leafletUserMarkerRef.current = leafletUserMarker;
      leafletMapRef.current = leafletInstance;
    };

    if (!MAPBOX_TOKEN) {
      setupLeafletFallback();
    } else {
      try {
        setMapType("mapbox");
        mapboxInstance = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: MAP_STYLE,
          center: userCoordsRef.current,
          zoom: 16.8,
          pitch: 55,
          bearing: 0,
          antialias: true,
        });

        mapboxMapRef.current = mapboxInstance;

        mapboxInstance.on("error", (e) => {
          if (e.error && (e.error.message?.includes("Unauthorized") || e.error.message?.includes("401") || e.error.message?.includes("Token"))) {
            console.error("Error de Token de Mapbox detectado en runtime. Destruyendo mapa Mapbox y aplicando Leaflet.");
            if (mapboxMapRef.current) {
              try {
                mapboxMapRef.current.remove();
              } catch (err) {}
              mapboxMapRef.current = null;
            }
            if (mapContainerRef.current) {
              mapContainerRef.current.innerHTML = "";
            }
            setupLeafletFallback();
          }
        });

        // Marcador del Usuario en Mapbox
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

        const mapboxUserMarker = new mapboxgl.Marker({
          element: userMarkerEl,
          anchor: "center",
          rotationAlignment: "map",
        })
          .setLngLat(userCoordsRef.current)
          .addTo(mapboxInstance);

        mapboxUserMarkerRef.current = mapboxUserMarker;

        // Edificios 3D
        mapboxInstance.on("style.load", () => {
          if (!mapboxInstance) return;
          const layers = mapboxInstance.getStyle()?.layers;
          const labelLayerId = layers?.find(
            (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
          )?.id;

          if (mapboxInstance.getSource("composite")) {
            try {
              mapboxInstance.addLayer(
                {
                  id: "3d-buildings",
                  source: "composite",
                  "source-layer": "building",
                  filter: ["==", "extrude", "true"],
                  type: "fill-extrusion",
                  minzoom: 15,
                  paint: {
                    "fill-extrusion-color": "#2c2a3e",
                    "fill-extrusion-height": ["get", "height"],
                    "fill-extrusion-base": ["get", "min_height"],
                    "fill-extrusion-opacity": 0.55,
                  },
                },
                labelLayerId
              );
            } catch (err) {}
          }
        });
      } catch (err) {
        console.error("Excepción al iniciar Mapbox GL JS:", err);
        setupLeafletFallback();
      }
    }

    // Geolocation Watcher
    const geoWatcher = navigator.geolocation.watchPosition(
      (position) => {
        if (isDemoActiveRef.current) return;

        const { longitude, latitude, heading, accuracy } = position.coords;
        const newCoords: [number, number] = [longitude, latitude];

        setUserCoords(newCoords);
        setGpsAccuracy(accuracy);

        // actualizar marcadores e interfaces de mapa activo
        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setLngLat(newCoords);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.easeTo({ center: newCoords, duration: 800 });
          }
        } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
          leafletUserMarkerRef.current.setLatLng([latitude, longitude]);
          if (isFollowingUserRef.current) {
            leafletMapRef.current.setView([latitude, longitude], leafletMapRef.current.getZoom(), { animate: true });
          }
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

    // Compass Orientation
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isDemoActiveRef.current) return;

      let heading = (e as any).webkitCompassHeading;
      if (heading === undefined || heading === null) {
        if (e.alpha !== null) {
          heading = 360 - e.alpha;
        }
      }

      if (heading !== undefined && heading !== null) {
        const roundedHeading = Math.round(heading);
        setMapHeading(roundedHeading);

        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setRotation(roundedHeading);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.setBearing(roundedHeading);
          }
        } else if (leafletMapRef.current) {
          const arrowEl = document.querySelector(".leaflet-user-pointer .user-pointer-arrow") as HTMLElement;
          if (arrowEl) {
            arrowEl.style.transform = `rotate(${roundedHeading}deg)`;
          }
        }
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      if (geoWatcher) navigator.geolocation.clearWatch(geoWatcher);
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
      
      if (mapboxInstance) {
        try {
          mapboxInstance.remove();
        } catch (e) {}
      }
      if (leafletInstance) {
        try {
          leafletInstance.remove();
        } catch (e) {}
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

    const startPoint = demoPath[0];
    setUserCoords(startPoint);

    if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
      mapboxUserMarkerRef.current.setLngLat(startPoint);
      mapboxUserMarkerRef.current.setRotation(0);
      mapboxMapRef.current.easeTo({
        center: startPoint,
        zoom: 17.2,
        pitch: 55,
        bearing: 0,
        duration: 1000,
      });
    } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
      leafletUserMarkerRef.current.setLatLng([startPoint[1], startPoint[0]]);
      leafletMapRef.current.setView([startPoint[1], startPoint[0]], 17, { animate: true });
      const arrowEl = document.querySelector(".leaflet-user-pointer .user-pointer-arrow") as HTMLElement;
      if (arrowEl) {
        arrowEl.style.transform = `rotate(0deg)`;
      }
    }

    demoIntervalRef.current = setInterval(() => {
      setDemoIndex((prevVal) => {
        const nextVal = (prevVal + 1) % demoPath.length;
        const currentLoc = demoPath[prevVal];
        const nextLoc = demoPath[nextVal];

        const lngDiff = nextLoc[0] - currentLoc[0];
        const latDiff = nextLoc[1] - currentLoc[1];
        let angle = Math.atan2(lngDiff, latDiff) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const headingAngle = Math.round(angle);
        setUserCoords(nextLoc);
        setMapHeading(headingAngle);

        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setLngLat(nextLoc);
          mapboxUserMarkerRef.current.setRotation(headingAngle);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.easeTo({
              center: nextLoc,
              bearing: headingAngle,
              pitch: 55,
              zoom: 17.2,
              duration: 1800,
            });
          }
        } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
          leafletUserMarkerRef.current.setLatLng([nextLoc[1], nextLoc[0]]);
          if (isFollowingUserRef.current) {
            leafletMapRef.current.setView([nextLoc[1], nextLoc[0]], leafletMapRef.current.getZoom(), { animate: true });
          }
          const arrowEl = document.querySelector(".leaflet-user-pointer .user-pointer-arrow") as HTMLElement;
          if (arrowEl) {
            arrowEl.style.transform = `rotate(${headingAngle}deg)`;
          }
        }

        return nextVal;
      });
    }, 4500);

    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
    };
  }, [isDemoActive]);

  // Actualizar y filtrar Marcadores
  useEffect(() => {
    const filteredData = categoryFilter
      ? tourismData.filter((place) => place.category === categoryFilter)
      : tourismData;

    // Marcadores de Mapbox
    if (mapType === "mapbox" && mapboxMapRef.current) {
      mapboxMarkersRef.current.forEach((m) => m.remove());
      mapboxMarkersRef.current = [];

      const renderedCoords = new Set<string>();

      filteredData.forEach((place) => {
        if (!place.coords || place.coords.length < 2) return;
        let [lat, lng] = place.coords;

        const coordKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
        if (renderedCoords.has(coordKey)) {
          lat += (Math.random() - 0.5) * 0.00065;
          lng += (Math.random() - 0.5) * 0.00065;
        }
        renderedCoords.add(coordKey);

        let badgeColor = "#3b82f6";
        let symbol = "📍";

        switch (place.category) {
          case "sabor":
            badgeColor = "#ec4899";
            symbol = "🍺";
            break;
          case "hospedaje":
            badgeColor = "#f59e0b";
            symbol = "🏨";
            break;
          case "destinos":
            badgeColor = "#a855f7";
            symbol = "🏛️";
            break;
          case "eventos":
            badgeColor = "#e11d48";
            symbol = "🎉";
            break;
          default:
            badgeColor = "#06b6d4";
            symbol = "✨";
        }

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

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: "bottom",
        })
          .setLngLat([lng, lat])
          .addTo(mapboxMapRef.current!);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedPlace(place);
          mapboxMapRef.current?.easeTo({
            center: [lng, lat],
            zoom: 17.5,
            pitch: 50,
            duration: 1000,
          });
          setIsFollowingUser(false);
        });

        mapboxMarkersRef.current.push(marker);
      });
    }

    // Marcadores de Leaflet
    if (mapType === "leaflet" && leafletMapRef.current && LRef.current) {
      const L = LRef.current;
      leafletMarkersRef.current.forEach((m) => m.remove());
      leafletMarkersRef.current = [];

      const renderedCoords = new Set<string>();

      filteredData.forEach((place) => {
        if (!place.coords || place.coords.length < 2) return;
        let [lat, lng] = place.coords;

        const coordKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
        if (renderedCoords.has(coordKey)) {
          lat += (Math.random() - 0.5) * 0.00065;
          lng += (Math.random() - 0.5) * 0.00065;
        }
        renderedCoords.add(coordKey);

        let badgeColor = "#3b82f6";
        let symbol = "📍";

        switch (place.category) {
          case "sabor":
            badgeColor = "#ec4899";
            symbol = "🍺";
            break;
          case "hospedaje":
            badgeColor = "#f59e0b";
            symbol = "🏨";
            break;
          case "destinos":
            badgeColor = "#a855f7";
            symbol = "🏛️";
            break;
          case "eventos":
            badgeColor = "#e11d48";
            symbol = "🎉";
            break;
          default:
            badgeColor = "#06b6d4";
            symbol = "✨";
        }

        const iconHtml = `
          <div class="pokestop-container">
            <div class="pokestop-pulse" style="background-color: ${badgeColor};"></div>
            <div class="pokestop-inner" style="border-color: ${badgeColor};">
              <div class="pokestop-photo" style="background-image: url('${place.imageUrl || ""}');">
                ${!place.imageUrl ? `<span class="pokestop-symbol">${symbol}</span>` : ""}
              </div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-leaflet-poi-icon",
          iconSize: [52, 60],
          iconAnchor: [26, 60],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMapRef.current);
        
        marker.on("click", (e: any) => {
          setSelectedPlace(place);
          leafletMapRef.current.setView([lat, lng], 17.5, { animate: true });
          setIsFollowingUser(false);
        });

        leafletMarkersRef.current.push(marker);
      });
    }
  }, [mapType, categoryFilter]);

  // Dibujar y actualizar ruta de destino fijado
  useEffect(() => {
    // Para Mapbox
    if (mapType === "mapbox" && mapboxMapRef.current) {
      const map = mapboxMapRef.current;
      const sourceId = "route-source";
      const layerId = "route-layer";

      if (!activeDestination) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
        return;
      }

      const destCoords: [number, number] = [
        activeDestination.coords[1],
        activeDestination.coords[0],
      ];

      try {
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
              "line-color": "#22d3ee",
              "line-width": 6,
              "line-dasharray": [2, 2],
            },
          });
        }
      } catch (err) {}
    }

    // Para Leaflet
    if (mapType === "leaflet" && leafletMapRef.current && LRef.current) {
      const map = leafletMapRef.current;
      const L = LRef.current;

      if (leafletRouteLineRef.current) {
        leafletRouteLineRef.current.remove();
        leafletRouteLineRef.current = null;
      }

      if (!activeDestination) return;

      const destCoords: [number, number] = [
        activeDestination.coords[0],
        activeDestination.coords[1],
      ];

      try {
        const polyline = L.polyline(
          [[userCoords[1], userCoords[0]], [destCoords[0], destCoords[1]]],
          {
            color: "#22d3ee",
            weight: 6,
            className: "leaflet-animated-route",
            lineCap: "round",
            lineJoin: "round",
          }
        ).addTo(map);

        leafletRouteLineRef.current = polyline;
      } catch (err) {}
    }
  }, [activeDestination, userCoords, mapType]);

  // Animación del láser dinámico en Mapbox
  useEffect(() => {
    if (mapType !== "mapbox" || !mapboxMapRef.current || !activeDestination) return;

    const map = mapboxMapRef.current;
    let animationFrameId: number;
    let step = 0;
    const layerId = "route-layer";

    const animateDash = () => {
      if (map.getLayer(layerId)) {
        step = (step + 0.12) % 4;
        try {
          map.setPaintProperty(layerId, "line-dasharray", [2, 2, step]);
        } catch (e) {}
      }
      animationFrameId = requestAnimationFrame(animateDash);
    };

    animateDash();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeDestination, mapType]);

  // Centrar cámara en el usuario
  const triggerCenter = () => {
    setIsFollowingUser(true);
    if (mapType === "mapbox" && mapboxMapRef.current) {
      mapboxMapRef.current.easeTo({
        center: userCoords,
        zoom: 17,
        pitch: 55,
        bearing: mapHeading || 0,
        duration: 1000,
      });
    } else if (mapType === "leaflet" && leafletMapRef.current) {
      leafletMapRef.current.setView([userCoords[1], userCoords[0]], 17, { animate: true });
    }
  };

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

  const setWaypoint = (place: TourismItem) => {
    setActiveDestination(place);
    setSelectedPlace(null);
  };

  const clearWaypoint = () => {
    setActiveDestination(null);
  };

  return (
    <div className="w-full h-full relative" id="mapbox-main-player">
      <div ref={mapContainerRef} className="w-full h-full bg-[#111019]" />

      {tokenError && (
        <div className="absolute top-28 left-6 right-6 z-50 pointer-events-none">
          <div className="bg-rose-950/95 text-white p-4 rounded-3xl shadow-xl border border-rose-500/20 backdrop-blur-xl flex flex-col gap-1 text-[11px] font-semibold leading-relaxed">
            <div className="flex items-center gap-2 text-rose-200">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="font-black uppercase tracking-wider">Modo de Respaldo Exitoso (Leaflet)</span>
            </div>
            <p className="text-rose-300/80 mt-0.5 pointer-events-auto">
              El servidor se inicializó sin la variable de entorno <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-white">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>. Se activó automáticamente el motor alterno de mapas para prevenir caídas del sistema.
            </p>
          </div>
        </div>
      )}

      {/* CONTROLES FLOTANTES */}
      <div className="absolute top-28 right-6 z-30 flex flex-col gap-3 pointer-events-auto">
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

      {/* BRÚJULA */}
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

      {/* HUD DESTINO */}
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

      {/* MODAL INFERIOR DETALLES */}
      {selectedPlace && (
        <div className="absolute bottom-28 left-6 right-6 z-40 pointer-events-auto">
          <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[35px] shadow-2xl p-5 relative overflow-hidden flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
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

            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold line-clamp-2 leading-relaxed">
              {selectedPlace.description}
            </p>

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

      {/* ESTILOS GLOBALES */}
      <style jsx global>{`
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

        /* Línea de ruta láser animada en Leaflet */
        .leaflet-animated-route {
          stroke-dasharray: 6 6;
          animation: leafletDash 1s linear infinite;
        }

        @keyframes leafletDash {
          to {
            stroke-dashoffset: -20;
          }
        }

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
