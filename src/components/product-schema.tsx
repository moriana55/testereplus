interface Props {
  name: string;
  description: string;
  brand: string;
  price: number;
  oldPrice?: number;
  sku?: string;
  mpn?: string;
  images: string[];
  inStock: boolean;
  category: string;
  url: string;
  /** Görüntülenen yıldız/yorum verisiyle tutarlı toplu puan (opsiyonel). */
  ratingValue?: number;
  reviewCount?: number;
}

const SITE = "https://testereplus.com";

export function ProductSchema({
  name,
  description,
  brand,
  price,
  oldPrice,
  sku,
  mpn,
  images,
  inStock,
  category,
  url,
  ratingValue,
  reviewCount,
}: Props) {
  // priceValidUntil her zaman verilir (Google Merchant uyarısını önler).
  const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images.length > 0 ? images.map((img) => `${SITE}${img}`) : undefined,
    sku: sku || undefined,
    mpn: mpn || sku || undefined,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category,
    ...(ratingValue && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: ratingValue.toFixed(1),
            reviewCount: String(reviewCount),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE}${url}`,
      priceCurrency: "TRY",
      price: price.toFixed(2),
      priceValidUntil,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Testere Plus",
      },
      ...(oldPrice
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: price.toFixed(2),
              priceCurrency: "TRY",
            },
          }
        : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
