"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { type Product, formatPrice } from "@/lib/data";
import { FavoriteButton } from "@/components/favorite-button";

export function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const heroImage = product.images?.[0] || product.image;

  return (
    <Link href={`/urunler/${product.slug}`} className="group block">
      <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-white overflow-hidden flex items-center justify-center p-4">
          {!imgError && heroImage ? (
            <Image
              src={heroImage}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <svg className="w-24 h-24 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton productId={product.id} size={16} />
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-100 text-text-muted text-sm px-4 py-2 rounded-lg border border-border">
                Stokta Yok
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pt-3 text-center">
          <p className="text-sm font-bold text-text-primary mb-1">{product.brand}</p>
          <h3 className="text-sm text-text-secondary group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem] mb-3">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-center gap-3">
            {discount && (
              <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1.5 rounded">
                %{discount}<br />
                <span className="text-[10px] font-medium">İndirim</span>
              </span>
            )}
            <div className="text-right">
              {product.oldPrice && (
                <p className="text-sm text-text-muted line-through">{formatPrice(product.oldPrice)}</p>
              )}
              <p className="text-xl font-bold text-text-primary">{formatPrice(product.price)} <span className="text-[10px] font-normal text-text-muted">KDV Dahil</span></p>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full mt-4 bg-accent hover:bg-accent-hover text-white text-sm font-bold uppercase tracking-wider py-3 rounded-xl transition-colors">
            Detaylı İncele
          </button>
        </div>
      </div>
    </Link>
  );
}
