"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Plus,
  Edit2,
  History,
  X,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface StockItem {
  sku: string;
  name: string;
  stock: number;
  minStock: number;
  incoming: number;
  lastRestock: string;
  status: string;
}

interface StockLog {
  sku: string;
  name: string;
  type: "in" | "out";
  qty: number;
  date: string;
  note: string;
}

const initialStock: StockItem[] = [
  { sku: "FRD-AL-250-80", name: "Freud Daire Testere 250x80", stock: 3, minStock: 10, incoming: 20, lastRestock: "28.04.2026", status: "critical" },
  { sku: "NTM-CY-300-96", name: "Netmak Çok Yönlü Daire Testere", stock: 25, minStock: 10, incoming: 0, lastRestock: "15.04.2026", status: "ok" },
  { sku: "TDW-KT-12-8", name: "Tideway Kanal Tarama Bıçağı", stock: 0, minStock: 5, incoming: 15, lastRestock: "10.03.2026", status: "out" },
  { sku: "KRN-HM-300-72", name: "Kronberg HM Daire Testere", stock: 8, minStock: 10, incoming: 0, lastRestock: "20.04.2026", status: "low" },
  { sku: "GKG-MT-200-128", name: "GKG Metal Daire Testere", stock: 15, minStock: 8, incoming: 0, lastRestock: "25.04.2026", status: "ok" },
  { sku: "TDW-PH-45-8", name: "Tideway Rulmanlı Pah Bıçağı", stock: 0, minStock: 5, incoming: 0, lastRestock: "01.02.2026", status: "out" },
  { sku: "PRN-PL-310-30", name: "Piranha Planya Bıçağı 310mm", stock: 12, minStock: 8, incoming: 0, lastRestock: "18.04.2026", status: "ok" },
  { sku: "MM-ST-4020-30", name: "Martin Miller Şerit Testere", stock: 2, minStock: 8, incoming: 10, lastRestock: "22.04.2026", status: "critical" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  ok: { label: "Normal", color: "bg-green-100 text-green-700" },
  low: { label: "Düşük", color: "bg-yellow-100 text-yellow-700" },
  critical: { label: "Kritik", color: "bg-red-100 text-red-700" },
  out: { label: "Tükendi", color: "bg-gray-100 text-gray-700" },
};

function calcStatus(stock: number, minStock: number): string {
  if (stock === 0) return "out";
  if (stock <= minStock * 0.3) return "critical";
  if (stock < minStock) return "low";
  return "ok";
}

export default function StockPage() {
  const [items, setItems] = useState(initialStock);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"stock" | "name">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [showEntry, setShowEntry] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [editSku, setEditSku] = useState<string | null>(null);
  const [logs, setLogs] = useState<StockLog[]>([]);

  const [entrySku, setEntrySku] = useState("");
  const [entryQty, setEntryQty] = useState("");
  const [entryNote, setEntryNote] = useState("");

  const [editStock, setEditStock] = useState("");
  const [editMin, setEditMin] = useState("");

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "stock") return (a.stock - b.stock) * mul;
      return a.name.localeCompare(b.name) * mul;
    });
  }, [items, search, sortField, sortDir]);

  function toggleSort() {
    if (sortField === "stock") {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortField("stock");
      setSortDir("asc");
    }
  }

  function handleStockEntry() {
    const qty = parseInt(entryQty);
    if (!entrySku || !qty || qty <= 0) return;
    const today = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
    setItems((prev) => prev.map((item) => {
      if (item.sku !== entrySku) return item;
      const newStock = item.stock + qty;
      return { ...item, stock: newStock, lastRestock: today, status: calcStatus(newStock, item.minStock) };
    }));
    const item = items.find((i) => i.sku === entrySku);
    setLogs((prev) => [{ sku: entrySku, name: item?.name || "", type: "in", qty, date: today, note: entryNote }, ...prev]);
    setEntrySku("");
    setEntryQty("");
    setEntryNote("");
    setShowEntry(false);
  }

  function startEdit(item: StockItem) {
    setEditSku(item.sku);
    setEditStock(item.stock.toString());
    setEditMin(item.minStock.toString());
  }

  function handleEditSave() {
    if (!editSku) return;
    const stock = parseInt(editStock) || 0;
    const min = parseInt(editMin) || 0;
    setItems((prev) => prev.map((item) => item.sku === editSku ? { ...item, stock, minStock: min, status: calcStatus(stock, min) } : item));
    setEditSku(null);
  }

  const outCount = items.filter((i) => i.status === "out").length;
  const criticalCount = items.filter((i) => i.status === "critical" || i.status === "low").length;
  const incomingTotal = items.reduce((s, i) => s + i.incoming, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Ürün stoklarını takip et ve yönet</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHistory(true)} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <History size={16} /> <span className="hidden sm:inline">Stok Geçmişi</span>
          </button>
          <button onClick={() => setShowEntry(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            <Plus size={16} /> Stok Girişi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Package size={16} className="text-blue-500" /><span className="text-xs text-gray-500 font-medium">Toplam SKU</span></div>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-red-500" /><span className="text-xs text-gray-500 font-medium">Stok Yok</span></div>
          <p className="text-2xl font-bold text-red-600">{outCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingDown size={16} className="text-amber-500" /><span className="text-xs text-gray-500 font-medium">Kritik/Düşük</span></div>
          <p className="text-2xl font-bold text-amber-600">{criticalCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={16} className="text-green-500" /><span className="text-xs text-gray-500 font-medium">Yolda Gelen</span></div>
          <p className="text-2xl font-bold text-green-600">{incomingTotal} adet</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="SKU veya ürün adı ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Ürün</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">SKU</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">
                  <button onClick={toggleSort} className="flex items-center gap-1 mx-auto hover:text-gray-700">
                    Stok {sortField === "stock" ? (sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}
                  </button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Min.</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Yolda</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-5 hidden sm:table-cell">Son Giriş</th>
                <th className="w-10 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const s = statusLabels[item.status];
                const isEditing = editSku === item.sku;
                return (
                  <tr key={item.sku} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3"><p className="text-sm font-medium text-gray-800">{item.name}</p></td>
                    <td className="py-3 hidden md:table-cell"><span className="text-xs text-gray-500 font-mono">{item.sku}</span></td>
                    <td className="py-3 text-center">
                      {isEditing ? (
                        <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-16 text-center text-sm border border-orange-300 rounded px-1 py-0.5 focus:outline-none" />
                      ) : (
                        <span className={`text-sm font-bold ${item.stock === 0 ? "text-red-500" : item.stock <= 5 ? "text-amber-500" : "text-gray-700"}`}>{item.stock}</span>
                      )}
                    </td>
                    <td className="py-3 text-center hidden sm:table-cell">
                      {isEditing ? (
                        <input type="number" value={editMin} onChange={(e) => setEditMin(e.target.value)} className="w-16 text-center text-sm border border-orange-300 rounded px-1 py-0.5 focus:outline-none" />
                      ) : (
                        <span className="text-sm text-gray-500">{item.minStock}</span>
                      )}
                    </td>
                    <td className="py-3 text-center hidden lg:table-cell">
                      {item.incoming > 0 ? <span className="text-sm text-green-600 font-medium">+{item.incoming}</span> : <span className="text-sm text-gray-300">—</span>}
                    </td>
                    <td className="py-3 text-center"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>{s.label}</span></td>
                    <td className="py-3 text-right px-5 hidden sm:table-cell"><span className="text-xs text-gray-400">{item.lastRestock}</span></td>
                    <td className="pr-4">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={handleEditSave} className="p-1.5 rounded-lg hover:bg-green-50"><Check size={14} className="text-green-500" /></button>
                          <button onClick={() => setEditSku(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={14} className="text-gray-400" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock entry modal */}
      {showEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEntry(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Stok Girişi</h2>
              <button onClick={() => setShowEntry(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün *</label>
                <select value={entrySku} onChange={(e) => setEntrySku(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                  <option value="">Ürün seçin...</option>
                  {items.map((i) => <option key={i.sku} value={i.sku}>{i.name} ({i.sku})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Miktar *</label>
                <input type="number" value={entryQty} onChange={(e) => setEntryQty(e.target.value)} min="1" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Not</label>
                <input type="text" value={entryNote} onChange={(e) => setEntryNote(e.target.value)} placeholder="Tedarikçi, fatura no vs." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowEntry(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleStockEntry} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Check size={16} /> Giriş Yap</button>
            </div>
          </div>
        </div>
      )}

      {/* Stock history modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Stok Geçmişi</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Henüz stok hareketi yok. Stok girişi yaparak başlayın.</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.type === "in" ? "bg-green-100" : "bg-red-100"}`}>
                        {log.type === "in" ? <ArrowDown size={14} className="text-green-600" /> : <ArrowUp size={14} className="text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{log.name}</p>
                        <p className="text-xs text-gray-400">{log.note || log.sku} · {log.date}</p>
                      </div>
                      <span className={`text-sm font-bold ${log.type === "in" ? "text-green-600" : "text-red-600"}`}>
                        {log.type === "in" ? "+" : "-"}{log.qty}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
