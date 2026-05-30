"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Package, X, Check } from "lucide-react";
import { brands as dataBrands, products } from "@/lib/data";

interface Brand {
  name: string;
  productCount: number;
}

export default function BrandsPage() {
  const [brandList, setBrandList] = useState<Brand[]>(
    dataBrands.map((b) => ({ name: b, productCount: products.filter((p) => p.brand === b).length })).sort((a, b) => b.productCount - a.productCount)
  );
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [formName, setFormName] = useState("");

  function resetForm() { setFormName(""); setEditIdx(null); }

  function handleSubmit() {
    if (!formName.trim()) return;
    if (editIdx !== null) {
      setBrandList((prev) => prev.map((b, i) => i === editIdx ? { ...b, name: formName } : b));
    } else {
      if (brandList.some((b) => b.name.toLowerCase() === formName.toLowerCase())) { alert("Bu marka zaten mevcut"); return; }
      setBrandList((prev) => [{ name: formName, productCount: 0 }, ...prev]);
    }
    resetForm();
    setShowForm(false);
  }

  function startEdit(idx: number) {
    setFormName(brandList[idx].name);
    setEditIdx(idx);
    setShowForm(true);
  }

  function deleteBrand(idx: number) {
    const b = brandList[idx];
    if (b.productCount > 0) { alert(`${b.name} markasında ${b.productCount} ürün var. Önce ürünleri taşıyın.`); return; }
    if (!confirm(`"${b.name}" markasını silmek istediğinize emin misiniz?`)) return;
    setBrandList((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Markalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{brandList.length} kayıtlı marka</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Marka
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandList.map((brand, idx) => (
          <div key={brand.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-gray-400">{brand.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(idx)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                <button onClick={() => deleteBrand(idx)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{brand.name}</h3>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Package size={12} /> {brand.productCount} ürün</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editIdx !== null ? "Marka Düzenle" : "Yeni Marka"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Marka Adı *</label>
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
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
