"use client";

import { CreditCard, Banknote, Wallet, Clock, CheckCircle2, XCircle } from "lucide-react";

const payments = [
  { id: "PM-4821", order: "SP-1247", customer: "Mehmet Yılmaz", method: "Kredi Kartı", card: "**** 4532", amount: "₺5.700", status: "completed", date: "07.05.2026 14:24" },
  { id: "PM-4820", order: "SP-1246", customer: "Ali Kaya", method: "Havale/EFT", card: "İş Bankası", amount: "₺890", status: "completed", date: "07.05.2026 09:18" },
  { id: "PM-4819", order: "SP-1245", customer: "Hasan Demir", method: "Kredi Kartı", card: "**** 8901", amount: "₺3.720", status: "completed", date: "06.05.2026 16:45" },
  { id: "PM-4818", order: "SP-1244", customer: "Ayşe Çelik", method: "Kapıda Ödeme", card: "—", amount: "₺520", status: "pending", date: "06.05.2026 11:10" },
  { id: "PM-4817", order: "SP-1243", customer: "Fatma Öztürk", method: "Kredi Kartı", card: "**** 2345", amount: "₺6.900", status: "completed", date: "05.05.2026 19:35" },
  { id: "PM-4816", order: "SP-1242", customer: "Veli Arslan", method: "Havale/EFT", card: "Garanti", amount: "₺1.850", status: "refunded", date: "05.05.2026 14:58" },
  { id: "PM-4815", order: "SP-1241", customer: "Kemal Bozkurt", method: "Kredi Kartı", card: "**** 6789", amount: "₺12.400", status: "completed", date: "05.05.2026 10:22" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  completed: { label: "Tamamlandı", color: "bg-green-100 text-green-700" },
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700" },
  refunded: { label: "İade Edildi", color: "bg-red-100 text-red-700" },
};

const methodIcons: Record<string, typeof CreditCard> = {
  "Kredi Kartı": CreditCard,
  "Havale/EFT": Banknote,
  "Kapıda Ödeme": Wallet,
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ödemeler</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Bu Ay Toplam</span>
          <p className="text-2xl font-bold text-green-600 mt-1">₺31.980</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Kredi Kartı</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">₺28.820</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">Havale/EFT</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">₺2.740</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-xs text-gray-500">İade Edilen</span>
          <p className="text-2xl font-bold text-red-600 mt-1">₺1.850</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">İşlem</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Sipariş</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Müşteri</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Yöntem</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Tutar</th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-5 hidden sm:table-cell">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const s = statusMap[p.status];
              const Icon = methodIcons[p.method] || CreditCard;
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3"><span className="text-sm font-semibold text-gray-800">{p.id}</span></td>
                  <td className="py-3 hidden md:table-cell"><span className="text-sm text-orange-600 font-medium">{p.order}</span></td>
                  <td className="py-3 hidden lg:table-cell"><span className="text-sm text-gray-600">{p.customer}</span></td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600"><Icon size={13} /> {p.method}</span>
                  </td>
                  <td className="py-3 text-right"><span className="text-sm font-bold text-gray-800">{p.amount}</span></td>
                  <td className="py-3 text-center"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span></td>
                  <td className="py-3 text-right px-5 hidden sm:table-cell"><span className="text-xs text-gray-400">{p.date}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
