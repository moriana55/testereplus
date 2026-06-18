"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  Phone,
  ChevronDown,
  User,
  Heart,
} from "lucide-react";
import { categories, getRootCategories, getChildCategories } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, setIsOpen } = useCart();
  const router = useRouter();

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  }

  return (
    <header className="w-full bg-white relative z-50 shadow-sm font-sans">
      {/* Top Bar */}
      <div className="bg-bg-dark text-gray-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center gap-6 text-[13px] font-medium">
          <span className="hidden sm:inline text-gray-400">Profesyonel kesici takımlar · Hızlı kargo · Faturalı satış</span>
          <div className="flex items-center gap-5 ml-auto font-semibold">
          <a href="https://wa.me/905395101888" className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            0 ( 539 ) 510 18 88
          </a>
          <a href="tel:+905395101888" className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors">
            <Phone size={14} className="fill-current" />
            0 ( 539 ) 510 18 88
          </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.svg" alt="Testere Plus — Profesyonel Kesici Takımlar" width={160} height={48} className="h-12 w-auto" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex" role="search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün adı veya stok kodu ara..."
              aria-label="Ürün ara"
              className="flex-1 bg-bg-secondary border border-border border-r-0 rounded-l-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:bg-white transition-colors"
            />
            <button type="submit" aria-label="Ara" className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-r-lg transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/favorilerim" aria-label="Favorilerim" className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-accent transition-colors rounded-full hover:bg-accent-bg">
              <Heart size={20} />
            </Link>
            <Link href="/hesabim" aria-label="Hesabım" className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-accent transition-colors rounded-full hover:bg-accent-bg">
              <User size={20} />
            </Link>
            <button onClick={() => setIsOpen(true)} aria-label="Sepeti aç" className="relative flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-accent/20">
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Sepet</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-text-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü" className="md:hidden w-10 h-10 flex items-center justify-center text-text-secondary">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-bg-secondary border-y border-border hidden md:block relative z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-[14px] font-semibold text-text-secondary">
          {/* Daire Testere — Mega Menu */}
          <div
            className="relative bg-accent text-white cursor-pointer"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <Link href="/kategori/daire-testere-bicaklari" className="flex items-center gap-1.5 px-6 py-4">
              Daire Testere Bıçakları
              <ChevronDown size={14} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </Link>

            {catOpen && (
              <div className="absolute top-full left-0 w-[720px] bg-white border border-border shadow-2xl shadow-black/10 rounded-b-xl p-6 grid grid-cols-2 gap-x-8 gap-y-3 cursor-default text-left">
                {[
                  { name: "Ahşap Daire Testere Bıçakları", slug: "ahsap-testereler", icon: "🪵" },
                  { name: "Aluminyum, PVC ve Metal Kesim", slug: "aluminyum-pvc-metal-testereleri", icon: "🔩" },
                  { name: "Sunta, MDF ve Laminant", slug: "sunta-mdf-laminant-testereleri", icon: "📐" },
                  { name: "Betopan, Asfalt, Granit, Mermer", slug: "betopan-asfalt-granit-seramik-mermer", icon: "🧱" },
                  { name: "Çoklu Materyal Kesim", slug: "coklu-materyal-kesim-testereleri", icon: "⚙️" },
                  { name: "DIA Testereler", slug: "dia-testereler", icon: "💎" },
                  { name: "El Tipi Makineler İçin", slug: "el-tipi-daire-testere-bicaklari", icon: "🔧" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/kategori/${item.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent-bg transition-colors group/item"
                    onClick={() => setCatOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[13px] font-medium text-text-secondary group-hover/item:text-accent leading-snug">{item.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Freze — Mega Menu */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setCatOpen(false)}
          >
            <div className="relative group">
              <Link href="/kategori/freze-bicaklari" className="flex items-center gap-1.5 px-5 py-4 hover:text-accent transition-colors">
                Freze Bıçakları
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute top-full left-0 w-[600px] bg-white border border-border shadow-2xl shadow-black/10 rounded-b-xl p-5 grid grid-cols-2 gap-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {[
                  { name: "Saplı Freze (Bilyalı)", slug: "sapli-freze-bilyali", icon: "🔘" },
                  { name: "Saplı Freze (Bilyasız)", slug: "sapli-freze-bilyasiz", icon: "🔵" },
                  { name: "Saplı DIA Bıçaklar", slug: "sapli-dia-bicaklar", icon: "💎" },
                  { name: "Göbekli Freze Bıçakları", slug: "gobekli-freze-bicaklari", icon: "⭕" },
                  { name: "Göbekli DIA Bıçaklar", slug: "gobekli-dia-bicaklar", icon: "💠" },
                  { name: "Değiştirilebilir Jiletli", slug: "degistirilebilir-jiletli-bicaklar", icon: "🔄" },
                  { name: "Çoklu Delik & Menteşe Matkap", slug: "coklu-delik-mentese-matkaplari", icon: "🕳️" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/kategori/${item.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent-bg transition-colors group/item"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[13px] font-medium text-text-secondary group-hover/item:text-accent leading-snug">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/kategori/jiletler-ve-planyalar" className="px-5 py-4 hover:text-accent transition-colors">
            Jiletler ve Planyalar
          </Link>
          <Link href="/kategori/matkap-uclari" className="px-5 py-4 hover:text-accent transition-colors">
            Matkap Uçları
          </Link>
          <Link href="/kategori/serit-testereler" className="px-5 py-4 hover:text-accent transition-colors">
            Şerit Testereler
          </Link>
          <Link href="/kategori/aksesuarlar" className="px-5 py-4 hover:text-accent transition-colors">
            Aksesuarlar
          </Link>
          <Link href="/urunler" className="px-5 py-4 hover:text-accent transition-colors">
            Tüm Ürünler
          </Link>
          <Link href="/teklif" className="px-5 py-4 font-semibold text-accent hover:text-accent-hover transition-colors">
            Teklif İste
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg p-4 space-y-1">
          {[
            { name: "Daire Testere Bıçakları", slug: "daire-testere-bicaklari" },
            { name: "Freze Bıçakları", slug: "freze-bicaklari" },
            { name: "Jiletler ve Planyalar", slug: "jiletler-ve-planyalar" },
            { name: "Matkap Uçları", slug: "matkap-uclari" },
            { name: "Şerit Testereler", slug: "serit-testereler" },
            { name: "Aksesuarlar", slug: "aksesuarlar" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="block py-2.5 px-3 text-text-secondary font-medium hover:text-accent hover:bg-accent-bg rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/urunler" className="block py-2.5 px-3 text-accent font-bold" onClick={() => setMenuOpen(false)}>
            Tüm Ürünler
          </Link>
          <Link href="/teklif" className="block py-2.5 px-3 text-accent font-bold" onClick={() => setMenuOpen(false)}>
            Teklif İste
          </Link>
        </div>
      )}
    </header>
  );
}
