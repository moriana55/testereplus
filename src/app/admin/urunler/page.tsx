"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Image as ImageIcon,
  X,
} from "lucide-react";
import rawProducts from "@/data/ideasoft-products.json";
import rawBrands from "@/data/ideasoft-brands.json";

interface Product {
  id: number;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  stock: number;
  status: string;
  url: string;
  image: string;
}

const initialProducts: Product[] = (rawProducts as Product[]).map((p, i) => ({ ...p, id: i + 1 }));
const allBrands = (rawBrands as { name: string }[]).map((b) => b.name);
const allCategories = [...new Set(initialProducts.map((p) => p.category).filter(Boolean))].sort();

const PER_PAGE = 20;

const emptyForm: Omit<Product, "id"> = { slug: "", name: "", sku: "", brand: "", category: "", subCategory: "", price: 0, stock: 0, status: "active", url: "", image: "" };

function toSlug(s: string) {
  return s.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type SortKey = "name" | "price" | "stock";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "all" && p.category !== catFilter) return false;
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (statusFilter === "active" && p.status !== "active") return false;
      if (statusFilter === "passive" && p.status !== "passive") return false;
      if (statusFilter === "nostock" && p.stock > 0) return false;
      return true;
    });
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return sortAsc ? (av as string).localeCompare(bv as string, "tr") : (bv as string).localeCompare(av as string, "tr");
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return list;
  }, [products, search, catFilter, brandFilter, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function toggleProduct(id: number) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleAll() {
    setSelected(selected.size === paginated.length ? new Set() : new Set(paginated.map((p) => p.id)));
  }

  function exportCSV() {
    const header = "SKU,Ürün Adı,Marka,Kategori,Fiyat,Stok,Durum,URL\n";
    const rows = filtered.map((p) => `"${p.sku}","${p.name}","${p.brand}","${p.category}",${p.price},${p.stock},${p.status},"${p.url}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "urunler.csv"; a.click();
  }

  function openNew() { setForm(emptyForm); setEditId(null); setShowForm(true); }
  function openEdit(p: Product) {
    setForm({ slug: p.slug, name: p.name, sku: p.sku, brand: p.brand, category: p.category, subCategory: p.subCategory, price: p.price, stock: p.stock, status: p.status, url: p.url, image: p.image });
    setEditId(p.id); setShowForm(true);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const slug = form.slug || toSlug(form.name);
    if (editId) {
      setProducts((prev) => prev.map((p) => p.id === editId ? { ...p, ...form, slug } : p));
    } else {
      const newId = Math.max(...products.map((p) => p.id)) + 1;
      setProducts((prev) => [...prev, { ...form, id: newId, slug }]);
    }
    setShowForm(false);
  }

  function deleteProduct(id: number) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function duplicateProduct(p: Product) {
    const newId = Math.max(...products.map((x) => x.id)) + 1;
    setProducts((prev) => [...prev, { ...p, id: newId, sku: p.sku + "-COPY", name: p.name + " (Kopya)" }]);
  }

  function bulkDelete() {
    if (!confirm(`${selected.size} ürünü silmek istediğinize emin misiniz?`)) return;
    setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  }

  function bulkToggleStatus() {
    setProducts((prev) => prev.map((p) => selected.has(p.id) ? { ...p, status: p.status === "active" ? "passive" : "active" } : p));
    setSelected(new Set());
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} / {products.length} ürün</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} /><span className="hidden sm:inline">Dışa Aktar</span>
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            <Plus size={16} /> Yeni Ürün
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Ürün adı, SKU veya marka ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden sm:block">
          <option value="all">Tüm Kategoriler</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden md:block">
          <option value="all">Tüm Markalar</option>
          {allBrands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden md:block">
          <option value="all">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
          <option value="nostock">Stok Yok</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-orange-700">{selected.size} ürün seçildi</span>
          <div className="h-4 w-px bg-orange-200" />
          <button onClick={bulkToggleStatus} className="text-sm text-orange-600 hover:underline">Aktif/Pasif</button>
          <button onClick={bulkDelete} className="text-sm text-red-600 hover:underline">Sil</button>
          <button onClick={() => setSelected(new Set())} className="text-sm text-gray-500 hover:underline ml-auto">Seçimi Kaldır</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={paginated.length > 0 && selected.size === paginated.length} onChange={toggleAll} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                </th>
                <th className="w-12 py-3"></th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-gray-700">Ürün <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden xl:table-cell">Kategori</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">
                  <button onClick={() => toggleSort("price")} className="flex items-center gap-1 hover:text-gray-700 ml-auto">Fiyat <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 hover:text-gray-700 mx-auto">Stok <ArrowUpDown size={12} /></button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="w-24 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleProduct(p.id)} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                  </td>
                  <td className="py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon size={16} className="text-gray-300" />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-[280px]">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </td>
                  <td className="py-3 hidden lg:table-cell">
                    <span className="text-xs text-gray-500 font-mono">{p.sku}</span>
                  </td>
                  <td className="py-3 hidden xl:table-cell">
                    {p.category && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{p.category}</span>}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    {p.price > 0 ? <p className="text-sm font-bold text-gray-800">₺{p.price.toLocaleString("tr-TR")}</p> : <p className="text-xs text-gray-400">—</p>}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : p.stock <= 5 ? "text-amber-500" : "text-gray-700"}`}>{p.stock}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status === "active" ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="pr-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Düzenle"><Edit2 size={14} className="text-gray-400" /></button>
                      <button onClick={() => duplicateProduct(p)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Kopyala"><Copy size={14} className="text-gray-400" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50" title="Sil"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} ürün</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              if (p < 1 || p > totalPages) return null;
              return <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? "bg-orange-500 text-white" : "hover:bg-gray-100 text-gray-600"}`}>{p}</button>;
            })}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Ürün Düzenle" : "Yeni Ürün"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Ürün Adı</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Marka</label>
                  <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    <option value="">Seçiniz</option>
                    {allBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                  <option value="">Seçiniz</option>
                  {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Fiyat (₺)</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Stok</label>
                  <input type="number" value={form.stock || ""} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Durum</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    <option value="active">Aktif</option>
                    <option value="passive">Pasif</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">{editId ? "Güncelle" : "Ekle"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
