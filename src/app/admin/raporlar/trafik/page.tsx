"use client";

import { TrendingUp, Users, Eye, Clock, Monitor, Smartphone, Globe, ArrowUpRight } from "lucide-react";

const dailyVisits = [
  { day: "01", visits: 124 }, { day: "02", visits: 156 }, { day: "03", visits: 189 },
  { day: "04", visits: 167 }, { day: "05", visits: 198 }, { day: "06", visits: 145 },
  { day: "07", visits: 212 },
];
const maxVisits = Math.max(...dailyVisits.map((d) => d.visits));

const sources = [
  { name: "Google Arama", visits: 542, percent: 45, color: "bg-blue-500" },
  { name: "Doğrudan", visits: 312, percent: 26, color: "bg-green-500" },
  { name: "WhatsApp", visits: 168, percent: 14, color: "bg-emerald-500" },
  { name: "Instagram", visits: 96, percent: 8, color: "bg-pink-500" },
  { name: "Diğer", visits: 82, percent: 7, color: "bg-gray-400" },
];

const topPages = [
  { path: "/", name: "Ana Sayfa", views: 890, unique: 645 },
  { path: "/urunler", name: "Tüm Ürünler", views: 456, unique: 312 },
  { path: "/urunler/freud-aluminyum-daire-testere-250x80", name: "Freud Daire Testere", views: 234, unique: 198 },
  { path: "/kategori/daire-testere-bicaklari", name: "Daire Testere Bıçakları", views: 189, unique: 156 },
  { path: "/blog/daire-testere-bicagi-secimi", name: "Testere Seçim Rehberi", views: 167, unique: 134 },
];

export default function TrafficPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Trafik Analizi</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Günlük Ziyaret", value: "212", change: "+14%", icon: Eye, color: "bg-blue-500" },
          { label: "Tekil Ziyaretçi", value: "168", change: "+8%", icon: Users, color: "bg-green-500" },
          { label: "Ort. Oturum", value: "3:24", change: "+22s", icon: Clock, color: "bg-purple-500" },
          { label: "Hemen Çıkma", value: "%34", change: "-3%", icon: TrendingUp, color: "bg-orange-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className={`${s.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}><s.icon size={20} className="text-white" /></div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-500">{s.label}</span>
              <span className="text-xs text-green-600 flex items-center gap-0.5"><ArrowUpRight size={10} />{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Son 7 Gün Ziyaret</h2>
          <div className="flex items-end gap-3 h-40">
            {dailyVisits.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-gray-400">{d.visits}</span>
                <div className="w-full bg-blue-500/80 hover:bg-blue-500 rounded-t-md transition-colors" style={{ height: `${(d.visits / maxVisits) * 120}px` }} />
                <span className="text-xs text-gray-500">{d.day} May</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Trafik Kaynakları</h2>
          <div className="space-y-3">
            {sources.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{s.name}</span>
                  <span className="text-sm font-semibold text-gray-800">{s.visits} · %{s.percent}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">En Çok Ziyaret Edilen</h2>
          <div className="space-y-3">
            {topPages.map((p, i) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{p.views}</p>
                  <p className="text-[10px] text-gray-400">{p.unique} tekil</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h2>
          <div className="space-y-4">
            {[
              { label: "Masaüstü", icon: Monitor, percent: 62, count: 742 },
              { label: "Mobil", icon: Smartphone, percent: 34, count: 408 },
              { label: "Tablet", icon: Monitor, percent: 4, count: 50 },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><d.icon size={18} className="text-gray-400" /></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{d.label}</span>
                    <span className="text-xs text-gray-400">{d.count} · %{d.percent}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${d.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
