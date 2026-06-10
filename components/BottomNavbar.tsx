"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Map, Bed, Calendar, Utensils } from "lucide-react";

const items = [
  { name: "Inicio", path: "/", icon: Home },
  { name: "Destinos", path: "/destinos", icon: Compass },
  { name: "Sabor", path: "/sabor", icon: Utensils },
  { name: "Hospedaje", path: "/hospedaje", icon: Bed },
  { name: "Eventos", path: "/eventos", icon: Calendar },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden font-outfit">
      <div className="bg-white/5 dark:bg-white/5 backdrop-blur-[32px] saturate-[180%] rounded-[32px] px-6 py-4 flex items-center justify-between shadow-2xl border border-white/20 dark:border-white/10 transition-colors duration-500">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path} className="relative flex flex-col items-center gap-1 group">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? "text-primary scale-125" : "text-foreground opacity-40 group-hover:text-primary group-hover:opacity-100"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-[0.1em] ${isActive ? "text-primary" : "text-foreground opacity-30"}`}>
                {item.name}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#8B2635]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
