import { Metadata } from "next";
import Link from "next/link";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { ProductListing } from "@/components/product-listing";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Kategori Bulunamadı" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">{category.name}</span>
      </nav>

      <div className="bg-gradient-to-r from-bg-dark to-bg-dark-light rounded-2xl p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-gray-400">{category.description}</p>
      </div>

      <ProductListing products={categoryProducts} categories={categories} activeCategory={slug} />
    </div>
  );
}
