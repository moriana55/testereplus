"use client";

import { ClipboardList, User, Package, ShoppingCart, CreditCard, Settings, Tag, Star } from "lucide-react";

const logs = [
  { id: "1", action: "Sipariş oluşturuldu", detail: "SP-1247 — Mehmet Yılmaz, ₺5.700", user: "Sistem", icon: ShoppingCart, color: "text-blue-500 bg-blue-50", time: "14:23" },
  { id: "2", action: "Ödeme alındı", detail: "SP-1247 — Kredi kartı ile ödeme", user: "iyzico", icon: CreditCard, color: "text-green-500 bg-green-50", time: "14:24" },
  { id: "3", action: "Stok güncellendi", detail: "Freud Daire Testere 250x80: 5 → 3", user: "Sistem", icon: Package, color: "text-orange-500 bg-orange-50", time: "14:24" },
  { id: "4", action: "Sipariş oluşturuldu", detail: "SP-1246 — Ali Kaya, ₺890", user: "Sistem", icon: ShoppingCart, color: "text-blue-500 bg-blue-50", time: "09:15" },
  { id: "5", action: "Kupon kullanıldı", detail: "YAZ15 — %15 indirim, SP-1246", user: "Ali Kaya", icon: Tag, color: "text-purple-500 bg-purple-50", time: "09:14" },
  { id: "6", action: "Yorum eklendi", detail: "Martin Miller Şerit Testere — 4 yıldız", user: "Ali K.", icon: Star, color: "text-amber-500 bg-amber-50", time: "09:10" },
  { id: "7", action: "Ürün güncellendi", detail: "Kronberg HM Daire Testere — fiyat değişikliği", user: "Yiğit", icon: Package, color: "text-orange-500 bg-orange-50", time: "Dün 18:42" },
  { id: "8", action: "Kullanıcı girişi", detail: "Admin panele giriş yapıldı", user: "Yiğit", icon: User, color: "text-gray-500 bg-gray-50", time: "Dün 18:30" },
  { id: "9", action: "Ayarlar güncellendi", detail: "Kargo ayarları değiştirildi", user: "Yiğit", icon: Settings, color: "text-indigo-500 bg-indigo-50", time: "Dün 16:15" },
  { id: "10", action: "Sipariş teslim edildi", detail: "SP-1245 — Hasan Demir", user: "Yurtiçi Kargo", icon: ShoppingCart, color: "text-green-500 bg-green-50", time: "Dün 16:42" },
  { id: "11", action: "İade talebi", detail: "IAD-101 — Veli Arslan, Netmak Testere", user: "Veli Arslan", icon: Package, color: "text-red-500 bg-red-50", time: "2 gün önce" },
  { id: "12", action: "Sipariş iptal edildi", detail: "SP-1242 — Veli Arslan, ₺1.850", user: "Yiğit", icon: ShoppingCart, color: "text-red-500 bg-red-50", time: "2 gün önce" },
];

export default function LogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Aktivite Logu</h1>
        <p className="text-sm text-gray-500 mt-0.5">Sistemdeki tüm işlemlerin kaydı</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="divide-y divide-gray-50">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${log.color}`}>
                <log.icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{log.action}</p>
                <p className="text-xs text-gray-400 truncate">{log.detail}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">{log.user}</p>
                <p className="text-[10px] text-gray-400">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
