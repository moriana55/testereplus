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
  const productCount = getProductsByCategory(slug).length;
  const seoTitle = `${category.name} — Fiyatları ve Modelleri`;
  const seoDescription =
    `${category.name} kategorisinde ${productCount} profesyonel ürün. ${category.description}`.slice(0, 300);
  return {
    title: seoTitle,
    description: seoDescription,
    alternates: { canonical: `/kategori/${slug}` },
    openGraph: {
      type: "website",
      title: `${category.name} | Testere Plus`,
      description: seoDescription,
      url: `/kategori/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Testere Plus`,
      description: seoDescription,
    },
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

  // CollectionPage + ItemList: kategori listesini Google'a yapısal olarak bildirir.
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `https://testereplus.com/kategori/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.slice(0, 30).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://testereplus.com/urunler/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
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

      <div className="relative bg-gradient-to-r from-bg-dark to-bg-dark-light rounded-2xl p-8 mb-8 overflow-hidden border-l-4 border-accent">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.name}</h1>
          <p className="text-gray-400 max-w-2xl">{category.description}</p>
          <p className="text-sm font-medium text-accent-light mt-3">{categoryProducts.length} ürün listeleniyor</p>
        </div>
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
