"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Check,
  XCircle,
  X,
  RefreshCw,
  FileText,
  AlertTriangle,
} from "lucide-react";

type Status = "Beklemede" | "Hazırlanıyor" | "Kargoda" | "Teslim Edildi" | "İptal";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  items: { name: string; qty: number; price: string }[];
  total: string;
  totalNum: number;
  payment: string;
  status: Status;
  date: string;
  note: string;
}

const statusConfig: Record<Status, { icon: typeof Check; color: string }> = {
  Beklemede: { icon: Clock, color: "bg-gray-100 text-gray-700" },
  Hazırlanıyor: { icon: Package, color: "bg-yellow-100 text-yellow-700" },
  Kargoda: { icon: Truck, color: "bg-blue-100 text-blue-700" },
  "Teslim Edildi": { icon: Check, color: "bg-green-100 text-green-700" },
  İptal: { icon: XCircle, color: "bg-red-100 text-red-700" },
};

const statusFlow: Status[] = ["Beklemede", "Hazırlanıyor", "Kargoda", "Teslim Edildi"];

const initialOrders: Order[] = [
  { id: "SP-1247", customer: "Mehmet Yılmaz", email: "mehmet@example.com", phone: "0532 123 4567", address: "Kadıköy, İstanbul", items: [{ name: "Freud Daire Testere 250x80", qty: 2, price: "₺2.850" }], total: "₺5.700", totalNum: 5700, payment: "Kredi Kartı", status: "Hazırlanıyor", date: "07 May 2026, 14:23", note: "" },
  { id: "SP-1246", customer: "Ali Kaya", email: "ali@example.com", phone: "0533 234 5678", address: "Çankaya, Ankara", items: [{ name: "Martin Miller Şerit Testere", qty: 1, price: "₺890" }], total: "₺890", totalNum: 890, payment: "Havale/EFT", status: "Kargoda", date: "07 May 2026, 09:15", note: "Aras Kargo — 123456789" },
  { id: "SP-1245", customer: "Hasan Demir", email: "hasan@example.com", phone: "0534 345 6789", address: "Osmangazi, Bursa", items: [{ name: "GKG Metal Daire Testere", qty: 1, price: "₺1.240" }, { name: "Tideway Kanal Tarama Bıçağı", qty: 2, price: "₺620" }], total: "₺3.720", totalNum: 3720, payment: "Kredi Kartı", status: "Teslim Edildi", date: "06 May 2026, 16:42", note: "" },
  { id: "SP-1244", customer: "Ayşe Çelik", email: "ayse@example.com", phone: "0535 456 7890", address: "Konak, İzmir", items: [{ name: "Piranha Planya Bıçağı 310mm", qty: 1, price: "₺520" }], total: "₺520", totalNum: 520, payment: "Kapıda Ödeme", status: "Hazırlanıyor", date: "06 May 2026, 11:08", note: "" },
  { id: "SP-1243", customer: "Fatma Öztürk", email: "fatma@example.com", phone: "0536 567 8901", address: "Muratpaşa, Antalya", items: [{ name: "Kronberg HM Daire Testere", qty: 2, price: "₺3.450" }], total: "₺6.900", totalNum: 6900, payment: "Kredi Kartı", status: "Teslim Edildi", date: "05 May 2026, 19:33", note: "" },
  { id: "SP-1242", customer: "Veli Arslan", email: "veli@example.com", phone: "0537 678 9012", address: "Selçuklu, Konya", items: [{ name: "Netmak Çok Yönlü Daire Testere", qty: 1, price: "₺1.850" }], total: "₺1.850", totalNum: 1850, payment: "Havale/EFT", status: "İptal", date: "05 May 2026, 14:55", note: "Müşteri iptal talep etti" },
  { id: "SP-1241", customer: "Kemal Bozkurt", email: "kemal@example.com", phone: "0538 789 0123", address: "Selçuklu, Konya", items: [{ name: "Freud Daire Testere 250x80", qty: 3, price: "₺8.550" }, { name: "Tideway Pah Bıçağı", qty: 1, price: "₺3.850" }], total: "₺12.400", totalNum: 12400, payment: "Kredi Kartı", status: "Kargoda", date: "05 May 2026, 10:20", note: "Yurtiçi Kargo — 987654321" },
  { id: "SP-1240", customer: "Emre Şahin", email: "emre@example.com", phone: "0539 890 1234", address: "Kadıköy, İstanbul", items: [{ name: "Freud Daire Testere 250x80", qty: 1, price: "₺2.850" }], total: "₺2.850", totalNum: 2850, payment: "Kredi Kartı", status: "Teslim Edildi", date: "04 May 2026, 17:12", note: "" },
  { id: "SP-1239", customer: "Burak Yıldız", email: "burak@example.com", phone: "0540 901 2345", address: "Trabzon Merkez", items: [{ name: "GKG Metal Daire Testere", qty: 1, price: "₺1.240" }, { name: "Piranha Planya Bıçağı", qty: 1, price: "₺520" }], total: "₺4.180", totalNum: 4180, payment: "Havale/EFT", status: "Beklemede", date: "04 May 2026, 09:45", note: "Ödeme bekleniyor" },
  { id: "SP-1238", customer: "Deniz Koç", email: "deniz@example.com", phone: "0541 012 3456", address: "Nilüfer, Bursa", items: [{ name: "Kronberg HM Daire Testere", qty: 1, price: "₺3.450" }], total: "₺3.450", totalNum: 3450, payment: "Kredi Kartı", status: "Teslim Edildi", date: "03 May 2026, 15:30", note: "" },
  { id: "SP-1237", customer: "Serkan Aydın", email: "serkan@example.com", phone: "0542 123 4567", address: "Bağcılar, İstanbul", items: [{ name: "Martin Miller Şerit Testere", qty: 2, price: "₺1.780" }], total: "₺1.780", totalNum: 1780, payment: "Kapıda Ödeme", status: "Beklemede", date: "03 May 2026, 11:10", note: "" },
  { id: "SP-1236", customer: "Oğuz Kara", email: "oguz@example.com", phone: "0543 234 5678", address: "Seyhan, Adana", items: [{ name: "Freud Daire Testere 250x80", qty: 1, price: "₺2.850" }], total: "₺2.850", totalNum: 2850, payment: "Kredi Kartı", status: "Hazırlanıyor", date: "02 May 2026, 14:00", note: "" },
];

const PER_PAGE = 5;

function statusToFilter(s: Status) {
  const map: Record<Status, string> = { Beklemede: "beklemede", Hazırlanıyor: "hazirlaniyor", Kargoda: "kargoda", "Teslim Edildi": "teslim", İptal: "iptal" };
  return map[s];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [statusModal, setStatusModal] = useState<string | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => { const k = statusToFilter(o.status); counts[k] = (counts[k] || 0) + 1; });
    return counts;
  }, [orders]);

  const statusFilters = [
    { label: "Tümü", value: "all" },
    { label: "Beklemede", value: "beklemede" },
    { label: "Hazırlanıyor", value: "hazirlaniyor" },
    { label: "Kargoda", value: "kargoda" },
    { label: "Teslim Edildi", value: "teslim" },
    { label: "İptal", value: "iptal" },
  ];

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (activeFilter !== "all" && statusToFilter(o.status) !== activeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [orders, activeFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function toggleOrder(id: string) {
    setSelectedOrders((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }
  function toggleAll() {
    setSelectedOrders(selectedOrders.size === paged.length ? new Set() : new Set(paged.map((o) => o.id)));
  }

  function updateStatus(ids: string[], status: Status) {
    setOrders((prev) => prev.map((o) => ids.includes(o.id) ? { ...o, status } : o));
    setSelectedOrders(new Set());
    setStatusModal(null);
  }

  function cancelOrders(ids: string[]) {
    if (!confirm(`${ids.length} siparişi iptal etmek istediğinize emin misiniz?`)) return;
    updateStatus(ids, "İptal");
  }

  function exportCSV() {
    const header = "Sipariş No,Müşteri,Email,Tutar,Ödeme,Durum,Tarih\n";
    const rows = filtered.map((o) => `${o.id},"${o.customer}",${o.email},${o.totalNum},${o.payment},${o.status},"${o.date}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `siparisler_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tüm siparişleri görüntüle ve yönet</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
            <Download size={16} />
            <span className="hidden sm:inline">Dışa Aktar</span>
          </button>
        </div>
      </div>

      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 overflow-x-auto">
        {statusFilters.map((f) => (
          <button key={f.value} onClick={() => { setActiveFilter(f.value); setPage(1); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === f.value ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
            {f.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === f.value ? "bg-white/20" : "bg-gray-100"}`}>{statusCounts[f.value] || 0}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Sipariş no, müşteri adı veya email ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>

      {selectedOrders.size > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex-wrap">
          <span className="text-sm font-medium text-orange-700">{selectedOrders.size} sipariş seçildi</span>
          <div className="h-4 w-px bg-orange-200" />
          <button onClick={() => setStatusModal("bulk")} className="text-sm text-orange-600 hover:underline flex items-center gap-1"><RefreshCw size={13} /> Durumu Güncelle</button>
          <button onClick={() => { const ids = [...selectedOrders]; alert(`${ids.length} sipariş için fatura oluşturuldu:\n${ids.join(", ")}`); setSelectedOrders(new Set()); }} className="text-sm text-orange-600 hover:underline flex items-center gap-1"><FileText size={13} /> Fatura Oluştur</button>
          <button onClick={() => cancelOrders([...selectedOrders])} className="text-sm text-red-600 hover:underline flex items-center gap-1"><AlertTriangle size={13} /> İptal Et</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={paged.length > 0 && selectedOrders.size === paged.length} onChange={toggleAll} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" /></th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">Sipariş</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4 hidden md:table-cell">Müşteri</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4">Tutar</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Ödeme</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 pr-4 hidden lg:table-cell">Tarih</th>
                <th className="w-10 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((order) => {
                const sc = statusConfig[order.status];
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => toggleOrder(order.id)} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" /></td>
                    <td className="py-3 pr-4"><span className="text-sm font-bold text-orange-600">{order.id}</span></td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-right"><span className="text-sm font-bold text-gray-800">{order.total}</span></td>
                    <td className="py-3 text-center hidden sm:table-cell"><span className="text-xs text-gray-500">{order.payment}</span></td>
                    <td className="py-3 text-center">
                      <button onClick={() => setStatusModal(order.id)} className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${sc.color}`}>
                        <sc.icon size={12} /> {order.status}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-right hidden lg:table-cell"><span className="text-xs text-gray-400">{order.date}</span></td>
                    <td className="pr-4"><button onClick={() => setViewOrder(order)} className="p-1.5 rounded-lg hover:bg-gray-100"><Eye size={16} className="text-gray-400" /></button></td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">Sonuç bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} sipariş</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {/* View order detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewOrder.id}</h2>
                <p className="text-xs text-gray-400">{viewOrder.date}</p>
              </div>
              <button onClick={() => setViewOrder(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full ${statusConfig[viewOrder.status].color}`}>
                  {(() => { const Icon = statusConfig[viewOrder.status].icon; return <Icon size={14} />; })()}
                  {viewOrder.status}
                </span>
                <span className="text-xs text-gray-500">{viewOrder.payment}</span>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p className="text-sm font-semibold text-gray-800">{viewOrder.customer}</p>
                <p className="text-xs text-gray-500">{viewOrder.email}</p>
                <p className="text-xs text-gray-500">{viewOrder.phone}</p>
                <p className="text-xs text-gray-500">{viewOrder.address}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ürünler</p>
                <div className="space-y-2">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-sm text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">x{item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-medium text-gray-600">Toplam</span>
                <span className="text-lg font-bold text-gray-900">{viewOrder.total}</span>
              </div>

              {viewOrder.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-yellow-700">Not: {viewOrder.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status update modal */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setStatusModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Durum Güncelle</h2>
              <button onClick={() => setStatusModal(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-2">
              {(Object.keys(statusConfig) as Status[]).map((s) => {
                const sc = statusConfig[s];
                return (
                  <button
                    key={s}
                    onClick={() => {
                      const ids = statusModal === "bulk" ? [...selectedOrders] : [statusModal];
                      updateStatus(ids, s);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${sc.color}`}><sc.icon size={16} /></span>
                    <span className="text-sm font-medium text-gray-700">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
