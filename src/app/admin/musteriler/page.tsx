"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Plus,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  Star,
  X,
  Check,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: string;
  totalNum: number;
  lastOrder: string;
  vip: boolean;
}

const initialCustomers: Customer[] = [
  { id: "1", name: "Mehmet Yılmaz", email: "mehmet@example.com", phone: "0532 123 4567", city: "İstanbul", orders: 12, totalSpent: "₺34.200", totalNum: 34200, lastOrder: "07.05.2026", vip: true },
  { id: "2", name: "Ali Kaya", email: "ali@example.com", phone: "0533 234 5678", city: "Ankara", orders: 8, totalSpent: "₺18.450", totalNum: 18450, lastOrder: "07.05.2026", vip: false },
  { id: "3", name: "Hasan Demir", email: "hasan@example.com", phone: "0534 345 6789", city: "Bursa", orders: 15, totalSpent: "₺42.800", totalNum: 42800, lastOrder: "06.05.2026", vip: true },
  { id: "4", name: "Ayşe Çelik", email: "ayse@example.com", phone: "0535 456 7890", city: "İzmir", orders: 3, totalSpent: "₺4.560", totalNum: 4560, lastOrder: "06.05.2026", vip: false },
  { id: "5", name: "Fatma Öztürk", email: "fatma@example.com", phone: "0536 567 8901", city: "Antalya", orders: 6, totalSpent: "₺22.100", totalNum: 22100, lastOrder: "05.05.2026", vip: false },
  { id: "6", name: "Kemal Bozkurt", email: "kemal@example.com", phone: "0537 678 9012", city: "Konya", orders: 22, totalSpent: "₺68.400", totalNum: 68400, lastOrder: "05.05.2026", vip: true },
  { id: "7", name: "Emre Şahin", email: "emre@example.com", phone: "0538 789 0123", city: "İstanbul", orders: 4, totalSpent: "₺8.920", totalNum: 8920, lastOrder: "04.05.2026", vip: false },
  { id: "8", name: "Burak Yıldız", email: "burak@example.com", phone: "0539 890 1234", city: "Trabzon", orders: 2, totalSpent: "₺4.180", totalNum: 4180, lastOrder: "04.05.2026", vip: false },
  { id: "9", name: "Serkan Aydın", email: "serkan@example.com", phone: "0540 901 2345", city: "Adana", orders: 7, totalSpent: "₺15.200", totalNum: 15200, lastOrder: "03.05.2026", vip: false },
  { id: "10", name: "Oğuz Kara", email: "oguz@example.com", phone: "0541 012 3456", city: "Mersin", orders: 11, totalSpent: "₺29.800", totalNum: 29800, lastOrder: "02.05.2026", vip: true },
  { id: "11", name: "Deniz Koç", email: "deniz@example.com", phone: "0542 123 4567", city: "Bursa", orders: 5, totalSpent: "₺12.400", totalNum: 12400, lastOrder: "01.05.2026", vip: false },
  { id: "12", name: "Tuncay Balcı", email: "tuncay@example.com", phone: "0543 234 5678", city: "Kayseri", orders: 1, totalSpent: "₺2.850", totalNum: 2850, lastOrder: "30.04.2026", vip: false },
];

const PER_PAGE = 5;

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCity, setFormCity] = useState("");

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const vipCount = customers.filter((c) => c.vip).length;

  function exportCSV() {
    const header = "İsim,Email,Telefon,Şehir,Sipariş Sayısı,Toplam Harcama,Son Sipariş,VIP\n";
    const rows = filtered.map((c) => `"${c.name}",${c.email},${c.phone},${c.city},${c.orders},${c.totalNum},${c.lastOrder},${c.vip ? "Evet" : "Hayır"}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `musteriler_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function resetForm() { setFormName(""); setFormEmail(""); setFormPhone(""); setFormCity(""); }

  function handleAddCustomer() {
    if (!formName.trim() || !formEmail.trim()) return;
    const newC: Customer = {
      id: Date.now().toString(36),
      name: formName, email: formEmail, phone: formPhone, city: formCity,
      orders: 0, totalSpent: "₺0", totalNum: 0,
      lastOrder: "-", vip: false,
    };
    setCustomers([newC, ...customers]);
    resetForm();
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-sm text-gray-500 mt-0.5">{customers.length} kayıtlı müşteri</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            <Download size={16} /><span className="hidden sm:inline">Dışa Aktar</span>
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            <Plus size={16} /> Yeni Müşteri
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Users size={16} className="text-blue-500" /><span className="text-xs text-gray-500 font-medium">Toplam</span></div>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><UserPlus size={16} className="text-green-500" /><span className="text-xs text-gray-500 font-medium">Bu Ay Yeni</span></div>
          <p className="text-2xl font-bold text-gray-900">34</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><Star size={16} className="text-amber-500" /><span className="text-xs text-gray-500 font-medium">VIP Müşteri</span></div>
          <p className="text-2xl font-bold text-gray-900">{vipCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2"><ShoppingCart size={16} className="text-purple-500" /><span className="text-xs text-gray-500 font-medium">Ort. Sipariş Değeri</span></div>
          <p className="text-2xl font-bold text-gray-900">₺{Math.round(customers.reduce((s, c) => s + c.totalNum, 0) / Math.max(customers.reduce((s, c) => s + c.orders, 0), 1)).toLocaleString("tr-TR")}</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="İsim, email veya telefon ara..." className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Müşteri</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden md:table-cell">İletişim</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 hidden lg:table-cell">Şehir</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Sipariş</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3">Toplam</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-5 hidden sm:table-cell">Son Sipariş</th>
                <th className="w-10 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setViewCustomer(c)}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-500">{c.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-800">{c.name}</p>
                          {c.vip && <Star size={12} className="text-amber-400 fill-amber-400" />}
                        </div>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 hidden md:table-cell"><p className="text-sm text-gray-600">{c.phone}</p></td>
                  <td className="py-3 hidden lg:table-cell"><span className="text-sm text-gray-600 flex items-center gap-1"><MapPin size={12} className="text-gray-400" /> {c.city}</span></td>
                  <td className="py-3 text-center"><span className="text-sm font-semibold text-gray-700">{c.orders}</span></td>
                  <td className="py-3 text-right"><span className="text-sm font-bold text-gray-800">{c.totalSpent}</span></td>
                  <td className="py-3 text-right px-5 hidden sm:table-cell"><span className="text-xs text-gray-400">{c.lastOrder}</span></td>
                  <td className="pr-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setViewCustomer(c)} className="p-1.5 rounded-lg hover:bg-gray-100"><Eye size={16} className="text-gray-400" /></button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Sonuç bulunamadı</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">{(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} müşteri</p>
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

      {/* Customer detail modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewCustomer(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Müşteri Detayı</h2>
              <button onClick={() => setViewCustomer(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">{viewCustomer.name.split(" ").map((n) => n[0]).join("")}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{viewCustomer.name}</h3>
                    {viewCustomer.vip && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5"><Star size={10} className="fill-amber-500" /> VIP</span>}
                  </div>
                  <p className="text-sm text-gray-500">{viewCustomer.city}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Toplam Sipariş</p>
                  <p className="text-lg font-bold text-gray-900">{viewCustomer.orders}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Toplam Harcama</p>
                  <p className="text-lg font-bold text-gray-900">{viewCustomer.totalSpent}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" /> {viewCustomer.email}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" /> {viewCustomer.phone}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={14} className="text-gray-400" /> {viewCustomer.city}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><ShoppingCart size={14} className="text-gray-400" /> Son sipariş: {viewCustomer.lastOrder}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New customer modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Yeni Müşteri</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 rounded-lg hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} autoFocus className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="0532 123 4567" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                <input type="text" value={formCity} onChange={(e) => setFormCity(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">İptal</button>
              <button onClick={handleAddCustomer} className="flex items-center gap-2 px-6 py-2.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"><Check size={16} /> Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
