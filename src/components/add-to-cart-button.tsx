"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

interface Props {
  productId: string;
  name: string;
  brand: string;
  price: number;
  slug: string;
  inStock: boolean;
}

export function AddToCartButton({ productId, name, brand, price, slug, inStock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors font-medium"
        >
          -
        </button>
        <span className="px-5 py-3 border-x border-border text-sm font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors font-medium"
        >
          +
        </button>
      </div>
      <button
        onClick={() => {
          if (inStock) {
            addItem({ id: productId, name, brand, price, slug }, quantity);
            setQuantity(1);
          }
        }}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
          inStock
            ? "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
            : "bg-bg-secondary text-text-muted cursor-not-allowed border border-border"
        }`}
        disabled={!inStock}
      >
        <ShoppingCart size={18} />
        {inStock ? `Sepete Ekle — ${formatPrice(price * quantity)}` : "Stokta Yok"}
      </button>
    </div>
  );
}
