"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  CircleDollarSign,
  Wallet,
  Receipt,
  CreditCard,
  PieChart,
} from "lucide-react";

type MonthKey = "may" | "apr" | "mar";

const allMonthlyData: Record<MonthKey, { label: string; income: number; expense: number; transactions: { id: string; type: string; description: string; amount: string; category: string; date: string }[] }> = {
  may: {
    label: "Mayıs 2026",
    income: 84320, expense: 48700,
    transactions: [
      { id: "TX-4821", type: "income", description: "SP-1247 - Mehmet Yılmaz", amount: "+₺5.700", category: "Satış", date: "07.05.2026" },
      { id: "TX-4820", type: "expense", description: "Yurtiçi Kargo - Kargo bedeli", amount: "-₺245", category: "Kargo", date: "07.05.2026" },
      { id: "TX-4819", type: "income", description: "SP-1246 - Ali Kaya", amount: "+₺890", category: "Satış", date: "07.05.2026" },
      { id: "TX-4818", type: "expense", description: "Freud Türkiye - Stok alımı", amount: "-₺28.500", category: "Stok Alım", date: "06.05.2026" },
      { id: "TX-4817", type: "income", description: "SP-1245 - Hasan Demir", amount: "+₺3.720", category: "Satış", date: "06.05.2026" },
      { id: "TX-4816", type: "expense", description: "Vercel - Hosting", amount: "-₺320", category: "Hosting", date: "05.05.2026" },
      { id: "TX-4815", type: "expense", description: "Google Ads - Reklam", amount: "-₺2.400", category: "Reklam", date: "05.05.2026" },
      { id: "TX-4814", type: "income", description: "SP-1243 - Fatma Öztürk", amount: "+₺6.900", category: "Satış", date: "05.05.2026" },
    ],
  },
  apr: {
    label: "Nisan 2026",
    income: 68500, expense: 42100,
    transactions: [
      { id: "TX-4710", type: "income", description: "SP-1198 - Emre Şahin", amount: "+₺4.200", category: "Satış", date: "28.04.2026" },
      { id: "TX-4709", type: "expense", description: "Aras Kargo - Kargo bedeli", amount: "-₺180", category: "Kargo", date: "27.04.2026" },
      { id: "TX-4708", type: "income", description: "SP-1195 - Deniz Koç", amount: "+₺2.350", category: "Satış", date: "25.04.2026" },
      { id: "TX-4707", type: "expense", description: "Kronberg - Stok alımı", amount: "-₺22.800", category: "Stok Alım", date: "20.04.2026" },
    ],
  },
  mar: {
    label: "Mart 2026",
    income: 71800, expense: 44300,
    transactions: [
      { id: "TX-4601", type: "income", description: "SP-1120 - Ahmet Yıldız", amount: "+₺5.600", category: "Satış", date: "30.03.2026" },
      { id: "TX-4600", type: "expense", description: "MNG Kargo - Kargo bedeli", amount: "-₺310", category: "Kargo", date: "28.03.2026" },
      { id: "TX-4599", type: "income", description: "SP-1115 - Zeynep Ak", amount: "+₺1.890", category: "Satış", date: "25.03.2026" },
    ],
  },
};

const monthlyChartData = [
  { month: "Oca", income: 62400, expense: 41200 },
  { month: "Şub", income: 58100, expense: 38600 },
  { month: "Mar", income: 71800, expense: 44300 },
  { month: "Nis", income: 68500, expense: 42100 },
  { month: "May", income: 84320, expense: 48700 },
];

const maxIncome = Math.max(...monthlyChartData.map((d) => d.income));

const expenseBreakdown = [
  { category: "Stok Alım", amount: 28500, percent: 58, color: "bg-blue-500" },
  { category: "Kargo", amount: 8400, percent: 17, color: "bg-green-500" },
  { category: "Reklam", amount: 6200, percent: 13, color: "bg-purple-500" },
  { category: "Personel", amount: 4200, percent: 9, color: "bg-orange-500" },
  { category: "Diğer", amount: 1400, percent: 3, color: "bg-gray-400" },
];

export default function AccountingPage() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("may");
  const currentData = allMonthlyData[selectedMonth];
  const netProfit = currentData.income - currentData.expense;
  const profitMargin = ((netProfit / currentData.income) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Muhasebe</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gelir-gider takibi ve finansal özet</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value as MonthKey)} className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 focus:outline-none">
            <option value="may">Mayıs 2026</option>
            <option value="apr">Nisan 2026</option>
            <option value="mar">Mart 2026</option>
          </select>
          <button onClick={() => {
            const header = "İşlem,Açıklama,Kategori,Tutar,Tarih\n";
            const rows = currentData.transactions.map((tx) => `${tx.id},"${tx.description}",${tx.category},${tx.amount},${tx.date}`).join("\n");
            const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `muhasebe_rapor_${selectedMonth}.csv`; a.click();
            URL.revokeObjectURL(url);
          }} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} />
            Rapor
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₺{currentData.income.toLocaleString("tr-TR")}</p>
          <p className="text-sm text-gray-500">Toplam Gelir</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight size={12} />
            <span>+23.1% geçen aya göre</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown size={20} className="text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₺{currentData.expense.toLocaleString("tr-TR")}</p>
          <p className="text-sm text-gray-500">Toplam Gider</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
            <ArrowDownRight size={12} />
            <span>+15.7% geçen aya göre</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600">₺{netProfit.toLocaleString("tr-TR")}</p>
          <p className="text-sm text-gray-500">Net Kar</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight size={12} />
            <span>%{profitMargin} kar marjı</span>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Receipt size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₺15.177</p>
          <p className="text-sm text-gray-500">KDV Borcu</p>
          <p className="text-xs text-gray-400 mt-2">Son ödeme: 26.06.2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly chart */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-6">Aylık Gelir vs Gider</h2>
          <div className="flex items-end gap-4 h-52">
            {monthlyChartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 justify-center" style={{ height: "180px", alignItems: "flex-end" }}>
                  <div
                    className="w-[45%] bg-green-400/80 rounded-t-md"
                    style={{ height: `${(d.income / maxIncome) * 160}px` }}
                    title={`Gelir: ₺${d.income.toLocaleString()}`}
                  />
                  <div
                    className="w-[45%] bg-red-400/60 rounded-t-md"
                    style={{ height: `${(d.expense / maxIncome) * 160}px` }}
                    title={`Gider: ₺${d.expense.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 bg-green-400 rounded" /> Gelir
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 bg-red-400 rounded" /> Gider
            </div>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Gider Dağılımı</h2>
          <div className="space-y-3">
            {expenseBreakdown.map((e) => (
              <div key={e.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{e.category}</span>
                  <span className="text-sm font-semibold text-gray-800">₺{e.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${e.color}`} style={{ width: `${e.percent}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 text-right">%{e.percent}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-base font-semibold text-gray-900">Son İşlemler</h2>
          <a href="/admin/giderler" className="text-xs text-orange-500 font-medium hover:underline">Tümünü Gör</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-4">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 px-5 pb-3">İşlem</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-3 hidden md:table-cell">Açıklama</th>
                <th className="text-center text-xs font-medium text-gray-500 pb-3 hidden sm:table-cell">Kategori</th>
                <th className="text-right text-xs font-medium text-gray-500 pb-3">Tutar</th>
                <th className="text-right text-xs font-medium text-gray-500 px-5 pb-3 hidden sm:table-cell">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {currentData.transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                        {tx.type === "income" ? <ArrowUpRight size={14} className="text-green-600" /> : <ArrowDownRight size={14} className="text-red-600" />}
                      </div>
                      <span className="text-xs text-gray-500 font-mono">{tx.id}</span>
                    </div>
                  </td>
                  <td className="py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-700">{tx.description}</span>
                  </td>
                  <td className="py-3 text-center hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{tx.category}</span>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`text-sm font-bold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>{tx.amount}</span>
                  </td>
                  <td className="px-5 py-3 text-right hidden sm:table-cell">
                    <span className="text-xs text-gray-400">{tx.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
