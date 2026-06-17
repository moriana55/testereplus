import { Metadata } from "next";
import Link from "next/link";
import { categories, getCategoryBySlug, getProductsByCategory, getCategoryBreadcrumb, getCategorySeo } from "@/lib/data";
import { ProductListing } from "@/components/product-listing";
import { notFound } from "next/navigation";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";

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
  const breadcrumb = getCategoryBreadcrumb(slug);
  const seoBlurb = getCategorySeo(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BreadcrumbSchema items={[{ name: "Ana Sayfa", url: "/" }, { name: "Ürünler", url: "/urunler" }, ...breadcrumb.map((cat) => ({ name: cat.name, url: `/kategori/${cat.slug}` }))]} />
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
        {breadcrumb.map((cat, i) => (
          <span key={cat.slug}>
            <span className="mx-2 text-border">/</span>
            {i === breadcrumb.length - 1 ? (
              <span className="text-text-primary font-medium">{cat.name}</span>
            ) : (
              <Link href={`/kategori/${cat.slug}`} className="hover:text-accent transition-colors">
                {cat.name}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="bg-gradient-to-r from-bg-dark to-bg-dark-light rounded-2xl p-8 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h1>
        <p className="text-gray-400">{category.description}</p>
        <p className="text-sm text-gray-500 mt-2">{categoryProducts.length} ürün</p>
      </div>

      <ProductListing products={categoryProducts} categories={categories} activeCategory={slug} />

      {seoBlurb && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-text-primary mb-4">{seoBlurb.heading}</h2>
          <div className="space-y-3 max-w-3xl">
            {seoBlurb.paragraphs.map((p, i) => (
              <p key={i} className="text-sm text-text-secondary leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
