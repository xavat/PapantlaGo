"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "leaflet/dist/leaflet.css";
import { Navigation, Compass, MapPin, Star, Info, Crosshair, X, Gamepad2, AlertTriangle, RefreshCw, Sun, Landmark } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

import { tourismData } from "@/data/tourism";

// 4. Estructura de Datos Limpia (id, name, type, coords [lat, lng], description, image)
interface TourPoint {
  id: string;
  name: string;
  type: "destinos" | "sabor" | "hospedaje" | "eventos";
  coords: [number, number]; // [lat, lng]
  description: string;
  image: string;
  rating: string;
  location: string;
}


function getDirectionLetter(heading: number): string {
  const h = ((heading % 360) + 360) % 360;
  if (h > 337.5 || h <= 22.5) return "N";
  if (h > 22.5 && h <= 67.5) return "NE";
  if (h > 67.5 && h <= 112.5) return "E";
  if (h > 112.5 && h <= 157.5) return "SE";
  if (h > 157.5 && h <= 202.5) return "S";
  if (h > 202.5 && h <= 247.5) return "SO";
  if (h > 247.5 && h <= 292.5) return "O";
  return "NO";
}

const EVENTS_POINTS: TourPoint[] = [
  {
    id: "cumbre-tajin",
    name: "Cumbre Tajín",
    type: "eventos",
    coords: [20.4315683, -97.3729754],
    description: "Festival cultural anual que celebra la identidad totonaca con talleres, música, y rituales tradicionales.",
    image: "/images/events/cumbre_tajin.jpeg",
    rating: "4.9",
    location: "Parque Temático Takilhsukut"
  },
  {
    id: "festival-xanath",
    name: "Festival Xanath",
    type: "eventos",
    coords: [20.4571868, -97.320831],
    description: "Puesta en escena que narra la rica herencia histórica del pueblo totonaca frente a la conquista.",
    image: "/images/events/festival_xanath.jpg",
    rating: "4.8",
    location: "Centro Histórico"
  },
  {
    id: "corpus-christi",
    name: "Feria de Corpus Christi",
    type: "eventos",
    coords: [20.458472, -97.323417],
    description: "La festividad tradicional patronal más importante del año con danzas, juegos e intercambios culturales.",
    image: "/images/events/corpus_christi.jpg",
    rating: "4.9",
    location: "Centro de Papantla"
  },
  {
    id: "carnaval-alegria",
    name: 'Carnaval de Papantla "Ilimakxtum"',
    type: "eventos",
    coords: [20.4498621, -97.3284981],
    description: "Un desfile vibrante por las calles de Papantla con música en vivo, comparsas y la alegría característica de la región norte de Veracruz.",
    image: "/images/events/carnaval_alegria.jpeg",
    rating: "4.7",
    location: "Calles del Centro, Papantla, Ver."
  }
];

const TOURISM_POINTS: TourPoint[] = [
  ...tourismData
    .filter(item => ["destinos", "sabor", "hospedaje"].includes(item.category))
    .map(item => ({
      id: item.id,
      name: item.title,
      type: item.category as "destinos" | "sabor" | "hospedaje",
      coords: item.coords,
      description: item.description,
      image: item.imageUrl,
      rating: item.rating,
      location: item.location
    })),
  ...EVENTS_POINTS
];

function lerpAngle(current: number, target: number, lerpFactor: number): number {
  const c = ((current % 360) + 360) % 360;
  const t = ((target % 360) + 360) % 360;

  let diff = t - c;
  if (diff < -180) {
    diff += 360;
  } else if (diff > 180) {
    diff -= 360;
  }

  const result = c + diff * lerpFactor;
  return ((result % 360) + 360) % 360;
}

interface InteractiveMapProps {
  categoryFilter: string | null;
}

export default function InteractiveMap({ categoryFilter }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const compassIconRef = useRef<SVGSVGElement | null>(null);
  const compassTextRef = useRef<HTMLSpanElement | null>(null);

  // Refs de mapas e instancias
  const mapboxMapRef = useRef<mapboxgl.Map | null>(null);
  const mapboxUserMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const mapboxMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const leafletMapRef = useRef<any>(null);
  const leafletUserMarkerRef = useRef<any>(null);
  const leafletMarkersRef = useRef<any[]>([]);
  const leafletRouteLineRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const gpsWatcherRef = useRef<number | null>(null);
  const isDemoActiveRef = useRef<boolean>(false);
  const isFollowingUserRef = useRef<boolean>(true);
  const userCoordsRef = useRef<[number, number]>([-97.3225, 20.4465]); // [lng, lat]
  const mapHeadingRef = useRef<number>(0);

  // States
  const [mapType, setMapType] = useState<"mapbox" | "leaflet" | "none">("none");
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [selectedPlace, setSelectedPlace] = useState<TourPoint | null>(null);
  const [activeDestination, setActiveDestination] = useState<TourPoint | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number]>([-97.3225, 20.4465]); // [lng, lat]
  const [mapHeading, setMapHeading] = useState<number>(0);
  const [isCompassAuthorized, setIsCompassAuthorized] = useState<boolean | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoIndex, setDemoIndex] = useState<number>(0);
  const [currentZoom, setCurrentZoom] = useState<number>(17.5);
  const [isSunlightMode, setIsSunlightMode] = useState<boolean>(false);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize active classes on DOM markers for both Mapbox and Leaflet fallback
  useEffect(() => {
    const containers = document.querySelectorAll(".pokestop-container");
    containers.forEach((container) => {
      const labelEl = container.querySelector(".pokestop-label");
      if (labelEl) {
        const text = labelEl.textContent || "";
        const isSelected = selectedPlace && text.toUpperCase() === selectedPlace.name.toUpperCase();
        const isActiveDest = activeDestination && text.toUpperCase() === activeDestination.name.toUpperCase();
        if (isSelected || isActiveDest) {
          container.classList.add("active-pokestop");
        } else {
          container.classList.remove("active-pokestop");
        }
      }
    });
  }, [selectedPlace, activeDestination, mapType, isMapReady]);


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

  // Sincronizar referencias editables
  useEffect(() => { isDemoActiveRef.current = isDemoActive; }, [isDemoActive]);
  useEffect(() => { isFollowingUserRef.current = isFollowingUser; }, [isFollowingUser]);
  useEffect(() => { userCoordsRef.current = userCoords; }, [userCoords]);
  useEffect(() => { mapHeadingRef.current = mapHeading; }, [mapHeading]);

  // Verificar estado del permiso de brújula iOS al montar
  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      setIsCompassAuthorized(false);
    } else {
      setIsCompassAuthorized(true);
    }
  }, []);

  // Solicitar permiso de ubicación y activar Geolocation
  const startGpsWatching = () => {
    if (gpsWatcherRef.current) {
      navigator.geolocation.clearWatch(gpsWatcherRef.current);
    }

    gpsWatcherRef.current = navigator.geolocation.watchPosition(
      (position) => {
        if (isDemoActiveRef.current) return;

        const { longitude, latitude, heading, accuracy } = position.coords;
        const newCoords: [number, number] = [longitude, latitude];

        setUserCoords(newCoords);
        setGpsAccuracy(accuracy);
        setGpsError(null);

        // Actualizar interfaces con inclinación 60º y zoom 17.5
        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setLngLat(newCoords);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.easeTo({
              center: newCoords,
              zoom: 17.5,
              pitch: 60,
              bearing: mapHeadingRef.current || 0,
              duration: 1500,
              easing: (t) => t * (2 - t),
              padding: { top: 0, bottom: 180, left: 0, right: 0 },
            });
          }
        } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
          leafletUserMarkerRef.current.setLatLng([latitude, longitude]);
          if (isFollowingUserRef.current) {
            leafletMapRef.current.setView([latitude, longitude], 17.5, { animate: true });
          }
        }
      },
      (error) => {
        console.warn("Ubicación GPS error de geolocalización:", error);
        let msg = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = "Permiso de ubicación rechazado. Para disfrutar la experiencia estilo Pokémon GO, activa los accesos de geolocalización.";
            break;
          case error.POSITION_UNAVAILABLE:
            msg = "Señal de GPS perdida. Comprueba si estás en interiores o tu conectividad.";
            break;
          case error.TIMEOUT:
            msg = "Tiempo de espera del GPS agotado. Intentando reconectar...";
            break;
          default:
            msg = "Error desconocido de geolocalización.";
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  // Inicialización de Mapas y Respaldo de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let mapboxInstance: mapboxgl.Map | null = null;
    let leafletInstance: any = null;
    let L: any = null;

    const setupLeafletFallback = () => {
      console.warn("Utilizando sistema alterno leaflet.");
      setTokenError(true);
      setMapType("leaflet");

      L = require("leaflet");
      LRef.current = L;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      const initialCoords = userCoordsRef.current;
      leafletInstance = L.map(mapContainerRef.current!, {
        center: [initialCoords[1], initialCoords[0]], // [lat, lng]
        zoom: 17.5,
        zoomControl: false,
        attributionControl: false,
      });

      leafletInstance.on("dragstart", () => setIsFollowingUser(false));
      leafletInstance.on("zoomstart", () => setIsFollowingUser(false));
      leafletInstance.on("zoomend", () => {
        setCurrentZoom(leafletInstance.getZoom());
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletInstance);

      // Icono de Avatar estilo Pokémon GO
      const userMarkerHtml = `
        <div class="user-avatar-container leaflet-user-pointer">
          <div class="user-avatar-pulse"></div>
          <div class="user-avatar-glow"></div>
          <div class="user-avatar-inner" style="transform: rotate(0deg);">
            <svg viewBox="0 0 24 24" class="user-avatar-arrow">
              <path d="M12 2L4 20L12 15L20 20L12 2Z" fill="#FFFFFF" />
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

      setIsMapReady(true);
      setIsMapLoading(false);
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
          zoom: 17.5,
          pitch: 60,
          bearing: 0,
          antialias: true,
          dragRotate: true,
          touchZoomRotate: true,
        });

        // Desnivel Pokémon GO offset
        mapboxInstance.setPadding({ top: 0, bottom: 180, left: 0, right: 0 });
        mapboxMapRef.current = mapboxInstance;

        mapboxInstance.on("dragstart", () => setIsFollowingUser(false));
        mapboxInstance.on("pitchstart", () => setIsFollowingUser(false));
        mapboxInstance.on("rotatestart", () => setIsFollowingUser(false));
        mapboxInstance.on("zoomstart", () => setIsFollowingUser(false));
        mapboxInstance.on("zoom", () => {
          setCurrentZoom(mapboxInstance!.getZoom());
        });

        mapboxInstance.on("error", (e) => {
          if (e.error && (e.error.message?.includes("Unauthorized") || e.error.message?.includes("401") || e.error.message?.includes("Token"))) {
            console.error("Token de Mapbox inválido detectado en runtime. Activando Leaflet.");
            if (mapboxMapRef.current) {
              try { mapboxMapRef.current.remove(); } catch (err) {}
              mapboxMapRef.current = null;
            }
            if (mapContainerRef.current) {
              mapContainerRef.current.innerHTML = "";
            }
            setupLeafletFallback();
          }
        });

        // Marcador del Jugador Mapbox
        const userMarkerEl = document.createElement("div");
        userMarkerEl.className = "user-avatar-container";
        userMarkerEl.innerHTML = `
          <div class="user-avatar-pulse"></div>
          <div class="user-avatar-glow"></div>
          <div class="user-avatar-inner">
            <svg viewBox="0 0 24 24" class="user-avatar-arrow">
              <path d="M12 2L4 20L12 15L20 20L12 2Z" fill="#FFFFFF" />
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

        mapboxInstance.on("style.load", () => {
          if (!mapboxInstance) return;
          const layers = mapboxInstance.getStyle()?.layers;
          const labelLayerId = layers?.find(
            (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
          )?.id;

          // Hide default Mapbox POI, medical and transit labels to prevent clashing and declutter map
          if (layers) {
            layers.forEach((layer) => {
              if (
                layer.id.includes("poi-label") || 
                layer.id.includes("landmark") || 
                layer.id.includes("transit") ||
                layer.id.includes("medical")
              ) {
                try {
                  mapboxInstance?.setLayoutProperty(layer.id, "visibility", "none");
                } catch (e) {}
              }
            });
          } (mapboxInstance as any)._poiLabelsHidden = true;

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
                    "fill-extrusion-color": "#dedcdc",
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

        mapboxInstance.on("load", () => {
          setIsMapReady(true);
          setIsMapLoading(false);
          mapboxInstance?.resize();
        });
      } catch (err) {
        console.error("Excepción al iniciar Mapbox, restaurando Leaflet:", err);
        setupLeafletFallback();
      }
    }

    startGpsWatching();

    // Compass Orientation (Suavizado de Filtro LERP)
    let smoothedHeading: number | null = null;
    let lastEventTime = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isDemoActiveRef.current) return;

      const now = performance.now();
      if (now - lastEventTime < 30) return;
      lastEventTime = now;

      let heading = (e as any).webkitCompassHeading;
      if (heading === undefined || heading === null) {
        if (e.alpha !== null) {
          heading = 360 - e.alpha;
        }
      }

      if (heading !== undefined && heading !== null) {
        heading = ((heading % 360) + 360) % 360;

        if (smoothedHeading === null) {
          smoothedHeading = heading;
        } else {
          // Filtro LERP 0.05
          smoothedHeading = lerpAngle(smoothedHeading, heading, 0.05);
        }

        const roundedHeading = Math.round(smoothedHeading!);

        if (roundedHeading !== mapHeadingRef.current) {
          mapHeadingRef.current = roundedHeading;
          
          // Direct DOM Mutation for Compass rotation & text (Gyro smoothing bypasses React state)
          if (compassIconRef.current) {
            compassIconRef.current.style.transform = `rotate(${-roundedHeading}deg)`;
          }
          if (compassTextRef.current) {
             compassTextRef.current.innerHTML = `${roundedHeading}° <span class="ml-1 font-black">${getDirectionLetter(roundedHeading)}</span>`;
          }
        }

        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setRotation(roundedHeading);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.setBearing(roundedHeading);
          }
        } else if (leafletMapRef.current) {
          const arrowEl = document.querySelector(".leaflet-user-pointer .user-avatar-inner") as HTMLElement;
          if (arrowEl) {
            arrowEl.style.transform = `rotate(${roundedHeading}deg)`;
          }
        }
      }
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      if (gpsWatcherRef.current) navigator.geolocation.clearWatch(gpsWatcherRef.current);
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);

      if (mapboxInstance) {
        try { mapboxInstance.remove(); } catch (e) {}
      }
      if (leafletInstance) {
        try { leafletInstance.remove(); } catch (e) {}
      }
    };
  }, []);

  // ResizeObserver para solventar error de redimensionamiento de pantallas móviles y gris de fondo
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const handleResize = () => {
      if (mapType === "mapbox" && mapboxMapRef.current) {
        mapboxMapRef.current.resize();
      } else if (mapType === "leaflet" && leafletMapRef.current) {
        leafletMapRef.current.invalidateSize();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(mapContainerRef.current);

    // Activación extra para asegurar renderizado correcto pos-carga
    const t = setTimeout(handleResize, 800);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(t);
    };
  }, [mapType, isMapReady]);

  // Lógica de simulación de caminatas (Modo Demo)
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
        zoom: 17.5,
        pitch: 60,
        bearing: 0,
        padding: { top: 0, bottom: 180, left: 0, right: 0 },
        duration: 1000,
      });
    } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
      leafletUserMarkerRef.current.setLatLng([startPoint[1], startPoint[0]]);
      leafletMapRef.current.setView([startPoint[1], startPoint[0]], 17.5, { animate: true });
      const arrowEl = document.querySelector(".leaflet-user-pointer .user-avatar-inner") as HTMLElement;
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
        mapHeadingRef.current = headingAngle;
        if (compassIconRef.current) {
          compassIconRef.current.style.transform = `rotate(${-headingAngle}deg)`;
        }
        if (compassTextRef.current) {
           compassTextRef.current.innerHTML = `${headingAngle}° <span class="ml-1 font-black">${getDirectionLetter(headingAngle)}</span>`;
        }

        if (mapboxMapRef.current && mapboxUserMarkerRef.current) {
          mapboxUserMarkerRef.current.setLngLat(nextLoc);
          mapboxUserMarkerRef.current.setRotation(headingAngle);
          if (isFollowingUserRef.current) {
            mapboxMapRef.current.easeTo({
              center: nextLoc,
              bearing: headingAngle,
              pitch: 60,
              zoom: 17.5,
              padding: { top: 0, bottom: 180, left: 0, right: 0 },
              duration: 1800,
            });
          }
        } else if (leafletMapRef.current && leafletUserMarkerRef.current) {
          leafletUserMarkerRef.current.setLatLng([nextLoc[1], nextLoc[0]]);
          if (isFollowingUserRef.current) {
            leafletMapRef.current.setView([nextLoc[1], nextLoc[0]], 17.5, { animate: true });
          }
          const arrowEl = document.querySelector(".leaflet-user-pointer .user-avatar-inner") as HTMLElement;
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

  // Actualizar y renderizar marcadores utilizando estructura TOURISM_POINTS limpia
  useEffect(() => {
    if (!isMapReady) return;

    const filteredData = categoryFilter
      ? TOURISM_POINTS.filter((place) => place.type === categoryFilter)
      : TOURISM_POINTS;

    // Marcadores de Mapbox
    if (mapType === "mapbox" && mapboxMapRef.current) {
      mapboxMarkersRef.current.forEach((m) => m.remove());
      mapboxMarkersRef.current = [];

      const renderedCoords = new Set<string>();

      filteredData.forEach((place) => {
        if (!place.coords || place.coords.length < 2) return;
        let [lat, lng] = place.coords;

        // Dispersión suave por colisión de coordenadas idénticas
        const coordKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
        if (renderedCoords.has(coordKey)) {
          lat += (Math.random() - 0.5) * 0.0006;
          lng += (Math.random() - 0.5) * 0.0006;
        }
        renderedCoords.add(coordKey);

        let badgeColor = "#3b82f6";
        let symbol = "🏛️";

        switch (place.type) {
          case "sabor":
            badgeColor = "#D81B60"; // Vibrant Deep Pink
            symbol = "🍺";
            break;
          case "hospedaje":
            badgeColor = "#E65100"; // Deep Amber Orange
            symbol = "🏨";
            break;
          case "destinos":
            badgeColor = "#311B92"; // Deep Royal Indigo
            symbol = "🏛️";
            break;
          case "eventos":
            badgeColor = "#D50000"; // Vivid Red
            symbol = "🎉";
            break;
        }

        const el = document.createElement("div");
        el.className = "pokestop-container";
        el.style.setProperty("--pulse-color", badgeColor);
        el.innerHTML = `
          <div class="pokestop-stem"></div>
          <div class="pokestop-inner" style="border-color: ${badgeColor};">
            <div class="pokestop-photo" style="background-image: url('${place.image || ""}');">
              ${!place.image ? `<span class="pokestop-symbol">${symbol}</span>` : ""}
            </div>
          </div>
          <div class="pokestop-label">${place.name}</div>
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

    // Marcadores de Leaflet fallback
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
          lat += (Math.random() - 0.5) * 0.0006;
          lng += (Math.random() - 0.5) * 0.0006;
        }
        renderedCoords.add(coordKey);

        let badgeColor = "#3b82f6";
        let symbol = "🏛️";

        switch (place.type) {
          case "sabor":
            badgeColor = "#D81B60"; // Vibrant Deep Pink
            symbol = "🍺";
            break;
          case "hospedaje":
            badgeColor = "#E65100"; // Deep Amber Orange
            symbol = "🏨";
            break;
          case "destinos":
            badgeColor = "#311B92"; // Deep Royal Indigo
            symbol = "🏛️";
            break;
          case "eventos":
            badgeColor = "#D50000"; // Vivid Red
            symbol = "🎉";
            break;
        }

        const iconHtml = `
          <div class="pokestop-container">
            <div class="pokestop-stem"></div>
            <div class="pokestop-inner" style="border-color: ${badgeColor};">
              <div class="pokestop-photo" style="background-image: url('${place.image || ""}'); font-size:12px;">
                ${!place.image ? `<span class="pokestop-symbol">${symbol}</span>` : ""}
              </div>
            </div>
            <div class="pokestop-label" style="--pulse-color: ${badgeColor};">${place.name}</div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-leaflet-poi-icon",
          iconSize: [52, 60],
          iconAnchor: [26, 60],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMapRef.current);

        marker.on("click", () => {
          setSelectedPlace(place);
          leafletMapRef.current.setView([lat, lng], 17.5, { animate: true });
          setIsFollowingUser(false);
        });

        leafletMarkersRef.current.push(marker);
      });
    }
  }, [mapType, isMapReady, categoryFilter]);

  // Dibujar trayectoria fijada
  useEffect(() => {
    if (!isMapReady) return;

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
  }, [activeDestination, userCoords, mapType, isMapReady]);

  // Animación del láser dinámico en Mapbox
  useEffect(() => {
    if (mapType !== "mapbox" || !mapboxMapRef.current || !activeDestination || !isMapReady) return;

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
  }, [activeDestination, mapType, isMapReady]);

  // Solicitar brújula e inicializar acelerómetro iOS / Android
  const requestCompassPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === "granted") {
          setIsCompassAuthorized(true);
          return true;
        } else {
          setIsCompassAuthorized(false);
          return false;
        }
      } catch (err) {
        console.error("Error al solicitar permiso de brújula:", err);
        return false;
      }
    }
    return true;
  };

  const triggerCenter = async () => {
    setIsFollowingUser(true);
    await requestCompassPermission();
    if (mapType === "mapbox" && mapboxMapRef.current) {
      mapboxMapRef.current.easeTo({
        center: userCoords,
        zoom: 17.5,
        pitch: 60,
        bearing: mapHeadingRef.current || 0,
        padding: { top: 0, bottom: 180, left: 0, right: 0 },
        duration: 1200,
      });
    } else if (mapType === "leaflet" && leafletMapRef.current) {
      leafletMapRef.current.setView([userCoords[1], userCoords[0]], 17.5, { animate: true });
    }
  };

  const centerToMainPoints = () => {
    setIsFollowingUser(false);
    const centerCoords: [number, number] = [-97.322, 20.4455];
    if (mapboxMapRef.current) {
      mapboxMapRef.current.easeTo({
        center: centerCoords,
        zoom: 16.8,
        pitch: 60,
        bearing: 0,
        duration: 2000,
        easing: (t) => t * (2 - t),
      });
    } else if (leafletMapRef.current) {
      leafletMapRef.current.setView([centerCoords[1], centerCoords[0]], 16.8, { animate: true });
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

  const setWaypoint = (place: TourPoint) => {
    setActiveDestination(place);
    setSelectedPlace(null);
  };

  const clearWaypoint = () => {
    setActiveDestination(null);
  };

  const placeTypeName = selectedPlace ? {
    destinos: "Atracción",
    sabor: "Gastronomía",
    hospedaje: "Hospedaje",
    eventos: "Evento"
  }[selectedPlace.type] : "";

  return (
    <div className={`w-full h-full relative ${currentZoom < 18 ? "map-zoom-low" : "map-zoom-high"} ${isSunlightMode ? "sunlight-mode" : ""}`} id="mapbox-main-player">
      
      {/* 2. Loader visual "Cargando..." */}
      {isMapLoading && (
        <div className="absolute inset-0 bg-[#0c0b12] z-[2000] flex flex-col items-center justify-center gap-6">
          <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary animate-pulse">
            Sincronizando sistemas cartográficos
          </p>
        </div>
      )}

      {/* Contenedor del Mapa */}
      <div ref={mapContainerRef} onClick={requestCompassPermission} className="w-full h-full bg-[#111019]" />



      {/* 3. Alerta sutil GPS en pantalla */}
      {gpsError && (
        <div className="absolute top-28 left-6 right-6 z-[1020] pointer-events-auto">
          <div className="bg-amber-950/90 text-amber-200 p-4.5 rounded-[24px] shadow-xl border border-amber-500/20 backdrop-blur-xl flex flex-col gap-3 text-[11px] font-semibold leading-relaxed">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-350">
                <AlertTriangle className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <span className="font-black uppercase tracking-wider text-[10px]">Alerta GPS</span>
              </div>
              <button 
                onClick={() => setGpsError(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Cerrar aviso"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-amber-300/80 leading-snug">
              {gpsError}
            </p>
            <button 
              onClick={startGpsWatching} 
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 font-bold uppercase text-[9px] tracking-widest shadow-md shadow-amber-500/10"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} /> Reintentar Conexión
            </button>
          </div>
        </div>
      )}

      {/* 2. Controles Flotantes con Alto Z-Index (z-[1010]+) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-[1010] flex flex-col gap-3 pointer-events-auto">
        {/* 1. Botón de Caminata Simulada (Modo Demo) */}
        <button
          onClick={toggleDemoMode}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xl active:scale-90 transition-all ${
            isDemoActive
              ? "bg-purple-600 border-purple-500 text-white animate-pulse"
              : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-foreground"
          }`}
          title={isDemoActive ? "Desactivar caminata simulada" : "Activar caminata simulada (Modo Demo)"}
        >
          <Gamepad2 className={`w-5.5 h-5.5 ${isDemoActive ? "text-white" : "text-purple-500"}`} />
        </button>

        {/* 2. Botón de Kiosco (Centrar Atracciones) */}
        <button
          onClick={centerToMainPoints}
          className="w-12 h-12 rounded-2xl bg-white/95 dark:bg-zinc-900/95 border border-black/5 dark:border-white/10 text-foreground flex items-center justify-center shadow-2xl active:scale-90 transition-all"
          title="Centrar en el kiosco / atracciones"
        >
          <Landmark className="w-5.5 h-5.5 text-primary" />
        </button>

        {/* 3. Botón de Modo Sol */}
        <button
          onClick={() => setIsSunlightMode((prev) => !prev)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xl active:scale-95 transition-all ${
            isSunlightMode
              ? "bg-amber-500 border-amber-400 text-white animate-pulse"
              : "bg-white/95 dark:bg-zinc-900/95 border-black/5 dark:border-white/10 text-foreground"
          }`}
          title={isSunlightMode ? "Desactivar Modo Sol (Contraste normal)" : "Activar Modo Sol (Alto Contraste para luz solar)"}
        >
          <Sun className="w-5.5 h-5.5" />
        </button>

        {/* 4. Botón de Mi Ubicación (GPS) */}
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

      {/* 2. Visualización de Brújula con Alto Z-Index (z-[1010]+) */}
      <div className="absolute top-12 left-[220px] z-[1010] pointer-events-auto cursor-pointer select-none" onClick={requestCompassPermission}>
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
              {isCompassAuthorized === false ? "🔒 Activar" : `${mapHeading}°`}
              {isCompassAuthorized !== false && (
                <span className="ml-1 font-black">
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
                )}
            </span>
          </div>
        </div>
      </div>

      {/* HUD de Ruta de Destino activa */}
      {activeDestination && (
        <div className="absolute top-48 left-6 right-6 z-[1010] pointer-events-none">
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
                  {activeDestination.name}
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

      {/* 2. Bottom Sheet Elegante y Adaptada a Pulgares móviles */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 24, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-[1030] bg-[#12111a]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[35px] shadow-2xl p-6 pb-9 flex flex-col gap-4 pointer-events-auto max-w-md mx-auto"
          >
            {/* Drag Handle superior */}
            <div 
              className="w-12 h-1.5 rounded-full bg-white/20 mx-auto -mt-2 mb-2 cursor-pointer" 
              onClick={() => setSelectedPlace(null)} 
            />

            <div className="flex gap-4 items-center">
              {selectedPlace.image && (
                <img 
                  src={selectedPlace.image} 
                  alt={selectedPlace.name} 
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0" 
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[8px] bg-primary/15 text-primary border border-primary/20 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/20 px-2.5 py-1 rounded-full font-black tracking-widest uppercase">
                  {placeTypeName}
                </span>
                <h3 className="text-base font-black text-white leading-tight tracking-tight mt-2 truncate">
                  {selectedPlace.name}
                </h3>
                <p className="text-[11px] text-gray-400 font-semibold line-clamp-2 leading-snug mt-1">
                  {selectedPlace.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 border-t border-white/5 pt-3">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-white font-bold">{selectedPlace.rating || "4.5"}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[200px] text-zinc-300">{selectedPlace.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <Link
                href={`/${
                  selectedPlace.type === "sabor"
                    ? "sabor"
                    : selectedPlace.type === "hospedaje"
                    ? "hospedaje"
                    : selectedPlace.type === "eventos"
                    ? "eventos"
                    : "destinos"
                }/${selectedPlace.id}`}
                className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest text-center transition-colors border border-white/10"
              >
                Ver Ficha
              </Link>

              <button
                onClick={() => setWaypoint(selectedPlace)}
                className="py-3 bg-primary hover:bg-[#721F2C] dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <Navigation className="w-3.5 h-3.5" /> Fijar Destino
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .user-avatar-container {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar-pulse {
          position: absolute;
          width: 56px;
          height: 56px;
          background: rgba(59, 130, 246, 0.25);
          border: 2px solid rgba(59, 130, 246, 0.6);
          border-radius: 50%;
          animation: mapPulse 2s infinite ease-out;
          pointer-events: none;
        }

        .user-avatar-glow {
          position: absolute;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.3) 70%, transparent 100%);
          border-radius: 50%;
          filter: blur(4px);
          z-index: 1;
        }

        .user-avatar-inner {
          position: relative;
          width: 32px;
          height: 32px;
          background: #00e5ff;
          border: 3px solid #ffffff;
          outline: 2.5px solid #000000;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: transform 0.1s linear;
        }

        .user-avatar-arrow {
          width: 16px;
          height: 16px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
        }

        /* Marcadores Poképarada estilo Pokémon GO */
        .pokestop-container {
          position: relative;
          width: 52px;
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          cursor: pointer;
          transform-origin: bottom center;
        }

        .pokestop-inner {
          width: 44px;
          height: 44px;
          border: 4px solid #ffffff;
          outline: 2.5px solid #000000;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          bottom: 8px;
          background: #ffffff;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s;
        }

        .pokestop-container:hover .pokestop-inner {
          transform: translateY(-6px) scale(1.15) rotate(15deg);
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

        .pokestop-stem {
          position: absolute;
          bottom: 0px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 10px;
          background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.4) 100%);
          z-index: 5;
        }

        /* 3. Etiquetas autogestionadas y anticolisión de nombres */
        .pokestop-label {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%) scale(0.85);
          background: #000000;
          border: 2.5px solid #ffffff;
          color: #ffffff;
          padding: 4.5px 10.5px;
          border-radius: 14px;
          font-size: 10.5px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
        }

        /* Control de visualización por zoom o interacciones */
        .pokestop-container:hover .pokestop-label,
        .pokestop-container:focus .pokestop-label,
        .active-pokestop .pokestop-label {
          opacity: 1;
          transform: translateX(-50%) scale(1) translateY(-3px);
        }

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
            transform: scale(1.6);
            opacity: 0;
          }
        }

        /* Sunlight Mode High Contrast Styles */
        .sunlight-mode .mapboxgl-map,
        .sunlight-mode .leaflet-container {
          filter: contrast(1.3) brightness(1.15) saturate(1.4) !important;
        }

        .sunlight-mode .pokestop-inner {
          border-width: 5px !important;
          outline-width: 3.5px !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.9) !important;
        }

        .sunlight-mode .pokestop-label {
          background: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
          border-width: 3.5px !important;
          font-weight: 950 !important;
          font-size: 11.5px !important;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8) !important;
        }

        /* Prevent labels from clattering and overlapping when zoomed out */
        .map-zoom-low .pokestop-label {
          display: none !important;
        }

        /* Show labels for hovered or active items even when zoomed out */
        .map-zoom-low .pokestop-container:hover .pokestop-label,
        .map-zoom-low .active-pokestop .pokestop-label {
          display: block !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
