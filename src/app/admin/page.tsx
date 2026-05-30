"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  Package,
  CircleDollarSign,
  ArrowUpRight,
  Clock,
  Truck,
  AlertTriangle,
  Eye,
  MoreVertical,
  PenSquare,
  X,
} from "lucide-react";

type Period = "7days" | "30days" | "month" | "year";

const periodLabels: Record<Period, string> = {
  "7days": "Son 7 gün",
  "30days": "Son 30 gün",
  "month": "Bu ay",
  "year": "Bu yıl",
};

const statsByPeriod: Record<Period, { label: string; value: string; change: string; up: boolean; icon: typeof CircleDollarSign; color: string }[]> = {
  "7days": [
    { label: "Toplam Satış", value: "₺18.420", change: "+8.1%", up: true, icon: CircleDollarSign, color: "bg-green-500" },
    { label: "Siparişler", value: "32", change: "+5.4%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Müşteriler", value: "1.248", change: "+1.2%", up: true, icon: Users, color: "bg-purple-500" },
    { label: "Ürünler", value: "342", change: "-2 stoksuz", up: false, icon: Package, color: "bg-orange-500" },
  ],
  "30days": [
    { label: "Toplam Satış", value: "₺68.540", change: "+15.2%", up: true, icon: CircleDollarSign, color: "bg-green-500" },
    { label: "Siparişler", value: "124", change: "+10.6%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Müşteriler", value: "1.248", change: "+2.8%", up: true, icon: Users, color: "bg-purple-500" },
    { label: "Ürünler", value: "342", change: "-2 stoksuz", up: false, icon: Package, color: "bg-orange-500" },
  ],
  month: [
    { label: "Toplam Satış", value: "₺84.320", change: "+12.5%", up: true, icon: CircleDollarSign, color: "bg-green-500" },
    { label: "Siparişler", value: "156", change: "+8.2%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Müşteriler", value: "1.248", change: "+3.1%", up: true, icon: Users, color: "bg-purple-500" },
    { label: "Ürünler", value: "342", change: "-2 stoksuz", up: false, icon: Package, color: "bg-orange-500" },
  ],
  year: [
    { label: "Toplam Satış", value: "₺345.120", change: "+22.4%", up: true, icon: CircleDollarSign, color: "bg-green-500" },
    { label: "Siparişler", value: "892", change: "+18.1%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Müşteriler", value: "1.248", change: "+14.6%", up: true, icon: Users, color: "bg-purple-500" },
    { label: "Ürünler", value: "342", change: "-2 stoksuz", up: false, icon: Package, color: "bg-orange-500" },
  ],
};

const recentOrders = [
  { id: "SP-1247", customer: "Mehmet Yılmaz", product: "Freud Daire Testere 250x80", amount: "₺2.850", status: "Hazırlanıyor", statusColor: "bg-yellow-100 text-yellow-700", date: "2 saat önce" },
  { id: "SP-1246", customer: "Ali Kaya", product: "Martin Miller Şerit Testere", amount: "₺890", status: "Kargoda", statusColor: "bg-blue-100 text-blue-700", date: "5 saat önce" },
  { id: "SP-1245", customer: "Hasan Demir", product: "GKG Metal Daire Testere", amount: "₺1.240", status: "Teslim Edildi", statusColor: "bg-green-100 text-green-700", date: "1 gün önce" },
  { id: "SP-1244", customer: "Ayşe Çelik", product: "Piranha Planya Bıçağı 310mm", amount: "₺520", status: "Hazırlanıyor", statusColor: "bg-yellow-100 text-yellow-700", date: "1 gün önce" },
  { id: "SP-1243", customer: "Fatma Öztürk", product: "Kronberg HM Daire Testere", amount: "₺3.450", status: "Teslim Edildi", statusColor: "bg-green-100 text-green-700", date: "2 gün önce" },
  { id: "SP-1242", customer: "Veli Arslan", product: "Netmak Çok Yönlü Daire Testere", amount: "₺1.850", status: "İptal", statusColor: "bg-red-100 text-red-700", date: "2 gün önce" },
];

const lowStockProducts = [
  { name: "Freud Daire Testere 250x80", sku: "FRD-AL-250-80", stock: 3, threshold: 10 },
  { name: "Tideway Kanal Tarama Bıçağı", sku: "TDW-KT-12-8", stock: 0, threshold: 5 },
  { name: "Tideway Rulmanlı Pah Bıçağı", sku: "TDW-PH-45-8", stock: 0, threshold: 5 },
  { name: "Martin Miller Şerit Testere", sku: "MM-ST-4020-30", stock: 2, threshold: 8 },
];

const topProducts = [
  { name: "Freud Daire Testere 250x80", sales: 48, revenue: "₺136.800" },
  { name: "Kronberg HM Daire Testere", sales: 35, revenue: "₺120.750" },
  { name: "Martin Miller Şerit Testere", sales: 29, revenue: "₺25.810" },
  { name: "Netmak Çok Yönlü Testere", sales: 22, revenue: "₺40.700" },
];

const weeklyRevenue = [
  { day: "Pzt", value: 12400 },
  { day: "Sal", value: 18200 },
  { day: "Çar", value: 15600 },
  { day: "Per", value: 21300 },
  { day: "Cum", value: 19800 },
  { day: "Cmt", value: 8400 },
  { day: "Paz", value: 4200 },
];

const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.value));

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>("month");
  const [chartMenu, setChartMenu] = useState(false);
  const stats = statsByPeriod[period];

  return (
    <div className="space-y-6">
      {/* Welcome card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">{getGreeting()}, Yiğit!</h1>
          <p className="text-orange-100 mt-1 text-sm">İşte bugünün özeti</p>
          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <p className="text-orange-200 text-xs">Bekleyen Sipariş</p>
              <p className="text-xl font-bold">12</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Yeni Mesaj</p>
              <p className="text-xl font-bold">3</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Düşük Stok</p>
              <p className="text-xl font-bold">4</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Bugünkü Satış</p>
              <p className="text-xl font-bold">₺4.200</p>
            </div>
          </div>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex items-center justify-end">
        <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
          <option value="7days">Son 7 gün</option>
          <option value="30days">Son 30 gün</option>
          <option value="month">Bu ay</option>
          <option value="year">Bu yıl</option>
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-0.5 ${stat.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Haftalık Gelir</h2>
              <p className="text-sm text-gray-500">Bu haftanın satış grafiği</p>
            </div>
            <div className="relative">
              <button onClick={() => setChartMenu(!chartMenu)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <MoreVertical size={16} className="text-gray-400" />
              </button>
              {chartMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setChartMenu(false)} />
                  <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-40">
                    <button onClick={() => { setChartMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">CSV İndir</button>
                    <button onClick={() => { setChartMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Tam Ekran</button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {weeklyRevenue.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400 font-medium">₺{(d.value / 1000).toFixed(1)}k</span>
                <div className="w-full relative">
                  <div
                    className="w-full bg-orange-500/80 rounded-t-md hover:bg-orange-500 transition-colors cursor-pointer"
                    style={{ height: `${(d.value / maxRevenue) * 140}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">En Çok Satan</h2>
            <a href="/admin/urunler" className="text-xs text-orange-500 font-medium hover:underline">Tümü</a>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sales} satış</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Alerts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="text-base font-semibold text-gray-900">Son Siparişler</h2>
            <a href="/admin/siparisler" className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-4">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 pb-3">Sipariş</th>
                  <th className="text-left text-xs font-medium text-gray-500 pb-3 hidden md:table-cell">Müşteri</th>
                  <th className="text-left text-xs font-medium text-gray-500 pb-3 hidden lg:table-cell">Ürün</th>
                  <th className="text-right text-xs font-medium text-gray-500 pb-3">Tutar</th>
                  <th className="text-center text-xs font-medium text-gray-500 pb-3">Durum</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 pb-3 hidden sm:table-cell">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-orange-600">{order.id}</span>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-700">{order.customer}</span>
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      <span className="text-sm text-gray-500 truncate max-w-[200px] block">{order.product}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-semibold text-gray-800">{order.amount}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right hidden sm:table-cell">
                      <span className="text-xs text-gray-400 flex items-center justify-end gap-1">
                        <Clock size={12} />
                        {order.date}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">Stok Uyarıları</h2>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.sku} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800 leading-tight">{p.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                    {p.stock === 0 ? "Tükendi" : `${p.stock} adet`}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{p.sku}</p>
                {p.stock > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${p.stock <= 3 ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${Math.min((p.stock / p.threshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Package, label: "Yeni Ürün Ekle", href: "/admin/urunler", color: "text-blue-600 bg-blue-50" },
          { icon: ShoppingCart, label: "Siparişler", href: "/admin/siparisler", color: "text-green-600 bg-green-50" },
          { icon: PenSquare, label: "Blog Yazısı Yaz", href: "/admin/blog", color: "text-purple-600 bg-purple-50" },
          { icon: Eye, label: "Siteyi Görüntüle", href: "/", color: "text-orange-600 bg-orange-50" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
              <action.icon size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
