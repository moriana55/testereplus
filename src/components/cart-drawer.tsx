"use client";

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Sepet ({totalItems})
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-bg-secondary rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-muted mb-4">Sepetiniz boş</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-accent font-semibold text-sm hover:text-accent-hover"
              >
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-bg-secondary rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0 border border-border">
                    <ShoppingBag size={20} className="text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/urunler/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-text-primary hover:text-accent line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5">{item.brand}{item.sku ? ` — ${item.sku}` : ""}</p>
                    {item.attributes && (
                      <p className="text-xs text-text-muted">
                        {Object.values(item.attributes).join(" / ")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 py-1 text-xs font-bold border-x border-border">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-text-muted hover:text-text-primary transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-accent">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Toplam</span>
              <span className="text-xl font-bold text-accent">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-green-600 font-medium">Ücretsiz kargo dahil</p>
            <Link
              href="/sepet"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors"
            >
              Sepete Git
            </Link>
            <a
              href={`https://wa.me/905551234567?text=${encodeURIComponent(
                `Merhaba, sipariş vermek istiyorum:\n${items.map((i) => `- ${i.name} (x${i.quantity}) ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nToplam: ${formatPrice(totalPrice)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors"
            >
              WhatsApp ile Sipariş Ver
            </a>
          </div>
        )}
      </div>
    </>
  );
}
