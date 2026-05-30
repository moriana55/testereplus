"use client";

import { useState } from "react";
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  RefreshCw,
  X,
} from "lucide-react";

interface Shipment {
  id: string;
  order: string;
  customer: string;
  carrier: string;
  tracking: string;
  status: "Hazırlanıyor" | "Yolda" | "Teslim Edildi";
  origin: string;
  destination: string;
  date: string;
  eta: string;
}

const statusConfig: Record<string, { color: string; icon: typeof Truck }> = {
  "Hazırlanıyor": { color: "bg-yellow-100 text-yellow-700", icon: Package },
  "Yolda": { color: "bg-blue-100 text-blue-700", icon: Truck },
  "Teslim Edildi": { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
};

const initialShipments: Shipment[] = [
  { id: "KRG-4821", order: "SP-1246", customer: "Ali Kaya", carrier: "Yurtiçi Kargo", tracking: "3400 1234 5678", status: "Yolda", origin: "İstanbul", destination: "Ankara", date: "07.05.2026", eta: "09.05.2026" },
  { id: "KRG-4820", order: "SP-1241", customer: "Kemal Bozkurt", carrier: "Aras Kargo", tracking: "5600 9876 5432", status: "Yolda", origin: "İstanbul", destination: "İzmir", date: "06.05.2026", eta: "08.05.2026" },
  { id: "KRG-4819", order: "SP-1245", customer: "Hasan Demir", carrier: "MNG Kargo", tracking: "7800 4567 8901", status: "Teslim Edildi", origin: "İstanbul", destination: "Bursa", date: "05.05.2026", eta: "06.05.2026" },
  { id: "KRG-4818", order: "SP-1243", customer: "Fatma Öztürk", carrier: "Yurtiçi Kargo", tracking: "3400 5678 1234", status: "Teslim Edildi", origin: "İstanbul", destination: "Antalya", date: "04.05.2026", eta: "06.05.2026" },
  { id: "KRG-4817", order: "SP-1240", customer: "Emre Şahin", carrier: "Sürat Kargo", tracking: "9100 3456 7890", status: "Teslim Edildi", origin: "İstanbul", destination: "Konya", date: "03.05.2026", eta: "05.05.2026" },
  { id: "KRG-4816", order: "SP-1238", customer: "Deniz Koç", carrier: "Aras Kargo", tracking: "5600 1122 3344", status: "Teslim Edildi", origin: "İstanbul", destination: "Trabzon", date: "02.05.2026", eta: "05.05.2026" },
];

const carrierStats = [
  { name: "Yurtiçi Kargo", shipments: 68, avgDays: 2.1 },
  { name: "Aras Kargo", shipments: 45, avgDays: 2.4 },
  { name: "MNG Kargo", shipments: 28, avgDays: 2.0 },
  { name: "Sürat Kargo", shipments: 15, avgDays: 2.8 },
];

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trackModal, setTrackModal] = useState<Shipment | null>(null);

  const filtered = shipments.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.order.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  function updateStatuses() {
    setUpdating(true);
    setTimeout(() => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.status === "Hazırlanıyor") return { ...s, status: "Yolda" };
          if (s.status === "Yolda") {
            const eta = s.eta.split(".").reverse().join("-");
            const now = new Date().toISOString().slice(0, 10);
            if (eta <= now) return { ...s, status: "Teslim Edildi" };
          }
          return s;
        })
      );
      setUpdating(false);
      alert("Kargo durumları güncellendi!");
    }, 800);
  }

  const readyCnt = shipments.filter((s) => s.status === "Hazırlanıyor").length;
  const transitCnt = shipments.filter((s) => s.status === "Yolda").length;
  const deliveredCnt = shipments.filter((s) => s.status === "Teslim Edildi").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kargo Takibi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gönderileri takip et ve yönet</p>
        </div>
        <button onClick={updateStatuses} disabled={updating} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 disabled:opacity-50">
          <RefreshCw size={16} className={updating ? "animate-spin" : ""} />
          {updating ? "Güncelleniyor..." : "Durumları Güncelle"}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Package size={16} className="text-yellow-500" /><span className="text-xs text-gray-500 font-medium">Hazırlanıyor</span></div>
          <p className="text-2xl font-bold text-gray-900">{readyCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Truck size={16} className="text-blue-500" /><span className="text-xs text-gray-500 font-medium">Yolda</span></div>
          <p className="text-2xl font-bold text-gray-900">{transitCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} className="text-green-500" /><span className="text-xs text-gray-500 font-medium">Teslim Edildi</span></div>
          <p className="text-2xl font-bold text-gray-900">{deliveredCnt}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-gray-500" /><span className="text-xs text-gray-500 font-medium">Ort. Teslimat</span></div>
          <p className="text-2xl font-bold text-gray-900">2.3 gün</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Kargo Firmaları Performansı</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {carrierStats.map((c) => (
            <div key={c.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center"><Truck size={18} className="text-gray-400" /></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-400">{c.shipments} gönderi · ort. {c.avgDays} gün</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Takip no, sipariş no veya müşteri ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Kargo No</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Sipariş</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Müşteri</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Kargo Firması</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden xl:table-cell">Güzergah</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Tahmini Teslim</th>
                <th className="w-12 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const cfg = statusConfig[s.status];
                const Icon = cfg.icon;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-semibold text-gray-800">{s.id}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{s.tracking}</p>
                    </td>
                    <td className="py-3 hidden md:table-cell"><span className="text-sm text-orange-600 font-medium">{s.order}</span></td>
                    <td className="py-3 hidden lg:table-cell"><span className="text-sm text-gray-600">{s.customer}</span></td>
                    <td className="py-3 hidden sm:table-cell"><span className="text-sm text-gray-600">{s.carrier}</span></td>
                    <td className="py-3 hidden xl:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} />{s.origin} → {s.destination}</div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <Icon size={12} />{s.status}
                      </span>
                    </td>
                    <td className="py-3 text-right hidden sm:table-cell"><span className="text-xs text-gray-400">{s.eta}</span></td>
                    <td className="px-4">
                      <button onClick={() => setTrackModal(s)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Takip Et">
                        <ExternalLink size={14} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {trackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Kargo Takibi</h2>
              <button onClick={() => setTrackModal(null)} className="p-1 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Kargo No</span><span className="font-semibold text-gray-800">{trackModal.id}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Takip No</span><span className="font-mono text-gray-800">{trackModal.tracking}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Firma</span><span className="text-gray-800">{trackModal.carrier}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Müşteri</span><span className="text-gray-800">{trackModal.customer}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Güzergah</span><span className="text-gray-800">{trackModal.origin} → {trackModal.destination}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Durum</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[trackModal.status].color}`}>{trackModal.status}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tahmini Teslim</span><span className="text-gray-800">{trackModal.eta}</span></div>
            </div>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500" /><span>{trackModal.date} — Kargo teslim alındı ({trackModal.origin})</span>
              </div>
              {trackModal.status !== "Hazırlanıyor" && (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /><span>Transfer merkezine ulaştı</span>
                </div>
              )}
              {trackModal.status === "Teslim Edildi" && (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-green-500" /><span>{trackModal.eta} — Teslim edildi ({trackModal.destination})</span>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button onClick={() => setTrackModal(null)} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
