"use client";

import { useState } from "react";
import { Plus, Calendar, Tag, Edit2, Trash2, X } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "percent" | "fixed";
  discount: number;
  target: string;
  start: string;
  end: string;
  status: "active" | "scheduled" | "ended";
  uses: number;
}

const initialCampaigns: Campaign[] = [
  { id: "1", name: "Yaz Sezonu İndirimi", type: "percent", discount: 15, target: "Tüm Ürünler", start: "2026-06-01", end: "2026-06-30", status: "scheduled", uses: 0 },
  { id: "2", name: "Freud Markası Özel", type: "percent", discount: 10, target: "Freud Ürünleri", start: "2026-05-01", end: "2026-05-31", status: "active", uses: 34 },
  { id: "3", name: "İlk Alışveriş İndirimi", type: "fixed", discount: 100, target: "Yeni Müşteriler", start: "2026-01-01", end: "2026-12-31", status: "active", uses: 128 },
  { id: "4", name: "Kış Kampanyası", type: "percent", discount: 20, target: "Şerit Testereler", start: "2025-12-01", end: "2026-02-28", status: "ended", uses: 67 },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Aktif", color: "bg-green-100 text-green-700" },
  scheduled: { label: "Planlandı", color: "bg-blue-100 text-blue-700" },
  ended: { label: "Sona Erdi", color: "bg-gray-100 text-gray-500" },
};

const emptyForm: { name: string; type: "percent" | "fixed"; discount: number; target: string; start: string; end: string } = { name: "", type: "percent", discount: 0, target: "", start: "", end: "" };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openNew() {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(c: Campaign) {
    setForm({ name: c.name, type: c.type, discount: c.discount, target: c.target, start: c.start, end: c.end });
    setEditId(c.id);
    setShowForm(true);
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.target.trim() || !form.start || !form.end) return;
    const now = new Date().toISOString().slice(0, 10);
    const status: Campaign["status"] = form.start > now ? "scheduled" : form.end < now ? "ended" : "active";
    if (editId) {
      setCampaigns((prev) => prev.map((c) => c.id === editId ? { ...c, ...form, status } : c));
    } else {
      setCampaigns((prev) => [...prev, { id: Date.now().toString(), ...form, status, uses: 0 }]);
    }
    setShowForm(false);
  }

  function deleteCampaign(id: string) {
    if (!confirm("Bu kampanyayı silmek istediğinize emin misiniz?")) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  function fmt(d: string) {
    const [y, m, day] = d.split("-");
    return `${day}.${m}.${y}`;
  }

  const activeCnt = campaigns.filter((c) => c.status === "active").length;
  const totalUses = campaigns.reduce((s, c) => s + c.uses, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kampanyalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">İndirim kampanyaları oluştur ve yönet</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Kampanya
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Aktif Kampanya</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{activeCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Kullanım</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalUses}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam İndirim</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">₺18.450</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Dönüşüm Oranı</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">%8.4</p>
        </div>
      </div>

      <div className="space-y-3">
        {campaigns.map((c) => {
          const s = statusLabels[c.status];
          return (
            <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <Tag size={22} className="text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">{c.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.label}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{c.type === "percent" ? "Yüzdelik" : "Sabit Tutar"}: <strong className="text-gray-600">{c.type === "percent" ? `%${c.discount}` : `₺${c.discount}`}</strong></span>
                  <span>Hedef: {c.target}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {fmt(c.start)} — {fmt(c.end)}</span>
                  <span>{c.uses} kullanım</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 size={16} className="text-gray-400" /></button>
                <button onClick={() => deleteCampaign(c.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 size={16} className="text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Kampanya Düzenle" : "Yeni Kampanya"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Kampanya Adı</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">İndirim Tipi</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none">
                    <option value="percent">Yüzdelik (%)</option>
                    <option value="fixed">Sabit Tutar (₺)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">İndirim Değeri</label>
                  <input type="number" value={form.discount || ""} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Hedef</label>
                <input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Tüm Ürünler, Freud Ürünleri..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Başlangıç</label>
                  <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Bitiş</label>
                  <input type="date" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none" />
                </div>
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
