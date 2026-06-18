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
    <Link href={`/urunler/${product.slug}`} className="group block h-full">
      <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-bg-secondary/40 overflow-hidden flex items-center justify-center p-4">
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
            {discount && (
              <span className="bg-danger text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-sm">
                %{discount} İndirim
              </span>
            )}
            {product.inStock && (
              <span className="bg-success-bg text-success text-[10px] font-semibold px-2 py-0.5 rounded-md border border-success/20">
                Stokta
              </span>
            )}
          </div>
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
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white text-text-secondary text-sm font-medium px-4 py-2 rounded-lg border border-border shadow-sm">
                Stokta Yok
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 pt-3 flex flex-col flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-accent mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem] mb-3 leading-snug">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-auto">
            {product.oldPrice && (
              <p className="text-xs text-text-muted line-through">{formatPrice(product.oldPrice)}</p>
            )}
            <p className="text-xl font-extrabold text-text-primary leading-tight">
              {formatPrice(product.price)}
              <span className="text-[10px] font-normal text-text-muted ml-1">KDV Dahil</span>
            </p>
          </div>

          {/* CTA */}
          <span className="block w-full mt-3 bg-text-primary group-hover:bg-accent text-white text-sm font-semibold text-center py-2.5 rounded-xl transition-colors">
            İncele
          </span>
        </div>
      </div>
    </Link>
  );
}
