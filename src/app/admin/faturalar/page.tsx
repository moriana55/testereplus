"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Eye,
  Printer,
  Send,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

interface Invoice {
  id: string;
  order: string;
  customer: string;
  email: string;
  type: "e-Arşiv" | "e-Fatura";
  total: string;
  totalNum: number;
  tax: string;
  status: string;
  statusColor: string;
  statusIcon: typeof CheckCircle2;
  date: string;
}

const initialInvoices: Invoice[] = [
  { id: "FTR-2026-0147", order: "SP-1247", customer: "Mehmet Yılmaz", email: "mehmet@example.com", type: "e-Arşiv", total: "₺5.700", totalNum: 5700, tax: "₺1.026", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "07.05.2026" },
  { id: "FTR-2026-0146", order: "SP-1246", customer: "Ali Kaya", email: "ali@example.com", type: "e-Fatura", total: "₺890", totalNum: 890, tax: "₺160.20", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "07.05.2026" },
  { id: "FTR-2026-0145", order: "SP-1245", customer: "Hasan Demir", email: "hasan@example.com", type: "e-Arşiv", total: "₺3.720", totalNum: 3720, tax: "₺669.60", status: "Beklemede", statusColor: "bg-yellow-100 text-yellow-700", statusIcon: Clock, date: "06.05.2026" },
  { id: "FTR-2026-0144", order: "SP-1244", customer: "Ayşe Çelik", email: "ayse@example.com", type: "e-Arşiv", total: "₺520", totalNum: 520, tax: "₺93.60", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "06.05.2026" },
  { id: "FTR-2026-0143", order: "SP-1243", customer: "Fatma Öztürk", email: "fatma@example.com", type: "e-Fatura", total: "₺6.900", totalNum: 6900, tax: "₺1.242", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "05.05.2026" },
  { id: "FTR-2026-0142", order: "SP-1242", customer: "Veli Arslan", email: "veli@example.com", type: "e-Arşiv", total: "₺1.850", totalNum: 1850, tax: "₺333", status: "İptal", statusColor: "bg-red-100 text-red-700", statusIcon: AlertCircle, date: "05.05.2026" },
  { id: "FTR-2026-0141", order: "SP-1241", customer: "Kemal Bozkurt", email: "kemal@example.com", type: "e-Fatura", total: "₺12.400", totalNum: 12400, tax: "₺2.232", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "05.05.2026" },
  { id: "FTR-2026-0140", order: "SP-1240", customer: "Emre Şahin", email: "emre@example.com", type: "e-Arşiv", total: "₺2.850", totalNum: 2850, tax: "₺513", status: "Onaylandı", statusColor: "bg-green-100 text-green-700", statusIcon: CheckCircle2, date: "04.05.2026" },
];

const PER_PAGE = 5;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewInv, setViewInv] = useState<Invoice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formOrder, setFormOrder] = useState("");
  const [formCustomer, setFormCustomer] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTotal, setFormTotal] = useState("");
  const [formType, setFormType] = useState<"e-Arşiv" | "e-Fatura">("e-Arşiv");

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filterType !== "all" && inv.type !== filterType) return false;
      if (filterStatus !== "all" && inv.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return inv.id.toLowerCase().includes(q) || inv.customer.toLowerCase().includes(q) || inv.order.toLowerCase().includes(q);
      }
      return true;
    });
  }, [invoices, search, filterType, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function exportCSV() {
    const header = "Fatura No,Sipariş,Müşteri,Tip,Tutar,KDV,Durum,Tarih\n";
    const rows = filtered.map((i) => `${i.id},${i.order},"${i.customer}",${i.type},${i.totalNum},${i.tax},${i.status},${i.date}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `faturalar_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function handleCreate() {
    if (!formCustomer.trim() || !formTotal.trim()) return;
    const totalNum = parseFloat(formTotal.replace(",", "."));
    const taxNum = totalNum * 0.18;
    const id = `FTR-2026-${(invoices.length + 148).toString().padStart(4, "0")}`;
    const newInv: Invoice = {
      id, order: formOrder || "-", customer: formCustomer, email: formEmail,
      type: formType, total: `₺${totalNum.toLocaleString("tr-TR")}`, totalNum,
      tax: `₺${taxNum.toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`,
      status: "Beklemede", statusColor: "bg-yellow-100 text-yellow-700", statusIcon: Clock,
      date: new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    };
    setInvoices([newInv, ...invoices]);
    setFormOrder(""); setFormCustomer(""); setFormEmail(""); setFormTotal(""); setFormType("e-Arşiv");
    setShowForm(false);
  }

  function printInvoice(inv: Invoice) {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>${inv.id}</title><style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}h1{font-size:18px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:8px;border-bottom:1px solid #eee;text-align:left}th{font-size:12px;color:#666;text-transform:uppercase}.right{text-align:right}.total{font-size:18px;font-weight:bold}</style></head><body>`);
    w.document.write(`<h1>TESTERE PLUS — Fatura</h1><p><strong>${inv.id}</strong> · ${inv.date}</p>`);
    w.document.write(`<table><tr><th>Müşteri</th><td>${inv.customer}</td></tr><tr><th>Sipariş</th><td>${inv.order}</td></tr><tr><th>Tip</th><td>${inv.type}</td></tr></table>`);
    w.document.write(`<table style="margin-top:30px"><tr><th>Tutar</th><td class="right">${inv.total}</td></tr><tr><th>KDV</th><td class="right">${inv.tax}</td></tr><tr><th>Durum</th><td>${inv.status}</td></tr></table>`);
    w.document.write(`</body></html>`);
    w.document.close();
    w.print();
  }

  function sendInvoice(inv: Invoice) {
    alert(`Fatura ${inv.id} → ${inv.email || inv.customer} adresine gönderildi.`);
  }

  const approvedTotal = invoices.filter((i) => i.status === "Onaylandı").reduce((s, i) => s + i.totalNum, 0);
  const pendingTotal = invoices.filter((i) => i.status === "Beklemede").reduce((s, i) => s + i.totalNum, 0);
  const taxTotal = invoices.filter((i) => i.status === "Onaylandı").reduce((s, i) => s + parseFloat(i.tax.replace("₺", "").replace(".", "").replace(",", ".")), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturalar</h1>
          <p className="text-sm text-gray-500 mt-0.5">e-Arşiv ve e-Fatura yönetimi</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} /><span className="hidden sm:inline">Dışa Aktar</span>
          </button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            <Plus size={16} /> Yeni Fatura
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Bu Ay Toplam", value: `₺${approvedTotal.toLocaleString("tr-TR")}`, sub: `${invoices.filter((i) => i.status === "Onaylandı").length} fatura`, color: "bg-green-500" },
          { label: "Bekleyen", value: `₺${pendingTotal.toLocaleString("tr-TR")}`, sub: `${invoices.filter((i) => i.status === "Beklemede").length} fatura`, color: "bg-yellow-500" },
          { label: "KDV Toplamı", value: `₺${Math.round(taxTotal).toLocaleString("tr-TR")}`, sub: "%18 KDV", color: "bg-blue-500" },
          { label: "İptal Edilen", value: `₺${invoices.filter((i) => i.status === "İptal").reduce((s, i) => s + i.totalNum, 0).toLocaleString("tr-TR")}`, sub: `${invoices.filter((i) => i.status === "İptal").length} fatura`, color: "bg-red-500" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2"><div className={`w-2 h-2 rounded-full ${card.color}`} /><span className="text-xs text-gray-500 font-medium">{card.label}</span></div>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Fatura no, müşteri veya sipariş ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden sm:block">
          <option value="all">Tüm Tipler</option>
          <option value="e-Arşiv">e-Arşiv</option>
          <option value="e-Fatura">e-Fatura</option>
        </select>
        <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none hidden sm:block">
          <option value="all">Tüm Durumlar</option>
          <option value="Onaylandı">Onaylandı</option>
          <option value="Beklemede">Beklemede</option>
          <option value="İptal">İptal</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Fatura No</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">Sipariş</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Müşteri</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Tip</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Tutar</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Durum</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden sm:table-cell">Tarih</th>
                <th className="w-28 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3"><div className="flex items-center gap-2"><FileText size={16} className="text-gray-300" /><span className="text-sm font-semibold text-gray-800">{inv.id}</span></div></td>
                  <td className="py-3 hidden md:table-cell"><span className="text-sm text-orange-600 font-medium">{inv.order}</span></td>
                  <td className="py-3 hidden lg:table-cell"><span className="text-sm text-gray-600">{inv.customer}</span></td>
                  <td className="py-3 text-center hidden sm:table-cell"><span className={`text-xs font-medium px-2 py-1 rounded ${inv.type === "e-Fatura" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{inv.type}</span></td>
                  <td className="py-3 text-right"><span className="text-sm font-bold text-gray-800">{inv.total}</span></td>
                  <td className="py-3 text-center"><span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${inv.statusColor}`}><inv.statusIcon size={12} />{inv.status}</span></td>
                  <td className="py-3 text-right hidden sm:table-cell"><span className="text-xs text-gray-400">{inv.date}</span></td>
                  <td className="px-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setViewInv(inv)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Görüntüle"><Eye size={14} className="text-gray-400" /></button>
                      <button onClick={() => printInvoice(inv)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Yazdır"><Printer size={14} className="text-gray-400" /></button>
                      <button onClick={() => sendInvoice(inv)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Gönder"><Send size={14} className="text-gray-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-sm text-gray-400">Sonuç bulunamadı</td></tr>}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} fatura</p>
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

      {/* View invoice modal */}
      {viewInv && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewInv(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{viewInv.id}</h2>
              <button onClick={() => setViewInv(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full ${viewInv.statusColor}`}><viewInv.statusIcon size={14} />{viewInv.status}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${viewInv.type === "e-Fatura" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{viewInv.type}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Müşteri</span><span className="font-medium text-gray-800">{viewInv.customer}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Sipariş</span><span className="font-medium text-orange-600">{viewInv.order}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tarih</span><span className="text-gray-700">{viewInv.date}</span></div>
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Ara Toplam</span><span className="text-gray-800">{viewInv.total}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">KDV (%18)</span><span className="text-gray-800">{viewInv.tax}</span></div>
                <div className="flex justify-between text-base font-bold border-t border-gray-100 pt-2"><span className="text-gray-700">Toplam</span><span className="text-gray-900">{viewInv.total}</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { printInvoice(viewInv); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"><Printer size={16} /> Yazdır</button>
                <button onClick={() => { sendInvoice(viewInv); }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Send size={16} /> Gönder</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New invoice modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Yeni Fatura</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı *</label>
                <input type="text" value={formCustomer} onChange={(e) => setFormCustomer(e.target.value)} autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sipariş No</label>
                  <input type="text" value={formOrder} onChange={(e) => setFormOrder(e.target.value)} placeholder="SP-XXXX" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (₺) *</label>
                  <input type="text" inputMode="decimal" value={formTotal} onChange={(e) => setFormTotal(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fatura Tipi</label>
                <div className="flex gap-2">
                  {(["e-Arşiv", "e-Fatura"] as const).map((t) => (
                    <button key={t} onClick={() => setFormType(t)} className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${formType === t ? "border-orange-300 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Check size={16} /> Oluştur</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
