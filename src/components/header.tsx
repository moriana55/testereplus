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
} from "lucide-react";
import { categories } from "@/lib/data";
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
      router.push(`/urunler?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar — dark */}
      <div className="bg-bg-dark text-text-on-dark">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href="tel:+905551234567" className="flex items-center gap-1.5 hover:text-accent-light transition-colors">
              <Phone size={12} />
              <span>0555 123 45 67</span>
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline text-gray-400">Tüm siparişlerde <strong className="text-accent-light">ücretsiz kargo</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/hakkimizda" className="hover:text-accent-light transition-colors hidden sm:inline">
              Hakkımızda
            </Link>
            <Link href="/blog" className="hover:text-accent-light transition-colors hidden sm:inline">
              Blog
            </Link>
            <Link href="/iletisim" className="hover:text-accent-light transition-colors">
              İletişim
            </Link>
          </div>
        </div>
      </div>

      {/* Main header — white */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-black text-lg">T+</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-text-primary tracking-tight">TESTERE</span>
                <span className="text-xl font-extrabold text-accent tracking-tight">PLUS</span>
              </div>
              <p className="text-[9px] text-text-muted uppercase tracking-[0.2em] -mt-0.5">
                Profesyonel Kesici Takımlar
              </p>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, marka veya kategori ara..."
                className="w-full bg-bg-secondary border border-border rounded-xl pl-5 pr-14 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors shadow-sm">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-green-500/20"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
            <button className="p-2.5 rounded-xl hover:bg-bg-secondary transition-colors hidden sm:block">
              <User size={20} className="text-text-secondary" />
            </button>
            <button onClick={() => setIsOpen(true)} className="relative p-2.5 rounded-xl hover:bg-bg-secondary transition-colors">
              <ShoppingCart size={20} className="text-text-secondary" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-bg-secondary transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-border hidden md:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center">
            {/* Categories mega dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-accent text-white hover:bg-accent-hover transition-colors rounded-none -ml-4">
                <Menu size={16} />
                Kategoriler
                <ChevronDown size={14} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-border rounded-b-xl shadow-xl shadow-black/10 z-50">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/kategori/${cat.slug}`}
                      className="flex items-center justify-between px-5 py-3.5 text-sm text-text-secondary hover:bg-accent-bg hover:text-accent transition-colors border-b border-border-light last:border-0 last:rounded-b-xl"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-xs text-text-muted bg-bg-secondary px-2 py-0.5 rounded-full">{cat.productCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/urunler" className="px-5 py-3 text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Tüm Ürünler
            </Link>
            <Link href="/blog" className="px-5 py-3 text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              Blog
            </Link>
            <Link href="/iletisim" className="px-5 py-3 text-sm font-medium text-text-secondary hover:text-accent transition-colors">
              İletişim
            </Link>

            {/* Brands */}
            <div className="ml-auto flex items-center gap-4 py-3">
              {["Freud", "Netmak", "Kronberg", "Bosch", "König"].map((brand) => (
                <span key={brand} className="text-xs font-medium text-text-muted hover:text-accent cursor-pointer transition-colors uppercase tracking-wide">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-border shadow-lg">
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full bg-bg-secondary border border-border rounded-xl pl-4 pr-12 py-3 text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-accent text-white rounded-lg">
                <Search size={18} />
              </button>
            </form>
            <div className="space-y-0.5">
              <Link href="/urunler" className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-bg-secondary" onClick={() => setMenuOpen(false)}>
                Tüm Ürünler
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  className="block px-4 py-3 text-sm text-text-secondary rounded-xl hover:bg-bg-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <Link href="/blog" className="block px-4 py-3 text-sm rounded-xl hover:bg-bg-secondary" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/hakkimizda" className="block px-4 py-3 text-sm rounded-xl hover:bg-bg-secondary" onClick={() => setMenuOpen(false)}>
                Hakkımızda
              </Link>
              <Link href="/iletisim" className="block px-4 py-3 text-sm rounded-xl hover:bg-bg-secondary" onClick={() => setMenuOpen(false)}>
                İletişim
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
