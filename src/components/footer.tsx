import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { categories, brands } from "@/lib/data";

export function Footer() {
  return (
    <footer className="bg-bg-dark text-gray-400 mt-0">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-base">T+</span>
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight">TESTERE</span>
                <span className="text-lg font-extrabold text-accent tracking-tight">PLUS</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Profesyonel kesici takımlar ve endüstriyel aksesuarlarda Türkiye&apos;nin güvenilir tedarikçisi.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="tel:+905551234567" className="flex items-center gap-2 hover:text-accent-light transition-colors">
                <Phone size={14} className="text-accent" /> 0555 123 45 67
              </a>
              <a href="mailto:info@testereplus.com" className="flex items-center gap-2 hover:text-accent-light transition-colors">
                <Mail size={14} className="text-accent" /> info@testereplus.com
              </a>
              <p className="flex items-start gap-2">
                <MapPin size={14} className="text-accent shrink-0 mt-0.5" /> İstanbul, Türkiye
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Kategoriler
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm hover:text-accent-light transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Markalar */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Markalar
            </h3>
            <ul className="space-y-2.5">
              {brands.map((brand) => (
                <li key={brand}>
                  <span className="text-sm hover:text-accent-light transition-colors cursor-pointer">
                    {brand}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bilgi */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">
              Bilgi
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/hakkimizda" className="text-sm hover:text-accent-light transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-sm hover:text-accent-light transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/teklif" className="text-sm hover:text-accent-light transition-colors">
                  Toplu Sipariş / Teklif İste
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-accent-light transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-sm hover:text-accent-light transition-colors">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link href="/kargo-takip" className="text-sm hover:text-accent-light transition-colors">
                  Kargo Takip
                </Link>
              </li>
              <li>
                <Link href="/karsilastir" className="text-sm hover:text-accent-light transition-colors">
                  Ürün Karşılaştır
                </Link>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-6 flex items-center gap-2">
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                SSL 256-bit
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs">
                Güvenli Ödeme
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Testere Plus. Tüm hakları saklıdır.</p>
          <p>Ücretsiz kargo &middot; Kapıda ödeme &middot; 7/24 WhatsApp destek</p>
        </div>
      </div>
    </footer>
  );
}
