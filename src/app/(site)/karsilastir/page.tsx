"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Search, Check, ShoppingBag, ArrowRight, Scale, ShoppingCart } from "lucide-react";
import { products, formatPrice, type Product } from "@/lib/data";

export default function KarsilastirPage() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return products
      .filter((p) => !selected.find((s) => s.id === p.id))
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 10);
  }, [search, selected]);

  const popularProducts = useMemo(() => {
    return products.filter((p) => p.inStock && !selected.find((s) => s.id === p.id)).slice(0, 6);
  }, [selected]);

  function addProduct(product: Product) {
    if (selected.length >= 4) return;
    setSelected([...selected, product]);
    setSearch("");
    setShowSearch(false);
  }

  function removeProduct(id: string) {
    setSelected(selected.filter((p) => p.id !== id));
  }

  const allSpecKeys = useMemo(() => {
    const keys = new Set<string>();
    selected.forEach((p) => Object.keys(p.specs).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }, [selected]);

  const cheapest = selected.length > 1 ? selected.reduce((a, b) => a.price < b.price ? a : b) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Karşılaştırma</h1>
          <p className="text-gray-500 text-sm mt-1">En fazla 4 ürünü yan yana karşılaştırabilirsiniz</p>
        </div>
        {selected.length > 0 && selected.length < 4 && (
          <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
            <Plus size={16} /> Ürün Ekle ({selected.length}/4)
          </button>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="space-y-8">
          <div className="text-center py-16 bg-gradient-to-b from-orange-50 to-white rounded-2xl border border-orange-100">
            <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale size={36} className="text-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Karşılaştırmaya Ürün Ekleyin</h2>
            <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">Ürünlerin özelliklerini, fiyatlarını ve teknik detaylarını yan yana karşılaştırın.</p>
            <button
              onClick={() => setShowSearch(true)}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              <Plus size={18} /> Ürün Ekle
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Popüler Ürünler</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {popularProducts.map((p) => (
                <button key={p.id} onClick={() => addProduct(p)} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-orange-300 hover:shadow-md transition-all text-left group">
                  <div className="w-full aspect-square bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} width={100} height={100} className="object-contain" />
                    ) : (
                      <ShoppingBag size={24} className="text-gray-300" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-xs text-orange-600 font-bold">{formatPrice(p.price)}</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-orange-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={10} /> Ekle
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Product Cards Row */}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${Math.min(selected.length + (selected.length < 4 ? 1 : 0), 4)}, 1fr)` }}>
            {selected.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-4 relative group">
                <button
                  onClick={() => removeProduct(p.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100 z-10"
                >
                  <X size={12} className="text-gray-400 hover:text-red-500" />
                </button>
                <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} width={160} height={160} className="object-contain" />
                  ) : (
                    <ShoppingBag size={32} className="text-gray-300" />
                  )}
                </div>
                <Link href={`/urunler/${p.slug}`} className="text-sm font-semibold text-gray-900 hover:text-orange-600 line-clamp-2 block mb-1">
                  {p.name}
                </Link>
                <p className="text-xs text-gray-500 mb-2">{p.brand}</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-lg font-bold ${cheapest?.id === p.id ? "text-green-600" : "text-gray-900"}`}>
                    {formatPrice(p.price)}
                  </span>
                  {(p.oldPrice ?? 0) > 0 && (p.oldPrice ?? 0) > p.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(p.oldPrice!)}</span>
                  )}
                  {cheapest?.id === p.id && selected.length > 1 && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">En Uygun</span>
                  )}
                </div>
                <div className="mt-2">
                  {p.inStock ? (
                    <span className="text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Stokta</span>
                  ) : (
                    <span className="text-xs text-red-500">Stok Dışı</span>
                  )}
                </div>
              </div>
            ))}
            {selected.length < 4 && (
              <button
                onClick={() => setShowSearch(true)}
                className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-300 hover:bg-orange-50/30 transition-all min-h-[280px]"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus size={20} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Ürün Ekle</span>
              </button>
            )}
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {/* Fiyat */}
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 w-44">Fiyat</td>
                    {selected.map((p) => (
                      <td key={p.id} className="px-5 py-3.5 text-center">
                        <span className={`text-base font-bold ${cheapest?.id === p.id ? "text-green-600" : "text-gray-900"}`}>
                          {formatPrice(p.price)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Marka */}
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3 text-sm font-medium text-gray-500 w-44">Marka</td>
                    {selected.map((p) => (
                      <td key={p.id} className="px-5 py-3 text-sm text-center text-gray-800 font-medium">{p.brand}</td>
                    ))}
                  </tr>
                  {/* Kategori */}
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-500 w-44">Kategori</td>
                    {selected.map((p) => (
                      <td key={p.id} className="px-5 py-3 text-sm text-center text-gray-700">{p.category}</td>
                    ))}
                  </tr>
                  {/* Stok */}
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3 text-sm font-medium text-gray-500 w-44">Stok Durumu</td>
                    {selected.map((p) => (
                      <td key={p.id} className="px-5 py-3 text-center">
                        {p.inStock ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium"><Check size={12} /> Stokta</span>
                        ) : (
                          <span className="inline-flex items-center text-xs text-red-500 bg-red-50 px-2.5 py-1 rounded-full font-medium">Stok Dışı</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  {/* Specs */}
                  {allSpecKeys.map((key, i) => {
                    const values = selected.map((p) => p.specs[key] || "—");
                    const allSame = values.every((v) => v === values[0]);
                    return (
                      <tr key={key} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                        <td className="px-5 py-3 text-sm font-medium text-gray-500 w-44">{key}</td>
                        {selected.map((p, j) => (
                          <td key={p.id} className={`px-5 py-3 text-sm text-center ${!allSame && values[j] !== "—" ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                            {p.specs[key] || <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => { setShowSearch(false); setSearch(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün adı, marka veya kategori ara..."
                  className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  autoFocus
                />
                <button onClick={() => { setShowSearch(false); setSearch(""); }} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {search.trim() && searchResults.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">Sonuç bulunamadı</p>
                )}
                {(search.trim() ? searchResults : popularProducts.slice(0, 8)).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {p.image ? (
                        <Image src={p.image} alt={p.name} width={40} height={40} className="object-contain" />
                      ) : (
                        <ShoppingBag size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand} · {formatPrice(p.price)}</p>
                    </div>
                    <Plus size={16} className="text-orange-500 shrink-0" />
                  </button>
                ))}
              </div>
              {!search.trim() && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Popüler ürünler gösteriliyor. Aramaya başlayın.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
