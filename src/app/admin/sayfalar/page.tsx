"use client";

import { useState } from "react";
import { FileText, Edit2, ExternalLink, CheckCircle2, Plus, X, Trash2 } from "lucide-react";

interface Page {
  id: string;
  name: string;
  path: string;
  status: "Yayında" | "Taslak";
  lastEdit: string;
  content: string;
}

function toSlug(s: string) {
  return "/" + s.toLowerCase().replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const initialPages: Page[] = [
  { id: "1", name: "Ana Sayfa", path: "/", status: "Yayında", lastEdit: "07.05.2026", content: "Ana sayfa içeriği" },
  { id: "2", name: "Hakkımızda", path: "/hakkimizda", status: "Yayında", lastEdit: "15.04.2026", content: "Hakkımızda sayfa içeriği" },
  { id: "3", name: "İletişim", path: "/iletisim", status: "Yayında", lastEdit: "15.04.2026", content: "İletişim sayfa içeriği" },
  { id: "4", name: "Tüm Ürünler", path: "/urunler", status: "Yayında", lastEdit: "07.05.2026", content: "Ürünler sayfa içeriği" },
  { id: "5", name: "Blog", path: "/blog", status: "Yayında", lastEdit: "01.05.2026", content: "Blog sayfa içeriği" },
];

const emptyForm: { name: string; path: string; status: "Yayında" | "Taslak"; content: string } = { name: "", path: "", status: "Yayında", content: "" };

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(p: Page) {
    setForm({ name: p.name, path: p.path, status: p.status, content: p.content });
    setEditId(p.id);
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.name.trim()) return;
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
    const path = form.path || toSlug(form.name);
    if (editId) {
      setPages((prev) => prev.map((p) => p.id === editId ? { ...p, name: form.name, path, status: form.status, content: form.content, lastEdit: dateStr } : p));
    } else {
      setPages((prev) => [...prev, { id: Date.now().toString(), name: form.name, path, status: form.status, lastEdit: dateStr, content: form.content }]);
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sayfalar</h1>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Plus size={16} /> Yeni Sayfa</button>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <div key={page.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText size={18} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">{page.name}</h3>
              <p className="text-xs text-gray-400">{page.path} · Son düzenleme: {page.lastEdit}</p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${page.status === "Yayında" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              <CheckCircle2 size={10} /> {page.status}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(page)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
              <a href={page.path} target="_blank" className="p-2 rounded-lg hover:bg-gray-100"><ExternalLink size={14} className="text-gray-400" /></a>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Sayfa Düzenle" : "Yeni Sayfa"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sayfa Adı</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, path: toSlug(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">URL Yolu</label>
                <input value={form.path} onChange={(e) => setForm({ ...form, path: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Durum</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Yayında" | "Taslak" })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                  <option value="Yayında">Yayında</option>
                  <option value="Taslak">Taslak</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">İçerik</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">İptal</button>
              <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">{editId ? "Güncelle" : "Oluştur"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
