"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { X, Plus, Search, Check, ShoppingBag } from "lucide-react";
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
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, selected]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Ürün Karşılaştırma</h1>
      <p className="text-text-muted mb-8">En fazla 4 ürünü yan yana karşılaştırabilirsiniz.</p>

      {selected.length === 0 ? (
        <div className="text-center py-16 bg-bg-secondary rounded-2xl">
          <ShoppingBag size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted mb-6">Karşılaştırmak istediğiniz ürünleri ekleyin</p>
          <button
            onClick={() => setShowSearch(true)}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-semibold transition-colors"
          >
            <Plus size={18} />
            Ürün Ekle
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-bg-secondary">
                <th className="text-left px-4 py-3 text-sm font-semibold text-text-primary border-b border-border w-40">Özellik</th>
                {selected.map((p) => (
                  <th key={p.id} className="px-4 py-4 border-b border-border border-l text-center min-w-[180px]">
                    <button
                      onClick={() => removeProduct(p.id)}
                      className="absolute-ish float-right p-1 hover:bg-red-50 rounded-lg text-text-muted hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <Link href={`/urunler/${p.slug}`} className="text-sm font-medium text-accent hover:underline line-clamp-2 block">
                      {p.name}
                    </Link>
                  </th>
                ))}
                {selected.length < 4 && (
                  <th className="px-4 py-4 border-b border-border border-l text-center min-w-[180px]">
                    <button
                      onClick={() => setShowSearch(true)}
                      className="mx-auto flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors"
                    >
                      <Plus size={16} /> Ürün Ekle
                    </button>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">Marka</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-sm text-center border-b border-border border-l font-semibold">{p.brand}</td>
                ))}
                {selected.length < 4 && <td className="border-b border-border border-l" />}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">Fiyat</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-sm text-center border-b border-border border-l font-bold text-accent">
                    {formatPrice(p.price)}
                    {p.oldPrice && <span className="block text-xs text-text-muted line-through font-normal">{formatPrice(p.oldPrice)}</span>}
                  </td>
                ))}
                {selected.length < 4 && <td className="border-b border-border border-l" />}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">Stok</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-sm text-center border-b border-border border-l">
                    {p.inStock ? <Check size={16} className="text-green-500 mx-auto" /> : <span className="text-red-500">Yok</span>}
                  </td>
                ))}
                {selected.length < 4 && <td className="border-b border-border border-l" />}
              </tr>
              {allSpecKeys.map((key) => (
                <tr key={key}>
                  <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">{key}</td>
                  {selected.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-sm text-center border-b border-border border-l">
                      {p.specs[key] || "—"}
                    </td>
                  ))}
                  {selected.length < 4 && <td className="border-b border-border border-l" />}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 text-sm text-text-muted font-medium">Kategori</td>
                {selected.map((p) => (
                  <td key={p.id} className="px-4 py-3 text-sm text-center border-l">{p.category}</td>
                ))}
                {selected.length < 4 && <td className="border-l" />}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowSearch(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Ürün Ekle</h3>
                <button onClick={() => setShowSearch(false)} className="p-1.5 hover:bg-bg-secondary rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün adı veya marka ara..."
                  className="w-full pl-9 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {searchResults.length === 0 && search.trim() && (
                  <p className="text-sm text-text-muted text-center py-4">Sonuç bulunamadı</p>
                )}
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-bg-secondary transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.brand} — {formatPrice(p.price)}</p>
                    </div>
                    <Plus size={16} className="text-accent shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
