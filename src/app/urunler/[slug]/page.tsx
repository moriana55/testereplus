import { Metadata } from "next";
import Link from "next/link";
import { Truck, Shield, ArrowLeft, Check } from "lucide-react";
import { products, getProductBySlug, getProductsByCategory, formatPrice } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Ürün Bulunamadı" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-text-muted mb-6">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        <span className="mx-2 text-border">/</span>
        <Link href="/urunler" className="hover:text-accent transition-colors">Ürünler</Link>
        <span className="mx-2 text-border">/</span>
        <Link href={`/kategori/${product.categorySlug}`} className="hover:text-accent transition-colors">
          {product.category}
        </Link>
        <span className="mx-2 text-border">/</span>
        <span className="text-text-primary font-medium">{product.name}</span>
      </nav>

      <Link href="/urunler" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={14} /> Ürünlere Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-bg-secondary border border-border rounded-2xl aspect-square flex items-center justify-center relative">
          <svg className="w-32 h-32 text-text-muted opacity-15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {discount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-xl">
              %{discount} İndirim
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{product.brand}</span>
            <span className="text-xs text-text-muted">|</span>
            <span className="text-xs text-text-muted">{product.category}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">{product.name}</h1>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-black text-accent">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">
                %{discount} tasarruf
              </span>
            )}
          </div>

          <p className="text-text-secondary leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.inStock ? (
              <>
                <Check size={16} className="text-green-500" />
                <span className="text-sm font-medium text-green-600">Stokta Var — Hemen Kargoya Verilir</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-500">Stokta Yok</span>
              </>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          <AddToCartButton
            productId={product.id}
            name={product.name}
            brand={product.brand}
            price={product.price}
            slug={product.slug}
            inStock={product.inStock}
          />

          {/* WhatsApp */}
          <a
            href={`https://wa.me/905551234567?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-sm mb-8"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp ile Sor
          </a>

          {/* Specs */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary mb-4">Teknik Özellikler</h3>
            <dl className="space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                  <dt className="text-text-muted">{key}</dt>
                  <dd className="text-text-primary font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Benefits */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl p-3.5">
              <Truck size={18} className="text-accent shrink-0" />
              <span className="text-xs text-text-secondary font-medium">Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center gap-2.5 bg-bg-secondary border border-border rounded-xl p-3.5">
              <Shield size={18} className="text-accent shrink-0" />
              <span className="text-xs text-text-secondary font-medium">Orijinal Ürün Garantisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
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
