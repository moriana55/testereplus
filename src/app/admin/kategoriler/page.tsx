"use client";

import { useState } from "react";
import { FolderTree, ChevronRight, Package, Edit2, Plus, Trash2, X, Check } from "lucide-react";
import { categories as dataCategories, getRootCategories, getChildCategories } from "@/lib/data";

interface LocalCategory {
  slug: string;
  name: string;
  parentSlug: string | null;
  productCount: number;
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<LocalCategory[]>(
    dataCategories.map((c) => ({ slug: c.slug, name: c.name, parentSlug: c.parentSlug || null, productCount: c.productCount }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editSlug, setEditSlug] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formParent, setFormParent] = useState<string>("none");

  const roots = cats.filter((c) => !c.parentSlug);
  const getChildren = (parentSlug: string) => cats.filter((c) => c.parentSlug === parentSlug);

  function resetForm() { setFormName(""); setFormSlug(""); setFormParent("none"); setEditSlug(null); }

  function handleSubmit() {
    if (!formName.trim() || !formSlug.trim()) return;
    const parent = formParent === "none" ? null : formParent;
    if (editSlug) {
      setCats((prev) => prev.map((c) => c.slug === editSlug ? { ...c, name: formName, slug: formSlug, parentSlug: parent } : c));
    } else {
      if (cats.some((c) => c.slug === formSlug)) { alert("Bu slug zaten mevcut"); return; }
      setCats((prev) => [...prev, { slug: formSlug, name: formName, parentSlug: parent, productCount: 0 }]);
    }
    resetForm();
    setShowForm(false);
  }

  function startEdit(c: LocalCategory) {
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormParent(c.parentSlug || "none");
    setEditSlug(c.slug);
    setShowForm(true);
  }

  function deleteCategory(slug: string) {
    const children = getChildren(slug);
    const label = children.length > 0 ? `Bu kategorinin ${children.length} alt kategorisi var. Hepsi silinecek.` : "Bu kategoriyi silmek istediğinize emin misiniz?";
    if (!confirm(label)) return;
    setCats((prev) => prev.filter((c) => c.slug !== slug && c.parentSlug !== slug));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{cats.length} kategori</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Kategori
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Ana Kategoriler</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{roots.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Alt Kategoriler</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{cats.length - roots.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Ürün</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{cats.reduce((s, c) => s + c.productCount, 0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Boş Kategori</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{cats.filter((c) => c.productCount === 0).length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {roots.map((root) => {
          const children = getChildren(root.slug);
          return (
            <div key={root.slug} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                <FolderTree size={18} className="text-orange-500" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">{root.name}</h3>
                  <p className="text-xs text-gray-400">{root.slug} · {children.length} alt kategori · {root.productCount} ürün</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(root)} className="p-2 rounded-lg hover:bg-gray-200"><Edit2 size={14} className="text-gray-400" /></button>
                  <button onClick={() => deleteCategory(root.slug)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                </div>
              </div>
              {children.length > 0 && (
                <div className="divide-y divide-gray-50">
                  {children.map((child) => (
                    <div key={child.slug} className="flex items-center gap-3 px-5 pl-12 py-3 hover:bg-gray-50 transition-colors">
                      <ChevronRight size={14} className="text-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{child.name}</p>
                        <p className="text-xs text-gray-400">{child.slug}</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Package size={10} /> {child.productCount}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(child)} className="p-1.5 rounded-lg hover:bg-gray-200"><Edit2 size={12} className="text-gray-400" /></button>
                        <button onClick={() => deleteCategory(child.slug)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={12} className="text-gray-400 hover:text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editSlug ? "Kategori Düzenle" : "Yeni Kategori"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
                <input type="text" value={formName} onChange={(e) => { setFormName(e.target.value); if (!editSlug) setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9ğüşöçı]/gi, "-").replace(/-+/g, "-")); }} autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Üst Kategori</label>
                <select value={formParent} onChange={(e) => setFormParent(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                  <option value="none">Ana Kategori (Kök)</option>
                  {roots.filter((r) => r.slug !== editSlug).map((r) => (
                    <option key={r.slug} value={r.slug}>{r.name}</option>
                  ))}
                </select>
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
