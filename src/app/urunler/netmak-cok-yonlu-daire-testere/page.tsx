import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VariantPicker } from "@/components/variant-picker";
import { sampleProductWithVariants } from "@/lib/variants";
import { ProductCard } from "@/components/product-card";
import { ComplementaryProduct } from "@/components/complementary-product";
import { getProductsByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı",
  description: "Netmak çok yönlü kesim testere bıçağı — 6 farklı çap, 6 diş sayısı seçeneği. Ahşap, MDF, sunta ve laminant kesimi.",
};

export default function NetmakVariantPage() {
  const related = getProductsByCategory("daire-testere-bicaklari").slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/kategori/daire-testere-bicaklari" className="hover:text-accent transition-colors">Daire Testere Bıçakları</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">Netmak Çok Yönlü Kesim</span>
      </nav>

      <Link href="/urunler" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={14} /> Ürünlere Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-3">
          <div className="bg-bg-secondary border border-border rounded-2xl aspect-square flex items-center justify-center relative overflow-hidden">
            <svg className="w-48 h-48 text-text-muted opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg">Çok Satan</span>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-bg-secondary border border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-accent/40 transition-colors">
                <svg className="w-8 h-8 text-text-muted opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>

          <ComplementaryProduct />
        </div>

        {/* Variant Picker */}
        <VariantPicker product={sampleProductWithVariants} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-text-primary mb-6">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
