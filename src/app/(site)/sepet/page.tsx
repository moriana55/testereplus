"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Tag, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

const COUPONS: Record<string, { type: "percent" | "fixed"; value: number; label: string }> = {
  "HOSGELDIN": { type: "percent", value: 10, label: "%10 Hoş Geldin İndirimi" },
  "TESTERE50": { type: "fixed", value: 50, label: "50₺ İndirim" },
  "YAZ2026": { type: "percent", value: 15, label: "%15 Yaz Kampanyası" },
};

export default function SepetPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      setCouponCode("");
    } else {
      setCouponError("Geçersiz kupon kodu");
    }
  }

  const discount = appliedCoupon && COUPONS[appliedCoupon]
    ? COUPONS[appliedCoupon].type === "percent"
      ? totalPrice * (COUPONS[appliedCoupon].value / 100)
      : COUPONS[appliedCoupon].value
    : 0;
  const finalPrice = totalPrice - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={64} className="mx-auto text-text-muted mb-6" />
        <h1 className="text-2xl font-bold mb-3">Sepetiniz Boş</h1>
        <p className="text-text-muted mb-8">Henüz sepetinize ürün eklemediniz.</p>
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="section-rule text-2xl font-bold mb-8">Sepetim ({totalItems} ürün)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 bg-white border border-border rounded-2xl">
              <div className="w-20 h-20 bg-bg-secondary rounded-xl flex items-center justify-center shrink-0 border border-border">
                <ShoppingBag size={24} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/urunler/${item.slug}`}
                  className="font-medium text-text-primary hover:text-accent transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-text-muted mt-0.5">{item.brand}{item.sku ? ` — ${item.sku}` : ""}</p>
                {item.attributes && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 py-2 text-sm font-bold border-x border-border min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-text-muted hover:text-red-500 transition-colors mt-2"
          >
            Sepeti Temizle
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-2xl p-6 sticky top-28">
            <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Ara Toplam</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Kargo</span>
                <span className="font-medium text-green-600">Ücretsiz</span>
              </div>

              {/* Coupon */}
              {!appliedCoupon ? (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                      placeholder="Kupon kodu"
                      className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-accent hover:bg-accent-hover text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-xs font-medium text-green-700">{COUPONS[appliedCoupon].label}</span>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)} className="text-text-muted hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>İndirim</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold">Toplam</span>
                <span className="text-xl font-bold text-accent">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            <Link
              href="/odeme"
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold transition-colors mt-6"
            >
              Ödemeye Geç
              <ArrowRight size={18} />
            </Link>

            <a
              href={`https://wa.me/905551234567?text=${encodeURIComponent(
                `Merhaba, sipariş vermek istiyorum:\n${items.map((i) => `- ${i.name} (x${i.quantity}) ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nToplam: ${formatPrice(totalPrice)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors mt-3"
            >
              WhatsApp ile Sipariş Ver
            </a>

            <Link href="/urunler" className="block text-center text-sm text-accent hover:text-accent-hover mt-4 transition-colors">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
