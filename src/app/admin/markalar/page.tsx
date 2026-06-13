"use client";

import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, Package, X, Check, Search, ExternalLink, Upload, Grid3X3, List, TrendingUp, Award } from "lucide-react";
import { brands as dataBrands, products } from "@/lib/data";
import { useLocalState } from "@/lib/use-local-state";

interface Brand {
  name: string;
  slug: string;
  productCount: number;
  logo: string;
  website: string;
  description: string;
}

const brandLogos: Record<string, string> = {
  bosch: "https://logo.clearbit.com/bosch.com",
  freud: "https://logo.clearbit.com/freud.it",
  netmak: "https://logo.clearbit.com/netmak.com.tr",
  konig: "https://logo.clearbit.com/konig.com",
  schuster: "https://logo.clearbit.com/schuster.com",
  tideway: "https://logo.clearbit.com/tideway.com",
  junior: "https://logo.clearbit.com/juniorhacksaw.com",
};

const brandColors: Record<string, string> = {
  bosch: "from-blue-500 to-cyan-500",
  freud: "from-red-500 to-orange-500",
  netmak: "from-emerald-500 to-green-500",
  konig: "from-amber-500 to-yellow-500",
  kronberg: "from-purple-500 to-violet-500",
  tideway: "from-sky-500 to-blue-500",
  flamex: "from-orange-500 to-red-500",
  gkg: "from-teal-500 to-emerald-500",
  izartools: "from-indigo-500 to-blue-500",
  junior: "from-lime-500 to-green-500",
  kohertz: "from-pink-500 to-rose-500",
  krabbe: "from-cyan-500 to-teal-500",
  onci: "from-violet-500 to-purple-500",
  schuster: "from-slate-500 to-gray-500",
  piranha: "from-red-600 to-red-500",
  resiste: "from-amber-600 to-orange-500",
  glg: "from-blue-600 to-indigo-500",
};

function getGradient(slug: string) {
  return brandColors[slug] || "from-gray-400 to-gray-500";
}

export default function BrandsPage() {
  const [brandList, setBrandList] = useLocalState<Brand[]>(
    "tp_admin_brands",
    dataBrands.map((b) => {
      const slug = typeof b === "string" ? b.toLowerCase() : (b as any).slug || b;
      const name = typeof b === "string" ? b : (b as any).name || b;
      return {
        name,
        slug,
        productCount: products.filter((p) => p.brand === name).length,
        logo: brandLogos[slug] || "",
        website: "",
        description: "",
      };
    }).sort((a, b) => b.productCount - a.productCount)
  );
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formWebsite, setFormWebsite] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLogo, setFormLogo] = useState("");
  const [logoError, setLogoError] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    if (!search) return brandList;
    return brandList.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [brandList, search]);

  const totalProducts = brandList.reduce((s, b) => s + b.productCount, 0);
  const topBrand = brandList[0];

  function resetForm() { setFormName(""); setFormWebsite(""); setFormDesc(""); setFormLogo(""); setEditIdx(null); }

  function handleSubmit() {
    if (!formName.trim()) return;
    const slug = formName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    if (editIdx !== null) {
      setBrandList((prev) => prev.map((b, i) => i === editIdx ? { ...b, name: formName, slug, website: formWebsite, description: formDesc, logo: formLogo || b.logo } : b));
    } else {
      if (brandList.some((b) => b.name.toLowerCase() === formName.toLowerCase())) { alert("Bu marka zaten mevcut"); return; }
      setBrandList((prev) => [{ name: formName, slug, productCount: 0, logo: formLogo || brandLogos[slug] || "", website: formWebsite, description: formDesc }, ...prev]);
    }
    resetForm();
    setShowForm(false);
  }

  function startEdit(idx: number) {
    const b = brandList[idx];
    setFormName(b.name);
    setFormWebsite(b.website);
    setFormDesc(b.description);
    setFormLogo(b.logo);
    setEditIdx(idx);
    setShowForm(true);
  }

  function deleteBrand(idx: number) {
    const b = brandList[idx];
    if (b.productCount > 0) { alert(`${b.name} markasında ${b.productCount} ürün var. Önce ürünleri taşıyın.`); return; }
    if (!confirm(`"${b.name}" markasını silmek istediğinize emin misiniz?`)) return;
    setBrandList((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFormLogo(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Markalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{brandList.length} kayıtlı marka</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Marka
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Marka</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{brandList.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Ürün</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-1.5">
            <Award size={12} className="text-orange-500" />
            <span className="text-xs text-gray-500">En Çok Ürün</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{topBrand?.name}</p>
          <p className="text-xs text-gray-400">{topBrand?.productCount} ürün</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Ort. Ürün/Marka</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(totalProducts / brandList.length)}</p>
        </div>
      </div>

      {/* Search + View Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Marka ara..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
          <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-orange-50 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}>
            <Grid3X3 size={16} />
          </button>
          <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-orange-50 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((brand, idx) => {
            const origIdx = brandList.indexOf(brand);
            const gradient = getGradient(brand.slug);
            const hasLogo = brand.logo && !logoError.has(brand.slug);
            return (
              <div key={brand.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all group">
                {/* Color Banner */}
                <div className={`h-16 bg-gradient-to-r ${gradient} relative`}>
                  <div className="absolute -bottom-7 left-5">
                    <div className="w-14 h-14 bg-white rounded-xl shadow-md border-2 border-white flex items-center justify-center overflow-hidden">
                      {hasLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 object-contain"
                          onError={() => setLogoError((prev) => new Set([...prev, brand.slug]))}
                        />
                      ) : (
                        <span className={`text-base font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
                          {brand.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(origIdx)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Edit2 size={12} className="text-gray-600" /></button>
                    <button onClick={() => deleteBrand(origIdx)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm"><Trash2 size={12} className="text-gray-600 hover:text-red-500" /></button>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-10 pb-5 px-5">
                  <h3 className="text-base font-bold text-gray-900">{brand.name}</h3>
                  {brand.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{brand.description}</p>}
                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Package size={12} />
                      <span className="font-semibold text-gray-700">{brand.productCount}</span> ürün
                    </span>
                    {brand.productCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp size={12} />
                        {Math.round((brand.productCount / totalProducts) * 100)}%
                      </div>
                    )}
                  </div>
                  {/* Mini bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1 mt-3">
                    <div className={`h-1 rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${Math.max(2, (brand.productCount / (topBrand?.productCount || 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pl-5">Marka</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Ürün Sayısı</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Pay</th>
                <th className="w-24 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((brand, idx) => {
                const origIdx = brandList.indexOf(brand);
                const gradient = getGradient(brand.slug);
                const hasLogo = brand.logo && !logoError.has(brand.slug);
                return (
                  <tr key={brand.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                          {hasLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-7 h-7 object-contain rounded"
                              onError={() => setLogoError((prev) => new Set([...prev, brand.slug]))}
                            />
                          ) : (
                            <span className="text-xs font-bold text-white">{brand.name.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{brand.name}</p>
                          <p className="text-xs text-gray-400">{brand.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="text-sm font-bold text-gray-700">{brand.productCount}</span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-gradient-to-r ${gradient}`} style={{ width: `${Math.max(3, (brand.productCount / (topBrand?.productCount || 1)) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{Math.round((brand.productCount / totalProducts) * 100)}%</span>
                      </div>
                    </td>
                    <td className="pr-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => startEdit(origIdx)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                        <button onClick={() => deleteBrand(origIdx)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editIdx !== null ? "Marka Düzenle" : "Yeni Marka"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Logo Preview */}
              <div className="flex items-center gap-4">
                <label className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors overflow-hidden border-2 border-dashed border-gray-300">
                  {formLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formLogo} alt="" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Upload size={20} className="text-gray-400" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
                </label>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Marka Logosu</p>
                  <p className="text-xs text-gray-400 mt-0.5">PNG, SVG önerilir (şeffaf arka plan)</p>
                  {formLogo && (
                    <button onClick={() => setFormLogo("")} className="text-xs text-red-500 mt-1 hover:underline">Kaldır</button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marka Adı *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={formWebsite} onChange={(e) => setFormWebsite(e.target.value)} placeholder="https://www.marka.com" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} placeholder="Marka hakkında kısa bilgi" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Check size={16} /> Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
