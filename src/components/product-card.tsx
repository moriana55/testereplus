"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { type Product, formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <Link href={`/urunler/${product.slug}`} className="group block">
      <div className="bg-white border border-border rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-bg-secondary overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-text-muted">
            <svg className="w-16 h-16 opacity-15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              %{discount}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
              <span className="bg-white text-text-muted text-sm px-4 py-2 rounded-lg border border-border shadow-sm">
                Stokta Yok
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (product.inStock) {
                  addItem({
                    id: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    slug: product.slug,
                  });
                }
              }}
              className="bg-accent hover:bg-accent-hover text-white p-2.5 rounded-xl shadow-lg shadow-accent/25 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          <p className="text-xs text-text-muted mt-1">{product.category}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-accent">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
