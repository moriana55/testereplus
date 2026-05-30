"use client";

import { useState } from "react";
import { ArrowLeftRight, Clock, CheckCircle2, XCircle, Package, AlertTriangle, Eye } from "lucide-react";

const initialReturns = [
  { id: "IAD-101", order: "SP-1242", customer: "Veli Arslan", product: "Netmak Çok Yönlü Daire Testere", reason: "Yanlış ürün geldi", amount: "₺1.850", status: "pending", date: "05.05.2026" },
  { id: "IAD-100", order: "SP-1230", customer: "Burak Yıldız", product: "Tideway Kanal Tarama Bıçağı", reason: "Ürün hasarlı", amount: "₺175", status: "approved", date: "01.05.2026" },
  { id: "IAD-099", order: "SP-1218", customer: "Deniz Koç", product: "GKG Metal Daire Testere", reason: "Beklentimi karşılamadı", amount: "₺1.240", status: "refunded", date: "28.04.2026" },
  { id: "IAD-098", order: "SP-1205", customer: "Emre Şahin", product: "Piranha Planya Bıçağı", reason: "Yanlış boyut", amount: "₺520", status: "rejected", date: "22.04.2026" },
  { id: "IAD-097", order: "SP-1198", customer: "Ali Kaya", product: "Freud Daire Testere 250x80", reason: "Sipariş hatası", amount: "₺2.850", status: "refunded", date: "18.04.2026" },
];

const statusMap: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  approved: { label: "Onaylandı", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
  refunded: { label: "İade Edildi", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Reddedildi", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function ReturnsPage() {
  const [returns, setReturns] = useState(initialReturns);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? returns : returns.filter((r) => r.status === filter);

  function updateStatus(id: string, status: string) {
    setReturns(returns.map((r) => r.id === id ? { ...r, status } : r));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">İade Yönetimi</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><ArrowLeftRight size={16} className="text-blue-500" /><span className="text-xs text-gray-500">Toplam İade</span></div>
          <p className="text-2xl font-bold text-gray-900">{returns.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-yellow-500" /><span className="text-xs text-gray-500">Beklemede</span></div>
          <p className="text-2xl font-bold text-yellow-600">{returns.filter((r) => r.status === "pending").length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={16} className="text-green-500" /><span className="text-xs text-gray-500">İade Edildi</span></div>
          <p className="text-2xl font-bold text-green-600">{returns.filter((r) => r.status === "refunded").length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><XCircle size={16} className="text-red-500" /><span className="text-xs text-gray-500">Reddedildi</span></div>
          <p className="text-2xl font-bold text-red-600">{returns.filter((r) => r.status === "rejected").length}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1">
        {[
          { value: "all", label: "Tümü" },
          { value: "pending", label: "Beklemede" },
          { value: "approved", label: "Onaylandı" },
          { value: "refunded", label: "İade Edildi" },
          { value: "rejected", label: "Reddedildi" },
        ].map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">İade No</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Sipariş</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Müşteri</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Ürün</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden xl:table-cell">Sebep</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Tutar</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
              <th className="w-32 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ret) => {
              const s = statusMap[ret.status];
              return (
                <tr key={ret.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3"><span className="text-sm font-semibold text-gray-800">{ret.id}</span></td>
                  <td className="py-3 hidden md:table-cell"><span className="text-sm text-orange-600 font-medium">{ret.order}</span></td>
                  <td className="py-3 hidden lg:table-cell"><span className="text-sm text-gray-600">{ret.customer}</span></td>
                  <td className="py-3"><span className="text-sm text-gray-700 truncate block max-w-[200px]">{ret.product}</span></td>
                  <td className="py-3 hidden xl:table-cell"><span className="text-xs text-gray-500">{ret.reason}</span></td>
                  <td className="py-3 text-right"><span className="text-sm font-bold text-gray-800">{ret.amount}</span></td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                      <s.icon size={12} /> {s.label}
                    </span>
                  </td>
                  <td className="px-4">
                    {ret.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateStatus(ret.id, "approved")} className="px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100">Onayla</button>
                        <button onClick={() => updateStatus(ret.id, "rejected")} className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100">Reddet</button>
                      </div>
                    )}
                    {ret.status === "approved" && (
                      <button onClick={() => updateStatus(ret.id, "refunded")} className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100">İade Et</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
