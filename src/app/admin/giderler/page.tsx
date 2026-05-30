"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Download,
  Filter,
  Search,
  Wallet,
  TrendingDown,
  Receipt,
  Users,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
} from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  paidBy: string;
  date: string;
  createdAt: number;
}

const CATEGORIES = [
  { value: "kargo", label: "Kargo", color: "bg-blue-100 text-blue-700" },
  { value: "elektrik", label: "Elektrik", color: "bg-yellow-100 text-yellow-700" },
  { value: "su", label: "Su", color: "bg-cyan-100 text-cyan-700" },
  { value: "dogalgaz", label: "Doğalgaz", color: "bg-orange-100 text-orange-700" },
  { value: "kira", label: "Kira", color: "bg-purple-100 text-purple-700" },
  { value: "internet", label: "İnternet/Telefon", color: "bg-indigo-100 text-indigo-700" },
  { value: "reklam", label: "Reklam", color: "bg-pink-100 text-pink-700" },
  { value: "stok", label: "Stok Alımı", color: "bg-green-100 text-green-700" },
  { value: "personel", label: "Personel", color: "bg-red-100 text-red-700" },
  { value: "hosting", label: "Hosting/Domain", color: "bg-violet-100 text-violet-700" },
  { value: "muhasebeci", label: "Muhasebeci", color: "bg-amber-100 text-amber-700" },
  { value: "vergi", label: "Vergi/SGK", color: "bg-rose-100 text-rose-700" },
  { value: "arac", label: "Araç/Yakıt", color: "bg-lime-100 text-lime-700" },
  { value: "yemek", label: "Yemek/İkram", color: "bg-teal-100 text-teal-700" },
  { value: "diger", label: "Diğer", color: "bg-gray-100 text-gray-600" },
];

const PEOPLE = ["Yiğit", "Ortak"];

const STORAGE_KEY = "testereplus_expenses";

function getCategoryStyle(value: string) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 0 }).format(n);
}

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

function getMonthLabel(key: string) {
  const [y, m] = key.split("-");
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("kargo");
  const [formDescription, setFormDescription] = useState("");
  const [formPaidBy, setFormPaidBy] = useState(PEOPLE[0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setExpenses(JSON.parse(stored)); } catch {}
    }
  }, []);

  const save = useCallback((data: Expense[]) => {
    setExpenses(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  function resetForm() {
    setFormAmount("");
    setFormCategory("kargo");
    setFormDescription("");
    setFormPaidBy(PEOPLE[0]);
    setFormDate(new Date().toISOString().slice(0, 10));
    setEditingId(null);
  }

  function handleSubmit() {
    const amount = parseFloat(formAmount.replace(",", "."));
    if (!amount || amount <= 0) return;

    if (editingId) {
      save(expenses.map((e) => e.id === editingId ? { ...e, amount, category: formCategory, description: formDescription, paidBy: formPaidBy, date: formDate } : e));
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        amount,
        category: formCategory,
        description: formDescription,
        paidBy: formPaidBy,
        date: formDate,
        createdAt: Date.now(),
      };
      save([newExpense, ...expenses]);
    }
    resetForm();
    setShowForm(false);
  }

  function startEdit(e: Expense) {
    setFormAmount(e.amount.toString());
    setFormCategory(e.category);
    setFormDescription(e.description);
    setFormPaidBy(e.paidBy);
    setFormDate(e.date);
    setEditingId(e.id);
    setShowForm(true);
  }

  function deleteExpense(id: string) {
    save(expenses.filter((e) => e.id !== id));
  }

  function exportCSV() {
    const header = "Tarih,Kategori,Açıklama,Tutar,Ödeyen\n";
    const rows = filtered.map((e) => `${e.date},${getCategoryStyle(e.category).label},"${e.description}",${e.amount},${e.paidBy}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `giderler_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filters
  const filtered = expenses.filter((e) => {
    if (filterCategory !== "all" && e.category !== filterCategory) return false;
    if (filterPerson !== "all" && e.paidBy !== filterPerson) return false;
    if (filterMonth !== "all" && getMonthKey(e.date) !== filterMonth) return false;
    if (searchQuery && !e.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  // Stats
  const totalAll = filtered.reduce((s, e) => s + e.amount, 0);
  const totalByPerson: Record<string, number> = {};
  PEOPLE.forEach((p) => { totalByPerson[p] = filtered.filter((e) => e.paidBy === p).reduce((s, e) => s + e.amount, 0); });

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: filtered.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  // Available months
  const months = [...new Set(expenses.map((e) => getMonthKey(e.date)))].sort().reverse();

  // Current month stats
  const thisMonth = new Date().toISOString().slice(0, 7);
  const thisMonthTotal = expenses.filter((e) => getMonthKey(e.date) === thisMonth).reduce((s, e) => s + e.amount, 0);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  const lastMonthTotal = expenses.filter((e) => getMonthKey(e.date) === lastMonth).reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gider Takibi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ortak harcamaları kaydet ve takip et</p>
        </div>
        <div className="flex items-center gap-2">
          {filtered.length > 0 && (
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
              <Download size={16} />
              <span className="hidden sm:inline">CSV İndir</span>
            </button>
          )}
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
          >
            <Plus size={16} />
            Gider Ekle
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><TrendingDown size={20} className="text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
          <p className="text-sm text-gray-500">Bu Ay Toplam</p>
          {lastMonthTotal > 0 && (
            <p className={`text-xs mt-1 ${thisMonthTotal > lastMonthTotal ? "text-red-500" : "text-green-500"}`}>
              {thisMonthTotal > lastMonthTotal ? "+" : ""}{Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)}% geçen aya göre
            </p>
          )}
        </div>
        {PEOPLE.map((person) => (
          <div key={person} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Wallet size={20} className="text-blue-600" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalByPerson[person] || 0)}</p>
            <p className="text-sm text-gray-500">{person} Ödedi</p>
            {totalAll > 0 && (
              <p className="text-xs text-gray-400 mt-1">%{Math.round(((totalByPerson[person] || 0) / totalAll) * 100)} toplam giderin</p>
            )}
          </div>
        ))}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Receipt size={20} className="text-purple-600" /></div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{filtered.length}</p>
          <p className="text-sm text-gray-500">Toplam Kayıt</p>
        </div>
      </div>

      {/* Balance between partners */}
      {PEOPLE.length === 2 && totalAll > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Ortak Hesap Durumu</h3>
          </div>
          {(() => {
            const half = totalAll / 2;
            const p1 = totalByPerson[PEOPLE[0]] || 0;
            const p2 = totalByPerson[PEOPLE[1]] || 0;
            const diff = Math.abs(p1 - p2) / 2;
            const owes = p1 > p2 ? PEOPLE[1] : PEOPLE[0];
            const owed = p1 > p2 ? PEOPLE[0] : PEOPLE[1];
            if (diff < 1) return <p className="text-sm text-gray-600">Her iki ortak da eşit ödemiş. Hesap sıfır.</p>;
            return (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{PEOPLE[0]}</span>
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(p1)}</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${(p1 / totalAll) * 100}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{PEOPLE[1]}</span>
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(p2)}</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                    <div className="bg-purple-500 h-3 rounded-full transition-all" style={{ width: `${(p2 / totalAll) * 100}%` }} />
                  </div>
                </div>
                <div className="shrink-0 bg-white border border-gray-200 rounded-xl px-4 py-3 text-center min-w-[160px]">
                  <p className="text-xs text-gray-400 mb-1">Dengeleme</p>
                  <p className="text-sm font-bold text-gray-900">{owes} → {owed}</p>
                  <p className="text-lg font-bold text-orange-600">{formatCurrency(diff)}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Charts row */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Monthly trend */}
          {(() => {
            const monthlyData: Record<string, number> = {};
            expenses.forEach((e) => {
              const key = getMonthKey(e.date);
              monthlyData[key] = (monthlyData[key] || 0) + e.amount;
            });
            const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
            const maxVal = Math.max(...sortedMonths.map((m) => monthlyData[m]));
            if (sortedMonths.length < 2) return null;
            return (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Aylık Gider Trendi</h3>
                <div className="flex items-end gap-3 h-40">
                  {sortedMonths.map((m) => (
                    <div key={m} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-400">{formatCurrency(monthlyData[m])}</span>
                      <div className="w-full bg-red-400/80 hover:bg-red-500 rounded-t-md transition-colors" style={{ height: `${(monthlyData[m] / maxVal) * 120}px` }} />
                      <span className="text-[10px] text-gray-500">{getMonthLabel(m).split(" ")[0].slice(0, 3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Category pie (visual bars) */}
          {categoryTotals.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Kategori Dağılımı</h3>
              <div className="space-y-3">
                {categoryTotals.slice(0, 8).map((cat) => {
                  const pct = totalAll > 0 ? (cat.total / totalAll) * 100 : 0;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setFilterCategory(filterCategory === cat.value ? "all" : cat.value)}
                      className={`w-full text-left transition-all rounded-lg p-2 ${filterCategory === cat.value ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{cat.label}</span>
                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(cat.total)} · %{Math.round(pct)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all ${cat.color.split(" ")[0].replace("-100", "-500")}`} style={{ width: `${pct}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category cards (compact) */}
      {categoryTotals.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Kategoriler</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categoryTotals.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(filterCategory === cat.value ? "all" : cat.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  filterCategory === cat.value ? "border-orange-300 bg-orange-50 ring-1 ring-orange-200" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                <p className="text-sm font-bold text-gray-900 mt-2">{formatCurrency(cat.total)}</p>
                <p className="text-[10px] text-gray-400">%{Math.round((cat.total / totalAll) * 100)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Açıklama ara..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
          <option value="all">Tüm Kategoriler</option>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
          <option value="all">Herkes</option>
          {PEOPLE.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
          <option value="all">Tüm Aylar</option>
          {months.map((m) => <option key={m} value={m}>{getMonthLabel(m)}</option>)}
        </select>
        {(filterCategory !== "all" || filterPerson !== "all" || filterMonth !== "all" || searchQuery) && (
          <button
            onClick={() => { setFilterCategory("all"); setFilterPerson("all"); setFilterMonth("all"); setSearchQuery(""); }}
            className="text-xs text-orange-600 hover:underline"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Filtered total */}
      {(filterCategory !== "all" || filterPerson !== "all" || filterMonth !== "all" || searchQuery) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
          Filtrelenmiş toplam: <strong className="text-gray-900">{formatCurrency(totalAll)}</strong> ({filtered.length} kayıt)
        </div>
      )}

      {/* Expense list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Receipt size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">{expenses.length === 0 ? "Henüz gider kaydı yok" : "Filtre sonucu bulunamadı"}</p>
            <p className="text-xs text-gray-400 mb-4">{expenses.length === 0 ? "İlk giderinizi ekleyerek başlayın" : "Farklı filtreler deneyin"}</p>
            {expenses.length === 0 && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
                <Plus size={14} className="inline mr-1" /> İlk Gideri Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Tarih</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Kategori</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Açıklama</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Ödeyen</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Tutar</th>
                  <th className="w-20 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((expense) => {
                  const cat = getCategoryStyle(expense.category);
                  return (
                    <tr key={expense.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-700">
                          {new Date(expense.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cat.color}`}>{cat.label}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-sm text-gray-700">{expense.description || "—"}</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{expense.paidBy}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                      </td>
                      <td className="px-4">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => startEdit(expense)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                          <button onClick={() => deleteExpense(expense.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-5 py-3 text-sm font-semibold text-gray-700 text-right">Toplam</td>
                  <td className="py-3 text-right"><span className="text-sm font-bold text-red-700">{formatCurrency(totalAll)}</span></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? "Gider Düzenle" : "Yeni Gider Ekle"}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tutar (₺)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormCategory(cat.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        formCategory === cat.value
                          ? "border-orange-300 bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama (opsiyonel)</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Kargo bedeli, fatura detayı vs."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Paid by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ödeyen</label>
                  <div className="flex gap-2">
                    {PEOPLE.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFormPaidBy(p)}
                        className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                          formPaidBy === p
                            ? "border-orange-300 bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tarih</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                İptal
              </button>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors">
                <Check size={16} />
                {editingId ? "Güncelle" : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
