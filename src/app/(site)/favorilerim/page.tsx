"use client";

import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { products } from "@/lib/data";
import { useFavorites } from "@/lib/favorites-context";
import { ProductCard } from "@/components/product-card";

export default function FavorilerimPage() {
  const { favorites } = useFavorites();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  if (favProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Heart size={64} className="mx-auto text-text-muted mb-6" />
        <h1 className="text-2xl font-bold mb-3">Favorileriniz Boş</h1>
        <p className="text-text-muted mb-8">Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.</p>
        <Link
          href="/urunler"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Favorilerim ({favProducts.length} ürün)</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {favProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
