interface Props {
  name: string;
  description: string;
  brand: string;
  price: number;
  oldPrice?: number;
  sku?: string;
  images: string[];
  inStock: boolean;
  category: string;
  url: string;
}

export function ProductSchema({ name, description, brand, price, oldPrice, sku, images, inStock, category, url }: Props) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: images.length > 0 ? images.map((img) => `https://testereplus.vercel.app${img}`) : undefined,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category,
    offers: {
      "@type": "Offer",
      url: `https://testereplus.vercel.app${url}`,
      priceCurrency: "TRY",
      price: price.toFixed(2),
      ...(oldPrice && { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Testere Plus",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
