import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VariantPicker } from "@/components/variant-picker";
import { ImageGallery } from "@/components/image-gallery";
import { ProductTabs } from "@/components/product-tabs";
import { RecommendedProducts } from "@/components/recommended-products";
import { ComplementaryProduct } from "@/components/complementary-product";
import { ProductSchema } from "@/components/product-schema";
import { sampleProductWithVariants } from "@/lib/variants";
import { getProductsByCategory } from "@/lib/data";

export const metadata: Metadata = {
  title: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı",
  description: "Netmak çok yönlü kesim testere bıçağı — 6 farklı çap, 6 diş sayısı seçeneği. Ahşap, MDF, sunta ve laminant kesimi.",
  openGraph: {
    title: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı",
    description: "6 farklı çap, 6 diş sayısı seçeneği. Ahşap, MDF, sunta ve laminant kesimi.",
  },
};

export default function NetmakVariantPage() {
  const related = getProductsByCategory("daire-testere-bicaklari").slice(0, 4);

  const images = [
    "/images/product-2.jpg",
    "/images/slide-testere.png",
    "/images/freud-blade.jpg",
    "/images/alu-testere.jpg",
  ];

  const specs: Record<string, string> = {
    "Çap Seçenekleri": "150 / 200 / 250 / 300 / 350 / 400 mm",
    "Diş Sayısı": "24 / 36 / 48 / 60 / 72 / 96",
    "Delik": "30 mm / 32 mm",
    "Malzeme": "TCT Karbür Uçlu",
    "Diş Geometrisi": "ATB (Alternating Top Bevel)",
    "Kullanım": "Çok yönlü kesim",
    "Menşei": "Türkiye",
  };

  const materials = [
    { name: "Ahşap", rating: 3 as const, notes: "Masif ve sert ahşap" },
    { name: "MDF", rating: 3 as const },
    { name: "Sunta", rating: 3 as const },
    { name: "Laminant", rating: 3 as const },
    { name: "Kontrplak", rating: 2 as const },
    { name: "Melamin", rating: 2 as const },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/kategori/testere-bicaklari" className="hover:text-accent transition-colors">Testere Bıçakları</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/kategori/daire-testere-bicaklari" className="hover:text-accent transition-colors">Daire Testere Bıçakları</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">Netmak Çok Yönlü Kesim</span>
      </nav>

      <Link href="/urunler" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={14} /> Ürünlere Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Image Gallery */}
        <div className="space-y-3">
          <ImageGallery images={images} alt="Netmak Çok Yönlü Kesim Daire Testere Bıçağı" />
          <ComplementaryProduct />
        </div>

        {/* Right — Variant Picker */}
        <VariantPicker product={sampleProductWithVariants} />
      </div>

      {/* Tabs */}
      <ProductTabs
        description={sampleProductWithVariants.description}
        overview="Netmak çok yönlü kesim serisi, tek bir bıçakla birden fazla malzemeyi kesebilmenizi sağlar. TCT karbür uçlu dişler uzun ömürlü kullanım sunarken, ATB diş geometrisi hem boyuna hem enine kesimlerde temiz yüzey elde etmenizi sağlar. 6 farklı çap seçeneği (150-400mm) ve 6 farklı diş sayısı ile ihtiyacınıza tam uyum sağlar. Panel ebatlama, format kesim ve genel amaçlı ahşap işleme için ideal tercih."
        specs={specs}
        materials={materials}
        downloads={[
          { label: "Netmak Daire Testere Kataloğu", url: "/downloads/netmak-katalog.pdf", fileType: "pdf", sizeMb: 3.1 },
        ]}
      />

      {/* Related */}
      <RecommendedProducts title="Benzer Ürünler" products={related} />

      {/* Schema */}
      <ProductSchema
        name="Netmak Çok Yönlü Kesim Daire Testere Bıçağı"
        description={sampleProductWithVariants.description}
        brand="Netmak"
        price={1250}
        sku="NTM-CY"
        images={images}
        inStock={true}
        category="Daire Testere Bıçakları"
        url="/urunler/netmak-cok-yonlu-daire-testere"
      />
    </div>
  );
}
