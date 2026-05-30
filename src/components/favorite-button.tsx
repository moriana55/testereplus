"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";

export function FavoriteButton({ productId, size = 18, className = "" }: { productId: string; size?: number; className?: string }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`p-2 rounded-full transition-all ${active ? "text-red-500 bg-red-50" : "text-text-muted hover:text-red-400 hover:bg-red-50"} ${className}`}
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
    >
      <Heart size={size} className={active ? "fill-red-500" : ""} />
    </button>
  );
}
