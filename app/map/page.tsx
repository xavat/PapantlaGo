import { MapPin } from "lucide-react";

export default function MapPage() {
  return (
    <div className="px-6 pt-10 pb-32 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">
          Mapa de <br />
          <span className="text-[#F16B24] not-italic">Papantla</span>
        </h2>
        <p className="text-gray-400 font-medium text-lg italic">
          Navega por la Ciudad que Perfuma al Mundo.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] h-[60vh] md:h-[70vh] shadow-xl shadow-gray-200 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[#F16B24]/5 animate-pulse" />
        <div className="flex flex-col items-center gap-4 z-10 transition-transform group-hover:scale-110">
          <div className="w-16 h-16 bg-[#F16B24] rounded-full flex items-center justify-center shadow-lg shadow-orange-200">
            <MapPin className="text-white w-8 h-8 animate-bounce" />
          </div>
          <span className="text-gray-900 font-black uppercase tracking-widest text-sm bg-white px-6 py-2 rounded-full shadow-sm">
            Mapa Interactivo Próximamente
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="font-extrabold text-gray-900 text-lg">Centro</span>
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">En el mapa</span>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2">
          <span className="font-extrabold text-gray-900 text-lg">El Tajín</span>
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">En el mapa</span>
        </div>
      </div>
    </div>
  );
}
