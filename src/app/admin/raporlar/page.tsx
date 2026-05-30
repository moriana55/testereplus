"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Users,
  CircleDollarSign,
  Download,
  ArrowUpRight,
  Package,
} from "lucide-react";

type Period = "month" | "3months" | "6months" | "year";

const dataByPeriod: Record<Period, { months: { month: string; value: number }[]; metrics: { label: string; value: string; change: string }[] }> = {
  month: {
    months: [{ month: "1. Hafta", value: 18200 }, { month: "2. Hafta", value: 21400 }, { month: "3. Hafta", value: 24800 }, { month: "4. Hafta", value: 19920 }],
    metrics: [
      { label: "Toplam Ciro", value: "₺84.320", change: "+18.4%" },
      { label: "Sipariş Sayısı", value: "38", change: "+12.1%" },
      { label: "Ort. Sepet Değeri", value: "₺2.219", change: "+5.3%" },
      { label: "Tekrar Müşteri Oranı", value: "%42", change: "+3.2%" },
    ],
  },
  "3months": {
    months: [{ month: "Mar", value: 71800 }, { month: "Nis", value: 68500 }, { month: "May", value: 84320 }],
    metrics: [
      { label: "Toplam Ciro", value: "₺224.620", change: "+14.2%" },
      { label: "Sipariş Sayısı", value: "102", change: "+9.8%" },
      { label: "Ort. Sepet Değeri", value: "₺2.202", change: "+4.1%" },
      { label: "Tekrar Müşteri Oranı", value: "%39", change: "+2.1%" },
    ],
  },
  "6months": {
    months: [{ month: "Ara", value: 54200 }, { month: "Oca", value: 62400 }, { month: "Şub", value: 58100 }, { month: "Mar", value: 71800 }, { month: "Nis", value: 68500 }, { month: "May", value: 84320 }],
    metrics: [
      { label: "Toplam Ciro", value: "₺399.320", change: "+22.1%" },
      { label: "Sipariş Sayısı", value: "186", change: "+15.6%" },
      { label: "Ort. Sepet Değeri", value: "₺2.146", change: "+3.8%" },
      { label: "Tekrar Müşteri Oranı", value: "%37", change: "+1.8%" },
    ],
  },
  year: {
    months: [{ month: "Oca", value: 62400 }, { month: "Şub", value: 58100 }, { month: "Mar", value: 71800 }, { month: "Nis", value: 68500 }, { month: "May", value: 84320 }],
    metrics: [
      { label: "Toplam Ciro", value: "₺345.120", change: "+18.4%" },
      { label: "Sipariş Sayısı", value: "156", change: "+12.1%" },
      { label: "Ort. Sepet Değeri", value: "₺2.212", change: "+5.3%" },
      { label: "Tekrar Müşteri Oranı", value: "%42", change: "+3.2%" },
    ],
  },
};

const metricIcons = [CircleDollarSign, ShoppingCart, Package, Users];
const metricColors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];

const topCategories = [
  { name: "Daire Testere Bıçakları", revenue: "₺42.800", orders: 68, percent: 51 },
  { name: "Şerit Testereler", revenue: "₺18.200", orders: 29, percent: 22 },
  { name: "Freze Bıçakları", revenue: "₺12.400", orders: 34, percent: 15 },
  { name: "Jiletler & Planyalar", revenue: "₺6.800", orders: 18, percent: 8 },
  { name: "Metal Testere Bıçakları", revenue: "₺4.120", orders: 7, percent: 4 },
];

const topCities = [
  { city: "İstanbul", orders: 52, percent: 33 },
  { city: "Ankara", orders: 28, percent: 18 },
  { city: "İzmir", orders: 19, percent: 12 },
  { city: "Bursa", orders: 14, percent: 9 },
  { city: "Antalya", orders: 11, percent: 7 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("year");
  const data = dataByPeriod[period];
  const maxRev = Math.max(...data.months.map((d) => d.value));

  function downloadPDF() {
    const lines = [
      "TESTERE PLUS - SATIŞ RAPORU",
      `Dönem: ${period === "month" ? "Bu Ay" : period === "3months" ? "Son 3 Ay" : period === "6months" ? "Son 6 Ay" : "Bu Yıl"}`,
      "",
      ...data.metrics.map((m) => `${m.label}: ${m.value} (${m.change})`),
      "",
      "KATEGORİ BAZLI SATIŞLAR",
      ...topCategories.map((c) => `${c.name}: ${c.revenue} (${c.orders} sipariş)`),
      "",
      "ŞEHİR BAZLI DAĞILIM",
      ...topCities.map((c) => `${c.city}: ${c.orders} sipariş (%${c.percent})`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapor-${period}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Satış Raporları</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detaylı satış analizi ve raporlar</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none">
            <option value="month">Bu Ay</option>
            <option value="3months">Son 3 Ay</option>
            <option value="6months">Son 6 Ay</option>
            <option value="year">Bu Yıl</option>
          </select>
          <button onClick={downloadPDF} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} /> PDF İndir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {data.metrics.map((m, i) => {
          const Icon = metricIcons[i];
          return (
            <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`${metricColors[i]} w-10 h-10 rounded-lg flex items-center justify-center`}><Icon size={20} className="text-white" /></div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-0.5"><ArrowUpRight size={12} /> {m.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{m.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-6">Ciro Grafiği</h2>
        <div className="flex items-end gap-4 h-52">
          {data.months.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">₺{(d.value / 1000).toFixed(0)}k</span>
              <div className="w-full"><div className="w-full bg-orange-500/80 hover:bg-orange-500 rounded-t-md transition-colors" style={{ height: `${(d.value / maxRev) * 160}px` }} /></div>
              <span className="text-xs text-gray-500 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Kategori Bazlı Satışlar</h2>
          <div className="space-y-4">
            {topCategories.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{c.name}</span>
                  <div className="flex items-center gap-3"><span className="text-xs text-gray-400">{c.orders} sipariş</span><span className="text-sm font-semibold text-gray-800">{c.revenue}</span></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full" style={{ width: `${c.percent}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Şehir Bazlı Dağılım</h2>
          <div className="space-y-3">
            {topCities.map((c, i) => (
              <div key={c.city} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-gray-800">{c.city}</span><span className="text-xs text-gray-400">{c.orders} sipariş · %{c.percent}</span></div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${c.percent}%` }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
