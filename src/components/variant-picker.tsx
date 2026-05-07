"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Truck, Shield, Check, AlertCircle, Info } from "lucide-react";
import { type ProductWithVariants, type Variant, findVariant, getAvailableOptions } from "@/lib/variants";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export function VariantPicker({ product }: { product: ProductWithVariants }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const first = product.variants.find((v) => v.inStock);
    return first ? { ...first.attributes } : {};
  });

  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const currentVariant = useMemo(
    () => findVariant(product.variants, selected),
    [product.variants, selected]
  );

  const discount = currentVariant?.oldPrice
    ? Math.round(((currentVariant.oldPrice - currentVariant.price) / currentVariant.oldPrice) * 100)
    : null;

  function handleSelect(groupKey: string, value: string) {
    setSelected((prev) => ({ ...prev, [groupKey]: value }));
  }

  return (
    <div>
      {/* Brand + Name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{product.brand}</span>
        <span className="text-xs text-text-muted">|</span>
        <span className="text-xs text-text-muted">{product.category}</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{product.name}</h1>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-2">
        {currentVariant ? (
          <>
            <span className="text-3xl font-black text-accent">{formatPrice(currentVariant.price)}</span>
            {currentVariant.oldPrice && (
              <span className="text-lg text-text-muted line-through">{formatPrice(currentVariant.oldPrice)}</span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2.5 py-0.5 rounded-lg">
                %{discount} tasarruf
              </span>
            )}
          </>
        ) : (
          <span className="text-lg text-text-muted">Lütfen seçenekleri belirleyin</span>
        )}
      </div>

      {/* SKU */}
      {currentVariant && (
        <p className="text-xs text-text-muted mb-5">SKU: {currentVariant.sku}</p>
      )}

      {/* Variant Groups */}
      <div className="space-y-5 mb-6">
        {product.variantGroups.map((group) => {
          const availability = getAvailableOptions(product.variants, group.key, selected);

          return (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-sm font-semibold text-text-primary">
                  {group.name}: <span className="text-accent font-bold">{selected[group.key] || "—"}</span>
                </label>
                {group.key === "cap" && (
                  <button className="text-xs text-text-muted hover:text-accent flex items-center gap-1 transition-colors">
                    <Info size={12} />
                    Ölçü rehberi
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const info = availability.get(option);
                  const isSelected = selected[group.key] === option;
                  const isAvailable = info?.available ?? false;
                  const isInStock = info?.inStock ?? false;

                  let className = "relative px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ";

                  if (!isAvailable) {
                    className += "border-border bg-bg-secondary text-text-muted/40 cursor-not-allowed line-through";
                  } else if (isSelected) {
                    className += "border-accent bg-accent-bg text-accent shadow-sm shadow-accent/10";
                  } else if (!isInStock) {
                    className += "border-border bg-white text-text-secondary hover:border-gray-300 cursor-pointer";
                  } else {
                    className += "border-border bg-white text-text-primary hover:border-accent/50 hover:shadow-sm cursor-pointer";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => isAvailable && handleSelect(group.key, option)}
                      disabled={!isAvailable}
                      className={className}
                    >
                      {option}
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </span>
                      )}
                      {isAvailable && !isInStock && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                          <AlertCircle size={10} className="text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {group.options.some((o) => {
                const info = availability.get(o);
                return info?.available && !info.inStock;
              }) && (
                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Sarı işaretli seçenekler stokta yok, sipariş ile temin edilir
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Stock status */}
      {currentVariant && (
        <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-bg-secondary border border-border">
          {currentVariant.inStock ? (
            <>
              <Check size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-600">Stokta Var — Hemen Kargoya Verilir</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm font-medium text-amber-600">Sipariş ile temin — 3-5 iş günü</span>
            </>
          )}
        </div>
      )}

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors font-medium text-lg"
          >
            −
          </button>
          <span className="px-5 py-3 border-x-2 border-border text-sm font-bold min-w-[3rem] text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-3 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors font-medium text-lg"
          >
            +
          </button>
        </div>
        <button
          onClick={() => {
            if (currentVariant) {
              addItem({
                id: `${product.slug}-${currentVariant.sku}`,
                name: product.name,
                brand: product.brand,
                price: currentVariant.price,
                slug: product.slug,
                sku: currentVariant.sku,
                attributes: { ...selected },
              }, quantity);
              setQuantity(1);
            }
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
            currentVariant
              ? "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 hover:shadow-accent/30"
              : "bg-bg-secondary text-text-muted cursor-not-allowed border-2 border-border"
          }`}
          disabled={!currentVariant}
        >
          <ShoppingCart size={18} />
          {currentVariant ? `Sepete Ekle — ${formatPrice(currentVariant.price * quantity)}` : "Seçim Yapın"}
        </button>
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/905551234567?text=${encodeURIComponent(
          `Merhaba, ${product.name} - ${Object.values(selected).join(", ")} hakkında bilgi almak istiyorum.${currentVariant ? ` (SKU: ${currentVariant.sku})` : ""}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm mb-6"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
        WhatsApp ile Sor
      </a>

      {/* Selected specs summary */}
      {currentVariant && (
        <div className="bg-bg-secondary border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Seçilen Konfigürasyon</h3>
          <dl className="space-y-2.5">
            {product.variantGroups.map((group) => (
              <div key={group.key} className="flex justify-between text-sm border-b border-border pb-2.5 last:border-0 last:pb-0">
                <dt className="text-text-muted">{group.name}</dt>
                <dd className="text-text-primary font-semibold">{selected[group.key]}</dd>
              </div>
            ))}
            <div className="flex justify-between text-sm border-b border-border pb-2.5">
              <dt className="text-text-muted">Marka</dt>
              <dd className="text-text-primary font-semibold">{product.brand}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-text-muted">Stok Kodu</dt>
              <dd className="text-text-primary font-mono text-xs font-semibold bg-bg-card-hover px-2 py-0.5 rounded">{currentVariant.sku}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl p-3.5">
          <Truck size={18} className="text-accent shrink-0" />
          <span className="text-xs text-text-secondary font-medium">Ücretsiz Kargo</span>
        </div>
        <div className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl p-3.5">
          <Shield size={18} className="text-accent shrink-0" />
          <span className="text-xs text-text-secondary font-medium">Orijinal Ürün Garantisi</span>
        </div>
      </div>
    </div>
  );
}
