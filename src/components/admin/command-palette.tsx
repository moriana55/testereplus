"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Receipt,
  Truck,
  PenSquare,
  Settings,
  StickyNote,
  FolderTree,
  Tags,
  Boxes,
  Calculator,
  CreditCard,
  ArrowLeftRight,
  Globe,
  Image,
  FileText,
  MessageSquare,
  Star,
  Megaphone,
  CircleDollarSign,
  BarChart3,
  TrendingUp,
  PieChart,
  Palette,
  ClipboardList,
  X,
} from "lucide-react";

const pages = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, keywords: "ana sayfa panel" },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingCart, keywords: "sipariş order" },
  { href: "/admin/musteriler", label: "Müşteriler", icon: Users, keywords: "müşteri customer" },
  { href: "/admin/notlar", label: "Notlar", icon: StickyNote, keywords: "not memo" },
  { href: "/admin/urunler", label: "Ürünler", icon: Package, keywords: "ürün product" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree, keywords: "kategori category" },
  { href: "/admin/markalar", label: "Markalar", icon: Tags, keywords: "marka brand" },
  { href: "/admin/stok", label: "Stok Yönetimi", icon: Boxes, keywords: "stok stock envanter" },
  { href: "/admin/giderler", label: "Gider Takibi", icon: Receipt, keywords: "gider harcama expense" },
  { href: "/admin/faturalar", label: "Faturalar", icon: Receipt, keywords: "fatura invoice" },
  { href: "/admin/muhasebe", label: "Muhasebe", icon: Calculator, keywords: "muhasebe accounting" },
  { href: "/admin/odemeler", label: "Ödemeler", icon: CreditCard, keywords: "ödeme payment" },
  { href: "/admin/kargo", label: "Kargo Takibi", icon: Truck, keywords: "kargo shipping" },
  { href: "/admin/iade", label: "İadeler", icon: ArrowLeftRight, keywords: "iade return" },
  { href: "/admin/blog", label: "Blog Yazıları", icon: PenSquare, keywords: "blog yazı post" },
  { href: "/admin/seo", label: "SEO Yönetimi", icon: Globe, keywords: "seo arama google" },
  { href: "/admin/medya", label: "Medya Kütüphanesi", icon: Image, keywords: "medya resim görsel" },
  { href: "/admin/sayfalar", label: "Sayfalar", icon: FileText, keywords: "sayfa page" },
  { href: "/admin/kampanyalar", label: "Kampanyalar", icon: Megaphone, keywords: "kampanya campaign" },
  { href: "/admin/kuponlar", label: "Kuponlar", icon: CircleDollarSign, keywords: "kupon coupon indirim" },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: Star, keywords: "yorum review" },
  { href: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare, keywords: "mesaj message" },
  { href: "/admin/raporlar", label: "Satış Raporları", icon: BarChart3, keywords: "rapor report satış" },
  { href: "/admin/raporlar/trafik", label: "Trafik Analizi", icon: TrendingUp, keywords: "trafik traffic ziyaret" },
  { href: "/admin/raporlar/urun", label: "Ürün Performansı", icon: PieChart, keywords: "performans ürün" },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings, keywords: "ayar setting" },
  { href: "/admin/gorunum", label: "Görünüm", icon: Palette, keywords: "tema theme renk" },
  { href: "/admin/log", label: "Aktivite Logu", icon: ClipboardList, keywords: "log aktivite" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = query.trim()
    ? pages.filter((p) => {
        const q = query.toLowerCase();
        return p.label.toLowerCase().includes(q) || p.keywords.toLowerCase().includes(q);
      })
    : pages;

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      navigate(results[selectedIdx].href);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Sayfa ara..."
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sonuç bulunamadı</p>
          ) : (
            results.map((page, i) => (
              <button
                key={page.href}
                onClick={() => navigate(page.href)}
                onMouseEnter={() => setSelectedIdx(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  i === selectedIdx ? "bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <page.icon size={18} className={i === selectedIdx ? "text-orange-500" : "text-gray-400"} />
                <span className="flex-1 text-left">{page.label}</span>
                {i === selectedIdx && <span className="text-[10px] text-gray-400">Enter ↵</span>}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-[10px] text-gray-400">↑↓ gezin · Enter seç · Esc kapat</span>
          <span className="text-[10px] text-gray-400">⌘K</span>
        </div>
      </div>
    </div>
  );
}
