import { Metadata } from "next";
import Link from "next/link";
import { products, categories } from "@/lib/data";
import { ProductListing } from "@/components/product-listing";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Profesyonel kesici takımlar — daire testere bıçakları, freze uçları, şerit testereler ve aksesuarlar.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Ürünler", url: "/urunler" }]} />
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">Tüm Ürünler</span>
      </nav>

      <h1 className="section-rule text-2xl font-bold text-text-primary mb-6">Tüm Ürünler</h1>

      <ProductListing products={products} categories={categories} initialSearch={q} />
    </div>
  );
}
