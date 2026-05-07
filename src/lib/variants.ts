export interface Variant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  oldPrice?: number;
  inStock: boolean;
}

export interface VariantGroup {
  name: string;
  key: string;
  options: string[];
}

export interface ProductWithVariants {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  category: string;
  categorySlug: string;
  description: string;
  variantGroups: VariantGroup[];
  variants: Variant[];
}

export const sampleProductWithVariants: ProductWithVariants = {
  id: "100",
  slug: "netmak-cok-yonlu-daire-testere",
  name: "Netmak Çok Yönlü Kesim Daire Testere Bıçağı",
  brand: "Netmak",
  image: "/images/product-netmak.jpg",
  category: "Daire Testere Bıçakları",
  categorySlug: "daire-testere-bicaklari",
  description: "Netmak çok yönlü kesim testere bıçağı, ahşap, MDF, sunta ve laminant kesimlerinde mükemmel yüzey kalitesi sağlar. TCT karbür uçlu dişler uzun ömürlü kullanım sunar.",
  variantGroups: [
    {
      name: "Çap",
      key: "cap",
      options: ["150 mm", "200 mm", "250 mm", "300 mm", "350 mm", "400 mm"],
    },
    {
      name: "Diş Sayısı",
      key: "dis",
      options: ["24", "36", "48", "60", "72", "96"],
    },
    {
      name: "Delik",
      key: "delik",
      options: ["30 mm", "32 mm"],
    },
  ],
  variants: [
    { id: "v1", sku: "T1150302448", attributes: { cap: "150 mm", dis: "48", delik: "30 mm" }, price: 1250, oldPrice: 1490, inStock: true },
    { id: "v2", sku: "T1150302436", attributes: { cap: "150 mm", dis: "36", delik: "30 mm" }, price: 1150, oldPrice: 1390, inStock: true },
    { id: "v3", sku: "T1150302424", attributes: { cap: "150 mm", dis: "24", delik: "30 mm" }, price: 1050, inStock: true },
    { id: "v4", sku: "T1200303048", attributes: { cap: "200 mm", dis: "48", delik: "30 mm" }, price: 1450, oldPrice: 1690, inStock: true },
    { id: "v5", sku: "T1200303060", attributes: { cap: "200 mm", dis: "60", delik: "30 mm" }, price: 1650, inStock: true },
    { id: "v6", sku: "T1200303036", attributes: { cap: "200 mm", dis: "36", delik: "30 mm" }, price: 1350, inStock: true },
    { id: "v7", sku: "T1250303060", attributes: { cap: "250 mm", dis: "60", delik: "30 mm" }, price: 1890, oldPrice: 2200, inStock: true },
    { id: "v8", sku: "T1250303072", attributes: { cap: "250 mm", dis: "72", delik: "30 mm" }, price: 2100, inStock: true },
    { id: "v9", sku: "T1250303048", attributes: { cap: "250 mm", dis: "48", delik: "30 mm" }, price: 1750, inStock: true },
    { id: "v10", sku: "T1300303096", attributes: { cap: "300 mm", dis: "96", delik: "30 mm" }, price: 2650, oldPrice: 3100, inStock: true },
    { id: "v11", sku: "T1300303072", attributes: { cap: "300 mm", dis: "72", delik: "30 mm" }, price: 2350, inStock: true },
    { id: "v12", sku: "T1300303060", attributes: { cap: "300 mm", dis: "60", delik: "30 mm" }, price: 2150, inStock: false },
    { id: "v13", sku: "T1300323096", attributes: { cap: "300 mm", dis: "96", delik: "32 mm" }, price: 2750, inStock: true },
    { id: "v14", sku: "T1350303096", attributes: { cap: "350 mm", dis: "96", delik: "30 mm" }, price: 3200, oldPrice: 3650, inStock: true },
    { id: "v15", sku: "T1350303072", attributes: { cap: "350 mm", dis: "72", delik: "30 mm" }, price: 2900, inStock: true },
    { id: "v16", sku: "T1400303096", attributes: { cap: "400 mm", dis: "96", delik: "30 mm" }, price: 3800, oldPrice: 4200, inStock: false },
    { id: "v17", sku: "T1400303072", attributes: { cap: "400 mm", dis: "72", delik: "30 mm" }, price: 3500, inStock: true },
    { id: "v18", sku: "T1200323048", attributes: { cap: "200 mm", dis: "48", delik: "32 mm" }, price: 1550, inStock: true },
    { id: "v19", sku: "T1250323060", attributes: { cap: "250 mm", dis: "60", delik: "32 mm" }, price: 1990, inStock: true },
    { id: "v20", sku: "T1350323096", attributes: { cap: "350 mm", dis: "96", delik: "32 mm" }, price: 3350, inStock: true },
  ],
};

export function findVariant(
  variants: Variant[],
  selected: Record<string, string>
): Variant | undefined {
  return variants.find((v) =>
    Object.entries(selected).every(([key, val]) => v.attributes[key] === val)
  );
}

export function getAvailableOptions(
  variants: Variant[],
  groupKey: string,
  selected: Record<string, string>
): Map<string, { available: boolean; inStock: boolean }> {
  const result = new Map<string, { available: boolean; inStock: boolean }>();

  const otherSelections = Object.entries(selected).filter(([k]) => k !== groupKey);

  const allOptions = [...new Set(variants.map((v) => v.attributes[groupKey]))];

  for (const option of allOptions) {
    const matchingVariants = variants.filter((v) => {
      if (v.attributes[groupKey] !== option) return false;
      return otherSelections.every(([k, val]) => v.attributes[k] === val);
    });

    if (matchingVariants.length === 0) {
      result.set(option, { available: false, inStock: false });
    } else {
      const hasStock = matchingVariants.some((v) => v.inStock);
      result.set(option, { available: true, inStock: hasStock });
    }
  }

  return result;
}
