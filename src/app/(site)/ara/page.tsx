"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, categories, formatPrice, type Product } from "@/lib/data";
import { ProductCard } from "@/components/product-card";

export default function AramaPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    let filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
    );

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categorySlugs.includes(selectedCategory));
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
    }

    return filtered;
  }, [query, selectedCategory, sortBy]);

  const categoryFacets = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matchingProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    const counts: Record<string, number> = {};
    matchingProducts.forEach((p) => {
      p.categorySlugs.forEach((slug) => {
        counts[slug] = (counts[slug] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([slug, count]) => ({
        slug,
        name: categories.find((c) => c.slug === slug)?.name || slug,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, marka veya kategori ara..."
            className="w-full pl-12 pr-12 py-4 border border-border rounded-2xl text-lg focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setSelectedCategory(""); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <X size={18} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {!query.trim() ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted text-lg">Arama yapmak için yukarıya bir şeyler yazın</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Freud", "Daire testere", "Freze bıçağı", "Şerit testere", "Matkap ucu"].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="px-4 py-2 bg-bg-secondary hover:bg-accent/10 hover:text-accent border border-border rounded-full text-sm transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-secondary">
              <span className="font-bold text-text-primary">{results.length}</span> sonuç bulundu
              {query && <span className="text-text-muted"> — &ldquo;{query}&rdquo;</span>}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1.5 text-sm border border-border px-3 py-2 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filtre
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-accent/20 outline-none"
              >
                <option value="relevance">Alaka</option>
                <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                <option value="name">İsim (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="font-bold text-sm mb-3">Kategori</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? "bg-accent/10 text-accent font-medium" : "hover:bg-bg-secondary text-text-secondary"
                    }`}
                  >
                    Tümü ({results.length})
                  </button>
                  {categoryFacets.map((f) => (
                    <button
                      key={f.slug}
                      onClick={() => setSelectedCategory(f.slug === selectedCategory ? "" : f.slug)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === f.slug ? "bg-accent/10 text-accent font-medium" : "hover:bg-bg-secondary text-text-secondary"
                      }`}
                    >
                      {f.name} ({f.count})
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="lg:col-span-3">
              {results.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-text-muted text-lg mb-2">Sonuç bulunamadı</p>
                  <p className="text-sm text-text-muted">Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
