"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

interface BundleItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  spec: string;
}

const bundleItems: BundleItem[] = [
  {
    id: "comp-cizici-125",
    slug: "netmak-cizici-testere-125",
    name: "Netmak Çizici Testere Bıçağı 125x3.1x22 Z24",
    brand: "Netmak",
    price: 680,
    oldPrice: 820,
    spec: "125 mm · 24 Diş · Karbür Uçlu",
  },
  {
    id: "comp-cizici-120",
    slug: "netmak-cizici-testere-120",
    name: "Netmak Çizici Testere Bıçağı 120x2.8x22 Z24",
    brand: "Netmak",
    price: 620,
    spec: "120 mm · 24 Diş · Karbür Uçlu",
  },
];

export function ComplementaryProduct() {
  const { addItem } = useCart();
  const [checked, setChecked] = useState<Set<string>>(() => new Set(bundleItems.map((i) => i.id)));
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(bundleItems.map((i) => [i.id, 1]))
  );

  function toggleItem(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function setQty(id: string, q: number) {
    if (q < 1) return;
    setQuantities((prev) => ({ ...prev, [id]: q }));
  }

  const selectedItems = bundleItems.filter((i) => checked.has(i.id));
  const totalPrice = selectedItems.reduce((sum, i) => sum + i.price * (quantities[i.id] || 1), 0);

  function addAllToCart() {
    for (const item of selectedItems) {
      addItem(
        { id: item.id, name: item.name, brand: item.brand, price: item.price, slug: item.slug },
        quantities[item.id] || 1
      );
    }
  }

  return (
    <div className="border border-border rounded-2xl p-5 mt-3 bg-white">
      <h3 className="text-base font-bold text-text-primary mb-4">Birlikte Sık Alınanlar</h3>

      {/* Product images with + sign */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {bundleItems.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3">
            {i > 0 && <span className="text-2xl font-light text-text-muted">+</span>}
            <div className={`w-20 h-20 border-2 rounded-xl flex items-center justify-center transition-all ${checked.has(item.id) ? "border-accent bg-accent-bg" : "border-border bg-bg-secondary opacity-40"}`}>
              <svg className="w-10 h-10 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        ))}

        {/* Total + Add All */}
        <div className="ml-4 pl-4 border-l border-border text-center">
          <p className="text-xs text-text-muted mb-0.5">Toplam Fiyat</p>
          <p className="text-xl font-black text-accent">{formatPrice(totalPrice)}</p>
          <button
            onClick={addAllToCart}
            disabled={selectedItems.length === 0}
            className={`mt-2 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
              selectedItems.length > 0
                ? "bg-accent hover:bg-accent-hover text-white shadow-sm"
                : "bg-bg-secondary text-text-muted cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={13} />
            Hepsini Ekle
          </button>
        </div>
      </div>

      {/* Item list with checkboxes and quantity */}
      <div className="space-y-2.5 border-t border-border pt-4">
        {bundleItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <button
              onClick={() => toggleItem(item.id)}
              className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-all ${
                checked.has(item.id) ? "bg-accent border-accent" : "border-gray-300 bg-white"
              }`}
            >
              {checked.has(item.id) && <Check size={12} className="text-white" />}
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary leading-tight line-clamp-1">{item.name}</p>
              <p className="text-xs text-text-muted">{item.spec}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold text-text-primary">{formatPrice(item.price)}</span>

              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQty(item.id, (quantities[item.id] || 1) - 1)}
                  className="px-2 py-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="px-2 py-1 text-xs font-bold border-x border-border min-w-[2rem] text-center">
                  {quantities[item.id] || 1}
                </span>
                <button
                  onClick={() => setQty(item.id, (quantities[item.id] || 1) + 1)}
                  className="px-2 py-1 text-text-muted hover:text-text-primary transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
