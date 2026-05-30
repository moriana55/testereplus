import Link from "next/link";
import { ArrowRight, Truck, Shield, Headphones, Award, ChevronRight, Zap, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { HeroSlider } from "@/components/hero-slider";
import { categories as allCategories, products } from "@/lib/data";

const categories = allCategories.filter((c) => c.parentSlug || (!c.children?.length));

const features = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "Tüm siparişlerde geçerli", color: "text-blue-600 bg-blue-50" },
  { icon: Shield, title: "Orijinal Ürün", desc: "Marka garantili", color: "text-green-600 bg-green-50" },
  { icon: Headphones, title: "7/24 Destek", desc: "WhatsApp & telefon", color: "text-purple-600 bg-purple-50" },
  { icon: Award, title: "Hızlı Teslimat", desc: "1-3 iş günü", color: "text-amber-600 bg-amber-50" },
];

export default function Home() {
  const featuredProducts = products.filter((p) => p.oldPrice);
  const bestSellers = products.filter((p) => p.inStock).slice(0, 4);

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Features bar */}
      <section className="bg-white border-b border-border relative -mt-1 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-secondary transition-colors">
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — card grid */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Kategoriler</h2>
            <p className="text-sm text-text-muted mt-1">İhtiyacınıza uygun kategoriyi seçin</p>
          </div>
          <Link href="/urunler" className="text-sm text-accent font-semibold hover:text-accent-hover flex items-center gap-1 transition-colors">
            Tümü <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const colors = [
              "from-orange-500 to-red-500",
              "from-blue-500 to-indigo-500",
              "from-emerald-500 to-teal-500",
              "from-purple-500 to-pink-500",
              "from-amber-500 to-orange-500",
              "from-cyan-500 to-blue-500",
            ];
            return (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="group relative bg-white border border-border rounded-2xl p-5 text-center hover:border-transparent hover:shadow-xl hover:shadow-black/8 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="w-14 h-14 bg-bg-secondary rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <svg className="w-7 h-7 text-text-muted group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-white transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-text-muted group-hover:text-white/70 mt-1 transition-colors">{cat.productCount} ürün</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products with gradient bg */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-secondary via-white to-bg-secondary" />
        <div className="max-w-7xl mx-auto px-4 py-14 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">Fırsat Ürünleri</h2>
                <p className="text-sm text-text-muted">Kaçırılmayacak indirimler</p>
              </div>
            </div>
            <Link href="/urunler" className="text-sm text-accent font-semibold hover:text-accent-hover flex items-center gap-1 transition-colors">
              Tümünü Gör <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">En Çok Satanlar</h2>
              <p className="text-sm text-text-muted">Müşterilerimizin tercihi</p>
            </div>
          </div>
          <Link href="/urunler" className="text-sm text-accent font-semibold hover:text-accent-hover flex items-center gap-1 transition-colors">
            Tümünü Gör <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="bg-gradient-to-br from-bg-dark to-bg-dark-light rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/20 rounded-full blur-[80px]" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[60px]" />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Toplu Sipariş & Özel Fiyat</h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Büyük siparişleriniz için size özel fiyat teklifi alın. WhatsApp veya telefon ile anında ulaşın.
            </p>
          </div>
          <div className="relative flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/905551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-7 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-7 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-accent/25"
            >
              Teklif Al
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
