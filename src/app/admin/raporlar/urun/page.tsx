"use client";

import { Package, TrendingUp, TrendingDown, Eye, ShoppingCart, Star, ArrowUpDown } from "lucide-react";
import { products, formatPrice } from "@/lib/data";

const performance = products.map((p, i) => ({
  ...p,
  views: [1248, 856, 423, 1890, 645, 234, 378, 712][i] || 100,
  sales: [48, 22, 15, 35, 19, 3, 12, 29][i] || 5,
  conversion: 0,
  revenue: 0,
})).map((p) => ({
  ...p,
  conversion: p.views > 0 ? ((p.sales / p.views) * 100) : 0,
  revenue: p.sales * p.price,
})).sort((a, b) => b.revenue - a.revenue);

export default function ProductPerformancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ürün Performansı</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Görüntüleme</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{performance.reduce((s, p) => s + p.views, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Satış</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{performance.reduce((s, p) => s + p.sales, 0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Ort. Dönüşüm</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">%{(performance.reduce((s, p) => s + p.conversion, 0) / performance.length).toFixed(1)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Toplam Ciro</span>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(performance.reduce((s, p) => s + p.revenue, 0))}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">#</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Ürün</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Görüntüleme</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Satış</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Dönüşüm</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-5">Ciro</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((p, i) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-5 py-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>{i + 1}</span>
                </td>
                <td className="py-3">
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.brand} · {formatPrice(p.price)}</p>
                </td>
                <td className="py-3 text-center hidden sm:table-cell">
                  <span className="text-sm text-gray-600 flex items-center justify-center gap-1"><Eye size={13} className="text-gray-400" /> {p.views.toLocaleString()}</span>
                </td>
                <td className="py-3 text-center">
                  <span className="text-sm font-semibold text-gray-700">{p.sales}</span>
                </td>
                <td className="py-3 text-center hidden md:table-cell">
                  <span className={`text-sm font-medium ${p.conversion >= 3 ? "text-green-600" : p.conversion >= 1.5 ? "text-amber-600" : "text-red-500"}`}>
                    %{p.conversion.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 text-right px-5">
                  <span className="text-sm font-bold text-gray-800">{formatPrice(p.revenue)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
