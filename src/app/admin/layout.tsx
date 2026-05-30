"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Truck,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  PenSquare,
  Tags,
  Receipt,
  Calculator,
  Globe,
  Image,
  MessageSquare,
  Star,
  Megaphone,
  FolderTree,
  Boxes,
  ArrowLeftRight,
  CreditCard,
  PieChart,
  TrendingUp,
  CircleDollarSign,
  ClipboardList,
  Palette,
  StickyNote,
  Moon,
  Sun,
  Plus,
  StickyNote as NoteIcon,
  Home,
} from "lucide-react";
import CommandPalette from "@/components/admin/command-palette";
import OrderToast from "@/components/admin/order-toast";

const navSections = [
  {
    label: "Ana Menü",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/siparisler", icon: ShoppingCart, label: "Siparişler", badge: "12" },
      { href: "/admin/musteriler", icon: Users, label: "Müşteriler" },
      { href: "/admin/notlar", icon: StickyNote, label: "Notlar" },
    ],
  },
  {
    label: "Ürün Yönetimi",
    items: [
      { href: "/admin/urunler", icon: Package, label: "Ürünler" },
      { href: "/admin/kategoriler", icon: FolderTree, label: "Kategoriler" },
      { href: "/admin/markalar", icon: Tags, label: "Markalar" },
      { href: "/admin/stok", icon: Boxes, label: "Stok Yönetimi" },
    ],
  },
  {
    label: "Finans",
    items: [
      { href: "/admin/giderler", icon: Receipt, label: "Gider Takibi" },
      { href: "/admin/faturalar", icon: Receipt, label: "Faturalar" },
      { href: "/admin/muhasebe", icon: Calculator, label: "Muhasebe" },
      { href: "/admin/odemeler", icon: CreditCard, label: "Ödemeler" },
    ],
  },
  {
    label: "Kargo & Lojistik",
    items: [
      { href: "/admin/kargo", icon: Truck, label: "Kargo Takibi" },
      { href: "/admin/iade", icon: ArrowLeftRight, label: "İadeler" },
    ],
  },
  {
    label: "İçerik & SEO",
    items: [
      { href: "/admin/blog", icon: PenSquare, label: "Blog Yazıları" },
      { href: "/admin/seo", icon: Globe, label: "SEO Yönetimi" },
      { href: "/admin/medya", icon: Image, label: "Medya Kütüphanesi" },
      { href: "/admin/sayfalar", icon: FileText, label: "Sayfalar" },
    ],
  },
  {
    label: "Pazarlama",
    items: [
      { href: "/admin/kampanyalar", icon: Megaphone, label: "Kampanyalar" },
      { href: "/admin/kuponlar", icon: CircleDollarSign, label: "Kuponlar" },
      { href: "/admin/yorumlar", icon: Star, label: "Yorumlar" },
      { href: "/admin/mesajlar", icon: MessageSquare, label: "Mesajlar", badge: "3" },
    ],
  },
  {
    label: "Raporlar",
    items: [
      { href: "/admin/raporlar", icon: BarChart3, label: "Satış Raporları" },
      { href: "/admin/raporlar/trafik", icon: TrendingUp, label: "Trafik Analizi" },
      { href: "/admin/raporlar/urun", icon: PieChart, label: "Ürün Performansı" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { href: "/admin/ayarlar", icon: Settings, label: "Ayarlar" },
      { href: "/admin/gorunum", icon: Palette, label: "Görünüm" },
      { href: "/admin/log", icon: ClipboardList, label: "Aktivite Logu" },
    ],
  },
];

const breadcrumbMap: Record<string, string> = {
  admin: "Yönetim",
  siparisler: "Siparişler",
  musteriler: "Müşteriler",
  notlar: "Notlar",
  urunler: "Ürünler",
  kategoriler: "Kategoriler",
  markalar: "Markalar",
  stok: "Stok Yönetimi",
  giderler: "Gider Takibi",
  faturalar: "Faturalar",
  muhasebe: "Muhasebe",
  odemeler: "Ödemeler",
  kargo: "Kargo Takibi",
  iade: "İadeler",
  blog: "Blog Yazıları",
  seo: "SEO Yönetimi",
  medya: "Medya Kütüphanesi",
  sayfalar: "Sayfalar",
  kampanyalar: "Kampanyalar",
  kuponlar: "Kuponlar",
  yorumlar: "Yorumlar",
  mesajlar: "Mesajlar",
  raporlar: "Raporlar",
  trafik: "Trafik Analizi",
  urun: "Ürün Performansı",
  ayarlar: "Ayarlar",
  gorunum: "Görünüm",
  log: "Aktivite Logu",
};

const notifications = [
  { id: 1, title: "Yeni sipariş geldi", desc: "SP-1248 — Ahmet Yılmaz", time: "2 dk önce", read: false, type: "order" },
  { id: 2, title: "Stok uyarısı", desc: "Tideway Kanal Tarama Bıçağı tükendi", time: "1 saat önce", read: false, type: "stock" },
  { id: 3, title: "Yeni yorum", desc: "Freud Daire Testere — 5 yıldız", time: "3 saat önce", read: false, type: "review" },
  { id: 4, title: "Kargo teslim edildi", desc: "SP-1240 — Aras Kargo", time: "5 saat önce", read: true, type: "shipping" },
  { id: 5, title: "Yeni mesaj", desc: "Mehmet K. — Toptan fiyat sormak istiyor", time: "1 gün önce", read: true, type: "message" },
];

const fabActions = [
  { label: "Yeni Sipariş", href: "/admin/siparisler", icon: ShoppingCart, color: "bg-blue-500" },
  { label: "Yeni Ürün", href: "/admin/urunler", icon: Package, color: "bg-green-500" },
  { label: "Yeni Not", href: "/admin/notlar", icon: NoteIcon, color: "bg-yellow-500" },
  { label: "Gider Ekle", href: "/admin/giderler", icon: Receipt, color: "bg-red-500" },
];

function getActiveSectionIndex(pathname: string) {
  return navSections.findIndex((section) =>
    section.items.some((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)))
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const activeIdx = getActiveSectionIndex(pathname);
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set(activeIdx >= 0 ? [0, activeIdx] : [0]));

  useEffect(() => {
    const stored = localStorage.getItem("tp_dark");
    if (stored === "1") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("tp_dark", next ? "1" : "0");
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: breadcrumbMap[seg] || seg,
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className={`min-h-screen flex ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
      <CommandPalette />
      <OrderToast />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white flex flex-col transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">T+</span>
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight">TESTERE PLUS</span>
              <p className="text-[9px] text-gray-400 -mt-0.5">Yönetim Paneli</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin">
          {navSections.map((section, sIdx) => {
            const isOpen = openSections.has(sIdx);
            const hasActive = section.items.some((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));
            return (
              <div key={section.label}>
                <button
                  onClick={() => toggleSection(sIdx)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-colors ${hasActive ? "text-orange-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {section.label}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="space-y-0.5 pb-1">
                    {section.items.map((item) => {
                      const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            active
                              ? "bg-orange-500/15 text-orange-400 font-medium"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <item.icon size={16} />
                          <span className="flex-1">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <Globe size={16} />
            Siteyi Görüntüle
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className={`h-16 border-b flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-30 ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu size={22} />
            </button>
            <button
              onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className={`relative hidden sm:flex items-center gap-2 w-72 rounded-lg pl-3 pr-4 py-2 text-sm transition-all cursor-pointer ${dark ? "bg-gray-700 border border-gray-600 text-gray-300 hover:border-gray-500" : "bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-300"}`}
            >
              <Search size={16} />
              <span className="flex-1 text-left">Hızlı arama...</span>
              <kbd className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${dark ? "bg-gray-600 text-gray-400" : "bg-gray-200 text-gray-500"}`}>⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button onClick={toggleDark} className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-lg transition-colors ${dark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 rounded-xl shadow-xl border overflow-hidden ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
                    <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Bildirimler</h3>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{unreadCount} yeni</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${dark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"} ${!n.read ? (dark ? "bg-gray-700/30" : "bg-orange-50/50") : ""}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-orange-500" : "bg-transparent"}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-800"}`}>{n.title}</p>
                          <p className={`text-xs mt-0.5 truncate ${dark ? "text-gray-400" : "text-gray-500"}`}>{n.desc}</p>
                          <p className={`text-[10px] mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 py-2.5 border-t text-center ${dark ? "border-gray-700" : "border-gray-100"}`}>
                    <Link href="/admin/mesajlar" onClick={() => setNotifOpen(false)} className="text-xs text-orange-500 font-medium hover:underline">Tümünü Gör</Link>
                  </div>
                </div>
              )}
            </div>

            <div className={`h-6 w-px ${dark ? "bg-gray-700" : "bg-gray-200"}`} />
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors ${dark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">YE</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>Yiğit Ertürk</p>
                  <p className={`text-[10px] ${dark ? "text-gray-500" : "text-gray-400"}`}>Admin</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 hidden md:block transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>
              {profileOpen && (
                <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border overflow-hidden ${dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  <div className={`px-4 py-3 border-b ${dark ? "border-gray-700" : "border-gray-100"}`}>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Yiğit Ertürk</p>
                    <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>r.y.erturk@gmail.com</p>
                  </div>
                  <div className="py-1">
                    <Link href="/admin/ayarlar" onClick={() => setProfileOpen(false)} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}>
                      <Settings size={15} className="text-gray-400" /> Ayarlar
                    </Link>
                    <Link href="/admin/log" onClick={() => setProfileOpen(false)} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}>
                      <ClipboardList size={15} className="text-gray-400" /> Aktivite Logu
                    </Link>
                    <Link href="/" onClick={() => setProfileOpen(false)} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}>
                      <Globe size={15} className="text-gray-400" /> Siteyi Görüntüle
                    </Link>
                  </div>
                  <div className={`border-t py-1 ${dark ? "border-gray-700" : "border-gray-100"}`}>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors">
                      <X size={15} /> Çıkış Yap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        {pathname !== "/admin" && (
          <div className={`px-4 lg:px-6 py-2 border-b flex items-center gap-1.5 text-xs ${dark ? "bg-gray-800/50 border-gray-700/50" : "bg-white/60 border-gray-100"}`}>
            <Link href="/admin" className={`flex items-center gap-1 hover:text-orange-500 transition-colors ${dark ? "text-gray-400" : "text-gray-500"}`}>
              <Home size={12} />
            </Link>
            {breadcrumbs.slice(1).map((crumb) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight size={12} className={dark ? "text-gray-600" : "text-gray-300"} />
                {crumb.isLast ? (
                  <span className={`font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className={`hover:text-orange-500 transition-colors ${dark ? "text-gray-400" : "text-gray-500"}`}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* FAB */}
      <div ref={fabRef} className="fixed bottom-6 right-6 z-40">
        {fabOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
            {fabActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl px-4 py-3 hover:shadow-xl transition-all whitespace-nowrap group"
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.label}</span>
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 ${fabOpen ? "bg-gray-700 rotate-45" : "bg-orange-500"}`}
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
