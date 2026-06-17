import { Metadata } from "next";
import Link from "next/link";
import { Truck, Shield, ArrowLeft, Check, Star, CircleCheck, Zap, Ruler, Disc3, Factory } from "lucide-react";
import { products, getProductBySlug, getRelatedProducts, getAccessories, getCategoryBreadcrumb, formatPrice } from "@/lib/data";
import { ImageGallery } from "@/components/image-gallery";
import { ProductTabs } from "@/components/product-tabs";
import { RecommendedProducts } from "@/components/recommended-products";
import { ProductSchema } from "@/components/product-schema";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductReviews } from "@/components/product-reviews";
import { BreadcrumbSchema } from "@/components/breadcrumb-schema";
import { StockAlert } from "@/components/stock-alert";
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
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
      type: "website",
    },
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

  const related = getRelatedProducts(product.id);
  const accessories = getAccessories(product.id);
  const breadcrumbCategories = getCategoryBreadcrumb(product.categorySlug);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const savings = product.oldPrice ? product.oldPrice - product.price : null;

  const featureIcons = [
    { icon: Disc3, label: "Çap", value: product.specs["Çap"] },
    { icon: Ruler, label: "Kalınlık", value: product.specs["Kalınlık"] },
    { icon: Zap, label: "Diş", value: product.specs["Diş Sayısı"] },
    { icon: Factory, label: "Malzeme", value: product.specs["Malzeme"] },
  ].filter((f) => f.value);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-text-muted mb-4">
        <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
        {breadcrumbCategories.map((cat) => (
          <span key={cat.slug}>
            <span className="mx-1.5">›</span>
            <Link href={`/kategori/${cat.slug}`} className="hover:text-accent transition-colors">
              {cat.name}
            </Link>
          </span>
        ))}
        <span className="mx-1.5">›</span>
        <span className="text-text-secondary">{product.name}</span>
      </nav>

      {/* Main layout: 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left — Image Gallery (5 cols) */}
        <div className="lg:col-span-5">
          <ImageGallery
            images={product.images}
            alt={product.name}
            discount={discount ?? undefined}
          />
        </div>

        {/* Middle — Product Info (4 cols) */}
        <div className="lg:col-span-4">
          <h1 className="text-xl md:text-2xl font-bold text-text-primary leading-tight mb-2">
            {product.name}
          </h1>

          <p className="text-sm text-text-muted mb-1">
            Marka: <Link href={`/urunler?q=${encodeURIComponent(product.brand)}`} className="text-accent hover:underline">{product.brand}</Link>
            {product.sku && <span className="ml-3">SKU: {product.sku}</span>}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </div>
            <span className="text-sm text-accent hover:underline cursor-pointer">4.0 (12 değerlendirme)</span>
          </div>

          {/* Price block */}
          <div className="mb-4">
            {product.oldPrice && (
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-text-muted">Liste Fiyatı:</span>
                <span className="text-sm text-text-muted line-through">{formatPrice(product.oldPrice)}</span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-text-muted">Fiyat:</span>
              <span className="text-[28px] font-bold text-red-700">{formatPrice(product.price)}</span>
              <span className="text-xs text-text-muted ml-1">KDV Dahil</span>
            </div>
            {savings && discount && (
              <p className="text-sm text-red-600 font-medium mt-0.5">
                Tasarruf: {formatPrice(savings)} (%{discount})
              </p>
            )}
          </div>

          {/* Feature highlights */}
          {featureIcons.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-5">
              {featureIcons.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5 bg-bg-secondary rounded-xl px-3 py-2.5">
                  <f.icon size={18} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide">{f.label}</p>
                    <p className="text-sm font-semibold text-text-primary">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* About this item — bullet points */}
          <div className="border-t border-border pt-4 mb-4">
            <h3 className="text-sm font-bold text-text-primary mb-2">Bu Ürün Hakkında</h3>
            <ul className="space-y-1.5">
              {product.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CircleCheck size={14} className="text-accent shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — Buy Box (3 cols) */}
        <div className="lg:col-span-3">
          <div className="border border-border rounded-2xl p-5 sticky top-24">
            {/* Price in buy box */}
            <div className="mb-4">
              <span className="text-2xl font-bold text-text-primary">{formatPrice(product.price)}</span>
              <span className="text-[10px] text-text-muted ml-1">KDV Dahil</span>
              {product.oldPrice && (
                <span className="text-sm text-text-muted line-through ml-2">{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            {/* Shipping */}
            <div className="flex items-center gap-2 text-sm mb-2">
              <Truck size={16} className="text-accent" />
              <span className="text-text-secondary"><strong className="text-green-600">Ücretsiz</strong> kargo</span>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-4">
              {product.inStock ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-sm font-semibold text-green-600">Stokta Var</span>
                </>
              ) : (
                <span className="text-sm font-semibold text-red-500">Stokta Yok</span>
              )}
            </div>

            {!product.inStock && (
              <StockAlert productId={product.id} productName={product.name} />
            )}

            {/* Add to Cart */}
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
              href={`https://wa.me/905551234567?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.${product.sku ? ` (SKU: ${product.sku})` : ""}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors text-sm mt-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.347 0-4.518-.809-6.235-2.16l-.436-.35-3.022 1.012 1.012-3.022-.35-.436A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp ile Sor
            </a>

            {/* Trust */}
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Shield size={14} className="text-accent" />
                Orijinal ürün garantisi
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Truck size={14} className="text-accent" />
                1-3 iş günü teslimat
              </div>
            </div>

            {/* Seller */}
            <div className="mt-4 pt-4 border-t border-border text-xs text-text-muted">
              <p>Satıcı: <strong className="text-text-primary">Testere Plus</strong></p>
              <p className="mt-0.5">Gönderen: Testere Plus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-text-primary mb-6">Benzer Ürünleri Karşılaştır</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-bg-secondary">
                  <th className="text-left px-4 py-3 text-sm font-semibold text-text-primary border-b border-border w-40">Özellik</th>
                  <th className="px-4 py-3 text-center border-b border-border border-l bg-accent-bg">
                    <div className="text-xs text-accent font-bold mb-1">Bu Ürün</div>
                    <p className="text-xs text-text-primary font-medium line-clamp-2">{product.name}</p>
                  </th>
                  {related.slice(0, 3).map((r) => (
                    <th key={r.id} className="px-4 py-3 text-center border-b border-border border-l">
                      <Link href={`/urunler/${r.slug}`} className="text-xs text-accent hover:underline font-medium line-clamp-2">
                        {r.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">Marka</td>
                  <td className="px-4 py-3 text-sm text-center border-b border-border border-l bg-accent-bg/30 font-semibold">{product.brand}</td>
                  {related.slice(0, 3).map((r) => (
                    <td key={r.id} className="px-4 py-3 text-sm text-center border-b border-border border-l">{r.brand}</td>
                  ))}
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">Fiyat</td>
                  <td className="px-4 py-3 text-sm text-center border-b border-border border-l bg-accent-bg/30 font-bold text-accent">{formatPrice(product.price)}</td>
                  {related.slice(0, 3).map((r) => (
                    <td key={r.id} className="px-4 py-3 text-sm text-center border-b border-border border-l font-semibold">{formatPrice(r.price)}</td>
                  ))}
                </tr>
                {Object.keys(product.specs).slice(0, 5).map((specKey) => (
                  <tr key={specKey}>
                    <td className="px-4 py-3 text-sm text-text-muted border-b border-border font-medium">{specKey}</td>
                    <td className="px-4 py-3 text-sm text-center border-b border-border border-l bg-accent-bg/30 font-semibold">{product.specs[specKey]}</td>
                    {related.slice(0, 3).map((r) => (
                      <td key={r.id} className="px-4 py-3 text-sm text-center border-b border-border border-l">{r.specs[specKey] || "—"}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 text-sm text-text-muted font-medium">Stok</td>
                  <td className="px-4 py-3 text-sm text-center border-l bg-accent-bg/30">
                    {product.inStock ? <Check size={16} className="text-green-500 mx-auto" /> : <span className="text-red-500">✗</span>}
                  </td>
                  {related.slice(0, 3).map((r) => (
                    <td key={r.id} className="px-4 py-3 text-sm text-center border-l">
                      {r.inStock ? <Check size={16} className="text-green-500 mx-auto" /> : <span className="text-red-500">✗</span>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tabs */}
      <ProductTabs
        description={product.description}
        overview={product.overview}
        specs={product.specs}
        materials={product.materials}
        downloads={product.downloads}
      />

      {/* Accessories */}
      <RecommendedProducts title="Tavsiye Edilen Aksesuarlar" products={accessories} />

      {/* Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related */}
      <RecommendedProducts title="Benzer Ürünler" products={related} />

      {/* Schemas */}
      <BreadcrumbSchema
        items={[
          { name: "Ana Sayfa", url: "/" },
          ...breadcrumbCategories.map((cat) => ({ name: cat.name, url: `/kategori/${cat.slug}` })),
          { name: product.name, url: `/urunler/${product.slug}` },
        ]}
      />
      <ProductSchema
        name={product.name}
        description={product.description}
        brand={product.brand}
        price={product.price}
        oldPrice={product.oldPrice}
        sku={product.sku}
        images={product.images}
        inStock={product.inStock}
        category={product.category}
        url={`/urunler/${product.slug}`}
      />
    </div>
  );
}
