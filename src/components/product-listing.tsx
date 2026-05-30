"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { type Product, type Category } from "@/lib/data";
import { ProductCard } from "./product-card";
import { CategoryTree } from "./category-tree";

interface Props {
  products: Product[];
  categories: Category[];
  activeCategory?: string;
  initialSearch?: string;
}

export function ProductListing({ products, categories, activeCategory, initialSearch }: Props) {
  const [search, setSearch] = useState(initialSearch || "");
  const [sort, setSort] = useState("default");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.size > 0) {
      result = result.filter((p) => selectedBrands.has(p.brand));
    }

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [products, search, sort, selectedBrands]);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0 space-y-6">
        <CategoryTree activeSlug={activeCategory} />

        {/* Brand filter */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Markalar</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer hover:text-text-primary">
                <input
                  type="checkbox"
                  checked={selectedBrands.has(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="accent-accent w-4 h-4 rounded"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Products grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ürün ara..."
              className="w-full bg-bg-secondary border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted whitespace-nowrap">{filtered.length} ürün</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-border rounded-xl px-4 py-2.5 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            >
              <option value="default">Önerilen Sıralama</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border rounded-2xl p-12 text-center">
            <p className="text-text-muted mb-2">Aramanızla eşleşen ürün bulunamadı.</p>
            <button
              onClick={() => { setSearch(""); setSelectedBrands(new Set()); }}
              className="text-accent hover:text-accent-hover text-sm font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
