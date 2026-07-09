export interface TourismItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  rating: string;
  tag: string;
  location: string;
  category: "destinos" | "sabor" | "hospedaje" | "eventos" | "mural" | "servicios";
  coords: [number, number];
  phone?: string;
  details?: { label: string; value: string; icon: string }[];
  gallery?: string[];
  address?: string;
  descriptionExtra?: {
    hours?: string;
    cost?: string;
    howToGet?: string;
    tip?: string;
  };
}

export const tourismData: TourismItem[] = [
  // DESTINOS
  {
    id: "tajin",
    title: "El Tajín",
    subtitle: "Patrimonio Mundial UNESCO",
    description: `La joya prehispánica del estado de Veracruz y un sitio declarado Patrimonio de la Humanidad por la UNESCO. Esta imponente y antigua capital de la cultura totonaca deslumbra por su sofisticada arquitectura y sus numerosos juegos de pelota, siendo el epicentro del misticismo y el esplendor arqueológico de la región.\n\n* **Pirámide de los Nichos:** Maravíllate con su estructura principal, famosa por sus 365 nichos alineados astronómicamente.\n* **Museo de sitio:** Alberga una notable colección de piezas encontradas durante las excavaciones y ofrece contexto histórico.\n* **Misticismo vivo:** Un destino ideal para cargarse de energía y comprender a fondo el pasado mesoamericano.`,
    imageUrl: "/destinos/tajin.jpg",
    rating: "4.9",
    tag: "Historia",
    location: "Carretera Chote - Tajín s/n, El Tajín, 93479 Papantla de Olarte, Ver.",
    category: "destinos",
    coords: [20.4426841, -97.3779076],
    gallery: ["/destinos/tajin.jpg"],
    descriptionExtra: {
      hours: "Lunes a domingo de 9:00 AM a 5:00 PM.",
      cost: "Entrada general aproximada de $95 MXN. Los domingos el acceso es gratuito para ciudadanos mexicanos y residentes extranjeros (con identificación oficial). Estudiantes, maestros y adultos mayores entran gratis todos los días.",
      howToGet: "Se localiza a unos 15-20 minutos del centro de Papantla. En el centro puedes tomar un autobús de ruta (autobuses \"Tajín\") o un taxi colectivo que te deja directamente en el acceso principal.",
      tip: "Lleva calzado cómodo, protector solar, sombrero y suficiente agua, ya que el clima es muy caluroso y húmedo. No te pierdas la ceremonia de los Voladores de Papantla que suele realizarse de forma continua en la explanada de la entrada."
    }
  },
  {
    id: "centro-historico",
    title: "Centro Histórico",
    subtitle: "Pueblo Mágico",
    description: `El corazón palpitante del Pueblo Mágico, donde el aroma a vainilla impregna el ambiente y las tradiciones totonacas cobran vida a cada paso. Caminar por sus coloridas calles te transportará a un ambiente de provincia mexicana inigualable, enmarcado por la belleza arquitectónica de sus principales edificios históricos.\n\n* **Arquitectura icónica:** Admira la hermosa Parroquia de Nuestra Señora de la Asunción y el Palacio Municipal.\n* **Ambiente cultural:** Un espacio ideal para disfrutar del tradicional café veracruzano, comprar artesanías y presenciar la danza de los voladores en el zócalo.\n* **Corazón de la ciudad:** El punto de inicio perfecto para cualquier viajero que desee conocer la identidad papanteca.`,
    imageUrl: "/destinos/centro.jpg",
    rating: "4.8",
    tag: "Cultura",
    location: "Calle Reforma s/n, Centro, 93400 Papantla de Olarte, Ver. (Zócalo / Parque Israel C. Téllez)",
    category: "destinos",
    coords: [20.4467303, -97.3220645],
    gallery: ["/destinos/centro.jpg"],
    descriptionExtra: {
      hours: "Espacio público abierto las 24 horas. Los comercios abren generalmente de 9:00 AM a 8:00 PM.",
      cost: "Acceso completamente gratuito.",
      howToGet: "Es el punto cero de la ciudad. Cualquier transporte colectivo local o taxi te dejará directamente en el Parque Central Israel C. Téllez.",
      tip: "Los fines de semana por la tarde se organizan los \"Viernes de Danzón\" o el \"Huapango Dominical\". Es el mejor momento para vivir el folklore local y probar los tradicionales esquites o un helado de vainilla casero."
    }
  },
  {
    id: "mural-de-la-cultura-totonaca",
    title: "Mural de la Cultura Totonaca",
    subtitle: "Obra de Teodoro Cano",
    description: `Una impresionante obra monumental esculpida por el maestro Teodoro Cano que narra de forma magistral la evolución del pueblo totonaca. Situado en pleno centro, este colosal relieve de piedra aprovecha el muro de contención de la iglesia para convertirse en una lección de historia visual obligada para todo visitante.\n\n* **Narración histórica:** Plasma detalladamente desde la época prehispánica hasta la era moderna de la región.\n* **Elementos sagrados:** Identifica símbolos clave como la danza del volador, el juego de pelota y el cultivo de la vainilla.\n* **Parada fotográfica:** Uno de los puntos fotográficos más emblemáticos y representativos de la ciudad.`,
    imageUrl: "/destinos/mural.jpg",
    rating: "4.7",
    tag: "Arte",
    location: "Calle José de J. Núñez s/n, Barrio del Naranjo, Centro, 93400 Papantla de Olarte, Ver.",
    category: "destinos",
    coords: [20.446255, -97.3220487],
    gallery: ["/destinos/mural.jpg"],
    descriptionExtra: {
      hours: "Abierto al público de manera permanente (visible desde la vía pública). Se recomienda visitarlo de día para apreciar los relieves o de noche si cuenta con iluminación artística.",
      cost: "Gratuito.",
      howToGet: "Ubicado a un costado de la Parroquia de Nuestra Señora de la Asunción, justo frente al Parque Central. Se llega a pie desde cualquier punto del centro.",
      tip: "Tómate unos minutos para leer la placa informativa. El mural se recorre visualmente de izquierda a derecha para comprender cronológicamente la historia, desde la mítica creación del pueblo totonaca hasta el Papantla del siglo XX."
    }
  },
  {
    id: "monumento-al-volador",
    title: "Monumento al Volador",
    subtitle: "Vista Panorámica",
    description: `Ubicado en la cima de un cerro en el centro de la ciudad, este imponente monumento rinde homenaje a los legendarios "Hombres Pájaro". Además de admirar la colosal estatua que vigila el pueblo, el sitio ofrece una de las panorámicas más espectaculares y completas de todo Papantla.\n\n* **Mirador espectacular:** Consigue vistas completas en 360 grados de los tejados, plazas y colinas del Pueblo Mágico.\n* **Homenaje a la tradición:** Dedicado al ritual de los Voladores, considerado Patrimonio Cultural Inmaterial.\n* **Fácil acceso:** Se llega mediante una caminata que recompensa con la mejor postal fotográfica de la zona.`,
    imageUrl: "/destinos/volador.jpg",
    rating: "4.9",
    tag: "Mirador",
    location: "Cerro del Volador, Reforma s/n, Centro, 93400 Papantla de Olarte, Ver.",
    category: "destinos",
    coords: [20.4447697, -97.3216441],
    gallery: ["/destinos/volador.jpg"],
    descriptionExtra: {
      hours: "Abierto todos los días de 7:00 AM a 7:00 PM (se aconseja visitarlo antes del anochecer).",
      cost: "Gratuito.",
      howToGet: "Se encuentra en la cima del cerro localizado detrás de la Iglesia de la Asunción. El acceso peatonal es a través de una escalinata señalizada que inicia desde la calle Aquiles Serdán o subiendo por la calle Reforma.",
      tip: "La subida requiere algo de esfuerzo físico debido a los escalones, por lo que se recomienda subir a un ritmo moderado y llevar agua. Las mejores horas para tomar fotografías panorámicas de la ciudad son al amanecer o durante el atardecer."
    }
  },
  {
    id: "zona-arqueologica-coyuxquihui",
    title: "Zona Arqueológica Coyuxquihui",
    subtitle: "Legado Totonaca",
    description: `Un fascinante tesoro arqueológico semioculto entre la densa vegetación y los paisajes del entorno papanteco. Fundada tras la caída de El Tajín, esta antigua fortaleza militar prehispánica ofrece una experiencia de exploración más íntima, rodeada de selva y con estructuras que denotan una gran estrategia defensiva.\n\n* **Ambiente natural:** Ideal para quienes buscan un recorrido tranquilo y una conexión directa con la naturaleza.\n* **Estructuras destacadas:** Explora el edificio de los nichos, su juego de pelota y las terrazas escalonadas.\n* **Menos concurrido:** Perfecto para tomar fotos sin aglomeraciones y respirar la tranquilidad del bosque tropical.`,
    imageUrl: "/destinos/coyuxquihui.jpg",
    rating: "4.6",
    tag: "Aventura",
    location: "Carretera Espinal - Coyuxquihui, 93556 Papantla de Olarte, Ver.",
    category: "destinos",
    coords: [20.3125312, -97.2556878],
    gallery: ["/destinos/coyuxquihui.jpg"],
    descriptionExtra: {
      hours: "Lunes a domingo de 9:00 AM a 5:00 PM.",
      cost: "Entrada general aproximada de $75 MXN. Aplican las mismas reglas de gratuidad de las zonas INAH (domingos gratis para nacionales).",
      howToGet: "Está ubicada a unos 35 kilómetros al sur de Papantla (aproximadamente 45 minutos en auto). Debes tomar la carretera hacia Espinal y seguir las desviaciones señalizadas hacia la comunidad de Coyuxquihui. El transporte público hacia allá es menos frecuente, por lo que se sugiere ir en automóvil propio o contratar un taxi privado.",
      tip: "Al ser un sitio inmerso en la selva y mucho menos concurrido que El Tajín, es indispensable llevar un buen repelente de insectos y calzado con buen agarre para subir a las terrazas. ¡Disfrutarás de un sitio arqueológico casi para ti solo!"
    }
  },
  {
    id: "la-bocana",
    title: "La Bocana",
    subtitle: "Unión de Río y Mar",
    description: `El punto mágico donde las aguas dulces de los esteros y manglares se unen de frente con la inmensidad del océano. Este rincón ecoturístico es un deleite visual y un santuario de biodiversidad marina, ideal para los amantes del turismo de naturaleza y los paisajes espectaculares de costa.\n\n* **Avistamiento de fauna:** Explora zonas cercanas de manglares que albergan diversas especies de aves locales y migratorias.\n* **Paisajes de contraste:** Admira el hermoso espectáculo visual del encuentro de las corrientes de agua dulce y salada.\n* **Actividades eco-amigables:** Un sitio ideal para la fotografía de paisaje, paseos tranquilos y desconexión absoluta.`,
    imageUrl: "/destinos/bocana.jpg",
    rating: "4.7",
    tag: "Naturaleza",
    location: "La Bocana de Rancho Playa, Costa de Papantla, 93575 Papantla, Ver.",
    category: "destinos",
    coords: [20.6143783, -97.144859],
    gallery: ["/destinos/bocana.jpg"],
    descriptionExtra: {
      hours: "Libre las 24 horas. Las actividades guiadas o recorridos en lancha operan bajo luz solar (8:00 AM a 5:00 PM).",
      cost: "Acceso libre. Los paseos en lancha por el manglar o el estero se contratan directamente con los cooperativistas locales y varían según el número de personas.",
      howToGet: "Está ubicada justo a un costado de Rancho Playa, donde el río o estero se conecta con el mar abierto. Puedes llegar caminando por la línea de la costa desde la zona principal de Rancho Playa o en auto por el camino de terracería perimetral.",
      tip: "Este es el lugar ideal para los amantes del ecoturismo. Contrata un paseo en lancha con un guía local para adentrarte en los túneles de manglar; es una experiencia fascinante donde podrás observar aves exóticas, cangrejos y con un poco de suerte, otras especies locales en su hábitat natural."
    }
  },
  {
    id: "rancho-playa",
    title: "Rancho Playa",
    subtitle: "Playa",
    description: `El escape perfecto hacia las costas del Golfo de México, a solo unos kilómetros de la cabecera municipal de Papantla. Es una extensa playa de aguas templadas y oleaje tranquilo donde la relajación, la gastronomía marina local y la brisa del mar te harán olvidar el ajetreo diario.\n\n* **Gastronomía local:** Disfruta de pescados y mariscos frescos en las tradicionales palapas a la orilla del mar.\n* **Naturaleza costera:** Un ambiente semi-virgen que combina la frescura del mar con los verdes paisajes veracruzanos.\n* **Espacio familiar:** Excelente opción para nadar, caminar por la arena fina y descansar bajo el sol.`,
    imageUrl: "/destinos/rancho-playa.jpg",
    rating: "4.8",
    tag: "Playa",
    location: "Vereda Rancho Playa s/n, Costa de Papantla, 93575 Papantla de Olarte, Ver.",
    category: "destinos",
    coords: [20.6286735, -97.1561068],
    gallery: ["/destinos/rancho-playa.jpg"],
    descriptionExtra: {
      hours: "Playa pública de acceso libre las 24 horas. Las palapas y restaurantes operan comúnmente de 9:00 AM a 6:00 PM.",
      cost: "El acceso a la playa es libre. Renta de palapas/enramadas con mesas y sillas oscila entre los $100 y $200 MXN por todo el día.",
      howToGet: "Se sitúa a unos 40-50 minutos en automóvil desde el centro de Papantla siguiendo la carretera hacia la costa. También existen camionetas de transporte público y taxis que salen desde la periferia del centro de la ciudad hacia la comunidad playera.",
      tip: "Prueba el \"pescado a la veracruzana\" o los mariscos al chipotle en cualquiera de las palapas locales; los precios suelen ser muy accesibles y el producto es del día. Si viajas entre los meses de junio y noviembre, pregunta a los lugareños por los campamentos tortugueros de la zona, a veces es posible presenciar la liberación de crías."
    }
  },
  // SABORES
  {
    id: "restaurante-naku",
    title: "Restaurante Nakú",
    subtitle: "Sabor Totonaca",
    description: "Especialistas en comida regional con un toque gourmet. Un ambiente único que combina la tradición con la elegancia contemporánea.",
    imageUrl: "/images/sabores/naku/imagen1.jpg",
    rating: "4.9",
    tag: "Gourmet",
    location: "Manantiales, Papantla",
    category: "sabor",
    coords: [20.4579954, -97.3108819],
    phone: "7848423112",
    address: "Heroico Colegio Militar s/n-s/n, Manantiales, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/naku/imagen1.jpg",
      "/images/sabores/naku/imagen2.jpg",
      "/images/sabores/naku/imagen3.webp",
      "/images/sabores/naku/imagen4.webp",
      "/images/sabores/naku/imagen5.webp",
      "/images/sabores/naku/imagen6.jpeg",
      "/images/sabores/naku/imagen7.webp"
    ]
  },
  {
    id: "la-boca",
    title: "La Boca",
    subtitle: "Asadero & Tradición",
    description: "Cortes de carne premium y lo mejor de la cocina local en un ambiente moderno y acogedor.",
    imageUrl: "/images/sabores/laboca/imagen1.jpg",
    rating: "4.8",
    tag: "Asadero",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4464908, -97.3258797],
    phone: "7848425756",
    address: "Aquiles Serdán 700, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/laboca/imagen1.jpg",
      "/images/sabores/laboca/imagen2.jpg",
      "/images/sabores/laboca/imagen3.jpg",
      "/images/sabores/laboca/imagen4.jpg",
      "/images/sabores/laboca/imagen5.jpg",
      "/images/sabores/laboca/imagen6.jpg"
    ]
  },
  {
    id: "restaurante-la-parroquia-de-papantla",
    title: "Restaurante la Parroquia de Papantla",
    subtitle: "Tradición Familiar",
    description: "El punto de encuentro por excelencia en Papantla para disfrutar de un buen café y platillos típicos.",
    imageUrl: "/images/sabores/parroquia/imagen1.jpg",
    rating: "4.7",
    tag: "Cafetería",
    location: "Barrio del Naranjo",
    category: "sabor",
    coords: [20.4456325, -97.3213761],
    phone: "7848885904",
    address: "Cjon 16 de Septiembre 114, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/parroquia/imagen1.jpg",
      "/images/sabores/parroquia/imagen2.webp",
      "/images/sabores/parroquia/imagen3.webp",
      "/images/sabores/parroquia/imagen4.webp",
      "/images/sabores/parroquia/imagen5.webp",
      "/images/sabores/parroquia/imagen6.jpeg",
      "/images/sabores/parroquia/imagen7.jpeg",
      "/images/sabores/parroquia/imagen8.jpeg",
      "/images/sabores/parroquia/imagen9.jpeg",
      "/images/sabores/parroquia/imagen10.jpeg",
      "/images/sabores/parroquia/imagen11.jpeg",
      "/images/sabores/parroquia/imagen12.jpeg",
      "/images/sabores/parroquia/imagen13.jpeg",
      "/images/sabores/parroquia/imagen14.jpeg",
      "/images/sabores/parroquia/imagen15.jpeg",
      "/images/sabores/parroquia/imagen16.jpg"
    ]
  },
  {
    id: "al-son-del-chapala",
    title: "Al Son del Chapala",
    subtitle: "Sabor Mexicano",
    description: "Vibrant experience with authentic Mexican dishes and a lively atmosphere.",
    imageUrl: "/images/sabores/chapala/imagen1.jpg",
    rating: "4.6",
    tag: "Mexicano",
    location: "Centro",
    category: "sabor",
    coords: [20.446513, -97.322703],
    phone: "7848423517",
    address: "Reforma #100 altos, Centro, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/chapala/imagen1.jpg",
      "/images/sabores/chapala/imagen2.jpg",
      "/images/sabores/chapala/imagen3.jpg",
      "/images/sabores/chapala/imagen4.jpg",
      "/images/sabores/chapala/imagen5.jpg",
      "/images/sabores/chapala/imagen6.jpg"
    ]
  },
  {
    id: "plaza-pardo",
    title: "Plaza Pardo",
    subtitle: "Cocina Regional",
    description: "Un espacio dedicado a la cocina tradicional con ingredientes frescos de la región.",
    imageUrl: "/images/sabores/plazapardo/imagen1.jpg",
    rating: "4.8",
    tag: "Regional",
    location: "Centro",
    category: "sabor",
    coords: [20.4469875, -97.3218272],
    phone: "7848420059",
    address: "Juan Enríquez 105, Centro, 93449 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/plazapardo/imagen1.jpg",
      "/images/sabores/plazapardo/imagen2.webp",
      "/images/sabores/plazapardo/imagen3.webp",
      "/images/sabores/plazapardo/imagen4.webp",
      "/images/sabores/plazapardo/imagen5.jpg",
      "/images/sabores/plazapardo/imagen6.jpg"
    ]
  },
  {
    id: "restaurante-humo",
    title: "Restaurante Humo",
    subtitle: "Gastronomía de Autor",
    description: "Experiencia culinaria innovadora centrada en técnicas de ahumado y sabores profundos.",
    imageUrl: "/images/sabores/humo/imagen1.jpg",
    rating: "4.9",
    tag: "Gourmet",
    location: "Santa Cruz",
    category: "sabor",
    coords: [20.4450616, -97.3206326],
    phone: "7848420400",
    address: "93400, Cjon 16 de Septiembre 104, Santa Cruz, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/humo/imagen1.jpg",
      "/images/sabores/humo/imagen2.jpg",
      "/images/sabores/humo/imagen3.jpg",
      "/images/sabores/humo/imagen4.jpg",
      "/images/sabores/humo/imagen5.jpg",
      "/images/sabores/humo/imagen6.jpg",
      "/images/sabores/humo/imagen7.jpg",
      "/images/sabores/humo/imagen8.jpg",
      "/images/sabores/humo/imagen9.jpg"
    ]
  },
  {
    id: "restaurante-totonaco",
    title: "Restaurante Totonaco",
    subtitle: "Herencia Ancestral",
    description: "Mantenemos vivas las recetas tradicionales Totonacas para el deleite de su paladar.",
    imageUrl: "/images/sabores/totonaco/imagen1.jpg",
    rating: "4.7",
    tag: "Tradicional",
    location: "El Naranjo",
    category: "sabor",
    coords: [20.4459858, -97.3212509],
    phone: "7841122581",
    address: "José de Jesús, Lázaro Muñoz 104, El Naranjo, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/totonaco/imagen1.jpg",
      "/images/sabores/totonaco/imagen2.jpeg",
      "/images/sabores/totonaco/imagen3.jpeg",
      "/images/sabores/totonaco/imagen4.jpeg",
      "/images/sabores/totonaco/imagen5.jpeg",
      "/images/sabores/totonaco/imagen6.jpeg"
    ]
  },
  {
    id: "don-pope-restaurante",
    title: "Don Pope Restaurante",
    subtitle: "Calidad y Sabor",
    description: "Excelente servicio y variedad de platillos que te harán sentir como en casa.",
    imageUrl: "/images/sabores/donpope/imagen1.jpg",
    rating: "4.6",
    tag: "Familiar",
    location: "Barrio San Juan",
    category: "sabor",
    coords: [20.4489288, -97.3212239],
    phone: "7842135289",
    address: "Francisco I Madero 206, Barrio del San Juan, 93449 Papantla, Ver.",
    gallery: [
      "/images/sabores/donpope/imagen1.jpg",
      "/images/sabores/donpope/imagen2.jpg",
      "/images/sabores/donpope/imagen3.webp",
      "/images/sabores/donpope/imagen4.webp",
      "/images/sabores/donpope/imagen5.webp",
      "/images/sabores/donpope/imagen6.jpg"
    ]
  },
  {
    id: "restaurante-papantla-kachikin",
    title: "Restaurante Papantla Kachikin",
    subtitle: "Pueblo Mágico",
    description: "Sabores que capturan la esencia mágica de Papantla en cada bocado.",
    imageUrl: "/images/sabores/kachikin/imagen1.jpg",
    rating: "4.5",
    tag: "Local",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4436628, -97.3419736],
    phone: "7841335190",
    address: "Chote - Papantla, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/kachikin/imagen1.jpg",
      "/images/sabores/kachikin/imagen2.jpg",
      "/images/sabores/kachikin/imagen3.jpg",
      "/images/sabores/kachikin/imagen4.jpg",
      "/images/sabores/kachikin/imagen5.jpg",
      "/images/sabores/kachikin/imagen6.jpg",
      "/images/sabores/kachikin/imagen7.jpg"
    ]
  },
  {
    id: "centro-turistico-saberes-ancestrales-de-la-vainilla",
    title: "Centro Turístico Saberes Ancestrales de la Vainilla",
    subtitle: "Cultura y Sabor",
    description: "Descubre la historia de la vainilla y degusta platillos infusionados con este aromático tesoro.",
    imageUrl: "/images/sabores/vainilla/imagen1.jpg",
    rating: "4.9",
    tag: "Cultural",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4425017, -97.3310242],
    phone: "7841150077",
    address: "Revolución 116, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/vainilla/imagen1.jpg",
      "/images/sabores/vainilla/imagen2.jpg",
      "/images/sabores/vainilla/imagen3.jpg",
      "/images/sabores/vainilla/imagen4.jpg",
      "/images/sabores/vainilla/imagen5.jpg",
      "/images/sabores/vainilla/imagen6.jpg",
      "/images/sabores/vainilla/imagen7.jpg",
      "/images/sabores/vainilla/imagen8.jpg",
      "/images/sabores/vainilla/imagen9.jpg",
      "/images/sabores/vainilla/imagen10.jpg"
    ]
  },
  // HOSPEDAJE
  {
    id: "hotel-tajin",
    title: "Hotel Tajín",
    subtitle: "Confort Tradicional",
    description: "Ubicado en el corazón de Papantla, el Hotel Tajín ofrece una experiencia única combinando comodidad moderna con la arquitectura tradicional del pueblo mágico.",
    imageUrl: "/images/hotels/hoteltajin.jpg",
    rating: "4.5",
    tag: "Centro",
    location: "Papantla de Olarte, Ver",
    category: "hospedaje",
    coords: [20.4458443, -97.3211287],
    phone: "7848420121",
    address: "José de Jesús Núñez 104, El Naranjo, 93400 Papantla, Ver.",
    details: [
      { label: "Habitaciones", value: "Aires Acondicionados", icon: "bed" },
      { label: "Servicios", value: "Alberca y Wifi", icon: "wifi" },
      { label: "Atención", value: "Desde 1951", icon: "clock" },
      { label: "Seguridad", value: "24 Horas", icon: "shield" }
    ],
    gallery: [
      "/images/hotels/tajin/1.jpg",
      "/images/hotels/tajin/2.jpg",
      "/images/hotels/tajin/3.jpg",
      "/images/hotels/tajin/4.jpg",
      "/images/hotels/tajin/5.jpg"
    ]
  },
  {
    id: "hotel-vista-inn",
    title: "Hotel Vista INN",
    subtitle: "Vista Panorámica",
    description: "Ubicación privilegiada con acceso fácil a los principales atractivos turísticos y comerciales del centro de Papantla.",
    imageUrl: "/images/hotels/vistainn.jpg",
    rating: "4.3",
    tag: "Centro",
    location: "Centro, Papantla",
    category: "hospedaje",
    coords: [20.4460035, -97.3227987],
    phone: "7848425981",
    address: "Reforma 102-local 5, Centro, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/hotels/vistainn/1.jpg",
      "/images/hotels/vistainn/2.jpg",
      "/images/hotels/vistainn/3.jpg",
      "/images/hotels/vistainn/4.jpg",
      "/images/hotels/vistainn/5.jpg"
    ]
  },
  {
    id: "oyo-hotel-totonacapan",
    title: "OYO Hotel Totonacapan",
    subtitle: "Esencia Totonaca",
    description: "Habitaciones confortables que reflejan la calidez de la cultura totonaca, ideal para viajeros que buscan una estancia auténtica.",
    imageUrl: "/images/hotels/oyo.jpg",
    rating: "4.0",
    tag: "Barrio San Juan",
    location: "Papantla, Ver",
    category: "hospedaje",
    coords: [20.4487448, -97.3224332],
    phone: "2296903292",
    address: "s/n Olivo Centro, Barrio del San Juan, 93400 Papantla, Ver.",
    gallery: [
      "/images/hotels/oyo/OYO.jpeg",
      "/images/hotels/oyo/1OYO.jpeg",
      "/images/hotels/oyo/2HOYO.jpeg",
      "/images/hotels/oyo/3OYO.jpeg",
      "/images/hotels/oyo/OYO4.jpeg",
      "/images/hotels/oyo/OYO5.jpeg"
    ]
  },
  {
    id: "hostal-del-centro-papantla",
    title: "Hostal del Centro Papantla",
    subtitle: "Ambiente Familiar",
    description: "Una opción acogedora y económica en el corazón de la ciudad, perfecta para explorar cada rincón de Papantla.",
    imageUrl: "/images/hotels/hoteldelcentro.jpg",
    rating: "4.2",
    tag: "Centro",
    location: "Centro, Papantla",
    category: "hospedaje",
    coords: [20.4475155, -97.3239883],
    phone: "7841023268",
    address: "Aquiles Serdán 415, Centro, 93449 Papantla, Ver.",
    gallery: [
      "/images/hotels/hoteldelcentro/HOSTEL DEL CENTRO.jpg",
      "/images/hotels/hoteldelcentro/HOSTAL DEL CENTRO1.jpg",
      "/images/hotels/hoteldelcentro/HOSTEL DEL CENTRO2.jpg",
      "/images/hotels/hoteldelcentro/HOSTEL DEL CENTRO3.jpg",
      "/images/hotels/hoteldelcentro/HOSTEL DEL CENTRO4.jpg"
    ]
  },
  {
    id: "hotel-campestre-la-colina-del-conejo",
    title: "Hotel Campestre La Colina Del Conejo",
    subtitle: "Naturaleza y Descanso",
    description: "Rodeado de vegetación, este hotel campestre es el refugio ideal para quienes buscan tranquilidad y contacto con la naturaleza.",
    imageUrl: "/images/hotels/colina.jpg",
    rating: "4.6",
    tag: "Campestre",
    location: "Adolfo Lopez Mateos",
    category: "hospedaje",
    coords: [20.4510893, -97.3411129],
    phone: "7848219206",
    address: "Jacarandas 35, Adolfo Lopez Mateos, 93438 Papantla de Olarte, Ver.",
    gallery: [
      "/images/hotels/colina/COLINA.png",
      "/images/hotels/colina/COLINA1.png",
      "/images/hotels/colina/COLINA2.png",
      "/images/hotels/colina/COLINA3.png",
      "/images/hotels/colina/COLINA4.png"
    ]
  },
  {
    id: "hotel-santo-domingo",
    title: "Hotel Santo Domingo",
    subtitle: "Tranquilidad y Confort",
    description: "Excelente servicio y hospitalidad en una atmósfera relajada para su estancia en la ciudad perfecta para descansar.",
    imageUrl: "/images/hotels/santo.jpg",
    rating: "4.2",
    tag: "Barrio San Juan",
    location: "Papantla, Ver",
    category: "hospedaje",
    coords: [20.4473219, -97.3243363],
    phone: "7848427038",
    address: "5 de Mayo 301, Barrio del San Juan, 93449 Papantla, Ver.",
    gallery: [
      "/images/hotels/santo/1.jpeg",
      "/images/hotels/santo/2.jpeg",
      "/images/hotels/santo/3.jpeg",
      "/images/hotels/santo/4.jpeg",
      "/images/hotels/santo/5.jpeg",
      "/images/hotels/santo/6.jpeg",
      "/images/hotels/santo/7.jpeg"
    ]
  },
  {
    id: "hotel-vainilla-y-descanso",
    title: "Hotel Vainilla y Descanso",
    subtitle: "Elegancia y Aroma",
    description: "Un hotel boutique que rinde homenaje al oro negro de Papantla. Experimente el lujo auténtico.",
    imageUrl: "/images/hotels/vainilla.jpg",
    rating: "4.7",
    tag: "Boutique",
    location: "Benito Juárez, Papantla",
    category: "hospedaje",
    coords: [20.4534986, -97.3325149],
    phone: "7821862711",
    address: "Francisco I Madero 716, Benito Juárez, 93410 Papantla de Olarte, Ver.",
    gallery: [
      "/images/hotels/vainilla/1.jpg",
      "/images/hotels/vainilla/2.jpg",
      "/images/hotels/vainilla/3.jpg",
      "/images/hotels/vainilla/4.jpg",
      "/images/hotels/vainilla/5.jpg",
      "/images/hotels/vainilla/6.jpg",
      "/images/hotels/vainilla/7.jpg",
      "/images/hotels/vainilla/8.png"
    ]
  },
  {
    id: "hotel-katlen",
    title: "Hotel Katlen",
    subtitle: "Hospitalidad Local",
    description: "Servicio personalizado en un entorno tradicional, ideal para disfrutar de la cultura local.",
    imageUrl: "/images/hotels/katlen.jpg",
    rating: "3.9",
    tag: "Barrio San Juan",
    location: "Papantla, Ver",
    category: "hospedaje",
    coords: [20.4496813, -97.3203352],
    phone: "7848423990",
    address: "Barrio del San Juan, 93449 Papantla de Olarte, Ver.",
    gallery: [
      "/images/hotels/katlen/KATLEN.jpeg",
      "/images/hotels/katlen/KATLEN1.jpeg",
      "/images/hotels/katlen/KATLEN2.jpeg",
      "/images/hotels/katlen/KATLEN3.jpeg",
      "/images/hotels/katlen/KATLEN4.jpeg",
      "/images/hotels/katlen/KATLEN5.jpeg"
    ]
  },
  {
    id: "hotel-familiar-arenas",
    title: "Hotel Familiar Arenas",
    subtitle: "Estancia Cálida",
    description: "Ambiente familiar y atención amable que le hará sentirse como en casa durante su visita.",
    imageUrl: "/images/hotels/arenas.jpg",
    rating: "4.0",
    tag: "Naranjo",
    location: "Barrio del Naranjo",
    category: "hospedaje",
    coords: [20.4465301, -97.3185984],
    phone: "7848423366",
    address: "Juan Enríquez 307, Barrio del Naranjo, 93400 Papantla, Ver.",
    gallery: [
      "/images/hotels/arenas/ARENAS.jpeg",
      "/images/hotels/arenas/ARENAS1.jpeg",
      "/images/hotels/arenas/ARENAS2.jpeg",
      "/images/hotels/arenas/ARENAS3.jpeg",
      "/images/hotels/arenas/ARENAS4.jpeg"
    ]
  },
  // ALIMENTOS Y BEBIDAS
  {
    id: "cafe-catedral",
    title: "Café Catedral",
    subtitle: "Aroma y Tradición",
    description: "Un espacio acogedor frente a la catedral donde el café papanteco es el protagonista.",
    imageUrl: "/images/sabores/cafecatedral/imagen1.jpg",
    rating: "4.8",
    tag: "Cafetería",
    location: "Barrio del Naranjo",
    category: "sabor",
    coords: [20.4460494, -97.3215319],
    phone: "7848425317",
    address: "Curato s/n, Barrio del Naranjo, 93400 Poza Rica de Hidalgo, Ver.",
    gallery: [
      "/images/sabores/cafecatedral/imagen1.jpg",
      "/images/sabores/cafecatedral/imagen2.jpg",
      "/images/sabores/cafecatedral/imagen3.jpg",
      "/images/sabores/cafecatedral/imagen4.jpg"
    ]
  },
  {
    id: "la-choza-de-lucy",
    title: "La choza de Lucy",
    subtitle: "Delicias del Mar",
    description: "Mariscos frescos con el sazón auténtico de la región en un ambiente relajado.",
    imageUrl: "/images/sabores/chozalucy/imagen1.jpg",
    rating: "4.7",
    tag: "Mariscos",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4432201, -97.3337204],
    phone: "7848424980",
    address: "Cjon 16 de Septiembre centro 829, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/chozalucy/imagen1.jpg",
      "/images/sabores/chozalucy/imagen2.jpg",
      "/images/sabores/chozalucy/imagen3.jpg",
      "/images/sabores/chozalucy/imagen4.jpg",
      "/images/sabores/chozalucy/imagen5.jpg",
      "/images/sabores/chozalucy/imagen6.JPG",
      "/images/sabores/chozalucy/imagen7.JPG",
      "/images/sabores/chozalucy/imagen8.jpg"
    ]
  },
  {
    id: "zacahuil-perla",
    title: "Zacahuil Perla",
    subtitle: "El Gigante de la Huasteca",
    description: "Tradición pura en cada bocado de nuestro zacahuil preparado artesanalmente.",
    imageUrl: "/images/sabores/zacahuilperla/imagen1.jpg",
    rating: "4.9",
    tag: "Comida Típica",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4421458, -97.3352901],
    phone: "7841346603",
    address: "Cjon 16 de Septiembre 907, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: ["/images/sabores/zacahuilperla/imagen1.jpg"]
  },
  {
    id: "sushi-&-drinks-mr.-rollo",
    title: "SUSHI & DRINKS MR. ROLLO",
    subtitle: "Fusion & Mixology",
    description: "Lo mejor del sushi con un toque local y coctelería de autor.",
    imageUrl: "/images/sabores/mrrollo/imagen1.jpeg",
    rating: "4.6",
    tag: "Sushi",
    location: "Barrio del Naranjo",
    category: "sabor",
    coords: [20.4457674, -97.3207569],
    phone: "",
    address: "C. José de J. Núñez 18, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/mrrollo/imagen1.jpeg",
      "/images/sabores/mrrollo/imagen2.jpg",
      "/images/sabores/mrrollo/imagen3.jpeg",
      "/images/sabores/mrrollo/imagen4.jpeg",
      "/images/sabores/mrrollo/imagen5.jpeg",
      "/images/sabores/mrrollo/imagen6.jpeg",
      "/images/sabores/mrrollo/imagen7.jpeg",
      "/images/sabores/mrrollo/imagen8.jpeg",
      "/images/sabores/mrrollo/imagen9.jpeg"
    ]
  },
  {
    id: "pizzas-y-volovanes-el-uli-sucursal-centro",
    title: "Pizzas y Volovanes El Uli",
    subtitle: "Sabor que Encanta",
    description: "Pizzas artesanalmente preparadas y los famosos volovanes de la región.",
    imageUrl: "/images/sabores/pizzasuli/imagen1.jpeg",
    rating: "4.5",
    tag: "Pizzería",
    location: "Centro",
    category: "sabor",
    coords: [20.4460647, -97.3209668],
    phone: "7848420064",
    address: "C. José de J. Núñez s/n, Centro, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/pizzasuli/imagen1.jpeg",
      "/images/sabores/pizzasuli/imagen2.JPG",
      "/images/sabores/pizzasuli/imagen3.jpg",
      "/images/sabores/pizzasuli/imagen4.jpg",
      "/images/sabores/pizzasuli/imagen5.JPG",
      "/images/sabores/pizzasuli/imagen6.jpg",
      "/images/sabores/pizzasuli/imagen7.jpeg",
      "/images/sabores/pizzasuli/imagen8.jpeg",
      "/images/sabores/pizzasuli/imagen9.jpeg",
      "/images/sabores/pizzasuli/imagen10.jpeg"
    ]
  },
  {
    id: "the-italian-coffee-company",
    title: "The Italian Coffee Company",
    subtitle: "Aroma y Calidad",
    description: "Excelente café gourmet y una gran selección de postres, frappés and bebidas especiales en una atmósfera relajante y cómoda.",
    imageUrl: "/images/sabores/theitaliancoffeecompany/imagen1.jpeg",
    rating: "4.6",
    tag: "Cafetería",
    location: "Centro, Papantla",
    category: "sabor",
    coords: [20.445911, -97.3211471],
    phone: "7841251585",
    address: "s/n, Curato, Centro, Barrio del Naranjo, 93400 Papantla de Olarte",
    gallery: [
      "/images/sabores/theitaliancoffeecompany/imagen1.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen2.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen3.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen4.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen5.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen6.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen7.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen8.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen9.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen10.jpeg",
      "/images/sabores/theitaliancoffeecompany/imagen11.jpg"
    ]
  },
  {
    id: "panificadora-lemus",
    title: "Panificadora Lemus",
    subtitle: "Tradición y Dulzura",
    description: "Pan de dulce y sal artesanal preparado al horno tradicional con la receta original de generación en generación.",
    imageUrl: "/images/sabores/panificadoralemus/imagen1.png",
    rating: "4.8",
    tag: "Panadería",
    location: "Santa Cruz, Papantla",
    category: "sabor",
    coords: [20.4456499, -97.3233724],
    phone: "7848422558",
    address: "Cjon 16 de Septiembre 209, Santa Cruz, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/panificadoralemus/imagen1.png",
      "/images/sabores/panificadoralemus/imagen2.jpeg",
      "/images/sabores/panificadoralemus/imagen3.jpeg",
      "/images/sabores/panificadoralemus/imagen4.jpeg",
      "/images/sabores/panificadoralemus/imagen5.jpeg"
    ]
  },
  {
    id: "pizzas-y-volovanes-el-uli-sucursal-16-de-septiembre",
    title: "Pizzas y Volovanes El Uli Sucursal 16 de Septiembre",
    subtitle: "Sabor de Tradición",
    description: "Sabor crujiente de las mejores pizzas hechas al momento y los clásicos volovanes hojaldrados de la región.",
    imageUrl: "/images/sabores/pizzasuli16deseptiembre/imagen1.jpeg",
    rating: "4.7",
    tag: "Pizzería",
    location: "Barrio del Zapote, Papantla",
    category: "sabor",
    coords: [20.4449662, -97.3300738],
    phone: "7848425458",
    address: "Cjon 16 de Septiembre 800, Barrio del Zapote, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/pizzasuli16deseptiembre/imagen1.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen2.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen3.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen4.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen5.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen6.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen7.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen8.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen9.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen10.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen11.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen12.jpeg",
      "/images/sabores/pizzasuli16deseptiembre/imagen13.jpeg"
    ]
  },
  {
    id: "idea-pizza",
    title: "Idea Pizza",
    subtitle: "Sabor que Encanta",
    description: "Las mejores pizzas preparadas al horno con ingredientes frescos y una masa artesanal crujiente.",
    imageUrl: "/images/sabores/ideapizza/imagen1.jpg",
    rating: "4.7",
    tag: "Pizzería",
    location: "Centro",
    category: "sabor",
    coords: [20.4447167, -97.3205704],
    phone: "7848422083",
    address: "Cjon 16 de Septiembre 101, Centro, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/ideapizza/imagen1.jpg",
      "/images/sabores/ideapizza/imagen2.jpg",
      "/images/sabores/ideapizza/imagen3.jpg",
      "/images/sabores/ideapizza/imagen4.jpg"
    ]
  },
  {
    id: "las-canastas",
    title: "Las Canastas",
    subtitle: "Sabor Mexicano",
    description: "Exquisitos tacos de canasta y una amplia variedad de guisados típicos con el sazón tradicional de la Huasteca.",
    imageUrl: "/images/sabores/lascanastas/imagen1.jpg",
    rating: "4.6",
    tag: "Comida Típica",
    location: "Barrio del San Juan",
    category: "sabor",
    coords: [20.4473646, -97.3227022],
    phone: "7841442168",
    address: "José Azueta 105, Barrio del San Juan, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/lascanastas/imagen1.jpg",
      "/images/sabores/lascanastas/imagen2.jpg",
      "/images/sabores/lascanastas/imagen3.jpg",
      "/images/sabores/lascanastas/imagen4.jpg",
      "/images/sabores/lascanastas/imagen5.jpg"
    ]
  },
  {
    id: "cafe-del-centro",
    title: "Café Del Centro",
    subtitle: "Cafetería & Snacks",
    description: "Un espacio acogedor en el corazón de Papantla para disfrutar de un buen café local, postres y snacks.",
    imageUrl: "/images/sabores/cafedelcentro/imagen1.jpg",
    rating: "4.5",
    tag: "Cafetería",
    location: "Barrio del San Juan",
    category: "sabor",
    coords: [20.4469308, -97.3237343],
    phone: "7848421163",
    address: "Artes 108, Barrio del San Juan, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/cafedelcentro/imagen1.jpg",
      "/images/sabores/cafedelcentro/imagen2.jpg",
      "/images/sabores/cafedelcentro/imagen3.jpeg",
      "/images/sabores/cafedelcentro/imagen4.jpeg",
      "/images/sabores/cafedelcentro/imagen5.jpg"
    ]
  },
  {
    id: "me-perdonas",
    title: "Me Perdonas",
    subtitle: "Cafetería & Snacks",
    description: "Un lugar con encanto para deleitarse con ricas crepas, postres, helados y refrescantes cafés preparados al momento.",
    imageUrl: "/images/sabores/meperdonas/imagen1.jpg",
    rating: "4.8",
    tag: "Cafetería",
    location: "Santa Cruz",
    category: "sabor",
    coords: [20.4426645, -97.3191563],
    phone: "7841218557",
    address: "C. Rodolfo Curti 118, Santa Cruz, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/meperdonas/imagen1.jpg",
      "/images/sabores/meperdonas/imagen2.jpg",
      "/images/sabores/meperdonas/imagen3.jpg",
      "/images/sabores/meperdonas/imagen4.jpg"
    ]
  },
  {
    id: "clandestino",
    title: "Clandestino",
    subtitle: "Hamburguesas & Snacks",
    description: "Las mejores hamburguesas gourmet de Papantla, con ingredientes de primera calidad y papas sazonadas en un ambiente genial.",
    imageUrl: "/images/sabores/clandestino/imagen1.jpg",
    rating: "4.7",
    tag: "Hamburguesas",
    location: "Barrio del Naranjo",
    category: "sabor",
    coords: [20.4465183, -97.3190178],
    phone: "7848499423",
    address: "C. Andrés Q.R. 201, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/clandestino/imagen1.jpg",
      "/images/sabores/clandestino/imagen2.jpg",
      "/images/sabores/clandestino/imagen3.jpg",
      "/images/sabores/clandestino/imagen4.jpg",
      "/images/sabores/clandestino/imagen5.jpg"
    ]
  },
  {
    id: "la-jarochita",
    title: "La Jarochita",
    subtitle: "Mariscos & Bebidas",
    description: "El auténtico sabor del golfo en Papantla. Cocteles, platillos de mariscos frescos y bebidas preparadas con el mejor sazón.",
    imageUrl: "/images/sabores/lajarochita/imagen1.jpg",
    rating: "4.6",
    tag: "Mariscos",
    location: "Centro",
    category: "sabor",
    coords: [20.4467149, -97.3241507],
    phone: "7841344357",
    address: "Leandro Valle s/n, Centro, 93449 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/lajarochita/imagen1.jpg",
      "/images/sabores/lajarochita/imagen2.jpg",
      "/images/sabores/lajarochita/imagen3.jpg",
      "/images/sabores/lajarochita/imagen4.jpg",
      "/images/sabores/lajarochita/imagen5.jpg"
    ]
  },
  {
    id: "tacos-rojos",
    title: "Tacos Rojos",
    subtitle: "Taquería de Tradición",
    description: "Los tradicionales tacos rojos de Papantla con su inigualable salsa y tortillas hechas a mano para chuparse los dedos.",
    imageUrl: "/images/sabores/tacosrojos/imagen1.jpg",
    rating: "4.7",
    tag: "Taquería",
    location: "Barrio el San Juan",
    category: "sabor",
    coords: [20.4476833, -97.3256245],
    phone: "",
    address: "Barrio del San Juan, 93449 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/tacosrojos/imagen1.jpg",
      "/images/sabores/tacosrojos/imagen2.jpg",
      "/images/sabores/tacosrojos/imagen3.jpg",
      "/images/sabores/tacosrojos/imagen4.jpg",
      "/images/sabores/tacosrojos/imagen5.jpg"
    ]
  },
  {
    id: "super-taqueria-el-gordo",
    title: "Super Taquería El Gordo",
    subtitle: "Sabor de Antaño",
    description: "Servicio rápido y los mejores tacos al pastor y de plancha. Una parada obligada para los amantes de los buenos tacos.",
    imageUrl: "/images/sabores/supertaqueriaelgordo/imagen1.jpg",
    rating: "4.6",
    tag: "Taquería",
    location: "Barrio del San Juan",
    category: "sabor",
    coords: [20.4493856, -97.3249791],
    phone: "7841087880",
    address: "93400 calle Francisco I. Madero FRENTE A WALDOS, A UN LADO DE SUBODEGA FRENTE A WALDOS EL, Barrio del San Juan, 93400 Papantla, Ver.",
    gallery: [
      "/images/sabores/supertaqueriaelgordo/imagen1.jpg",
      "/images/sabores/supertaqueriaelgordo/imagen2.jpg",
      "/images/sabores/supertaqueriaelgordo/imagen3.jpg"
    ]
  },
  {
    id: "antojitos-dona-carmen",
    title: "Antojitos Doña Carmen",
    subtitle: "Antojitos Típicos",
    description: "Los mejores antojitos huastecos hechos al instante: empanadas, duba, mole y antojitos totonacos preparados con amor de hogar.",
    imageUrl: "/images/sabores/antojitosdonacarmen/imagen1.jpeg",
    rating: "4.8",
    tag: "Antojitos",
    location: "Barrio del Zapote",
    category: "sabor",
    coords: [20.4491959, -97.3279114],
    phone: "7846881200",
    address: "De La Libertad 308, Barrio del Zapote, 93440 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/antojitosdonacarmen/imagen1.jpeg",
      "/images/sabores/antojitosdonacarmen/imagen2.PNG",
      "/images/sabores/antojitosdonacarmen/imagen3.PNG",
      "/images/sabores/antojitosdonacarmen/imagen4.PNG",
      "/images/sabores/antojitosdonacarmen/imagen5.PNG",
      "/images/sabores/antojitosdonacarmen/imagen6.PNG"
    ]
  },
  {
    id: "las-tortugas",
    title: "Las Tortugas",
    subtitle: "Hamburguesas & Tortas",
    description: "Las mejores tortas y hamburguesas al carbón de la zona frente al mural. Rápidas, abundantes y deliciosas.",
    imageUrl: "/images/sabores/lastortugas/imagen1.jpg",
    rating: "4.5",
    tag: "Hamburguesas",
    location: "Barrio del Naranjo",
    category: "sabor",
    coords: [20.446251, -97.3216291],
    phone: "7841214753",
    address: "Centro Frente al Mural de Papantla, C. José de J. Núñez Col, Barrio del Naranjo, 93400 Papantla de Olarte, Ver.",
    gallery: [
      "/images/sabores/lastortugas/imagen1.jpg",
      "/images/sabores/lastortugas/imagen2.jpg",
      "/images/sabores/lastortugas/imagen3.jpg",
      "/images/sabores/lastortugas/imagen4.jpg"
    ]
  }
];
