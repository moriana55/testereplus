"use client";

import { useState } from "react";
import { Plus, Copy, Trash2, Check, X, Tag, Calendar, Users, CircleDollarSign } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxUses: number;
  used: number;
  expiry: string;
  active: boolean;
}

const initial: Coupon[] = [
  { id: "1", code: "HOSGELDIN", type: "fixed", value: 100, minOrder: 500, maxUses: 0, used: 128, expiry: "2026-12-31", active: true },
  { id: "2", code: "YAZ15", type: "percent", value: 15, minOrder: 300, maxUses: 200, used: 34, expiry: "2026-06-30", active: true },
  { id: "3", code: "TOPLU20", type: "percent", value: 20, minOrder: 5000, maxUses: 50, used: 8, expiry: "2026-08-31", active: true },
  { id: "4", code: "TESTERE10", type: "percent", value: 10, minOrder: 0, maxUses: 100, used: 100, expiry: "2026-03-31", active: false },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiry, setExpiry] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  function handleAdd() {
    if (!code || !value) return;
    const c: Coupon = {
      id: Date.now().toString(36),
      code: code.toUpperCase().replace(/\s/g, ""),
      type,
      value: parseFloat(value),
      minOrder: parseFloat(minOrder) || 0,
      maxUses: parseInt(maxUses) || 0,
      used: 0,
      expiry: expiry || "2026-12-31",
      active: true,
    };
    setCoupons([c, ...coupons]);
    setCode(""); setValue(""); setMinOrder(""); setMaxUses(""); setExpiry("");
    setShowForm(false);
  }

  function copyCode(c: string) {
    navigator.clipboard.writeText(c);
    setCopied(c);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuponlar</h1>
          <p className="text-sm text-gray-500 mt-0.5">{coupons.filter((c) => c.active).length} aktif kupon</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
          <Plus size={16} /> Yeni Kupon
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Aktif Kupon</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.filter((c) => c.active).length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Kullanım</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{coupons.reduce((s, c) => s + c.used, 0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Süresi Dolan</span>
          <p className="text-2xl font-bold text-red-600 mt-1">{coupons.filter((c) => new Date(c.expiry) < new Date()).length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Limiti Dolan</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">{coupons.filter((c) => c.maxUses > 0 && c.used >= c.maxUses).length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={`bg-white border rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow ${!coupon.active ? "opacity-60" : "border-gray-200"}`}>
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
              <Tag size={22} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => copyCode(coupon.code)} className="font-mono text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 flex items-center gap-1.5 transition-colors">
                  {coupon.code}
                  {copied === coupon.code ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                </button>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${coupon.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {coupon.active ? "Aktif" : "Pasif"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <CircleDollarSign size={11} />
                  {coupon.type === "percent" ? `%${coupon.value} indirim` : `₺${coupon.value} indirim`}
                </span>
                {coupon.minOrder > 0 && <span>Min. ₺{coupon.minOrder}</span>}
                <span className="flex items-center gap-1">
                  <Users size={11} />
                  {coupon.used}{coupon.maxUses > 0 ? `/${coupon.maxUses}` : ""} kullanım
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(coupon.expiry).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setCoupons(coupons.map((c) => c.id === coupon.id ? { ...c, active: !c.active } : c))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${coupon.active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
              >
                {coupon.active ? "Pasife Al" : "Aktifleştir"}
              </button>
              <button onClick={() => setCoupons(coupons.filter((c) => c.id !== coupon.id))} className="p-2 rounded-lg hover:bg-red-50">
                <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Yeni Kupon</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kupon Kodu</label>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ÖRNEK: YAZ2026" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İndirim Tipi</label>
                  <div className="flex gap-2">
                    <button onClick={() => setType("percent")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${type === "percent" ? "border-orange-300 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>%</button>
                    <button onClick={() => setType("fixed")} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${type === "fixed" ? "border-orange-300 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>₺</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Değer</label>
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === "percent" ? "15" : "100"} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sipariş (₺)</label>
                  <input type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maks. Kullanım</label>
                  <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Sınırsız" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Geçerlilik</label>
                <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleAdd} className="px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
