"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, ShoppingCart, Users, Package,
  CircleDollarSign, ArrowUpRight, Clock, AlertTriangle,
  Eye, PenSquare, BarChart3, Layers, Tag,
} from "lucide-react";
import { products, categories, brands } from "@/lib/data";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "İyi geceler";
  if (h < 12) return "Günaydın";
  if (h < 18) return "İyi günler";
  return "İyi akşamlar";
}

export default function AdminDashboard() {
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock).length;
  const outOfStock = totalProducts - inStockProducts;
  const lowStock = 4; // placeholder until real stock tracking
  const totalCategories = categories.length;
  const totalBrands = brands.length;

  const avgPrice = Math.round(products.reduce((s, p) => s + p.price, 0) / totalProducts);
  const maxPrice = Math.max(...products.map((p) => p.price));
  const minPrice = Math.min(...products.filter((p) => p.price > 0).map((p) => p.price));

  const brandStats = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.brand] = (map[p.brand] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, []);

  const priceRanges = useMemo(() => {
    const ranges = [
      { label: "0-500₺", min: 0, max: 500, count: 0, color: "bg-green-500" },
      { label: "500-1500₺", min: 500, max: 1500, count: 0, color: "bg-blue-500" },
      { label: "1500-5000₺", min: 1500, max: 5000, count: 0, color: "bg-purple-500" },
      { label: "5000₺+", min: 5000, max: Infinity, count: 0, color: "bg-orange-500" },
    ];
    products.forEach((p) => {
      const r = ranges.find((r) => p.price >= r.min && p.price < r.max);
      if (r) r.count++;
    });
    return ranges;
  }, []);

  const maxRangeCount = Math.max(...priceRanges.map((r) => r.count));

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">{getGreeting()}, Yiğit!</h1>
          <p className="text-orange-100 mt-1 text-sm">Mağaza durumun bir bakışta</p>
          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <p className="text-orange-200 text-xs">Toplam Ürün</p>
              <p className="text-xl font-bold">{totalProducts}</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Stokta</p>
              <p className="text-xl font-bold">{inStockProducts}</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Stok Dışı</p>
              <p className="text-xl font-bold">{outOfStock}</p>
            </div>
            <div>
              <p className="text-orange-200 text-xs">Ort. Fiyat</p>
              <p className="text-xl font-bold">₺{avgPrice.toLocaleString("tr-TR")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Toplam Ürün", value: totalProducts.toString(), sub: `${inStockProducts} stokta`, icon: Package, color: "bg-blue-500" },
          { label: "Kategoriler", value: totalCategories.toString(), sub: `${categories.filter((c) => !c.parentSlug).length} ana kategori`, icon: Layers, color: "bg-purple-500" },
          { label: "Markalar", value: totalBrands.toString(), sub: `${brandStats[0]?.[0] || "-"} lider`, icon: Tag, color: "bg-green-500" },
          { label: "Fiyat Aralığı", value: `₺${minPrice.toLocaleString("tr-TR")}`, sub: `— ₺${maxPrice.toLocaleString("tr-TR")}`, icon: CircleDollarSign, color: "bg-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Price distribution */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Fiyat Dağılımı</h2>
          <p className="text-sm text-gray-500 mb-6">{totalProducts} ürünün fiyat aralıklarına göre dağılımı</p>
          <div className="flex items-end gap-6 h-48">
            {priceRanges.map((r) => (
              <div key={r.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-gray-700">{r.count}</span>
                <div className="w-full relative">
                  <div
                    className={`w-full ${r.color} rounded-t-lg hover:opacity-80 transition-opacity cursor-default`}
                    style={{ height: `${Math.max(8, (r.count / maxRangeCount) * 140)}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top brands */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">En Çok Ürünlü Markalar</h2>
            <a href="/admin/markalar" className="text-xs text-orange-500 font-medium hover:underline">Tümü</a>
          </div>
          <div className="space-y-3">
            {brandStats.map(([name, count], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-orange-400" style={{ width: `${(count / brandStats[0][1]) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories + Stock row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top categories */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Kategorilere Göre Ürün Dağılımı</h2>
            <a href="/admin/kategoriler" className="text-xs text-orange-500 font-medium hover:underline flex items-center gap-1">
              Tümünü Gör <ArrowUpRight size={12} />
            </a>
          </div>
          <div className="space-y-3">
            {categoryStats.map(([name, count]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 font-medium w-48 truncate">{name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: `${(count / categoryStats[0][1]) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-8 text-right">{count}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{Math.round((count / totalProducts) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stock alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">Stok Durumu</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-sm font-medium text-green-700">Stokta</span>
              <span className="text-lg font-bold text-green-700">{inStockProducts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
              <span className="text-sm font-medium text-red-700">Stok Dışı</span>
              <span className="text-lg font-bold text-red-700">{outOfStock}</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="h-3 rounded-full bg-green-500" style={{ width: `${(inStockProducts / totalProducts) * 100}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">%{Math.round((inStockProducts / totalProducts) * 100)} stok doluluk</p>
            </div>
          </div>
          {outOfStock > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Stoksuz ürünler:</p>
              <div className="space-y-1.5">
                {products.filter((p) => !p.inStock).slice(0, 4).map((p) => (
                  <p key={p.id} className="text-xs text-red-600 truncate">• {p.name}</p>
                ))}
                {outOfStock > 4 && <p className="text-xs text-gray-400">+{outOfStock - 4} daha</p>}
              </div>
            </div>
          )}
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
