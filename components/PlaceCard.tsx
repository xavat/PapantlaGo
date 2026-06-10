import Image from "next/image";
import { Star, ArrowRight, Clock, DollarSign, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceCardProps {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  rating?: string;
  price?: string;
  buttonText?: string;
  icon?: "clock" | "dollar" | "eye";
  label?: string;
  onTap?: () => void;
}

export default function PlaceCard({
  title,
  description = "",
  imageUrl,
  category,
  rating,
  price,
  buttonText = "Ver más",
  icon,
  label,
  onTap
}: PlaceCardProps) {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.06)] mb-8 border border-gray-50 flex flex-col group overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="px-3 pt-6 pb-2">
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-[#F16B24] text-[#F16B24]" />
            <span className="text-sm font-bold text-gray-500">{rating}</span>
          </div>
        )}

        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {title}
        </h3>

        {category && (
          <p className="text-gray-400 font-medium text-sm mt-1">{category}</p>
        )}

        {(icon || label) && (
          <div className="flex gap-4 mt-4 text-xs font-bold text-gray-400 bg-gray-50 p-3 rounded-2xl w-fit">
            <div className="flex items-center gap-2">
              {icon === "clock" && <Clock className="w-4 h-4 text-[#F16B24]" />}
              {icon === "dollar" && <DollarSign className="w-4 h-4 text-[#F16B24]" />}
              {icon === "eye" && <Eye className="w-4 h-4 text-[#F16B24]" />}
              <span>{label}</span>
            </div>
          </div>
        )}

        <p className="text-gray-500 mt-5 leading-relaxed text-sm">
          {description}
        </p>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">
            {price || ""}
          </span>
          
          <button
            onClick={onTap}
            className={cn(
              "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-[0.97]",
              buttonText === "Ver más" 
                ? "bg-[#FFC107] text-white shadow-lg shadow-amber-100 hover:bg-amber-500" 
                : "bg-[#F16B24] text-white shadow-lg shadow-orange-100 hover:bg-orange-600"
            )}
          >
            {buttonText}
            {buttonText === "Ver más" && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
